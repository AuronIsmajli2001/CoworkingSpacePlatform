import React from "react";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const stats = [
    { title: "Total Users", value: "1,024", change: "+12%", trend: "up" },
    { title: "Active Reservations", value: "56", change: "+5%", trend: "up" },
    { title: "Available Spaces", value: "24", change: "-3%", trend: "down" },
    { title: "Revenue", value: "$8,450", change: "+18%", trend: "up" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Dashboard Overview
        </h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <div className="flex items-end justify-between mt-2">
                <p className="text-2xl font-bold">{stat.value}</p>
                <span
                  className={`flex items-center text-sm ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change}
                  {stat.trend === "up" ? (
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-start pb-4 border-b border-gray-100 last:border-0"
              >
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">New reservation created</p>
                  <p className="text-sm text-gray-500">
                    Conference Room A • 2 hours ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-medium mb-4">Reservations This Week</h3>
            <div className="h-64 bg-gray-50 rounded flex items-center justify-center text-gray-400">
              [Chart Placeholder]
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-medium mb-4">Space Utilization</h3>
            <div className="h-64 bg-gray-50 rounded flex items-center justify-center text-gray-400">
              [Chart Placeholder]
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;
