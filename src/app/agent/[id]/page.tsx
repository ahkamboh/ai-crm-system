"use client"; // Ensure the component is treated as a Client Component

import Sidebar from "@/app/components/Dashboard/Sidebar";
import React, { useState, useEffect } from "react";
import QueriesTable, { QueryData } from "./QueriesTable";
import QueriesForm from "@/app/components/Dashboard/QueriesForm";
import BreadcrumbNavigation from "@/app/components/Dashboard/BreadcrumbNavigation";
import Navbar from "@/app/components/Dashboard/Navbar";
import QueriesCards from "@/app/components/Dashboard/QueriesCards";
import { useParams } from 'next/navigation'; // Use useParams from next/navigation instead of useRouter

function Page() {
  const params = useParams();
  const id = params.id as string; // Use id from the URL params
  const breadcrumbLinks = [{ label: "Agent", href: `/agent/${id}` }];
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [queryData, setQueryData] = useState<QueryData[]>([]);
  const [editQuery, setEditQuery] = useState<QueryData | null>(null);
  const [agentName, setAgentName] = useState<string>("");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAddQuery = (newQuery: QueryData) => {
    if (editQuery) {
      setQueryData(prevData =>
        prevData.map(query => (query.queryId === newQuery.queryId ? newQuery : query))
      );
      setEditQuery(null);
    } else {
      setQueryData(prevData => [...prevData, newQuery]);
    }
    setIsFormVisible(false);
  };

  const handleEditQuery = (query: QueryData) => {
    setEditQuery(query);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setEditQuery(null);
    setIsFormVisible(false);
  };

  // Fetch the agent's name based on the agent ID
  useEffect(() => {
    const fetchAgentName = async () => {
      try {
        const response = await fetch(`https://crm-syste-f15f21fd2637.herokuapp.com/api/agent/${id}`);
        if (response.ok) {
          const agentData = await response.json();
          setAgentName(agentData.name); // Assuming the agent's name is returned as "name"
        } else {
          console.error("Failed to fetch agent data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching agent data:", error);
      }
    };

    fetchAgentName();
  }, [id]);

  return (
    <div className="flex relative">
      <Sidebar sidebarOpen={sidebarOpen} />
      <div className="flex-grow bg-[#1e1e1e] transition-all duration-300">
        <Navbar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          userRole={`Agent: ${agentName}`} // Display the agent's name
          logoutUrl={"/signin"}
          url={"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
        />
        <div className="w-full bg-[#242424] text-white flex gap-2 items-center h-10 border-b border-[#5c5a5acb]">
          <BreadcrumbNavigation currentPage="Home" breadcrumbLinks={breadcrumbLinks} />
        </div>
        <div className="w-full h-full bg-[#1e1e1e] overflow-y-auto p-5" style={{ height: 'calc(100vh - 6rem)' }}>
          {/* @ts-ignore */}
          <QueriesCards isFormVisible={false} />
          {isFormVisible && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              {/* @ts-ignore */}
              <QueriesForm onSubmit={handleAddQuery} onCancel={handleCancel} initialData={editQuery} />
            </div>
          )}
          <QueriesTable data={queryData} setData={setQueryData} onEditQuery={handleEditQuery} agentId={id} />
        </div>
      </div>
    </div>
  );
}

export default Page;
