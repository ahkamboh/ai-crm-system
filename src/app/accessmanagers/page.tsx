"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Dashboard/Sidebar";
import Navbar from "../components/Dashboard/Navbar";
import BreadcrumbNavigation from "../components/Dashboard/BreadcrumbNavigation";
import AddAgentManager from "../components/Dashboard/AddAgentManager";
import AgentManagerTable from "../components/Dashboard/AgentManagerTable";

interface Employee {
  id: number;
  name: string;
  contactNumber: string;
  email: string;
  username: string;
  password: string;
  isActive: string;
}

const breadcrumbLinks = [{ label: "Access", href: "/access" }];

const AgentHome: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Fetch employees data from the server
  const fetchEmployees = async () => {
    try {
      const response = await fetch("https://crm-syste-f15f21fd2637.herokuapp.com/api/manager", {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map((manager: any) => ({
          id: manager.managerId,
          name: manager.name,
          contactNumber: manager.contactNumber,
          email: manager.email,
          username: manager.username,
          isActive: manager.isActive,
          password: manager.password,
        }));
        setEmployees(formattedData);
        console.log("Fetched employees:", formattedData);
      } else {
        console.error("Failed to fetch employees:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Fetch employees when the component mounts
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle opening the modal for adding a new employee
  const handleAddNewEmployee = () => {
    setSelectedEmployee(null); // Clear any previously selected employee
    setIsModalOpen(true); // Open the modal
  };

  // Handle adding a new employee or updating an existing one
  const handleAddAccess = async (newEmployee: Employee) => {
    console.log("Submitting new employee data:", newEmployee);
    const method = selectedEmployee ? "PUT" : "POST";
    const url = selectedEmployee
      ? `https://crm-syste-f15f21fd2637.herokuapp.com/api/manager/${newEmployee.id}`
      : "https://crm-syste-f15f21fd2637.herokuapp.com/api/manager";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmployee),
      });

      if (response.ok) {
        const updatedEmployee = await response.json();
        console.log("Backend response:", updatedEmployee);

        if (selectedEmployee) {
          // Update the existing employee in the frontend state
          setEmployees((prevEmployees) =>
            prevEmployees.map((emp) =>
              emp.id === updatedEmployee.id ? updatedEmployee : emp
            )
          );
        } else {
          // Add the new employee to the frontend state
          setEmployees((prevEmployees) => [...prevEmployees, updatedEmployee]);
        }
        console.log(
          `${
            selectedEmployee ? "Employee updated" : "Employee added"
          } successfully`
        );
      } else {
        console.error(
          `Error ${
            selectedEmployee ? "updating" : "adding"
          } employee:`,
          response.statusText
        );
      }
    } catch (error) {
      console.error(
        `Error ${
          selectedEmployee ? "updating" : "adding"
        } employee:`,
        error
      );
    }

    setIsModalOpen(false); // Close the modal
    setSelectedEmployee(null); // Clear the selected employee
  };

  // Handle editing an employee
  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee); // Set the selected employee for editing
    setIsModalOpen(true); // Open the modal
  };

  // Handle toggling the active status of an employee
  const handleToggleActive = async (employeeId: number) => {
    const currentStatus =
      employees.find((emp) => emp.id === employeeId)?.isActive === "active"
        ? "inactive"
        : "active";

    try {
      const updatedEmployees = employees.map((employee) =>
        employee.id === employeeId
          ? { ...employee, isActive: currentStatus }
          : employee
      );
      setEmployees(updatedEmployees); // Update the state optimistically

      const response = await fetch(
        `https://crm-syste-f15f21fd2637.herokuapp.com/api/manager/${employeeId}/activate`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
          body: JSON.stringify({ isActive: currentStatus }),
        }
      );

      if (!response.ok) {
        console.error(
          "Error toggling employee status:",
          response.statusText
        );
        // Revert the change if the server-side operation failed
        setEmployees(employees);
      }
    } catch (error) {
      console.error("Error toggling employee status:", error);
      // Revert the change in case of an error
      setEmployees(employees);
    }
  };

  // Handle toggling sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex">
      <Sidebar sidebarOpen={sidebarOpen} />
      <div className="flex-grow bg-[#1e1e1e] transition-all duration-300">
        <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} userRole={"admin"} logoutUrl={"/signin"} url={""} />
        <div className="w-full bg-[#242424] text-white flex gap-2 items-center h-10 border-b border-[#5c5a5acb]">
          <BreadcrumbNavigation
            currentPage="Home"
            breadcrumbLinks={breadcrumbLinks}
          />
          <button
            onClick={handleAddNewEmployee} // Open modal for adding a new employee
            className="ml-auto text-white transition-colors duration-300 hover:text-[#0D99FF] p-2 mr-2 rounded-md"
          >
            +Add Access
          </button>
        </div>
        <div
          className="w-full h-full overflow-y-auto p-5"
          style={{ height: "calc(100vh - 6rem)" }}
        >
          <h1 className="text-3xl font-bold mb-8 text-white">Managers</h1>
          <div className="rounded-md border border-[#5c5a5acb] shadow overflow-hidden">
            <AgentManagerTable
              employees={employees}
              onEdit={handleEdit}
              onToggleActive={handleToggleActive}
            />
          </div>
        </div>
        <AddAgentManager
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEmployee(null);
          }}
          onAdd={handleAddAccess}
          initialData={selectedEmployee}
          employees={employees} // Pass employees to modal for real-time updates
          setEmployees={setEmployees} // Pass setEmployees to update state in real-time
        />
      </div>
    </div>
  );
};

export default AgentHome;

