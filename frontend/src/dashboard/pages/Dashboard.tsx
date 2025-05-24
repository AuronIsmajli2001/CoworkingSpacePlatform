import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { IconType } from "react-icons";
import { FiUsers, FiCalendar, FiMapPin, FiDollarSign } from "react-icons/fi";

enum ReservationStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Cancelled = "Cancelled",
  Completed = "Completed",
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

  const [users, setUsers] = useState<User[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState({
    users: true,
    reservations: true,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users data
        const usersResponse = await axios.get("http://localhost:5234/User");
        const mappedUsers: User[] = usersResponse.data.map((user: any) => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          status: user.active ? "Active" : "Inactive",
          avatar: `https://randomuser.me/api/portraits/lego/${Math.floor(
            Math.random() * 10
          )}.jpg`,
        }));

        // Fetch reservations data
        const reservationsResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/reservation`
        );
        const mappedReservations: Reservation[] = reservationsResponse.data.map(
          (res: any) => ({
            id: res.id,
            startDateTime: new Date(res.startDateTime),
            endDateTime: new Date(res.endDateTime),
            status: res.status,
          })
        );

        console.log("Fetched Reservations:", mappedReservations);

        setUsers(mappedUsers);
        setReservations(mappedReservations);

        // Calculate statistics
        const totalUsers = mappedUsers.length;
        const activeUsers = mappedUsers.filter(
          (u) => u.status === "Active"
        ).length;
        const inactiveUsers = totalUsers - activeUsers;

        const now = new Date();
        const activeReservations = mappedReservations.filter((res) => {
          const end = new Date(res.endDateTime);

          // Count all confirmed reservations that haven't ended yet
          return res.status === ReservationStatus.Confirmed && end >= now;
        }).length;

        console.log("Active Reservations Count:", activeReservations);

        setStats((prevStats) => {
          const newStats = [...prevStats];
          newStats[0] = {
            ...newStats[0],
            value: totalUsers,
            active: activeUsers,
            inactive: inactiveUsers,
          };
          newStats[1] = {
            ...newStats[1],
            value: activeReservations,
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
                  (loading.reservations && index === 1)
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
