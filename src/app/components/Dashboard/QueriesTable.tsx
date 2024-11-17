import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx'; 
// Define the interfaces
export interface QueryData {
  queryId?: string;
  full_name: string;
  phone_number: string;
  Comments: string;
  travelType: string;
  queryType: string;
  leadSource: string;
  priority: string;
  agentName?: string; 
  status: string;
  TravelTime: string;
  TravelDate: string;
  assignedTime?: string; 
  editReasons?: string[]; 
}

interface AgentData {
  agentId: number;
  name: string;
}

interface QueriesTableProps {
  data: QueryData[];
  setData: (data: QueryData[]) => void;
  onEditQuery: (query: QueryData) => void;
}

// Utility functions
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

const QueriesTable: React.FC<QueriesTableProps> = ({ data, setData, onEditQuery }) => {
  const [xlsxFile, setXlsxFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('Choose File');
  const [agentMap, setAgentMap] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); // State to manage XLSX upload loading
  const [assignedQueries, setAssignedQueries] = useState<QueryData[]>([]);
  const [pendingQueries, setPendingQueries] = useState<QueryData[]>([]);
  const [completedQueries, setCompletedQueries] = useState<QueryData[]>([]);
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [selectedCustomerQueries, setSelectedCustomerQueries] = useState<QueryData[]>([]); // State to hold filtered queries
  const [queryAdding, setQueryAdding] = useState(false); // New state for adding query loading
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://crm-syste-f15f21fd2637.herokuapp.com/api/query');
        if (response.ok) {
          const initialData: QueryData[] = await response.json();
          
          // Ensure each query has editReasons initialized as an array
          
          const processedData = initialData.map(query => ({
            ...query,
            editReasons:
            typeof query.editReasons === 'string'
              ? JSON.parse(query.editReasons)
              : query.editReasons || [], 
          }));

          
          

          classifyQueries(processedData);
          setData(processedData);
          setLoading(false);
        } else {
          console.error('Failed to fetch data:', response.statusText);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    const fetchAgents = async () => {
      try {
        const response = await fetch('https://crm-syste-f15f21fd2637.herokuapp.com/api/agent');
        if (response.ok) {
          const agents: AgentData[] = await response.json();
          const agentMapping = agents.reduce((map, agent) => {
            map[agent.name.trim().toLowerCase()] = agent.agentId;
            return map;
          }, {} as { [key: string]: number });
          setAgentMap(agentMapping);
        } else {
          console.error('Failed to fetch agents:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };

    fetchData();
    fetchAgents();

    const intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);
  }, [setData]);

  const classifyQueries = (queries: QueryData[]) => {
    const now = new Date().getTime();
    const assigned = queries.filter(query => query.status === 'assigned');
    const pending = queries.filter(query => {
      if (query.status === 'pending') return true;
      if (query.status === 'assigned' && query.assignedTime) {
        const assignedTime = new Date(query.assignedTime).getTime();
        return now - assignedTime > 2 * 1000; // Check if more than 2 seconds
      }
      return false;
    });
    const completed = queries.filter(query => query.status === 'completed');

    setAssignedQueries(assigned);
    setPendingQueries(pending);
    setCompletedQueries(completed);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setXlsxFile(file);
      setFileName(file.name);
    }
  };


  const handleFileUpload = () => {
    if (xlsxFile) {
      setUploading(true); // Start loading when upload begins
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const binaryStr = e.target?.result;
        if (typeof binaryStr === 'string') {
          const workbook = XLSX.read(binaryStr, { type: 'binary' });
  
          // Assume data is in the first sheet
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
  
          // Convert sheet to JSON
          const jsonData: QueryData[] = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });
  
          // Send data to the server in small batches
          const batchSize = 50; // Adjust batch size as needed
          const sendInBatches = async (data: QueryData[]) => {
            for (let i = 0; i < data.length; i += batchSize) {
              const batch = data.slice(i, i + batchSize);
              await saveBatchToServer(batch);
            }
            setUploading(false); // End loading when all batches are processed
            
            // Clear the file input
            const fileInputElement = document.getElementById('fileInput') as HTMLInputElement;
            if (fileInputElement) {
              fileInputElement.value = ''; // Clear the file input
              setFileName('Choose File'); // Reset file name
            }
          };
  
          sendInBatches(jsonData); // Start sending data in batches
        }
      };
      reader.readAsBinaryString(xlsxFile);
    }
  };
    // send quries in bulk to the server
  const saveBatchToServer = async (batch: QueryData[]) => {
    try {
      const response = await fetch('https://crm-syste-f15f21fd2637.herokuapp.com/api/queries/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batch),
      });
      if (!response.ok) {
        console.error('Failed to upload batch:', await response.text());
      }
    } catch (error) {
      console.error('Error uploading batch:', error);
    }
  };
  

  const handleViewQueries = (phone_number: string) => {
    const filteredQueries = data.filter(query => query.phone_number === phone_number);
    setSelectedCustomerQueries(filteredQueries);
    setShowModal(true); // Show modal
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold my-4 text-white">Query Management</h1>
        {/* XLSX Upload Section */}
        <div className="my-4 flex items-center gap-4">
          <div className="relative">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <button className="px-4 py-2 border rounded-md border-[#5c5a5acb] bg-[#5c5a5a7a] text-white hover:bg-[#5c5a5ab4] cursor-pointer">
              {fileName}
            </button>
          </div>
          <button
            onClick={handleFileUpload}
            className="px-4 py-2 border rounded-md border-[#5c5a5acb] bg-[#5c5a5a7a] text-white hover:bg-[#5c5a5ab4] cursor-pointer"
          >
            Upload
          </button>
        </div>
      </div>

      {loading || uploading ? ( // Show loader if fetching or uploading
        <div className="flex justify-center items-center min-h-[200px]">
          <img
            src="https://i.gifer.com/ZZ5H.gif"
            alt="Loading"
            className="w-16 h-16"
          />
        </div>
      ) : (
        <>
          {/* Assigned Queries Table */}
          <h2 className="text-xl font-semibold my-4 text-white">Assigned Queries</h2>
          <QueriesDisplay data={assignedQueries} onEditQuery={onEditQuery} onViewQueries={handleViewQueries} />

          {/* Pending Queries Table */}
          <h2 className="text-xl font-semibold my-4 text-white">Pending Queries</h2>
          <QueriesDisplay data={pendingQueries} onEditQuery={onEditQuery} onViewQueries={handleViewQueries} />

          {/* Completed Queries Table */}
          <h2 className="text-xl font-semibold my-4 text-white">Completed Queries</h2>
          <QueriesDisplay data={completedQueries} onEditQuery={onEditQuery} onViewQueries={handleViewQueries} />
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

interface QueriesDisplayProps {
  data: QueryData[];
  onEditQuery: (query: QueryData) => void;
  onViewQueries: (phone_number: string) => void; // New prop for view functionality
}

const QueriesDisplay: React.FC<QueriesDisplayProps> = ({ data, onEditQuery, onViewQueries }) => {
  const isSmallScreen = window.innerWidth <= 1170;

  // Convert 'queryId' to a number for sorting and sort the data in descending order
  const sortedData = [...data].sort((a, b) => Number(b.queryId) - Number(a.queryId));

  return (
    <div className="overflow-x-auto border rounded-md border-[#5c5a5acb]">
      {!isSmallScreen ? (
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
              <th className="text-center py-3 px-1.5">Agent Name</th>
              <th className="text-center py-3 px-1.5">Status</th>
              <th className="text-center py-3 px-1.5">Travel Time</th>
              <th className="text-center py-3 px-1.5">Travel Date</th>
              <th className="text-center py-3 px-1.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => {
              const customerQueryCount = sortedData.filter(query => query.phone_number === item.phone_number).length;
              return (
                <tr key={item.queryId} className="border-b border-[#5c5a5acb]">
                  <td className="text-center py-3 px-1.5">{item.full_name}</td>
                  <td className="text-center py-3 px-1.5">{item.phone_number}</td>
                  <td className="text-center py-3 px-1.5">{item.Comments}</td>
                  <td className="text-center py-3 px-1.5">{item.travelType || 'N/A'}</td>
                  <td className="text-center py-3 px-1.5">{item.queryType || 'N/A'}</td>
                  <td className="text-center py-3 px-1.5">{item.leadSource || 'N/A'}</td>
                  <td className="text-center py-3 px-1.5">{item.priority || 'N/A'}</td>
                  <td className="text-center py-3 px-1.5">{item.agentName || 'N/A'}</td>
                  <td className="text-center py-3 px-1.5">{item.status}</td>
                  <td className="text-center py-3 px-1.5">{item.TravelTime ? formatTime(item.TravelTime) : 'N/A'}</td>
                  <td className="text-center py-3 px-1.5">{item.TravelDate ? formatDate(item.TravelDate) : 'N/A'}</td>
                  <td className="text-center py-3 px-1.5 flex flex-wrap gap-2 justify-center items-center">
                    <button
                      className="px-3 py-2 w-20 text-[#0D99FF] hover:bg-[#5c5a5acb] transition-colors duration-200 border border-[#5c5a5acb] rounded"
                      onClick={() => onEditQuery(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 flex gap-1 py-2 w-20 text-[#0D99FF] hover:bg-[#5c5a5acb] transition-colors duration-200 border border-[#5c5a5acb] rounded"
                      onClick={() => onViewQueries(item.phone_number)}
                    >
                      <span> View </span><span className='text-xs'>({customerQueryCount})</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className="flex flex-col gap-4">
          {sortedData.map((item) => {
            const customerQueryCount = sortedData.filter(query => query.phone_number === item.phone_number).length;
            return (
              <div key={item.queryId} className="border p-4 rounded-md bg-[#242424] text-white">
                <div className="flex justify-between">
                  <h3 className="font-bold">{item.full_name}</h3>
                  <div>
                    <button
                      className="text-[#0D99FF] hover:underline mr-2"
                      onClick={() => onEditQuery(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-[#0D99FF] hover:underline"
                      onClick={() => onViewQueries(item.phone_number)}
                    >
                      View ({customerQueryCount})
                    </button>
                  </div>
                </div>
                <div><strong>Query Data:</strong> {item.phone_number}</div>
                <div><strong>Comments:</strong> {item.Comments}</div>
                <div><strong>Travel Type:</strong> {item.travelType || 'N/A'}</div>
                <div><strong>Query Type:</strong> {item.queryType || 'N/A'}</div>
                <div><strong>Lead Source:</strong> {item.leadSource || 'N/A'}</div>
                <div><strong>Priority:</strong> {item.priority || 'N/A'}</div>
                <div><strong>Agent Name:</strong> {item.agentName || 'N/A'}</div>
                <div><strong>Status:</strong> {item.status}</div>
                <div><strong>Travel Time:</strong> {item.TravelTime ? formatTime(item.TravelTime) : 'N/A'}</div>
                <div><strong>Travel Date:</strong> {item.TravelDate ? formatDate(item.TravelDate) : 'N/A'}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QueriesTable;
