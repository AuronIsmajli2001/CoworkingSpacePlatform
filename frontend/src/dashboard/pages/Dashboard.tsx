import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { FiUsers, FiCalendar, FiMapPin, FiDollarSign } from "react-icons/fi";

const Dashboard = () => {
  // Simplified initial state - only keep what we need for users
  const [stats, setStats] = useState([
    {
      title: "Total Users",
      value: "Loading...",
      icon: FiUsers,
      active: "Loading...",
      inactive: "Loading...",
    },
    // Keep other cards as loading placeholders
    {
      title: "Active Reservations",
      value: "Loading...",
      icon: FiCalendar,
    },
    {
      title: "Available Spaces",
      value: "Loading...",
      icon: FiMapPin,
    },
    {
      title: "Revenue",
      value: "Loading...",
      icon: FiDollarSign,
    },
  ]);

  useEffect(() => {
    // Only fetch user stats for now
    axios
      .get("https://localhost:7100/dashboard/user-stats") // Full URL to avoid confusion
      .then((res) => {
        console.log("Successfully fetched user stats:", res.data); // Debug log

        setStats((prevStats) => {
          // Create a new array with updated user stats
          const newStats = [...prevStats];
          newStats[0] = {
            ...newStats[0],
            value: res.data.totalUsers,
            active: res.data.activeUsers,
            inactive: res.data.inactiveUsers,
          };
          return newStats;
        });
      })
      .catch((error) => {
        console.error("Failed to fetch user stats:", error);

        setStats((prevStats) => {
          const newStats = [...prevStats];
          newStats[0] = {
            ...newStats[0],
            value: "Error",
            active: "Error",
            inactive: "Error",
          };
          return newStats;
        });
      });
  }, []); // Empty dependency array = runs once on mount

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Dashboard Overview
        </h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-2">
                <stat.icon size={24} className="mr-2" />
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>
              </div>
              <div className="flex items-end justify-between mt-2">
                <p className="text-2xl font-bold">{stat.value}</p>
                {stat.title === "Total Users" && (
                  <div>
                    <p className="text-sm text-gray-600">
                      Active: {stat.active}
                    </p>
                    <p className="text-sm text-gray-600">
                      Inactive: {stat.inactive}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
