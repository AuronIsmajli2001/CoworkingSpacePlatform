import Sidebar from "../components/Sidebar";
import CalendarView from "../pages/CalendarView";
import { useState } from "react";
import { Pencil, Trash2, Plus, Download } from "lucide-react";
import React from "react";

type User = {
  id: string;
  name: string;
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
  Completed = "Completed",
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
};

const sampleReservations: Reservation[] = [
  {
    id: "1",
    userId: "user1",
    spaceId: "space1",
    startDateTime: new Date("2025-04-15T10:00:00"),
    endDateTime: new Date("2025-04-15T12:00:00"),
    createdAt: new Date("2025-04-20"),
    status: ReservationStatus.Confirmed,
    user: {
      id: "user1",
      name: "Neil Sims",
      email: "neil.sims@fswabs.com",
    },
    space: {
      id: "space1",
      name: "Conference Room A",
    },
    reservationEquipment: [
      { id: "eq1", name: "Projector", quantity: 1 },
      { id: "eq2", name: "Whiteboard", quantity: 1 },
    ],
  },
  {
    id: "2",
    userId: "user2",
    spaceId: "space2",
    startDateTime: new Date("2025-04-16T14:00:00"),
    endDateTime: new Date("2025-04-16T16:00:00"),
    createdAt: new Date("2025-04-21"),
    status: ReservationStatus.Pending,
    user: {
      id: "user2",
      name: "Roberta Cazar",
      email: "roberta.casas@fswabs.com",
    },
    space: {
      id: "space2",
      name: "Meeting Room B",
    },
    reservationEquipment: [{ id: "eq3", name: "TV Screen", quantity: 1 }],
  },
];

