import React from "react";
import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

type Equipment = {
  id: string;
  type: string;
  name: string;
  quantity: number;
  price_per_piece: number;
  spaceEquipments: any[];
  reservationEquipment: any[];
};

type Notification = {
  message: string;
  type: "success" | "error";
} | null;

const Equipment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notification, setNotification] = useState<Notification>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const equipmentPerPage = 5;

  const [newEquipment, setNewEquipment] = useState({
    type: "",
    name: "",
    quantity: 0,
    price_per_piece: 0
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const navigate = useNavigate();

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
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/Equipment`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setEquipment(res.data);
        } else {
          console.error("Expected array but got:", res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching equipment:", err);
        setNotification({ message: "Failed to load equipment. Please try again later.", type: "error" });
      });
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(id)
        ? prev.filter((equipmentId) => equipmentId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedEquipment.length === equipment.length) {
      setSelectedEquipment([]);
    } else {
      setSelectedEquipment(equipment.map((eq) => eq.id));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/Equipment/${id}`);
      setEquipment((prev) => prev.filter((eq) => eq.id !== id));
      setSelectedEquipment((prev) => prev.filter((eqId) => eqId !== id));
      setNotification({ message: "Equipment successfully deleted.", type: "success" });
    } catch (err) {
      console.error("Failed to delete equipment:", err);
      setNotification({ message: "Failed to delete equipment.", type: "error" });
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedEquipment.map((id) =>
          axios.delete(`${import.meta.env.VITE_API_BASE_URL}/Equipment/${id}`)
        )
      );
      setEquipment((prev) => prev.filter((eq) => !selectedEquipment.includes(eq.id)));
      setSelectedEquipment([]);
      setNotification({ message: "Selected equipment deleted successfully.", type: "success" });
    } catch (err) {
      console.error("Failed to delete equipment:", err);
      setNotification({ message: "Failed to delete selected equipment.", type: "error" });
    }
  };

  const handleSaveEdit = async () => {
    if (editingEquipment) {
      try {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/Equipment/${editingEquipment.id}`,
          {
            type: editingEquipment.type,
            name: editingEquipment.name,
            quantity: editingEquipment.quantity,
            price_per_piece: editingEquipment.price_per_piece
          }
        );
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/Equipment`);
        setEquipment(res.data);
        setEditingEquipment(null);
        setNotification({ message: "Equipment successfully updated.", type: "success" });
      } catch (err) {
        console.error("Failed to update equipment:", err);
        setNotification({ message: "Failed to update equipment.", type: "error" });
      }
    }
  };

  const handleAddEquipment = async () => {
    if (!newEquipment.name.trim() || !newEquipment.type.trim() || newEquipment.quantity <= 0 || newEquipment.price_per_piece <= 0) {
      setNotification({ message: "All fields are required and values must be greater than 0.", type: "error" });
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/Equipment`, newEquipment);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/Equipment`);
      setEquipment(res.data);
      setShowAddModal(false);
      setNewEquipment({
        type: "",
        name: "",
        quantity: 0,
        price_per_piece: 0
      });
      setNotification({ message: "Equipment successfully added.", type: "success" });
    } catch (err) {
      console.error("Failed to add equipment:", err);
      setNotification({ message: "Failed to add equipment.", type: "error" });
    }
  };

  const filteredEquipment = equipment.filter((eq) =>
    eq.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastEquipment = currentPage * equipmentPerPage;
  const indexOfFirstEquipment = indexOfLastEquipment - equipmentPerPage;
  const currentEquipment = filteredEquipment.slice(indexOfFirstEquipment, indexOfLastEquipment);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="w-px flex-1 p-6 overflow-auto bg-gray-900 text-white">
        {notification && (
          <div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeInOut ${
              notification.type === "success" ? "bg-green-500 text-white" : "bg-red-600 text-white"
            }`}
            style={{ minWidth: "280px", textAlign: "center", fontWeight: "600" }}
          >
            {notification.message}
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Equipment</h2>
          <div className="flex gap-2">
            {selectedEquipment.length > 0 && (
              <button
                onClick={() => {
                  setSelectedEquipment([selectedEquipment[0]]);
                  setShowConfirmModal(true);
                }}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
              >
                Delete selected ({selectedEquipment.length})
              </button>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
            >
              + Add Equipment
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search equipment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-800 text-white border border-gray-700 rounded px-4 py-2 text-sm w-64 mb-4"
        />

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-800 text-left uppercase text-gray-400">
              <tr>
                <th className="p-3">
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={
                      selectedEquipment.length === equipment.length &&
                      equipment.length > 0
                    }
                    className="accent-blue-600"
                  />
                </th>
                <th className="p-3">ID</th>
                <th className="p-3">Type</th>
                <th className="p-3">Name</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Price per Piece</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentEquipment.map((eq, idx) => (
                <tr
                  key={eq.id}
                  className={`border-b border-gray-700 bg-gray-900 hover:bg-gray-800`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedEquipment.includes(eq.id)}
                      onChange={() => toggleSelect(eq.id)}
                      className="accent-blue-600"
                    />
                  </td>
                  <td className="p-3">{eq.id}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-gray-700 rounded-full text-xs">
                      {eq.type}
                    </span>
                  </td>
                  <td className="p-3">{eq.name}</td>
                  <td className="p-3">{eq.quantity}</td>
                  <td className="p-3">${eq.price_per_piece.toFixed(2)}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm flex items-center gap-1"
                      onClick={() => setEditingEquipment(eq)}
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedEquipment([eq.id]);
                        setShowConfirmModal(true);
                      }}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
          >
            ←
          </button>
          <span className="text-sm text-gray-300">
            Page {currentPage} of {Math.ceil(filteredEquipment.length / equipmentPerPage)}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                indexOfLastEquipment < filteredEquipment.length ? prev + 1 : prev
              )
            }
            disabled={indexOfLastEquipment >= filteredEquipment.length}
            className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
          >
            →
          </button>
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded w-[400px]">
              <h3 className="text-xl mb-4 font-semibold">Add Equipment</h3>

              <input
                type="text"
                placeholder="Type"
                value={newEquipment.type}
                onChange={(e) =>
                  setNewEquipment({ ...newEquipment, type: e.target.value })
                }
                className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white"
              />

              <input
                type="text"
                placeholder="Name"
                value={newEquipment.name}
                onChange={(e) =>
                  setNewEquipment({ ...newEquipment, name: e.target.value })
                }
                className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white"
              />

              <input
                type="number"
                placeholder="Quantity"
                value={newEquipment.quantity}
                onChange={(e) =>
                  setNewEquipment({
                    ...newEquipment,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white"
              />

              <input
                type="number"
                placeholder="Price per Piece"
                value={newEquipment.price_per_piece}
                onChange={(e) =>
                  setNewEquipment({
                    ...newEquipment,
                    price_per_piece: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full mb-4 px-3 py-2 rounded bg-gray-700 text-white"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEquipment}
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingEquipment && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded w-[400px]">
              <h3 className="text-xl mb-4 font-semibold">Edit Equipment</h3>

              <input
                type="text"
                placeholder="Type"
                value={editingEquipment.type}
                onChange={(e) =>
                  setEditingEquipment({
                    ...editingEquipment,
                    type: e.target.value,
                  })
                }
                className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white"
              />

              <input
                type="text"
                placeholder="Name"
                value={editingEquipment.name}
                onChange={(e) =>
                  setEditingEquipment({
                    ...editingEquipment,
                    name: e.target.value,
                  })
                }
                className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white"
              />

              <input
                type="number"
                placeholder="Quantity"
                value={editingEquipment.quantity}
                onChange={(e) =>
                  setEditingEquipment({
                    ...editingEquipment,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white"
              />

              <input
                type="number"
                placeholder="Price per Piece"
                value={editingEquipment.price_per_piece}
                onChange={(e) =>
                  setEditingEquipment({
                    ...editingEquipment,
                    price_per_piece: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full mb-4 px-3 py-2 rounded bg-gray-700 text-white"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditingEquipment(null)}
                  className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
              <p className="text-sm text-gray-300 mb-6">
                Are you sure you want to delete {selectedEquipment.length} selected equipment?
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
                    if (selectedEquipment.length === 1) {
                      handleDelete(selectedEquipment[0]);
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
      </main>
    </div>
  );
};

export default Equipment;
