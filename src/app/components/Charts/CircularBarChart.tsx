import React, { useEffect, useState } from 'react';
import { Card, DonutChart, Legend, Title } from '@tremor/react';

// Define the type for your query data
interface QueryData {
  queryId: number;
  full_name: string;
  phone_number: string;
  Comments: string;
  travelType: string;
  queryType: string;
  leadSource: string;
  priority: string;
  status: 'pending' | 'completed'; // You can add more statuses if needed
  querydate: string;
  TravelTime: string | null;
  TravelDate: string | null;
  agentName: string | null;
}

// Define the type for your sales data
interface SalesData {
  name: 'Completed' | 'Pending';
  sales: number;
}

export function CircularBarChart() {
  const [sales, setSales] = useState<SalesData[]>([
    { name: 'Completed', sales: 0 },
    { name: 'Pending', sales: 0 },
  ]);

  useEffect(() => {
    // Fetch data from the API endpoint
    const fetchData = async () => {
      try {
        const response = await fetch('https://crm-syste-f15f21fd2637.herokuapp.com/api/query');
        const data: QueryData[] = await response.json();

        // Calculate the number of completed and pending queries
        const completedCount = data.filter(query => query.status === 'completed').length;
        const pendingCount = data.filter(query => query.status === 'pending').length;

        // Update the state with the new data
        setSales([
          { name: 'Completed', sales: completedCount },
          { name: 'Pending', sales: pendingCount },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 1000); 
    // Fetch the latest data periodically every 2 seconds
    return () => clearInterval(intervalId); //
  }, []); // Empty dependency array to run only on mount

  return (
    <div className="flex justify-center items-center">
      <DonutChart
        data={sales}
        category="sales"
        index="name"
        className="h-[90px] w-full text-white"
        colors={['green-400', 'blue-500']}
      />
      <Legend
        categories={['Completed', 'Pending']}
        colors={['green', 'blue']}
        className="max-w-sm"
      />
    </div>
  );
}
