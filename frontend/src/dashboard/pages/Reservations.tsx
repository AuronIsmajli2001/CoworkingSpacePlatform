import Sidebar from "../components/Sidebar";
import CalendarView from "../pages/CalendarView";
import { useState } from "react";
import { Pencil, Trash2, Plus, Download } from "lucide-react";
import React from "react";
import { useEffect } from "react";
import api from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { v4 as uuidv4 } from 'uuid';


//@ts-ignore
const baseUrl = import.meta.env.VITE_API_BASE_URL;
//@ts-ignore
const frontUrl = import.meta.env.VITE_FRONTEND_URL;

type User = {
  id: string;
  userName: string;
  email: string;
};

type Space = {
  id: string;
  name: string;
};

type ReservationEquipment = {
  id: string;
  name: string;
  quantity: number;
};

enum ReservationStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Cancelled = "Cancelled",
}

enum PaymentMethod {
  Card = "Card",
  Cash = "Cash",
}

type Reservation = {
  id: string;
  userId: string;
  spaceId: string;
  startDateTime: Date;
  endDateTime: Date;
  createdAt: Date;
  status: ReservationStatus;
  user: User;
  space: Space;
  reservationEquipment: ReservationEquipment[];
  paymentMethod?: PaymentMethod;
  isPaid?: boolean;
};

type NewReservation = {
  user: { id: string; name: string; email: string };
  space: { id: string; name: string };
  startDateTime: Date;
  endDateTime: Date;
  status: ReservationStatus;
  paymentMethod: PaymentMethod;
};

