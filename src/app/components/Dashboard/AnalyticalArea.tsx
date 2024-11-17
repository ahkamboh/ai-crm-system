import React, { useEffect, useState } from 'react';
import { CircularBarChart } from '../../components/Charts/CircularBarChart';
import { AreaCharts } from '../../components/Charts/AreaCharts';
import { LineChars } from '../../components/Charts/LineCharts';
import { BarCharts } from '../../components/Charts/BarCharts';
import TodoList from './TodoList';
import ChatComponent from './ChatComponent';
import ActiveUsersMap from './ActiveUsersMap';

function AnalyticalArea() {
  const [queryData, setQueryData] = useState([]);
  const [todayQueries, setTodayQueries] = useState(0);
  const [yesterdayQueries, setYesterdayQueries] = useState(0);
  const [monthlyQueries, setMonthlyQueries] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://crm-syste-f15f21fd2637.herokuapp.com/api/query');
        if (response.ok) {
          const data = await response.json();
          setQueryData(data);
  
          // Get current date and adjust for time zone by stripping time parts
          const now = new Date();
          const todayDateString = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split('T')[0];
          const yesterdayDateString = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString().split('T')[0];
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();

          // Filter queries for today, yesterday, and this month
          const todayCount = data.filter((query: { querydate: string }) => {
            const queryDateString = new Date(query.querydate).toISOString().split('T')[0];
            return queryDateString === todayDateString;
          }).length;
  
          const yesterdayCount = data.filter((query: { querydate: string }) => {
            const queryDateString = new Date(query.querydate).toISOString().split('T')[0];
            return queryDateString === yesterdayDateString;
          }).length;
  
          const monthlyCount = data.filter((query: { querydate: string }) => {
            const queryDate = new Date(query.querydate);
            return (
              queryDate.getFullYear() === currentYear &&
              queryDate.getMonth() === currentMonth
            );
          }).length;
  
          setTodayQueries(todayCount);
          setYesterdayQueries(yesterdayCount);
          setMonthlyQueries(monthlyCount);
        } else {
          console.error('Failed to fetch data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
    const intervalId = setInterval(fetchData, 1000); 
    // Fetch the latest data periodically every 2 seconds
    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, []);

  return (
    <div className="w-full h-full bg-[#1e1e1e] overflow-y-auto p-5" style={{ height: 'calc(100vh - 6rem)' }}>
      {/* Cards  */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="w-full bg-[#242424] border rounded-md border-[#5c5a5acb]">
          <div className="flex w-full text-white p-4 justify-between">
            <div className="plus-jakarta-sans-400 grid">
              Today Queries
              <span className="plus-jakarta-sans-700 text-xl ">{todayQueries}</span>
            </div>
            <div className="w-10 h-10 bg-[#22303a] rounded-lg flex justify-center items-center">
              <svg width="22" height="22" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.0346 3.25977H7.6072C4.78845 3.25977 3.02112 5.25535 3.02112 8.08052V15.7017C3.02112 18.5269 4.7802 20.5224 7.6072 20.5224H15.6959C18.5238 20.5224 20.2829 18.5269 20.2829 15.7017V12.0094" stroke="#0D99FF" strokeLinecap="round" strokeLinejoin="round" />
                <path fillRule="evenodd" clipRule="evenodd" d="M8.59214 10.714L15.4424 3.86374C16.2958 3.01124 17.6791 3.01124 18.5325 3.86374L19.6481 4.97932C20.5015 5.83274 20.5015 7.21691 19.6481 8.06941L12.7648 14.9527C12.3917 15.3258 11.8857 15.5357 11.3577 15.5357H7.92389L8.01006 12.0707C8.02289 11.561 8.23097 11.0752 8.59214 10.714Z" stroke="#0D99FF" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14.4014 4.92212L18.5869 9.10762" stroke="#0D99FF" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="w-full">
            <img src="/images/dashboard/blueGraphLine.svg" className='w-full' alt="blueGraphLine-Today-queries" />
          </div>
        </div>
        <div className="w-full bg-[#242424] border rounded-md border-[#5c5a5acb]">
          <div className="flex w-full text-white p-4 justify-between">
            <div className="plus-jakarta-sans-400 grid">
              Yesterday Queries
              <span className="plus-jakarta-sans-700 text-xl ">{yesterdayQueries}</span>
            </div>
            <div className="w-10 h-10 bg-[#2f2727] rounded-lg flex justify-center items-center">
              <svg width="22" height="22" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.0346 3.25977H7.6072C4.78845 3.25977 3.02112 5.25535 3.02112 8.08052V15.7017C3.02112 18.5269 4.7802 20.5224 7.6072 20.5224H15.6959C18.5238 20.5224 20.2829 18.5269 20.2829 15.7017V12.0094" stroke="#ff5e5e" strokeLinecap="round" strokeLinejoin="round" />
                <path fillRule="evenodd" clipRule="evenodd" d="M8.59214 10.714L15.4424 3.86374C16.2958 3.01124 17.6791 3.01124 18.5325 3.86374L19.6481 4.97932C20.5015 5.83274 20.5015 7.21691 19.6481 8.06941L12.7648 14.9527C12.3917 15.3258 11.8857 15.5357 11.3577 15.5357H7.92389L8.01006 12.0707C8.02289 11.561 8.23097 11.0752 8.59214 10.714Z" stroke="#ff5e5e" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14.4014 4.92212L18.5869 9.10762" stroke="#ff5e5e" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="w-full">
            <img src="/images/dashboard/redGraphLine.svg" className='w-full' alt="redGraphLine-Yesterday-queries" />
          </div>
        </div>
        <div className="w-full bg-[#242424] border rounded-md border-[#5c5a5acb]">
          <div className="flex w-full text-white p-4 justify-between">
            <div className="plus-jakarta-sans-400 grid">
              Monthly Queries
              <span className="plus-jakarta-sans-700 text-xl ">{monthlyQueries}</span>
            </div>
            <div className="w-10 h-10 bg-[#2f2727] rounded-lg flex justify-center items-center">
              <svg width="22" height="22" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.0346 3.25977H7.6072C4.78845 3.25977 3.02112 5.25535 3.02112 8.08052V15.7017C3.02112 18.5269 4.7802 20.5224 7.6072 20.5224H15.6959C18.5238 20.5224 20.2829 18.5269 20.2829 15.7017V12.0094" stroke="#0D99FF" strokeLinecap="round" strokeLinejoin="round" />
                <path fillRule="evenodd" clipRule="evenodd" d="M8.59214 10.714L15.4424 3.86374C16.2958 3.01124 17.6791 3.01124 18.5325 3.86374L19.6481 4.97932C20.5015 5.83274 20.5015 7.21691 19.6481 8.06941L12.7648 14.9527C12.3917 15.3258 11.8857 15.5357 11.3577 15.5357H7.92389L8.01006 12.0707C8.02289 11.561 8.23097 11.0752 8.59214 10.714Z" stroke="#0D99FF" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14.4014 4.92212L18.5869 9.10762" stroke="#0D99FF" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="w-full">
            <img src="/images/dashboard/blueGraphLine.svg" className='w-full' alt="blueGraphLine-Today-queries" />
          </div>
        </div>
        <div className="w-full text-white  bg-[#242424] border rounded-md border-[#5c5a5acb]  relative justify-center grid">
          <div className="plus-jakarta-sans-400 w-full text-end px-4 pt-2">
            Monthly Queries
          </div>
          <div className="relative -top-4"><CircularBarChart /> </div>
        </div>
      </div>
      <div className="mt-5 flex gap-5">
        <div className="w-full bg-[#242424] border rounded-md border-[#5c5a5acb] p-3">
          <AreaCharts />
        </div>
        <div className="w-full bg-[#242424] border rounded-md border-[#5c5a5acb] p-3">
          <LineChars />
        </div>
      </div>
      <div className="mt-5 flex gap-5">
        <div className="w-full bg-[#242424] border rounded-md border-[#5c5a5acb] p-3">
          <BarCharts />
        </div>
        <div className="w-full bg-[#242424] border rounded-md border-[#5c5a5acb] p-3">
          <LineChars />
        </div>
      </div>
      <div className="mt-5 flex w-full gap-5">
        <TodoList />
        <ChatComponent />
      </div>
      <div className="w-full bg-[#242424] border rounded-md border-[#5c5a5acb] p-5 mt-5">
        <ActiveUsersMap />
      </div>
    </div>
  );
}

export default AnalyticalArea;
