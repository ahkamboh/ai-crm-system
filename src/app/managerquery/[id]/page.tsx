"use client";
import React, { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import Sidebar from "../../components/Dashboard/SidebarManager";
import Navbar from "../../components/Dashboard/Navbar";
import BreadcrumbNavigation from "../../components/Dashboard/BreadcrumbNavigation";
import QueriesCards from "../../components/Dashboard/QueriesCards";
{/* @ts-ignore */}
import QueriesForm, { QueryData } from "../../components/Dashboard/QueriesForm";
import QueriesTable from "../../components/Dashboard/QueriesTable";

const Page: React.FC = () => {
  const params = useParams();
  const managerId = params.id as string; // Use managerId from the URL params

  const breadcrumbLinks = [{ label: "Query", href: `/managerquery/${managerId}` }];

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [queryData, setQueryData] = useState<QueryData[]>([]);
  const [editQuery, setEditQuery] = useState<QueryData | null>(null); // State to hold the query being edited
  const [managerName, setManagerName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAddQuery = (newQuery: QueryData) => {
    if (editQuery) {
      // Update the existing query in the state
      setQueryData(prevData =>
        prevData.map(query => (query.queryId === newQuery.queryId ? newQuery : query))
      );
      setEditQuery(null); // Clear the edit state
    } else {
      // Add the new query to the state
      setQueryData(prevData => [...prevData, newQuery]);
    }
    setIsFormVisible(false);
  };

  const handleEditQuery = (query: QueryData) => {
    setEditQuery(query); // Set the query to be edited
    setIsFormVisible(true); // Show the form with the query data
  };

  const handleCancel = () => {
    setEditQuery(null); // Clear the edit state if canceled
    setIsFormVisible(false);
  };

  // Fetch the manager's data based on the manager ID
  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        const response = await fetch(`https://crm-syste-f15f21fd2637.herokuapp.com/api/manager/${managerId}`);
        if (response.ok) {
          const managerData = await response.json();
          setManagerName(managerData.name); // Assuming the manager's name is returned as "name"
        } else {
          console.error("Failed to fetch manager data:", response.statusText);
          setError("Failed to fetch manager data");
        }
      } catch (error) {
        console.error("Error fetching manager data:", error);
        setError("Error fetching manager data");
      } finally {
        setLoading(false);
      }
    };

    fetchManagerData();
  }, [managerId]);

  return (
    <div className="flex relative">
      <Sidebar sidebarOpen={sidebarOpen} />
      <div className={`flex-grow bg-[#1e1e1e] transition-all duration-300`}>
        <Navbar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          userRole={`Manager: ${managerName}`} // Display the manager's name
          logoutUrl={"/signin"}
          url={""}
        />
        <div className="w-full bg-[#242424] text-white flex gap-2 items-center h-10 border-b border-[#5c5a5acb]">
          <BreadcrumbNavigation currentPage="Home" breadcrumbLinks={breadcrumbLinks} />
          <button
            onClick={() => setIsFormVisible(true)}
            className="ml-auto text-white transition-colors duration-300 hover:text-[#0D99FF] p-2 mr-2 rounded-md"
          >
            + Add Query
          </button>
        </div>
        <div className="w-full h-full bg-[#1e1e1e] overflow-y-auto p-5" style={{ height: 'calc(100vh - 6rem)' }}>
          {/* @ts-ignore */}
          <QueriesCards isFormVisible={false} />
          {isFormVisible && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <QueriesForm onSubmit={handleAddQuery} onCancel={handleCancel} initialData={editQuery} />
            </div>
          )}
          <QueriesTable data={queryData} setData={setQueryData} onEditQuery={handleEditQuery} />
        </div>
      </div>
    </div>
  );
}

export default Page;
