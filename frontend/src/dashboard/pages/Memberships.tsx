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
  const [editingMembership, setEditingMembership] = useState<Membership | null>(null);

  const [newMembership, setNewMembership] = useState<Omit<Membership, "id">>({
    title: "",
    created_At: new Date().toISOString(),
    price: 0,
    isActive: true,
    includesVAT: true,
    billingType: "monthly",
    description: "",
    additionalServices: "",
  });

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
    try {
      await axios.delete(`http://localhost:5234/Membership/${id}`);
      setMemberships((prev) => prev.filter((m) => m.id !== id));
      setSelectedMemberships((prev) => prev.filter((sid) => sid !== id));
    } catch (error) {
      console.error("Delete failed", error);
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
    } catch (error) {
      console.error("Bulk delete failed", error);
    }
  };

const handleAddMembership = async () => {
  try {
    await axios.post("http://localhost:5234/Membership", {
      title: newMembership.title,
      price: newMembership.price,
      includesVAT: newMembership.includesVAT,
      description: newMembership.description,
      additionalServices: newMembership.additionalServices,
      billingType: newMembership.billingType,
    });

    // Get the updated list with IDs
    const res = await axios.get("http://localhost:5234/Membership");
    setMemberships(res.data);

    setShowAddModal(false);
    setNewMembership({
      title: "",
      created_At: new Date().toISOString(),
      price: 0,
      isActive: true,
      includesVAT: true,
      billingType: "monthly",
      description: "",
      additionalServices: "",
    });
  } catch (error) {
    console.error("Add membership failed", error);
  }
};




  // PUT update membership
  const handleEditMembership = async () => {
    if (!editingMembership) return;
    try {
      const res = await axios.put(
        `http://localhost:5234/Membership/${editingMembership.id}`,
        {
          title: editingMembership.title,
          price: editingMembership.price,
          includesVAT: editingMembership.includesVAT,
          description: editingMembership.description,
          additionalServices: editingMembership.additionalServices,
          created_At: editingMembership.created_At,
          isActive: editingMembership.isActive,
          billingType: newMembership.billingType.toLowerCase(),  

        }
      );
      setMemberships((prev) =>
        prev.map((m) => (m.id === editingMembership.id ? res.data : m))
      );
      setEditingMembership(null);
    } catch (error) {
      console.error("Edit membership failed", error);
    }
  };

  const filteredMemberships = memberships.filter((m) =>
  (m.title ?? "").toLowerCase().includes(searchTerm.toLowerCase())
);



  // Controlled inputs for edit modal
  const updateEditingField = (field: keyof Membership, value: any) => {
    if (!editingMembership) return;
    setEditingMembership({ ...editingMembership, [field]: value });
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto bg-gray-900 text-white">
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
              {filteredMemberships.map((m) => (
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
                      onClick={() => setEditingMembership(m)}
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
                value={newMembership.price}
                onChange={(e) =>
                  setNewMembership({
                    ...newMembership,
                    price: Number(e.target.value),
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
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>

              </select>

              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={newMembership.includesVAT}
                  onChange={() =>
                    setNewMembership({
                      ...newMembership,
                      includesVAT: !newMembership.includesVAT,
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
                value={editingMembership.price}
                onChange={(e) =>
                  updateEditingField("price", Number(e.target.value))
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
                  checked={editingMembership.includesVAT}
                  onChange={() =>
                    updateEditingField("includesVAT", !editingMembership.includesVAT)
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
