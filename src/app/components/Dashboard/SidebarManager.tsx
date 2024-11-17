"use client"; // Ensure the component is treated as a Client Component

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type SidebarProps = {
  sidebarOpen: boolean;
};

type MenuItem = {
  name: string;
  icon: IconName;
  href: string;
};

type IconName = 'home' | 'users' | 'edit' | 'dollar-sign' | 'mail';

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen }) => {
  const params = useParams();
  const managerId = params.id as string; 

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', icon: 'home', href: `/managerdashboard/${managerId}` },
    { name: 'Agent', icon: 'users', href: `/manageraccessagents/${managerId}` },
    { name: 'Query', icon: 'edit', href: `/managerquery/${managerId}` },
  ];

  return (
    <div
      className={`bg-[#242424] ${sidebarOpen ? 'border-r' : 'border-0'
        }  border-[#5c5a5acb] transition-all duration-300 h-screen ${sidebarOpen ? 'w-56' : 'w-0'
        } overflow-hidden`}
    >
      <div className="w-full h-14 bg-[#2c2c2c] plus-jakarta-sans-600 text-2xl text-white grid justify-center items-center">
        CRM
      </div>
      <ul className="mt-4 text-white plus-jakarta-sans-500">
        {menuItems.map((item, index) => (
          <Link href={item.href} key={index}>
            <li className="flex items-center pl-4 py-2 group cursor-pointer hover:bg-[#232a2f] hover:text-white text-[#B3B3B3] transition-colors duration-300">
              <div className="w-5 h-5 mr-4">
                <Icon name={item.icon} />
              </div>
              {item.name}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

type IconProps = {
  name: IconName;
};

const Icon: React.FC<IconProps> = ({ name }) => {
  const icons = {
    home: (
      <svg className='group-hover:text-[#0D99FF] text-[#888888] transition-colors duration-300' width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_1_1488)">
          <path d="M3 7.50002L10.5 1.66669L18 7.50002V16.6667C18 17.1087 17.8244 17.5326 17.5118 17.8452C17.1993 18.1577 16.7754 18.3333 16.3333 18.3333H4.66667C4.22464 18.3333 3.80072 18.1577 3.48816 17.8452C3.17559 17.5326 3 17.1087 3 16.6667V7.50002Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 18.3333V10H13V18.3333" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_1_1488">
            <rect width="20" height="20" fill="white" transform="translate(0.5)" />
          </clipPath>
        </defs>
      </svg>
    ),
    users: (
      <svg width="23" height="23" className='group-hover:text-[#0D99FF] text-[#888888] transition-colors duration-300' viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M9.29222 14.5802C12.6738 14.5802 15.5641 15.0926 15.5641 17.1395C15.5641 19.1864 12.6931 19.7135 9.29222 19.7135C5.90972 19.7135 3.02039 19.2057 3.02039 17.1578C3.02039 15.11 5.89047 14.5802 9.29222 14.5802Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        <path fillRule="evenodd" clipRule="evenodd" d="M9.29223 11.6588C7.07206 11.6588 5.27173 9.85939 5.27173 7.63922C5.27173 5.41905 7.07206 3.61963 9.29223 3.61963C11.5115 3.61963 13.3118 5.41905 13.3118 7.63922C13.3201 9.85114 11.5326 11.6505 9.32064 11.6588H9.29223Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15.6095 10.6155C17.0771 10.4092 18.2073 9.14971 18.2101 7.6253C18.2101 6.12288 17.1147 4.8762 15.6782 4.64062" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17.5458 14.1451C18.9675 14.3569 19.9603 14.8555 19.9603 15.8822C19.9603 16.5889 19.4928 17.0473 18.7374 17.3342" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    edit: (
      <svg className='group-hover:text-[#0D99FF] text-[#888888] transition-colors duration-300' width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.0346 3.25977H7.6072C4.78845 3.25977 3.02112 5.25535 3.02112 8.08052V15.7017C3.02112 18.5269 4.7802 20.5224 7.6072 20.5224H15.6959C18.5238 20.5224 20.2829 18.5269 20.2829 15.7017V12.0094" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        <path fillRule="evenodd" clipRule="evenodd" d="M8.59214 10.714L15.4424 3.86374C16.2958 3.01124 17.6791 3.01124 18.5325 3.86374L19.6481 4.97932C20.5015 5.83274 20.5015 7.21691 19.6481 8.06941L12.7648 14.9527C12.3917 15.3258 11.8857 15.5357 11.3577 15.5357H7.92389L8.01006 12.0707C8.02289 11.561 8.23097 11.0752 8.59214 10.714Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.4014 4.92212L18.5869 9.10762" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    'dollar-sign': (
      <svg xmlns="http://www.w3.org/2000/svg" className='group-hover:text-[#0D99FF] text-[#888888] transition-colors duration-300' width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" ><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" /></svg>
    ),
    mail: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 23 23" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className='group-hover:text-[#0D99FF] text-[#888888] transition-colors duration-300'><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
    ),
  };

  return icons[name] || null;
};

export default Sidebar;
