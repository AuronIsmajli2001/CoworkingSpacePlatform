import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import React from "react";
import { useEffect } from "react";
import axios from "axios";

type Space = {
  id: string;
  name: string;
  type: string;
  description: string;
  capacity: number | string;
  price: number | string;
  location: string;
  imageUrl: string;
};

const Spaces = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpaces, setSelectedSpaces] = useState<string[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editingSpace, setEditingSpace] = useState<Space | null>(null);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newSpace, setNewSpace] = useState({
    name: "",
    type: "",
    description: "",
    capacity: "",
    price: "",
    location: "",
  });
  const [newSpaceImage, setNewSpaceImage] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const spacesPerPage = 6;

  const indexOfLastSpace = currentPage * spacesPerPage;
  const indexOfFirstSpace = indexOfLastSpace - spacesPerPage;
  const currentSpaces = spaces.slice(indexOfFirstSpace, indexOfLastSpace);

  const [editingImage, setEditingImage] = useState<File | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:5234/Space") // or use `baseUrl`
      .then((res) => {
        if (Array.isArray(res.data)) {
          const mappedSpaces = res.data.map((space: any) => ({
            id: space.id,
            name: space.name,
            type: space.type,
            description: space.description,
            capacity: space.capacity,
            price: space.price,
            location: space.location,
            imageUrl: space.image_URL,
          }));
          setSpaces(mappedSpaces);
        } else {
          console.error("Expected array but got:", res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching spaces:", err);
      });
  }, []);

  // CRUD Operations
  const toggleSelect = (id: string) => {
    setSelectedSpaces((prev) =>
      prev.includes(id)
        ? prev.filter((spaceId) => spaceId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedSpaces.length === spaces.length) {
      setSelectedSpaces([]);
    } else {
      setSelectedSpaces(spaces.map((space) => space.id));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5234/Space/${id}`);
      setSpaces((prev) => prev.filter((space) => space.id !== id));
    } catch (err) {
      alert("Failed to delete space. Please try again.");
      console.error(err);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedSpaces.map(id => axios.delete(`http://localhost:5234/Space/${id}`)));
      setSpaces((prev) => prev.filter((space) => !selectedSpaces.includes(space.id)));
      setSelectedSpaces([]);
      setShowConfirmModal(false);
    } catch (err) {
      alert("Failed to delete selected spaces. Please try again.");
      console.error(err);
    }
  };

  const handleSaveEdit = async () => {
    if (editingSpace) {
      try {
        const formData = new FormData();
        formData.append("name", editingSpace.name ? editingSpace.name : "null");
        formData.append("type", editingSpace.type ? editingSpace.type : "null");
        formData.append("description", editingSpace.description ? editingSpace.description : "null");
        if (editingSpace.capacity !== undefined && editingSpace.capacity !== null && editingSpace.capacity !== "") {
          formData.append("capacity", editingSpace.capacity.toString());
        }
        if (editingSpace.price !== undefined && editingSpace.price !== null && editingSpace.price !== "") {
          formData.append("price", editingSpace.price.toString());
        }
        formData.append("location", editingSpace.location ? editingSpace.location : "null");
        if (editingImage) {
          formData.append("image", editingImage);
        }
        await axios.put(`http://localhost:5234/Space/${editingSpace.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // Fetch all spaces after update
        const res = await axios.get("http://localhost:5234/Space");
        if (Array.isArray(res.data)) {
          const mappedSpaces = res.data.map((space: any) => ({
            id: space.id,
            name: space.name,
            type: space.type,
            description: space.description,
            capacity: space.capacity,
            price: space.price,
            location: space.location,
            imageUrl: space.image_URL,
          }));
          setSpaces(mappedSpaces);
        }
        setEditingSpace(null);
        setEditingImage(null);
      } catch (err) {
        alert("Failed to update space. Please try again.");
        console.error(err);
      }
    }
  };

  const handleAddSpace = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newSpace.name);
      formData.append("type", newSpace.type);
      formData.append("description", newSpace.description);
      formData.append("capacity", Number(newSpace.capacity).toString());
      formData.append("price", Number(newSpace.price).toString());
      formData.append("location", newSpace.location);
      if (newSpaceImage) {
        formData.append("image", newSpaceImage);
      }

      await axios.post("http://localhost:5234/Space", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Optionally, refresh the list of spaces here
      setShowAddModal(false);
      setNewSpace({
        name: "",
        type: "",
        description: "",
        capacity: "",
        price: "",
        location: "",
      });
      setNewSpaceImage(null);
    } catch (err) {
      alert("Failed to add space. Please try again.");
      console.error(err);
    }
  };

  // Stats Calculations
  const totalSpaces = spaces.length;
  const totalCapacity = spaces.reduce((sum, space) => sum + Number(space.capacity), 0);
  const averagePrice =
    spaces.length > 0
      ? (
          spaces.reduce((sum, space) => sum + Number(space.price), 0) / spaces.length
        ).toFixed(2)
      : 0;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-1 pb-0 pt-0">
        <div className="p-6 bg-gray-900 text-white min-h-screen">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-400">Total Spaces</p>
              <h2 className="text-2xl font-bold">{totalSpaces}</h2>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-400">Total Capacity</p>
              <h2 className="text-2xl font-bold text-green-400">
                {totalCapacity}
              </h2>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-400">Avg. Price</p>
              <h2 className="text-2xl font-bold text-blue-400">
                ${averagePrice}
              </h2>
            </div>
          </div>

          {/* Header with Actions */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Manage Spaces</h2>
            <div className="flex gap-2">
              {selectedSpaces.length > 0 && (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
                >
                  Delete selected ({selectedSpaces.length})
                </button>
              )}
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
              >
                + Add Space
              </button>
            </div>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search spaces..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 rounded px-4 py-2 text-sm w-64 mb-4"
          />

          {/* Main Table */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead className="bg-gray-800 text-left uppercase text-gray-400">
                <tr>
                  <th className="p-3">
                    <input
                      type="checkbox"
                      onChange={toggleSelectAll}
                      checked={
                        selectedSpaces.length === spaces.length &&
                        spaces.length > 0
                      }
                      className="accent-blue-600"
                    />
                  </th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Capacity</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentSpaces
                  .filter(
                    (space) =>
                      space.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      space.location
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .map((space) => (
                    <tr
                      key={space.id}
                      className="border-b border-gray-700 hover:bg-gray-800"
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedSpaces.includes(space.id)}
                          onChange={() => toggleSelect(space.id)}
                          className="accent-blue-600"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={space.imageUrl}
                            alt={space.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-semibold">{space.name}</div>
                            <div className="text-gray-300 text-xs line-clamp-1">
                              {space.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-gray-700 rounded-full text-xs">
                          {space.type}
                        </span>
                      </td>
                      <td className="p-3">{space.capacity}</td>
                      <td className="p-3">${Number(space.price).toFixed(2)}</td>
                      <td className="p-3 text-gray-300 text-sm">
                        {space.location}
                      </td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => setEditingSpace(space)}
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm rounded flex items-center gap-1"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSpaces([space.id]);
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
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                ←
              </button>

              <span className="text-sm text-gray-300">
                Page {currentPage} of {Math.ceil(spaces.length / spacesPerPage)}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev < Math.ceil(spaces.length / spacesPerPage)
                      ? prev + 1
                      : prev
                  )
                }
                disabled={
                  currentPage === Math.ceil(spaces.length / spacesPerPage)
                }
                className={`px-4 py-1 rounded ${
                  currentPage === Math.ceil(spaces.length / spacesPerPage)
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                →
              </button>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {showConfirmModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded shadow-lg w-96">
                <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
                <p className="text-sm text-gray-300 mb-6">
                  Are you sure you want to delete {selectedSpaces.length}{" "}
                  selected space(s)?
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {editingSpace && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded shadow-lg w-1/2 max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Edit Space</h3>
                  <button
                    onClick={() => setEditingSpace(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editingSpace.name}
                      onChange={(e) =>
                        setEditingSpace({
                          ...editingSpace,
                          name: e.target.value,
                        })
                      }
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Type
                    </label>
                    <select
                      value={editingSpace.type}
                      onChange={(e) =>
                        setEditingSpace({
                          ...editingSpace,
                          type: e.target.value,
                        })
                      }
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                    >
                      <option>Conference</option>
                      <option>Workspace</option>
                      <option>Meeting Room</option>
                      <option>Event Space</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Capacity*
                    </label>
                    <input
                      type="text"
                      value={editingSpace.capacity}
                      onChange={(e) =>
                        setEditingSpace({ ...editingSpace, capacity: e.target.value })
                      }
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Price ($)*
                    </label>
                    <input
                      type="text"
                      value={editingSpace.price}
                      onChange={(e) =>
                        setEditingSpace({ ...editingSpace, price: e.target.value })
                      }
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editingSpace.description}
                      onChange={(e) =>
                        setEditingSpace({
                          ...editingSpace,
                          description: e.target.value,
                        })
                      }
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full h-20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editingSpace.location}
                      onChange={(e) =>
                        setEditingSpace({
                          ...editingSpace,
                          location: e.target.value,
                        })
                      }
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => setEditingImage(e.target.files?.[0] || null)}
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingSpace(null)}
                    className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Space Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded shadow-lg w-1/2 max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Add New Space</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Name*
                    </label>
                    <input
                      type="text"
                      value={newSpace.name}
                      onChange={(e) =>
                        setNewSpace({ ...newSpace, name: e.target.value })
                      }
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Type*
                    </label>
                    <select
                      value={newSpace.type}
                      onChange={(e) =>
                        setNewSpace({ ...newSpace, type: e.target.value })
                      }
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                      required
                    >
                      <option value="">Select type</option>
                      <option>Conference</option>
                      <option>Workspace</option>
                      <option>Meeting Room</option>
                      <option>Event Space</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Capacity*
                    </label>
                    <input
                      type="number"
                      value={newSpace.capacity}
                      onChange={(e) =>
                        setNewSpace({ ...newSpace, capacity: e.target.value })
                      }
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Price ($)*
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newSpace.price}
                      onChange={(e) =>
                        setNewSpace({ ...newSpace, price: e.target.value })
                      }
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newSpace.description}
                      onChange={(e) =>
                        setNewSpace({
                          ...newSpace,
                          description: e.target.value,
                        })
                      }
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full h-20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Location*
                    </label>
                    <input
                      type="text"
                      value={newSpace.location}
                      onChange={(e) =>
                        setNewSpace({ ...newSpace, location: e.target.value })
                      }
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Image*</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => setNewSpaceImage(e.target.files?.[0] || null)}
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddSpace}
                    className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded"
                  >
                    Add Space
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

export default Spaces;
