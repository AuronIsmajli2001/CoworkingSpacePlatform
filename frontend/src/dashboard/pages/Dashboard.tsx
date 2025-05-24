import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { IconType } from "react-icons";
import { FiUsers, FiCalendar, FiMapPin, FiDollarSign } from "react-icons/fi";

enum ReservationStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
}

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string;
};

type Reservation = {
  id: string;
  startDateTime: Date;
  endDateTime: Date;
  status: ReservationStatus;
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

  const [loading, setLoading] = useState({
    users: true,
    reservations: true,
    spaces: true,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [usersResponse, reservationsResponse, spacesResponse] =
          await Promise.all([
            axios.get("http://localhost:5234/User"),
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/reservation`),
            axios.get("http://localhost:5234/Space"), // Added spaces endpoint
          ]);

        // Calculate statistics
        const totalUsers = usersResponse.data.length;
        const activeUsers = usersResponse.data.filter(
          (u: any) => u.active
        ).length;
        const inactiveUsers = totalUsers - activeUsers;

        const now = new Date();
        const activeReservations = reservationsResponse.data.filter(
          (res: any) => {
            const end = new Date(res.endDateTime);
            return res.status === "Confirmed" && end >= now;
          }
        ).length;

        const totalSpaces = spacesResponse.data.length; // Get total spaces count

        setStats((prevStats) => {
          const newStats = [...prevStats];
          newStats[0] = {
            // Users
            ...newStats[0],
            value: totalUsers,
            active: activeUsers,
            inactive: inactiveUsers,
          };
          newStats[1] = {
            // Reservations
            ...newStats[1],
            value: activeReservations,
          };
          newStats[2] = {
            // Spaces
            ...newStats[2],
            value: totalSpaces,
          };
          return newStats;
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading({
          users: false,
          reservations: false,
          spaces: false,
        });
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

        {error && (
          <div className="bg-red-900/20 border border-red-700 text-red-300 p-4 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-2">
                <stat.icon size={20} className="mr-2 text-gray-400" />
                <p className="text-sm font-medium text-gray-400">
                  {stat.title}
                </p>
              </div>
              <div className="flex items-end justify-between mt-2">
                <p className="text-2xl font-bold">
                  {(loading.users && index === 0) ||
                  (loading.reservations && index === 1) ||
                  (loading.spaces && index === 2)
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
