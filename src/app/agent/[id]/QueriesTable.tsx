import React, { useEffect, useState } from 'react';

export interface QueryData {
  queryId: string;
  full_name: string;
  phone_number: string;
  Comments: string;
  travelType: string;
  queryType: string;
  leadSource: string;
  priority: string;
  agentName: string;
  status: string;
  TravelTime: string;
  TravelDate: string;
  assignedTime?: string; // Store assigned time
  editReasons?: string[]; // Array to store reasons for edit
}

interface QueriesTableProps {
  data: QueryData[];
  setData: (data: QueryData[]) => void;
  onEditQuery: (query: QueryData) => void;
  agentId: string;
}

const AgentQueriesTable: React.FC<QueriesTableProps> = ({ data, setData, onEditQuery, agentId }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1170);
  const [loading, setLoading] = useState(true); // State to manage loading
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [selectedCustomerQueries, setSelectedCustomerQueries] = useState<QueryData[]>([]); // State to hold filtered queries

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1170);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to fetch the latest data
  const fetchData = async () => {
    try {
      const response = await fetch(`https://crm-syste-f15f21fd2637.herokuapp.com/api/queries/agent/${agentId}`);
      if (response.ok) {
        const result: QueryData[] = await response.json();
        
        // Ensure each query has editReasons initialized as an array or parsed correctly
        const processedData = result.map((query) => ({
          ...query,
          editReasons:
            typeof query.editReasons === 'string'
              ? JSON.parse(query.editReasons)
              : query.editReasons || [], // Initialize as an empty array if undefined
        }));

        setData(processedData);
        setLoading(false); // Data is loaded, set loading to false
      } else {
        console.error('Failed to fetch data:', response.statusText);
        setLoading(false); // Stop loading even on error
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false); // Stop loading even on error
    }
  };

  // useEffect to fetch data periodically
  useEffect(() => {
    if (agentId) {
      fetchData();
      const intervalId = setInterval(() => {
        fetchData(); // Fetch the latest data periodically
      }, 1000); // Check every 2 seconds

      return () => clearInterval(intervalId); // Clean up interval on component unmount
    }
  }, [agentId, setData]);

  // useEffect to check assigned status periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      checkAssignedStatus(data);
    }, 1000); // Check every second

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, [data]);

  const checkAssignedStatus = (queries: QueryData[]) => {
    const now = new Date().getTime();
    queries.forEach(async (query) => {
      if (query.status === 'assigned' && query.assignedTime) {
        const assignedTime = new Date(query.assignedTime).getTime();
        if (now - assignedTime > 2 * 1000) { // Check if more than 2 seconds have passed
          await updateQueryStatus(query, 'pending');
        }
      }
    });
  };

  const updateQueryStatus = async (query: QueryData, newStatus: string) => {
    try {
      const response = await fetch(`https://crm-syste-f15f21fd2637.herokuapp.com/api/queries/${query.queryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...query,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        console.error('Failed to update query status:', await response.text());
      } else {
        console.log('Query status updated successfully');
        // Update local state to reflect changes
        const updatedQueries = data.map(q =>
          q.queryId === query.queryId ? { ...q, status: newStatus } : q
        );
        setData(updatedQueries);
      }
    } catch (error) {
      console.error('Error updating query status:', error);
    }
  };

  const handleCompleteClick = (query: QueryData) => {
    updateQueryStatus(query, 'completed');
  };

  const handleViewQueries = (phone_number: string) => {
    const filteredQueries = data.filter(query => query.phone_number === phone_number);
    setSelectedCustomerQueries(filteredQueries);
    setShowModal(true); // Show modal
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const formatTime = (timeString: string): string => {
    if (!timeString) return 'N/A';
    const [hour, minute] = timeString.split(':');
    let hours = parseInt(hour, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `${hours}:${minute} ${ampm}`;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold my-4 text-white">Agent Query Management</h1>
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <img
            src="https://i.gifer.com/ZZ5H.gif"
            alt="Loading"
            className="w-16 h-16"
          />
        </div>
      ) : (
        <>
          {isSmallScreen ? (
            <div className="flex flex-col space-y-4">
              {data.map((item) => {
                // Get the count of queries for this customer
                const customerQueryCount = data.filter(query => query.phone_number === item.phone_number).length;
                return (
                  <div key={item.queryId} className={`border rounded-md p-4 bg-[#242424] text-white ${item.status === 'pending' ? 'bg-red-500' : ''}`}>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Name:</span>
                      <span>{item.full_name}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Contact No:</span>
                      <span>{item.phone_number}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Comments:</span>
                      <span>{item.Comments}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Travel Type:</span>
                      <span>{item.travelType}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Query Type:</span>
                      <span>{item.queryType}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Lead Source:</span>
                      <span>{item.leadSource}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Priority:</span>
                      <span>{item.priority}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Status:</span>
                      <span>{item.status}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Travel Time:</span>
                      <span>{formatTime(item.TravelTime)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Travel Date:</span>
                      <span>{formatDate(item.TravelDate)}</span>
                    </div>
                    {/* Display edit reasons */}
                    {Array.isArray(item.editReasons) && item.editReasons.length > 0 && (
                      <div className="mt-4">
                        <h3 className="font-bold text-white">Edit Reasons:</h3>
                        <ul className="mt-2">
                          {/* Highlight the most recent edit reason */}
                          <li className="text-[#FF6347] mb-2">
                            Latest Reason: {item.editReasons[item.editReasons.length - 1]}
                          </li>
                          {/* Show all other edit reasons */}
                          {item.editReasons.slice(0, -1).map((reason, index) => (
                            <li key={index}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <button
                        className="px-3 py-2 text-[#0D99FF] hover:bg-[#5c5a5acb] transition-colors duration-200 border border-[#5c5a5acb] rounded"
                        onClick={() => onEditQuery(item)}
                      >
                        Edit
                      </button>
                      <button
                        className={`px-3 py-2 ml-2 hover:bg-[#5c5a5acb] transition-colors duration-200 border border-[#5c5a5acb] rounded ${
                          item.status === 'pending'
                            ? 'text-white'
                            : item.status === 'assigned'
                            ? 'text-red-500'
                            : 'text-green-500 cursor-not-allowed'
                        }`}
                        onClick={() => handleCompleteClick(item)}
                        disabled={item.status === 'completed'}
                      >
                        Done
                      </button>
                      <button
                        className="px-3 py-2 ml-2 text-[#0D99FF] hover:bg-[#5c5a5acb] transition-colors duration-200 border border-[#5c5a5acb] rounded"
                        onClick={() => handleViewQueries(item.phone_number)}
                      >
                        View ({customerQueryCount})
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="overflow-x-auto hidden lg:block border rounded-md border-[#5c5a5acb]">
              <table className="min-w-full bg-[#242424] text-white">
                <thead className="bg-[#5c5a5a3f]">
                  <tr>
                    <th className="text-center py-3 px-1.5">Name</th>
                    <th className="text-center py-3 px-1.5">Contact No</th>
                    <th className="text-center py-3 px-1.5">Comments</th>
                    <th className="text-center py-3 px-1.5">Travel Type</th>
                    <th className="text-center py-3 px-1.5">Query Type</th>
                    <th className="text-center py-3 px-1.5">Lead Source</th>
                    <th className="text-center py-3 px-1.5">Priority</th>
                    <th className="text-center py-3 px-1.5">Status</th>
                    <th className="text-center py-3 px-1.5">Travel Time</th>
                    <th className="text-center py-3 px-1.5">Travel Date</th>
                    <th className="text-center py-3 px-1.5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => {
                    // Get the count of queries for this customer
                    const customerQueryCount = data.filter(query => query.phone_number === item.phone_number).length;
                    return (
                      <tr key={item.queryId} className={`border-b border-[#5c5a5acb] ${item.status === 'pending' ? 'bg-red-500' : ''}`}>
                        <td className="text-center py-3 px-1.5">{item.full_name}</td>
                        <td className="text-center py-3 px-1.5">{item.phone_number}</td>
                        <td className="text-center py-3 px-1.5">{item.Comments}</td>
                        <td className="text-center py-3 px-1.5">{item.travelType}</td>
                        <td className="text-center py-3 px-1.5">{item.queryType}</td>
                        <td className="text-center py-3 px-1.5">{item.leadSource}</td>
                        <td className="text-center py-3 px-1.5">{item.priority}</td>
                        <td className="text-center py-3 px-1.5">{item.status}</td>
                        <td className="text-center py-3 px-1.5">{formatTime(item.TravelTime)}</td>
                        <td className="text-center py-3 px-1.5">{formatDate(item.TravelDate)}</td>
                        <td className="text-center py-3 px-1.5 flex flex-wrap gap-1 justify-center items-center">
                          <button
                            className="px-3 py-2 text-[#0D99FF] hover:bg-[#5c5a5acb] transition-colors duration-200 border border-[#5c5a5acb] rounded"
                            onClick={() => onEditQuery(item)}
                          >
                            Edit
                          </button>
                          <button
                            className={`px-3 py-2 ml-2 hover:bg-[#5c5a5acb] transition-colors duration-200 border border-[#5c5a5acb] rounded ${
                              item.status === 'pending'
                                ? 'text-white'
                                : item.status === 'assigned'
                                ? 'text-red-500'
                                : 'text-green-500 cursor-not-allowed'
                            }`}
                            onClick={() => handleCompleteClick(item)}
                            disabled={item.status === 'completed'}
                          >
                            Done
                          </button>
                          <button
                            className="px-3 py-2 ml-2 text-[#0D99FF] hover:bg-[#5c5a5acb] transition-colors duration-200 border border-[#5c5a5acb] rounded"
                            onClick={() => handleViewQueries(item.phone_number)}
                          >
                            View ({customerQueryCount})
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Modal for displaying all queries of a customer */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center text-white bg-black bg-opacity-50">
          <div className="bg-[#242424] border rounded-md border-[#5c5a5acb] p-6 shadow-lg w-3/4 max-w-xl relative">
            <h2 className="text-xl font-bold mb-4">Customer Queries ({selectedCustomerQueries.length})</h2>
            <button
              className="absolute top-0 right-2 text-white transition-colors duration-300 hover:text-red-700 text-4xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <div className="overflow-y-auto max-h-96">
              {selectedCustomerQueries.map((query) => (
                <div key={query.queryId} className="mb-4 border-b border-[#5c5a5acb] pb-2">
                  <p><strong>Name:</strong> {query.full_name}</p>
                  <p><strong>Phone:</strong> {query.phone_number}</p>
                  <p><strong>Comments:</strong> {query.Comments}</p>
                  <p><strong>Travel Type:</strong> {query.travelType}</p>
                  <p><strong>Query Type:</strong> {query.queryType}</p>
                  <p><strong>Lead Source:</strong> {query.leadSource}</p>
                  <p><strong>Priority:</strong> {query.priority}</p>
                  <p><strong>Agent Name:</strong> {query.agentName}</p>
                  <p><strong>Status:</strong> {query.status}</p>
                  <p><strong>Travel Time:</strong> {formatTime(query.TravelTime)}</p>
                  <p><strong>Travel Date:</strong> {formatDate(query.TravelDate)}</p>

                  {/* Display edit reasons */}
                  {Array.isArray(query.editReasons) && query.editReasons.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-bold text-white">Edit Reasons:</h3>
                      <ul className="mt-2">
                        {/* Highlight the most recent edit reason */}
                        <li className="text-[#FF6347] mb-2">
                          Latest Reason: {query.editReasons[query.editReasons.length - 1]}
                        </li>
                        {/* Show all other edit reasons */}
                        {query.editReasons.slice(0, -1).map((reason, index) => (
                          <li key={index}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentQueriesTable;
