"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Dashboard/SidebarManager';
import Navbar from '../../components/Dashboard/Navbar';
import BreadcrumbNavigation from '../../components/Dashboard/BreadcrumbNavigation';
import AnalyticalArea from '../../components/Dashboard/AnalyticalArea';
import { useParams } from 'next/navigation'; 

const Dashboard: React.FC = () => {
  const params = useParams();
  const managerId = params.id as string; 
  const breadcrumbLinks = [{ label: 'Dashboard', href: `/managerdashboard/${managerId}` }];

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [managerName, setManagerName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
    <div className="flex">
      <Sidebar sidebarOpen={sidebarOpen} />
      <div className="flex-grow bg-[#1e1e1e] transition-all duration-300">
        <Navbar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          userRole={`Manager: ${managerName}`} // Display the manager's name
          logoutUrl={'/signin'}
          url={"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
        />

        <div className="w-full bg-[#242424] text-white flex gap-2 items-center h-10 border-b border-[#5c5a5acb]">
          <BreadcrumbNavigation currentPage="Home" breadcrumbLinks={breadcrumbLinks} />
        </div>
        <AnalyticalArea />
      </div>
    </div>
  );
};

export default Dashboard;
