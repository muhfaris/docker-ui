import React from "react";
import Sidebar from "../components/Sidebar";
import useAuthRedirect from "../hooks/useAuthRedirect";

const Dashboard: React.FC = () => {
  const isAuthenticated = useAuthRedirect();

  if (!isAuthenticated) {
    return null; // Or return a loading spinner or message if needed
  }

  return (
    <div className="flex flex-col sm:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-white p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>This is the content area.</p>
      </main>
    </div>
  );
};

export default Dashboard;
