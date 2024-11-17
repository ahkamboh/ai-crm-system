import React, { useEffect, useState } from 'react';
import {
  BarList,
  Color,
  ProgressBar,
  SparkBarChart,
  Tracker,
} from '@tremor/react';

interface QueryData {
  queryId: number;
  full_name: string;
  phone_number: string;
  Comments: string;
  travelType: string;
  queryType: string;
  leadSource: string;
  priority: string;
  status: 'pending' | 'completed';
  querydate: string;
  TravelTime: string | null;
  TravelDate: string | null;
  agentName: string | null;
}

interface TrackerItem {
  color: Color;
  tooltip: string;
}

const QueriesCards: React.FC = () => {
  const [queryData, setQueryData] = useState<QueryData[]>([]);
  const [todayQueries, setTodayQueries] = useState<number>(0);
  const [yesterdayQueries, setYesterdayQueries] = useState<number>(0);
  const [weeklyQueries, setWeeklyQueries] = useState<number>(0);
  const [monthlyQueries, setMonthlyQueries] = useState<number>(0);
  const [monthlyTracker, setMonthlyTracker] = useState<TrackerItem[]>([]);
  const [weeklyTracker, setWeeklyTracker] = useState<TrackerItem[]>([]);
  const [barListData, setBarListData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://crm-syste-f15f21fd2637.herokuapp.com/api/query");
        if (response.ok) {
          const data: QueryData[] = await response.json();
          setQueryData(data);

          // Get current date details
          const now = new Date();
          const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const yesterdayStart = new Date(todayStart);
          yesterdayStart.setDate(todayStart.getDate() - 1);

          const weekStart = new Date(todayStart);
          weekStart.setDate(todayStart.getDate() - todayStart.getDay());

          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

          // Filter queries for today, yesterday, this week, and this month
          const todayCount = data.filter((query) => {
            const queryDate = new Date(query.querydate);
            return queryDate >= todayStart;
          }).length;

          const yesterdayCount = data.filter((query) => {
            const queryDate = new Date(query.querydate);
            return queryDate >= yesterdayStart && queryDate < todayStart;
          }).length;

          const weeklyCount = data.filter((query) => {
            const queryDate = new Date(query.querydate);
            return queryDate >= weekStart;
          }).length;

          const monthlyCount = data.filter((query) => {
            const queryDate = new Date(query.querydate);
            return queryDate >= monthStart && queryDate < nextMonthStart;
          }).length;

          setTodayQueries(todayCount);
          setYesterdayQueries(yesterdayCount);
          setWeeklyQueries(weeklyCount);
          setMonthlyQueries(monthlyCount);

          // Generate Tracker Data for Monthly Sales
          const trackerData: TrackerItem[] = Array.from(
            { length: 31 }, // Assume a max of 31 days in a month
            (_, day) => {
              const currentDayStart = new Date(now.getFullYear(), now.getMonth(), day + 1);
              const nextDayStart = new Date(now.getFullYear(), now.getMonth(), day + 2);

              const daySalesCount = data.filter((query) => {
                const queryDate = new Date(query.querydate);
                return queryDate >= currentDayStart && queryDate < nextDayStart;
              }).length;

              let color: Color = 'emerald'; // Default color for low sales
              if (daySalesCount > 10) {
                color = 'yellow'; // Moderate sales
              }
              if (daySalesCount > 20) {
                color = 'rose'; // High sales
              }

              return {
                color: color,
                tooltip: `Day ${day + 1}: ${daySalesCount} sales`,
              };
            }
          );

          setMonthlyTracker(trackerData);

          // Generate Tracker Data for Weekly Sales
          const weeklyTrackerData: TrackerItem[] = Array.from(
            { length: 7 }, // 7 days of the week
            (_, day) => {
              const currentDayStart = new Date(weekStart);
              currentDayStart.setDate(weekStart.getDate() + day);
              const nextDayStart = new Date(currentDayStart);
              nextDayStart.setDate(currentDayStart.getDate() + 1);

              const daySalesCount = data.filter((query) => {
                const queryDate = new Date(query.querydate);
                return queryDate >= currentDayStart && queryDate < nextDayStart;
              }).length;

              let color: Color = 'emerald'; // Default color for low sales
              if (daySalesCount > 5) {
                color = 'yellow'; // Moderate sales
              }
              if (daySalesCount > 10) {
                color = 'rose'; // High sales
              }

              return {
                color: color,
                tooltip: `Day ${currentDayStart.toDateString()}: ${daySalesCount} sales`,
              };
            }
          );

          setWeeklyTracker(weeklyTrackerData);

          // Generate data for BarList using today's date
          const todayBarList = data
            .filter((query) => {
              const queryDate = new Date(query.querydate);
              return queryDate >= todayStart; // Filter for today's queries
            })
            .map((query) => {
              const queryDate = new Date(query.querydate).toLocaleDateString(); // Convert date to a readable format (e.g., "MM/DD/YYYY")
              return { name: queryDate, value: 1 }; // Each entry represents a single query on that date
            })
            .reduce((acc, current) => {
              const existing = acc.find(item => item.name === current.name);
              if (existing) {
                existing.value += 1; // Increment the count for the existing date
              } else {
                acc.push(current); // Add a new entry for a new date
              }
              return acc;
            }, [] as { name: string; value: number }[]);

          setBarListData(todayBarList); // Set state for today's BarList data
        } else {
          console.error("Failed to fetch data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 1000); 
    // Fetch the latest data periodically every 2 seconds
    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, []); // Empty dependency array to run only on mount

  const chartdata = [
    {
      month: 'Jan 21',
      Performance: 4000,
      Benchmark: 3000,
    },
    {
      month: 'Feb 21',
      Performance: 3000,
      Benchmark: 2000,
    },
    {
      month: 'Mar 21',
      Performance: 2000,
      Benchmark: 1700,
    },
    {
      month: 'Apr 21',
      Performance: 2780,
      Benchmark: 2500,
    },
    {
      month: 'May 21',
      Performance: 1890,
      Benchmark: 1890,
    },
    {
      month: 'Jun 21',
      Performance: 2390,
      Benchmark: 2000,
    },
    {
      month: 'Jul 21',
      Performance: 3490,
      Benchmark: 3000,
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Today Queries Card */}
      <div className="w-full p-2 bg-[#242424] border rounded-md border-[#5c5a5acb]">
        <div className="flex w-full text-white p-4 justify-between">
          <div className="plus-jakarta-sans-400 grid">
            Today Queries
            <span className="plus-jakarta-sans-700 text-xl">{todayQueries}</span>
          </div>
        </div>
        {/* Updated BarList to only show today's queries */}
        <BarList data={barListData} className="mx-auto max-w-sm mt-4" />
      </div>

      {/* Yesterday Queries Card */}
      <div className="w-full p-2 bg-[#242424] border rounded-md border-[#5c5a5acb]">
        <div className="flex w-full text-white p-4 justify-between">
          <div className="plus-jakarta-sans-400 grid">
            Yesterday Queries
            <span className="plus-jakarta-sans-700 text-xl">{yesterdayQueries}</span>
          </div>
        </div>
        <div className="w-full">
          <SparkBarChart
            data={chartdata}
            index="month"
            categories={['Performance', 'Benchmark']}
            colors={['blue', 'cyan']}
            className="w-full"
          />
        </div>
      </div>

      {/* Weekly Queries Card */}
      <div className="w-full p-2 bg-[#242424] border rounded-md border-[#5c5a5acb]">
        <div className="flex w-full text-white p-4 justify-between">
          <div className="plus-jakarta-sans-400 grid">
            Weekly Queries
            <span className="plus-jakarta-sans-700 text-xl">{weeklyQueries}</span>
          </div>
        </div>
        <Tracker data={weeklyTracker} className="mt-2" />
      </div>

      {/* Monthly Queries Card */}
      <div className="w-full p-2 bg-[#242424] border rounded-md border-[#5c5a5acb]">
        <div className="flex w-full text-white p-4 justify-between">
          <div className="plus-jakarta-sans-400 grid">
            Monthly Queries
            <span className="plus-jakarta-sans-700 text-xl">{monthlyQueries}</span>
          </div>
        </div>

        <Tracker data={monthlyTracker} className="mt-2" />
      </div>
    </div>
  );
};

export default QueriesCards;
