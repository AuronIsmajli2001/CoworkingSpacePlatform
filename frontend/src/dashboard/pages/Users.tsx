import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

const users = [
  {
    id: 1,
    name: "Neil Sims",
    email: "neil.sims@flowbite.com",
    role: "User",
    status: "Active",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Roberta Casas",
    email: "roberta.casas@flowbite.com",
    role: "User",
    status: "Inactive",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
];

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const toggleSelect = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-1 pb-0 pt-0">
        <div className="p-6 bg-gray-900 text-white min-h-screen">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">All users</h2>
            <div className="flex gap-2">
              {selectedUsers.length > 0 && (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
                >
                  Delete selected ({selectedUsers.length})
                </button>
              )}
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm">
                + Add user
              </button>
              <button className="border border-gray-500 px-4 py-2 rounded text-sm">
                Export
              </button>
            </div>
          </div>

          <input
            type="text"
            placeholder="Search for users"
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
                      checked={selectedUsers.length === users.length}
                      className="accent-blue-600"
                    />
                  </th>
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((user) =>
                    user.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((user) => (
                    <tr
                      className="border-b border-gray-700 hover:bg-gray-800"
                      key={user.email}
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleSelect(user.id)}
                          className="accent-blue-600"
                        />
                      </td>
                      <td className="p-3">{user.id}</td>
                      <td className="p-3 flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="font-semibold">{user.name}</div>
                      </td>
                      <td className="p-3 text-gray-300">{user.email}</td>
                      <td className="p-3 font-semibold">{user.role}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded ${
                            user.status === "Active"
                              ? "bg-green-600/20 text-green-400"
                              : "bg-red-600/20 text-red-400"
                          }`}
                        >
                          <span className="h-2 w-2 rounded-full bg-current"></span>
                          {user.status}
                        </span>
                      </td>
                      <td className="p-3 flex gap-2">
                        <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm rounded flex items-center gap-1">
                          <Pencil size={14} /> Edit
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 px-3 py-1 text-sm rounded flex items-center gap-1">
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Modal */}
          {showConfirmModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded shadow-lg w-96">
                <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
                <p className="text-sm text-gray-300 mb-6">
                  Are you sure you want to delete{" "}
                  <span className="font-bold text-white">
                    {selectedUsers.length}
                  </span>{" "}
                  selected user{selectedUsers.length > 1 ? "s" : ""}?
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
                      setSelectedUsers([]);
                      setShowConfirmModal(false);
                      // TODO: optional – remove users from array if you're using state
                    }}
                    className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 rounded"
                  >
                    Delete
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

export default Users;