const Reservations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReservations, setSelectedReservations] = useState<string[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [totalReservations, setTotalReservations] = useState(0);
  const [upcomingReservations, setUpcomingReservations] = useState(0);
  const [completedReservations, setCompletedReservations] = useState(0);
  const [pendingReservations, setPendingReservations] = useState(0);

  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const reservationsPerPage = 5;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newReservation, setNewReservation] = useState<NewReservation>({
    user: { id: "", name: "", email: "" },
    space: { id: "", name: "" },
    startDateTime: new Date(),
    endDateTime: new Date(Date.now() + 3600000),
    status: ReservationStatus.Pending,
    paymentMethod: PaymentMethod.Card,
  });

  const [editingEquipment, setEditingEquipment] = useState<ReservationEquipment[]>([]);
  const [allEquipment, setAllEquipment] = useState<ReservationEquipment[]>([]);
  const [equipmentLoading, setEquipmentLoading] = useState(false);
  const [equipmentError, setEquipmentError] = useState<string | null>(null);
  const [addEquipId, setAddEquipId] = useState("");
  const [addEquipQty, setAddEquipQty] = useState(1);

  const navigate = useNavigate();

  // Auth validation
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/auth");
      return;
    }
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.role !== "Staff" && decoded.role !== "SuperAdmin" && decoded.role !== "Admin") {
        navigate("/auth");
      }
    } catch (err) {
      navigate("/auth");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch users
        const usersResponse = await api.get(`${baseUrl}/User`);
        setUsers(usersResponse.data);

        // Fetch spaces
        const spacesResponse = await api.get(`${baseUrl}/Space`);
        setSpaces(spacesResponse.data);

        // Fetch reservations
        const reservationsResponse = await api.get(`${baseUrl}/reservation`);

        const mappedReservations = reservationsResponse.data.map((res: any) => ({
          id: res.id,
          userId: res.userId,
          spaceId: res.spaceId,
          startDateTime: new Date(res.startDateTime),
          endDateTime: new Date(res.endDateTime),
          createdAt: new Date(res.createdAt),
          status: res.status as ReservationStatus,
          user: {
            id: res.user?.id || res.userId || "",
            userName: res.user?.userName || `User ${res.userId}`,
            email: res.user?.email || "",
          },
          space: {
            id: res.space?.id || res.spaceId || "",
            name: res.space?.name || `Space ${res.spaceId}`,
          },
          reservationEquipment: res.reservationEquipment?.map((eq: any) => ({
          id: eq.equipment?.id || eq.id,
          name: eq.equipment?.name || eq.name,
          quantity: eq.quantity,
        })) || res.equipment?.map((eq: any) => ({
          id: eq.id,
          name: eq.name,
          quantity: eq.quantity,
        })) || [],
        paymentMethod: res.paymentMethod,
        isPaid: res.isPaid,
      }));

        setReservations(mappedReservations);
        setTotalReservations(mappedReservations.length);
        setUpcomingReservations(
          mappedReservations.filter(
            (res: Reservation) => 
              res.status === ReservationStatus.Confirmed && 
              new Date(res.startDateTime) > new Date()
          ).length
        );
        setCompletedReservations(
          mappedReservations.filter(
            (res: Reservation) => 
              res.status === ReservationStatus.Confirmed && 
              new Date(res.endDateTime) < new Date()
          ).length
        );
        setPendingReservations(
          mappedReservations.filter(
            (res: Reservation) => res.status === ReservationStatus.Pending
          ).length
        );
      } catch (error: any) {
        console.error("Failed to fetch data:", error);
        if (error.response) {
          if (error.response.status === 401) {
            navigate("/auth");
          } else {
            setError(error.response.data?.message || "Failed to load data. Please try again later.");
          }
        } else if (error.request) {
          setError("Network error. Please check your connection.");
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = reservations.slice(
    indexOfFirstReservation,
    indexOfLastReservation
  );

  const [showAddModal, setShowAddModal] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedReservations((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedReservations.length === reservations.length) {
      setSelectedReservations([]);
    } else {
      setSelectedReservations(reservations.map((res) => res.id));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`${baseUrl}/Reservation/${id}`);
      setReservations((prev) => prev.filter((res) => res.id !== id));
      setSelectedReservations((prev) => prev.filter((resId) => resId !== id));
      // Update counts
      setTotalReservations(prev => prev - 1);
      const deletedRes = reservations.find(res => res.id === id);
      if (deletedRes) {
        if (deletedRes.status === ReservationStatus.Confirmed) {
          if (new Date(deletedRes.startDateTime) > new Date()) {
            setUpcomingReservations(prev => prev - 1);
          } else {
            setCompletedReservations(prev => prev - 1);
          }
        } else {
          setPendingReservations(prev => prev - 1);
        }
      }
    } catch (error: any) {
      console.error("Failed to delete reservation:", error);
      if (error.response) {
        if (error.response.status === 401) {
          navigate("/auth");
        } else {
          setError(error.response.data?.message || "Failed to delete reservation. Please try again later.");
        }
      } else if (error.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedReservations.map((id) =>
          api.delete(`${baseUrl}/Reservation/${id}`)
        )
      );
      const deletedCount = selectedReservations.length;
      const deletedReservations = reservations.filter(res => selectedReservations.includes(res.id));
      
      setReservations((prev) =>
        prev.filter((res) => !selectedReservations.includes(res.id))
      );
      setSelectedReservations([]);
      setShowConfirmModal(false);
      
      // Update counts
      setTotalReservations(prev => prev - deletedCount);
      setUpcomingReservations(prev => prev - deletedReservations.filter(
        res => res.status === ReservationStatus.Confirmed && new Date(res.startDateTime) > new Date()
      ).length);
      setCompletedReservations(prev => prev - deletedReservations.filter(
        res => res.status === ReservationStatus.Confirmed && new Date(res.endDateTime) < new Date()
      ).length);
      setPendingReservations(prev => prev - deletedReservations.filter(
        res => res.status === ReservationStatus.Pending
      ).length);
    } catch (error: any) {
      console.error("Failed to delete reservations:", error);
      if (error.response) {
        if (error.response.status === 401) {
          navigate("/auth");
        } else {
          setError(error.response.data?.message || "Failed to delete reservations. Please try again later.");
        }
      } else if (error.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleEdit = async (reservation: Reservation) => {
    setEditingReservation(reservation);
    setEquipmentLoading(true);
    setEquipmentError(null);
    try {
      const [resEquipRes, allEquipRes] = await Promise.all([
        api.get(`${baseUrl}/ReservationEquipment/${reservation.id}`),
        api.get(`${baseUrl}/Equipment`)
      ]);
      setEditingEquipment(resEquipRes.data); // Array of {id, name, quantity}
      setAllEquipment(allEquipRes.data);     // Array of all equipment
    } catch (err: any) {
      setEquipmentError("Failed to load equipment.");
    } finally {
      setEquipmentLoading(false);
    }
  };

  const handleSaveEdit = async (updatedReservation: Reservation) => {
    try {
      const payload = {
        userId: null,
        spaceId: null,
        startDateTime: updatedReservation.startDateTime.toISOString(),
        endDateTime: updatedReservation.endDateTime.toISOString(),
        status: updatedReservation.status,
      };

      await api.put(
        `${baseUrl}/Reservation/${updatedReservation.id}`,
        payload
      );

      // Refresh reservations from server to show updates immediately
      const reservationsResponse = await api.get(`${baseUrl}/reservation`);
      const mappedReservations = reservationsResponse.data.map((res: any) => ({
        id: res.id,
        userId: res.userId,
        spaceId: res.spaceId,
        startDateTime: new Date(res.startDateTime),
        endDateTime: new Date(res.endDateTime),
        createdAt: new Date(res.createdAt),
        status: res.status as ReservationStatus,
        user: {
          id: res.user?.id || res.userId || "",
          userName: res.user?.userName || `User ${res.userId}`,
          email: res.user?.email || "",
        },
        space: {
          id: res.space?.id || res.spaceId || "",
          name: res.space?.name || `Space ${res.spaceId}`,
        },
        reservationEquipment: res.reservationEquipment?.map((eq: any) => ({
          id: eq.id,
          name: eq.name,
          quantity: eq.quantity,
        })) || [],
        paymentMethod: res.paymentMethod,
        isPaid: res.isPaid,
      }));
      setReservations(mappedReservations);
      setEditingReservation(null);
    } catch (error: any) {
      console.error("Failed to update reservation:", error);
      if (error.response) {
        if (error.response.status === 401) {
          navigate("/auth");
        } else {
          setError(error.response.data?.message || "Failed to update reservation. Please try again later.");
        }
      } else if (error.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleAddReservation = async () => {
    try {
      const payload = {
        id  : uuidv4(),
        userId: newReservation.user.id,
        spaceId: newReservation.space.id,
        paymentMethod: newReservation.paymentMethod,
        isPaid: newReservation.paymentMethod === PaymentMethod.Card,
        startDateTime: newReservation.startDateTime.toISOString(),
        endDateTime: newReservation.endDateTime.toISOString(),
        status: ReservationStatus.Confirmed
      };

      const response = await api.post(
        `${baseUrl}/Reservation`,
        payload
      );

      const newReservationWithId: Reservation = {
        id: response.data.id,
        userId: newReservation.user.id,
        spaceId: newReservation.space.id,
        startDateTime: newReservation.startDateTime,
        endDateTime: newReservation.endDateTime,
        createdAt: new Date(),
        status: ReservationStatus.Confirmed,
        user: {
          id: newReservation.user.id,
          userName: newReservation.user.name,
          email: newReservation.user.email,
        },
        space: {
          id: newReservation.space.id,
          name: newReservation.space.name,
        },
        reservationEquipment: [],
        paymentMethod: newReservation.paymentMethod,
        isPaid: newReservation.paymentMethod === PaymentMethod.Card,
      };

      setReservations([...reservations, newReservationWithId]);
      setShowAddModal(false);
      resetNewReservationForm();
      
      // Update counts
      setTotalReservations(prev => prev + 1);
      if (newReservation.startDateTime > new Date()) {
        setUpcomingReservations(prev => prev + 1);
      } else {
        setCompletedReservations(prev => prev + 1);
      }
    } catch (error: any) {
      console.error("Failed to add reservation:", error);
      if (error.response) {
        if (error.response.status === 401) {
          navigate("/auth");
        } else {
          setError(error.response.data?.message || "Failed to add reservation. Please try again later.");
        }
      } else if (error.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const resetNewReservationForm = () => {
    setNewReservation({
      user: { id: "", name: "", email: "" },
      space: { id: "", name: "" },
      startDateTime: new Date(),
      endDateTime: new Date(Date.now() + 3600000),
      status: ReservationStatus.Pending,
      paymentMethod: PaymentMethod.Card,
    });
  };

  const exportToCSV = () => {
    const headers = [
      "ID",
      "User Name",
      "User Email",
      "Space",
      "Start Date",
      "End Date",
      "Status",
      "Equipment",
    ];

    const csvContent = [
      headers.join(","),
      ...reservations.map((res) =>
        [
          res.id,
          `"${res.user.userName}"`,
          `"${res.user.email}"`,
          `"${res.space.name}"`,
          `"${formatDate(res.startDateTime)} ${formatTime(res.startDateTime)}"`,
          `"${formatTime(res.endDateTime)}"`,
          res.status,
          `"${getEquipmentSummary(res.reservationEquipment)}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "reservations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEquipmentSummary = (equipment: ReservationEquipment[]) => {
    return equipment.length === 0
      ? "0"
      : equipment.map((e) => `${e.name} (${e.quantity})`).join(", ");
  };

  const handleAddEquipment = async () => {
    if (!addEquipId || addEquipQty < 1 || !editingReservation) return;
    try {
      await api.post(`${baseUrl}/ReservationEquipment`, {
        reservationId: editingReservation.id,
        equipmentIds: [addEquipId],
        quantity: [addEquipQty]
      });
      // Refresh equipment list
      const resEquipRes = await api.get(`${baseUrl}/ReservationEquipment/${editingReservation.id}`);
      setEditingEquipment(resEquipRes.data);
      setAddEquipId("");
      setAddEquipQty(1);
    } catch (err) {
      setEquipmentError("Failed to add equipment.");
    }
  };

  const handleRemoveEquipment = async (equipmentId: string) => {
    if (!editingReservation) return;
    try {
      await api.delete(`${baseUrl}/ReservationEquipment/${editingReservation.id}/${equipmentId}`);
      // Refresh equipment list
      const resEquipRes = await api.get(`${baseUrl}/ReservationEquipment/${editingReservation.id}`);
      setEditingEquipment(resEquipRes.data);
    } catch (err) {
      setEquipmentError("Failed to remove equipment.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 pb-0 pt-0">
        <div className="p-6 bg-gray-900 text-white min-h-screen">
          {/* Dashboard Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg shadow text-white">
              <p className="text-sm text-gray-400">Total Reservations</p>
              <h2 className="text-2xl font-bold">{totalReservations}</h2>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow text-white">
              <p className="text-sm text-gray-400">Upcoming Reservations</p>
              <h2 className="text-2xl font-bold text-blue-400">
                {upcomingReservations}
              </h2>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow text-white">
              <p className="text-sm text-gray-400">Completed Reservations</p>
              <h2 className="text-2xl font-bold text-green-400">
                {completedReservations}
              </h2>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow text-white">
              <p className="text-sm text-gray-400">Pending Reservations</p>
              <h2 className="text-2xl font-bold text-yellow-400">
                {pendingReservations}
              </h2>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">All Reservations</h2>
            <div className="flex gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-1 rounded text-sm ${
                    viewMode === "table" ? "bg-blue-600" : "bg-gray-700"
                  }`}
                >
                  Table View
                </button>
                <button
                  onClick={() => setViewMode("calendar")}
                  className={`px-3 py-1 rounded text-sm ${
                    viewMode === "calendar" ? "bg-blue-600" : "bg-gray-700"
                  }`}
                >
                  Calendar View
                </button>
              </div>
              {selectedReservations.length > 0 && (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
                >
                  Delete selected ({selectedReservations.length})
                </button>
              )}
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm flex items-center gap-1"
              >
                <Plus size={16} /> Add Reservation
              </button>
              <button
                onClick={exportToCSV}
                className="border border-gray-500 px-4 py-2 rounded text-sm flex items-center gap-1"
              >
                <Download size={16} /> Export
              </button>
            </div>
          </div>

          <input
            type="text"
            placeholder="Search for reservations"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 rounded px-4 py-2 text-sm w-64 mb-4"
          />

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-700 text-red-300 p-4 rounded">
              {error}
              <button
                onClick={() => window.location.reload()}
                className="ml-2 text-blue-400 hover:text-blue-300"
              >
                Retry
              </button>
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No reservations found. Create your first reservation!
            </div>
          ) : viewMode === "table" ? (
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead className="bg-gray-800 text-left uppercase text-gray-400">
                  <tr>
                    <th className="p-3">
                      <input
                        type="checkbox"
                        onChange={toggleSelectAll}
                        checked={
                          selectedReservations.length === reservations.length &&
                          reservations.length > 0
                        }
                        className="accent-blue-600"
                      />
                    </th>
                    <th className="p-3">ID</th>
                    <th className="p-3">User</th>
                    <th className="p-3">Space</th>
                    <th className="p-3">Start Date</th>
                    <th className="p-3">End Date</th>
                    <th className="p-3">Equipment</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentReservations
                    .filter(
                      (res) =>
                        res.user.userName
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        res.space.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                    )
                    .map((res) => (
                      <tr
                        className="border-b border-gray-700 hover:bg-gray-800"
                        key={res.id}
                      >
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedReservations.includes(res.id)}
                            onChange={() => toggleSelect(res.id)}
                            className="accent-blue-600"
                          />
                        </td>
                        <td className="p-3">{res.id}</td>
                        <td className="p-3">
                          <div className="font-semibold">
                            {res.user.userName}
                          </div>
                          <div className="text-gray-300 text-xs">
                            {res.user.email}
                          </div>
                        </td>
                        <td className="p-3 font-semibold">{res.space.name}</td>
                        <td className="p-3">
                          <div>{formatDate(res.startDateTime)}</div>
                          <div className="text-gray-300 text-xs">
                            {formatTime(res.startDateTime)}
                          </div>
                        </td>
                        <td className="p-3">
                          <div>{formatDate(res.endDateTime)}</div>
                          <div className="text-gray-300 text-xs">
                            {formatTime(res.endDateTime)}
                          </div>
                        </td>

                        <td className="p-3 text-gray-300 text-sm">
                          {getEquipmentSummary(res.reservationEquipment)}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded ${
                              res.status === ReservationStatus.Confirmed
                                ? "bg-green-600/20 text-green-400"
                                : "bg-yellow-600/20 text-yellow-400"
                            }`}
                          >
                            <span className="h-2 w-2 rounded-full bg-current"></span>
                            {res.status}
                          </span>
                        </td>
                        <td className="p-3 flex gap-2">
                          <button
                            onClick={() => handleEdit(res)}
                            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm rounded flex items-center gap-1"
                          >
                            <Pencil size={14} /> Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedReservations([res.id]);
                              setShowConfirmModal(true);
                            }}
                            className="bg-red-600 hover:bg-red-700 px-3 py-1 text-sm rounded flex items-center gap-1"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="flex justify-center items-center gap-4 mt-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
                >
                  ←
                </button>
                <span className="text-sm text-gray-300">
                  Page {currentPage} of{" "}
                  {Math.ceil(reservations.length / reservationsPerPage)}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      indexOfLastReservation < reservations.length
                        ? prev + 1
                        : prev
                    )
                  }
                  disabled={indexOfLastReservation >= reservations.length}
                  className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
                >
                  →
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <div className="text-gray-400 text-center py-8">
                <CalendarView reservations={reservations} />{" "}
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showConfirmModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded shadow-lg w-96">
                <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
                <p className="text-sm text-gray-300 mb-6">
                  Are you sure you want to delete{" "}
                  <span className="font-bold text-white">
                    {selectedReservations.length}
                  </span>{" "}
                  selected reservation
                  {selectedReservations.length > 1 ? "s" : ""}?
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (selectedReservations.length === 1) {
                        handleDelete(selectedReservations[0]);
                      } else {
                        handleBulkDelete();
                      }
                      setShowConfirmModal(false);
                    }}
                    className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {editingReservation && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded shadow-lg w-1/2">
                <h3 className="text-lg font-semibold mb-4">Edit Reservation</h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Start Date
                    </label>
                    <input
                      type="datetime-local"
                      value={editingReservation.startDateTime
                        .toISOString()
                        .slice(0, 16)}
                      onChange={(e) =>
                        setEditingReservation({
                          ...editingReservation,
                          startDateTime: new Date(e.target.value),
                        })
                      }
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      End Date
                    </label>
                    <input
                      type="datetime-local"
                      value={editingReservation.endDateTime
                        .toISOString()
                        .slice(0, 16)}
                      onChange={(e) =>
                        setEditingReservation({
                          ...editingReservation,
                          endDateTime: new Date(e.target.value),
                        })
                      }
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      value={editingReservation.status}
                      onChange={(e) =>
                        setEditingReservation({
                          ...editingReservation,
                          status: e.target.value as ReservationStatus,
                        })
                      }
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                    >
                      <option value={ReservationStatus.Pending}>Pending</option>
                      <option value={ReservationStatus.Confirmed}>Confirmed</option>
                      <option value={ReservationStatus.Cancelled}>Cancelled</option>

                    </select>
                  </div>
                </div>

                {/* Equipment Section */}
                <div>
                  <h4 className="text-gray-300 mb-2">Equipment</h4>
                  {equipmentLoading ? (
                    <div>Loading equipment...</div>
                  ) : equipmentError ? (
                    <div className="text-red-400">{equipmentError}</div>
                  ) : (
                    <>
                      <ul>
                        {editingEquipment.map(eq => (
                          <li key={eq.id} className="flex items-center gap-2">
                            {eq.name} (x{eq.quantity})
                            <button onClick={() => handleRemoveEquipment(eq.id)} className="text-red-400 ml-2">Remove</button>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-2 flex gap-2 items-center">
                        <select
                          value={addEquipId}
                          onChange={e => setAddEquipId(e.target.value)}
                          className="bg-gray-700 text-white rounded px-3 py-2"
                        >
                          <option value="">Add equipment...</option>
                          {allEquipment
                            .filter(eq => !editingEquipment.some(e => e.id === eq.id))
                            .map(eq => (
                              <option key={eq.id} value={eq.id}>{eq.name}</option>
                            ))}
                        </select>
                        <input
                          type="number"
                          min={1}
                          value={addEquipQty}
                          onChange={e => setAddEquipQty(Number(e.target.value))}
                          className="bg-gray-700 text-white rounded px-3 py-2 w-20"
                        />
                        <button
                          onClick={handleAddEquipment}
                          className="ml-2 bg-blue-600 px-2 py-1 rounded text-white"
                        >
                          Add
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingReservation(null)}
                    className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveEdit(editingReservation)}
                    className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Reservation Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded shadow-lg w-1/2 max-h-[80vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Add New Reservation</h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      User
                    </label>
                    <select
                      value={newReservation.user.id}
                      onChange={(e) => {
                        const selectedUser = users.find(u => u.id === e.target.value);
                        setNewReservation({
                          ...newReservation,
                          user: {
                            id: e.target.value,
                            name: selectedUser?.userName || "",
                            email: selectedUser?.email || "",
                          },
                        });
                      }}
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                    >
                      <option value="">Select a user</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.userName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Space
                    </label>
                    <select
                      value={newReservation.space.id}
                      onChange={(e) => {
                        const selectedSpace = spaces.find(s => s.id === e.target.value);
                        setNewReservation({
                          ...newReservation,
                          space: {
                            id: e.target.value,
                            name: selectedSpace?.name || "",
                          },
                        });
                      }}
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                    >
                      <option value="">Select a space</option>
                      {spaces.map((space) => (
                        <option key={space.id} value={space.id}>
                          {space.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Payment Method
                    </label>
                    <select
                      value={newReservation.paymentMethod}
                      onChange={(e) =>
                        setNewReservation({
                          ...newReservation,
                          paymentMethod: e.target.value as PaymentMethod,
                        })
                      }
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                    >
                      <option value={PaymentMethod.Card}>Card</option>
                      <option value={PaymentMethod.Cash}>Cash</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Start Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={newReservation.startDateTime
                        .toISOString()
                        .slice(0, 16)}
                      onChange={(e) =>
                        setNewReservation({
                          ...newReservation,
                          startDateTime: new Date(e.target.value),
                        })
                      }
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      End Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={newReservation.endDateTime
                        .toISOString()
                        .slice(0, 16)}
                      onChange={(e) =>
                        setNewReservation({
                          ...newReservation,
                          endDateTime: new Date(e.target.value),
                        })
                      }
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetNewReservationForm();
                    }}
                    className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddReservation}
                    className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded"
                  >
                    Add Reservation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reservations;