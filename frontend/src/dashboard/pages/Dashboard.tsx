import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { IconType } from "react-icons";

import { FiUsers, FiCalendar, FiMapPin, FiDollarSign } from "react-icons/fi";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string;
};

type StatItem = {
  title: string;
  value: number | string;
  icon: IconType;
  active?: number | string;
  inactive?: number | string;
};

const Dashboard = () => {
  const [stats, setStats] = useState<StatItem[]>([
    {
      title: "Total Users",
      value: 0,
      icon: FiUsers,
      active: 0,
      inactive: 0,
    },
    {
      title: "Active Reservations",
      value: 0,
      icon: FiCalendar,
    },
    {
      title: "Available Spaces",
      value: 0,
      icon: FiMapPin,
    },
    {
      title: "Revenue",
      value: 0,
      icon: FiDollarSign,
    },
  ]);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5234/User");

        const mappedUsers: User[] = response.data.map((user: any) => ({
          status: user.active ? "Active" : "Inactive",
        }));

        setUsers(mappedUsers);
        setLoading(false);

        // Update stats with user data
        const totalUsers = mappedUsers.length;
        const activeUsers = mappedUsers.filter(
          (u: User) => u.status === "Active"
        ).length;
        const inactiveUsers = totalUsers - activeUsers;

        setStats((prevStats) => {
          const newStats = [...prevStats];
          newStats[0] = {
            ...newStats[0],
            value: totalUsers,
            active: activeUsers,
            inactive: inactiveUsers,
          };
          return newStats;
        });
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load user data");
        setLoading(false);

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
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex h-screen" style={{ backgroundColor: "#f5f5f5" }}>
      <Sidebar />
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-800 text-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-2">
                <stat.icon size={20} className="mr-2 text-gray-400" />
                <p className="text-sm font-medium text-gray-400">
                  {stat.title}
                </p>
              </div>
              <div className="flex items-end justify-between mt-2">
                <p className="text-2xl font-bold">
                  {stat.title === "Total Users" && loading
                    ? "Loading..."
                    : stat.value}
                </p>
                {stat.title === "Total Users" && (
                  <div className="text-right">
                    <p className="text-sm text-green-400">
                      Active: {stat.active}
                    </p>
                    <p className="text-sm text-red-400">
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
