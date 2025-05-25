import React from "react";
import { useState, useEffect } from "react";
import { Pencil, Trash2, X, Check } from "lucide-react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

type Membership = {
  id: string;
  title: string;
  created_At: string;
  price: number;
  isActive: boolean;
  includesVAT: boolean;
  billingType: string;
  description: string;
  additionalServices: string;
};

const Memberships = () => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMemberships, setSelectedMemberships] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMembership, setEditingMembership] = useState<{
    id: string;
    title: string;
    price: number | null;
    includesVAT: string;
    description: string;
    additionalServices: string;
    isActive: string;
    billingType: string;
  } | null>(null);

  const [newMembership, setNewMembership] = useState({
    title: "",
    price: null as number | null,
    includesVAT: "",
    description: "",
    additionalServices: "",
    billingType: "",
  });

  type Notification = {
  message: string;
  type: "success" | "error";
} | null;

const [notification, setNotification] = useState<Notification>(null);

useEffect(() => {
  if (notification) {
    const timer = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(timer);
  }
}, [notification]);


  const [currentPage, setCurrentPage] = useState(1);
  const membershipsPerPage = 5;

  useEffect(() => {
    axios
      .get("http://localhost:5234/Membership")
      .then((res) => {
        setMemberships(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch memberships:", err);
      });
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedMemberships((prev) =>
      prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedMemberships.length === memberships.length) {
      setSelectedMemberships([]);
    } else {
      setSelectedMemberships(memberships.map((m) => m.id));
    }
  };

 // DELETE single membership API call
 const handleDelete = async (id: string) => {
  const confirmed = window.confirm("Are you sure you wanna delete this membership?");
  if (!confirmed) return;

  try {
    await axios.delete(`http://localhost:5234/Membership/${id}`);
    setMemberships((prev) => prev.filter((m) => m.id !== id));
    setSelectedMemberships((prev) => prev.filter((sid) => sid !== id));
    setNotification({ message: "Membership successfully deleted.", type: "error" });
  } catch (error) {
    console.error("Delete failed", error);
    setNotification({ message: "Failed to delete membership.", type: "error" });
  }
};


   // BULK delete calling DELETE API for each
  const handleBulkDelete = async () => {
  try {
    await Promise.all(
      selectedMemberships.map((id) =>
        axios.delete(`http://localhost:5234/Membership/${id}`)
      )
    );
    setMemberships((prev) =>
      prev.filter((m) => !selectedMemberships.includes(m.id))
    );
    setSelectedMemberships([]);
    setNotification({ message: "Selected memberships deleted.", type: "success" });
  } catch (error) {
    console.error("Bulk delete failed", error);
    setNotification({ message: "Failed to delete selected memberships.", type: "error" });
  }
};

  const openEditModal = (membership: Membership) => {
  setEditingMembership({
    id: membership.id,
    title: membership.title,
    price: membership.price,
    includesVAT: membership.includesVAT.toString(),
    description: membership.description,
    additionalServices: membership.additionalServices,
    isActive: membership.isActive.toString(),
    billingType: membership.billingType,
  });
};


  const handleEditMembership = async () => {
  if (!editingMembership) return;
  try {
    const body = {
      title: editingMembership.title.trim() === "" ? null : editingMembership.title,
      price: editingMembership.price === null ? null : editingMembership.price,
      includesVAT: editingMembership.includesVAT.trim() === "" ? null : editingMembership.includesVAT === "true",
      description: editingMembership.description.trim() === "" ? null : editingMembership.description,
      additionalServices: editingMembership.additionalServices.trim() === "" ? null : editingMembership.additionalServices,
      isActive: editingMembership.isActive.trim() === "" ? null : editingMembership.isActive === "true",
      billingType: editingMembership.billingType.trim() === "" ? null : editingMembership.billingType,
    };
    await axios.put(
      `http://localhost:5234/Membership/${editingMembership.id}`,
      body
    );
    const res = await axios.get("http://localhost:5234/Membership");
    setMemberships(res.data);
    setNotification({ message: "Membership successfully updated.", type: "success" });
    setEditingMembership(null);
  } catch (error) {
    console.error("Edit membership failed", error);
    setNotification({ message: "Failed to update membership.", type: "error" });
  }
};

  const handleAddMembership = async () => {
  if (
    !newMembership.title.trim() ||
    !newMembership.price ||
    !newMembership.includesVAT.trim() ||
    !newMembership.description.trim() ||
    !newMembership.additionalServices.trim() ||
    !newMembership.billingType.trim()
  ) {
    alert("All fields are required.");
    return;
  }
  try {
    const body = {
      title: newMembership.title,
      price: newMembership.price,
      includesVAT: newMembership.includesVAT === "true",
      description: newMembership.description,
      additionalServices: newMembership.additionalServices,
      billingType: newMembership.billingType,
    };
    await axios.post("http://localhost:5234/Membership", body);
    const res = await axios.get("http://localhost:5234/Membership");
    setMemberships(res.data);
    setNotification({ message: "Membership successfully added.", type: "success" });
    setShowAddModal(false);
    setNewMembership({
      title: "",
      price: null,
      includesVAT: "",
      description: "",
      additionalServices: "",
      billingType: "",
    });
  } catch (error) {
    console.error("Add membership failed", error);
    setNotification({ message: "Failed to add membership.", type: "error" });
  }
};

  const filteredMemberships = memberships.filter((m) =>
  (m.title ?? "").toLowerCase().includes(searchTerm.toLowerCase())
);

  const indexOfLastMembership = currentPage * membershipsPerPage;
  const indexOfFirstMembership = indexOfLastMembership - membershipsPerPage;
  const currentMemberships = filteredMemberships.slice(indexOfFirstMembership, indexOfLastMembership);

  // Controlled inputs for edit modal
  const updateEditingField = (field: keyof Membership, value: any) => {
    if (!editingMembership) return;
    setEditingMembership({ ...editingMembership, [field]: value });
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className=" w-px flex-1 p-6 overflow-auto bg-gray-900 text-white">



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
          <h2 className="text-2xl font-bold">Memberships</h2>
          <div className="flex gap-2">
            {selectedMemberships.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
              >
                Delete selected ({selectedMemberships.length})
              </button>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
            >
              + Add Membership
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search memberships..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-800 text-white border border-gray-700 rounded px-4 py-2 text-sm w-64 mb-4"
        />

        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-800 text-left uppercase text-gray-400">
              <tr>
                <th className="p-3">
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={
                      selectedMemberships.length === memberships.length &&
                      memberships.length > 0
                    }
                    className="accent-blue-600"
                  />
                </th>
                <th className="p-3">ID</th>
                <th className="p-3">Title</th>
                <th className="p-3">Price</th>
                <th className="p-3">Billing Type</th>
                <th className="p-3">Active</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentMemberships.map((m) => (
                <tr
                  key={m.id}
                  className="border-b border-gray-700 hover:bg-gray-800"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedMemberships.includes(m.id)}
                      onChange={() => toggleSelect(m.id)}
                      className="accent-blue-600"
                    />
                  </td>
                  <td className="p-3">{m.id}</td> 
                  <td className="p-3">{m.title}</td>
                  <td className="p-3">${typeof m.price === "number" ? m.price.toFixed(2) : "0.00"}</td>
                  <td className="p-3">{m.billingType}</td>
                  <td className="p-3">{m.isActive ? "Yes" : "No"}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm flex items-center gap-1"
                      onClick={() => openEditModal(m)}
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm flex items-center gap-1"
                      onClick={() => handleDelete(m.id)}
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
            Page {currentPage} of {Math.ceil(filteredMemberships.length / membershipsPerPage)}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                indexOfLastMembership < filteredMemberships.length ? prev + 1 : prev
              )
            }
            disabled={indexOfLastMembership >= filteredMemberships.length}
            className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
          >
            →
          </button>
        </div>

        {/* ADD MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded w-[400px]">
              <h3 className="text-xl mb-4 font-semibold">Add Membership</h3>

              <input
                type="text"
                placeholder="Title"
                value={newMembership.title}
                onChange={(e) =>
                  setNewMembership({ ...newMembership, title: e.target.value })
                }
                className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white"
              />

              <input
                type="number"
                placeholder="Price"
                value={newMembership.price ?? ""}
                onChange={e =>
                  setNewMembership({
                    ...newMembership,
                    price: e.target.value === '' ? null : Number(e.target.value),
                  })
                }
                className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white"
              />

              <select
                value={newMembership.billingType}
                onChange={(e) =>
                  setNewMembership({ ...newMembership, billingType: e.target.value })
                }
                className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white"
              >
                <option value="0">Choose an option</option>
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>

              </select>

              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={newMembership.includesVAT === "true"}
                  onChange={() =>
                    setNewMembership({
                      ...newMembership,
                      includesVAT: newMembership.includesVAT === "true" ? "false" : "true",
                    })
                  }
                />
                Includes VAT
              </label>

              <textarea
                placeholder="Description"
                value={newMembership.description}
                onChange={(e) =>
                  setNewMembership({ ...newMembership, description: e.target.value })
                }
                className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white"
              />

              <textarea
                placeholder="Additional Services"
                value={newMembership.additionalServices}
                onChange={(e) =>
                  setNewMembership({
                    ...newMembership,
                    additionalServices: e.target.value,
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
                  onClick={handleAddMembership}
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {editingMembership && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded w-[400px]">
              <h3 className="text-xl mb-4 font-semibold">Edit Membership</h3>

              <input
                type="text"
                placeholder="Title"
                value={editingMembership.title}
                onChange={(e) => updateEditingField("title", e.target.value)}
                className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white"
              />

              <input
                type="number"
                placeholder="Price"
                value={editingMembership?.price ?? ""}
                onChange={e =>
                  updateEditingField('price', e.target.value === '' ? null : Number(e.target.value))
                }
                className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white"
              />

              <select
                value={editingMembership.billingType}
                onChange={(e) =>
                  updateEditingField("billingType", e.target.value)
                }
                className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white"
              >
                <option value="Daily">Daily</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>

              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={editingMembership.includesVAT === "true"}
                  onChange={() =>
                    updateEditingField(
                      "includesVAT",
                      editingMembership.includesVAT === "true" ? "false" : "true"
                    )
                  }
                />
                Includes VAT
              </label>

              <textarea
                placeholder="Description"
                value={editingMembership.description}
                onChange={(e) => updateEditingField("description", e.target.value)}
                className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white"
              />

              <textarea
                placeholder="Additional Services"
                value={editingMembership.additionalServices}
                onChange={(e) =>
                  updateEditingField("additionalServices", e.target.value)
                }
                className="w-full mb-4 px-3 py-2 rounded bg-gray-700 text-white"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditingMembership(null)}
                  className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditMembership}
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Memberships;
