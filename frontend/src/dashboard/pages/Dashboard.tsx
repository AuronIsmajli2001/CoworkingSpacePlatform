import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { IconType } from "react-icons";
import { FiUsers, FiCalendar, FiMapPin, FiDollarSign } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

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

type MonthlyReservations = {
  month: string;
  count: number;
  fullDate: Date;
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
  const [allReservations, setAllReservations] = useState<MonthlyReservations[]>(
    []
  );
  const [filteredReservations, setFilteredReservations] = useState<
    MonthlyReservations[]
  >([]);
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const [loadingChart, setLoadingChart] = useState(true);
  const [timeRange, setTimeRange] = useState<"6m" | "year">("6m");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, reservationsResponse, spacesResponse] =
          await Promise.all([
            axios.get("http://localhost:5234/User"),
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/reservation`),
            axios.get("http://localhost:5234/Space"),
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

        const totalSpaces = spacesResponse.data.length;

        // Process reservations for the chart
        const reservationsByMonth: Record<
          string,
          { count: number; fullDate: Date }
        > = {};

        reservationsResponse.data.forEach((res: any) => {
          const startDate = new Date(res.startDateTime);
          const monthYear = `${startDate.toLocaleString("default", {
            month: "short",
          })} ${startDate.getFullYear()}`;

          if (!reservationsByMonth[monthYear]) {
            reservationsByMonth[monthYear] = {
              count: 0,
              fullDate: new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                1
              ),
            };
          }
          reservationsByMonth[monthYear].count++;
        });

        // Convert to array for the chart
        const chartData = Object.keys(reservationsByMonth)
          .map((month) => ({
            month,
            count: reservationsByMonth[month].count,
            fullDate: reservationsByMonth[month].fullDate,
          }))
          .sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());

        setAllReservations(chartData);
        setLoadingChart(false);

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
          newStats[2] = {
            ...newStats[2],
            value: totalSpaces,
          };
          return newStats;
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dashboard data");
        setLoadingChart(false);
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

  useEffect(() => {
    if (allReservations.length === 0) return;

    const now = new Date();
    let filtered = [];

    if (timeRange === "6m") {
      const cutoffDate = new Date();
      cutoffDate.setMonth(now.getMonth() - 6);
      filtered = allReservations.filter((res) => res.fullDate >= cutoffDate);
    } else {
      // "year" - show all months of current year
      const currentYear = now.getFullYear();
      filtered = allReservations.filter(
        (res) => res.fullDate.getFullYear() === currentYear
      );

      // Ensure all 12 months are represented (even with 0 counts)
      const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(currentYear, i, 1);
        return {
          month:
            date.toLocaleString("default", { month: "short" }) +
            ` ${currentYear}`,
          count: 0,
          fullDate: date,
        };
      });

      // Merge with actual data
      filtered = months.map((month) => {
        const existing = allReservations.find(
          (r) =>
            r.fullDate.getFullYear() === month.fullDate.getFullYear() &&
            r.fullDate.getMonth() === month.fullDate.getMonth()
        );
        return existing || month;
      });
    }

    setFilteredReservations(filtered);
  }, [allReservations, timeRange]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-2 border border-gray-700 rounded">
          <p className="font-semibold">{payload[0].payload.month}</p>
          <p>Reservations: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

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

        <div className="bg-gray-800 p-4 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Reservations</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setTimeRange("6m")}
                className={`px-3 py-1 rounded ${
                  timeRange === "6m" ? "bg-blue-600" : "bg-gray-700"
                }`}
              >
                6 Months
              </button>
              <button
                onClick={() => setTimeRange("year")}
                className={`px-3 py-1 rounded ${
                  timeRange === "year" ? "bg-blue-600" : "bg-gray-700"
                }`}
              >
                This Year
              </button>
              <div className="ml-4 flex space-x-2">
                <button
                  onClick={() => setChartType("bar")}
                  className={`px-3 py-1 rounded ${
                    chartType === "bar" ? "bg-blue-600" : "bg-gray-700"
                  }`}
                >
                  Bar
                </button>
                <button
                  onClick={() => setChartType("line")}
                  className={`px-3 py-1 rounded ${
                    chartType === "line" ? "bg-blue-600" : "bg-gray-700"
                  }`}
                >
                  Line
                </button>
              </div>
            </div>
          </div>

          {loadingChart ? (
            <div className="h-[500px] flex items-center justify-center">
              <p>Loading chart data...</p>
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="h-[500px] flex items-center justify-center">
              <p>No reservation data available for selected period</p>
            </div>
          ) : (
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "bar" ? (
                  <BarChart data={filteredReservations}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis
                      stroke="#9ca3af"
                      allowDecimals={false}
                      domain={[0, "dataMax + 1"]}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={false} />
                    <Legend />
                    <Bar
                      dataKey="count"
                      name="Reservations"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <LineChart data={filteredReservations}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis
                      stroke="#9ca3af"
                      allowDecimals={false}
                      domain={[0, "dataMax + 1"]}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={false} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Reservations"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6" }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
