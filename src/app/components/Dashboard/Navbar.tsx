// components/Navbar.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button'; // Ensure this path is correct

type NavbarProps = {
  sidebarOpen: boolean; // Prop to track if the sidebar is open or closed
  toggleSidebar: () => void; // Function to toggle the sidebar
  userRole: string; // Prop for user role
  logoutUrl: string; // Prop for logout URL
  url: string; // Prop for the URL to be displayed as an image
};

const Navbar: React.FC<NavbarProps> = ({ sidebarOpen, toggleSidebar, userRole, logoutUrl, url }) => {
  const router = useRouter();

  const handleLogout = () => {
    // Clear the token from local storage
    localStorage.removeItem('jwtToken');
  
    // Clear the token from cookies
    document.cookie = 'token=; Max-Age=0; path=/;';
  
    // Redirect to sign-in page
    router.push('/signin');
  };

  return (
    <div>
      <div className="w-full h-14 p-2 bg-[#2c2c2c] flex items-center justify-between">
        <div
          className={`h-14 cursor-pointer flex items-center group ${sidebarOpen ? 'text-[#0D99FF]' : 'text-[#888888]'}`}
          onClick={toggleSidebar}
        >
          <svg
            className="transition-colors duration-300"
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </div>
        <div className="text-white flex items-center gap-3 plus-jakarta-sans-400">
          <img
            src={url || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
            alt="Profile or Logo"
            className="h-10 w-10 rounded-full object-cover mr-4"
          />
          <Button
            className="bg-[#444444] transition-colors duration-300 hover:bg-[#0D99FF] mr-2"
            onClick={handleLogout}
          >
            Logout
          </Button>
          <div className="mr-3 border-l border-[#5c5a5acb] flex items-center gap-3 pl-4">
            <span>{userRole}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
