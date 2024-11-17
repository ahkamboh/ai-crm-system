"use client";
import React, { useState } from 'react';
 {/* @ts-ignore */}
import QueryForm, { QueryData } from '../components/Dashboard/QueriesForm';
import QueriesTable from '../components/Dashboard/QueriesTable';

const QueriesPage: React.FC = () => {
  const [queries, setQueries] = useState<QueryData[]>([]);
  const [editingQuery, setEditingQuery] = useState<QueryData | null>(null);

  const handleAddQuery = (newQuery: QueryData) => {
    setQueries([...queries, newQuery]);
    setEditingQuery(null); // Clear form after adding
  };

  const handleCancel = () => {
    setEditingQuery(null); // Clear the editing state
  };

  return (
    <div className='bg-[#1e1e1e]'>
      <QueryForm 
        onSubmit={handleAddQuery} 
        initialData={editingQuery || undefined} 
        onCancel={handleCancel} // Use the handleCancel function
      />
      <div className="overflow-x-auto border rounded-md mt-5 border-[#5c5a5acb]">
        {/* @ts-ignore */}
        <QueriesTable data={queries} setData={setQueries} onEditQuery={setEditingQuery} />
      </div>
    </div>
  );
};

export default QueriesPage;