const Reservations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReservations, setSelectedReservations] = useState<string[]>(
    []
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editingReservation, setEditingReservation] =
    useState<Reservation | null>(null);
  const [reservations, setReservations] =
    useState<Reservation[]>(sampleReservations);
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const reservationsPerPage = 5;

  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = reservations.slice(
    indexOfFirstReservation,
    indexOfLastReservation
  );

  const [showAddModal, setShowAddModal] = useState(false);
  const [newReservation, setNewReservation] = useState({
    user: { name: "", email: "" },
    space: { name: "" },
    startDateTime: new Date(),
    endDateTime: new Date(Date.now() + 3600000), // 1 hour later
    status: ReservationStatus.Pending,
    equipment: [{ name: "", quantity: 1 }],
  });

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

  const handleDelete = (id: string) => {
    setReservations((prev) => prev.filter((res) => res.id !== id));
    setSelectedReservations((prev) => prev.filter((resId) => resId !== id));
  };

  const handleBulkDelete = () => {
    setReservations((prev) =>
      prev.filter((res) => !selectedReservations.includes(res.id))
    );
    setSelectedReservations([]);
    setShowConfirmModal(false);
  };

  const handleEdit = (reservation: Reservation) => {
    setEditingReservation(reservation);
  };

  const handleSaveEdit = (updatedReservation: Reservation) => {
    setReservations((prev) =>
      prev.map((res) =>
        res.id === updatedReservation.id ? updatedReservation : res
      )
    );
    setEditingReservation(null);
  };

  const handleAddReservation = () => {
    const reservation: Reservation = {
      ...newReservation,
      id: `res-${Date.now()}`,
      userId: `user-${Date.now()}`,
      spaceId: `space-${Date.now()}`,
      createdAt: new Date(),
      user: {
        id: `user-${Date.now()}`,
        name: newReservation.user.name,
        email: newReservation.user.email,
      },
      space: {
        id: `space-${Date.now()}`,
        name: newReservation.space.name,
      },
      reservationEquipment: newReservation.equipment.map((eq, idx) => ({
        id: `eq-${Date.now()}-${idx}`,
        name: eq.name,
        quantity: eq.quantity,
      })),
    };

    setReservations([...reservations, reservation]);
    setShowAddModal(false);
    resetNewReservationForm();
  };

  const resetNewReservationForm = () => {
    setNewReservation({
      user: { name: "", email: "" },
      space: { name: "" },
      startDateTime: new Date(),
      endDateTime: new Date(Date.now() + 3600000),
      status: ReservationStatus.Pending,
      equipment: [{ name: "", quantity: 1 }],
    });
  };

  const addEquipmentField = () => {
    setNewReservation((prev) => ({
      ...prev,
      equipment: [...prev.equipment, { name: "", quantity: 1 }],
    }));
  };

  const removeEquipmentField = (index: number) => {
    setNewReservation((prev) => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== index),
    }));
  };

  const handleEquipmentChange = (
    index: number,
    field: "name" | "quantity",
    value: string | number
  ) => {
    const newEquipment = [...newReservation.equipment];
    newEquipment[index] = {
      ...newEquipment[index],
      [field]: field === "quantity" ? Number(value) : value,
    };
    setNewReservation((prev) => ({ ...prev, equipment: newEquipment }));
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
          `"${res.user.name}"`,
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
    return equipment.map((e) => `${e.name} (${e.quantity})`).join(", ");
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-1 pb-0 pt-0">
        <div className="p-6 bg-gray-900 text-white min-h-screen">
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

          {viewMode === "table" ? (
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
                    <th className="p-3">Date & Time</th>
                    <th className="p-3">Equipment</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentReservations
                    .filter(
                      (res) =>
                        res.user.name
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
                          <div className="font-semibold">{res.user.name}</div>
                          <div className="text-gray-300 text-xs">
                            {res.user.email}
                          </div>
                        </td>
                        <td className="p-3 font-semibold">{res.space.name}</td>
                        <td className="p-3">
                          <div>{formatDate(res.startDateTime)}</div>
                          <div className="text-gray-300 text-xs">
                            {formatTime(res.startDateTime)} -{" "}
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
                                : res.status === ReservationStatus.Pending
                                ? "bg-yellow-600/20 text-yellow-400"
                                : res.status === ReservationStatus.Cancelled
                                ? "bg-red-600/20 text-red-400"
                                : "bg-blue-600/20 text-blue-400"
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
                      User
                    </label>
                    <input
                      type="text"
                      value={editingReservation.user.name}
                      onChange={(e) =>
                        setEditingReservation({
                          ...editingReservation,
                          user: {
                            ...editingReservation.user,
                            name: e.target.value,
                          },
                        })
                      }
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Space
                    </label>
                    <input
                      type="text"
                      value={editingReservation.space.name}
                      onChange={(e) =>
                        setEditingReservation({
                          ...editingReservation,
                          space: {
                            ...editingReservation.space,
                            name: e.target.value,
                          },
                        })
                      }
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                    />
                  </div>

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
                      {Object.values(ReservationStatus).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
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
                <h3 className="text-lg font-semibold mb-4">
                  Add New Reservation
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      User Name
                    </label>
                    <input
                      type="text"
                      value={newReservation.user.name}
                      onChange={(e) =>
                        setNewReservation({
                          ...newReservation,
                          user: {
                            ...newReservation.user,
                            name: e.target.value,
                          },
                        })
                      }
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      User Email
                    </label>
                    <input
                      type="email"
                      value={newReservation.user.email}
                      onChange={(e) =>
                        setNewReservation({
                          ...newReservation,
                          user: {
                            ...newReservation.user,
                            email: e.target.value,
                          },
                        })
                      }
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Space Name
                    </label>
                    <input
                      type="text"
                      value={newReservation.space.name}
                      onChange={(e) =>
                        setNewReservation({
                          ...newReservation,
                          space: {
                            ...newReservation.space,
                            name: e.target.value,
                          },
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
                      value={newReservation.status}
                      onChange={(e) =>
                        setNewReservation({
                          ...newReservation,
                          status: e.target.value as ReservationStatus,
                        })
                      }
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                    >
                      {Object.values(ReservationStatus).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
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

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm text-gray-300">
                      Equipment
                    </label>
                    <button
                      onClick={addEquipmentField}
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Equipment
                    </button>
                  </div>
                  {newReservation.equipment.map((eq, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Equipment name"
                        value={eq.name}
                        onChange={(e) =>
                          handleEquipmentChange(index, "name", e.target.value)
                        }
                        className="bg-gray-700 text-white rounded px-3 py-2"
                      />
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Quantity"
                          min="1"
                          value={eq.quantity}
                          onChange={(e) =>
                            handleEquipmentChange(
                              index,
                              "quantity",
                              e.target.value
                            )
                          }
                          className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                        />
                        <button
                          onClick={() => removeEquipmentField(index)}
                          className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
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
