import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

const initialUsers = [
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
  const [editUserEditable, setEditUserEditable] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [users, setUsers] = useState(initialUsers);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    avatar: string;
  };
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

  const handleDeleteConfirmed = () => {
    if (userToDelete !== null) {
      setUsers((prev) => prev.filter((user) => user.id !== userToDelete));
      setUserToDelete(null);
    } else {
      setUsers((prev) =>
        prev.filter((user) => !selectedUsers.includes(user.id))
      );
      setSelectedUsers([]);
    }
    setShowConfirmModal(false);
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    surname: "",
    email: "",
    role: "User",
    status: "Active",
    avatar: "",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    surname?: string;
    email?: string;
  }>({});

  const validateFields = () => {
    const newErrors: { name?: string; surname?: string; email?: string } = {};

    if (!newUser.name.trim()) newErrors.name = "First name is required";
    if (!newUser.surname.trim()) newErrors.surname = "Surname is required";
    if (!newUser.email.trim() || !isValidEmail(newUser.email))
      newErrors.email = "Valid email is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "users.xlsx");
  };

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const inactiveUsers = users.filter((u) => u.status === "Inactive").length;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-1 pb-0 pt-0">
        <div className="p-6 bg-gray-900 text-white min-h-screen">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg shadow text-white">
              <p className="text-sm text-gray-400">Total Users</p>
              <h2 className="text-2xl font-bold">{totalUsers}</h2>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow text-white">
              <p className="text-sm text-gray-400">Active Users</p>
              <h2 className="text-2xl font-bold text-green-400">
                {activeUsers}
              </h2>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow text-white">
              <p className="text-sm text-gray-400">Inactive Users</p>
              <h2 className="text-2xl font-bold text-red-400">
                {inactiveUsers}
              </h2>
            </div>
          </div>

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
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
              >
                + Add user
              </button>

              <button
                onClick={exportToExcel}
                className="border border-gray-500 px-4 py-2 rounded text-sm"
              >
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
                        <button
                          onClick={() => {
                            setEditUser(user);
                            setEditUserEditable(user);
                            setShowEditModal(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm rounded flex items-center gap-1"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          onClick={() => {
                            setUserToDelete(user.id);
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
          </div>

          {/* Delete Confirmation Modal */}
          {showConfirmModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              {" "}
              <div className="bg-[#1f2937] p-6 rounded-lg shadow-xl w-[400px]">
                <h2 className="text-xl font-semibold text-white mb-2">
                  Confirm Deletion
                </h2>
                <p className="text-sm text-gray-300 mb-6">
                  Are you sure you want to delete{" "}
                  <strong>
                    {userToDelete !== null ? 1 : selectedUsers.length}
                  </strong>{" "}
                  user
                  {userToDelete === null && selectedUsers.length > 1 ? "s" : ""}
                  ?
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowConfirmModal(false);
                      setUserToDelete(null);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirmed}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {showEditModal && editUser && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              {" "}
              <div className="bg-gray-800 p-6 rounded shadow-lg w-[500px] max-w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Edit user</h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm block mb-1">First Name</label>
                    <input
                      type="text"
                      value={editUserEditable?.name.split(" ")[0] || ""}
                      onChange={(e) => {
                        const last = editUserEditable?.name.split(" ")[1] || "";
                        setEditUserEditable((prev) =>
                          prev
                            ? { ...prev, name: `${e.target.value} ${last}` }
                            : null
                        );
                      }}
                      className="bg-gray-700 border border-gray-600 text-sm px-3 py-2 rounded w-full text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm block mb-1">Last Name</label>
                    <input
                      type="text"
                      value={editUserEditable?.name.split(" ")[1] || ""}
                      onChange={(e) => {
                        const first =
                          editUserEditable?.name.split(" ")[0] || "";
                        setEditUserEditable((prev) =>
                          prev
                            ? { ...prev, name: `${first} ${e.target.value}` }
                            : null
                        );
                      }}
                      className="bg-gray-700 border border-gray-600 text-sm px-3 py-2 rounded w-full text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm block mb-1">Email</label>
                    <input
                      type="email"
                      value={editUserEditable?.email || ""}
                      onChange={(e) =>
                        setEditUserEditable((prev) =>
                          prev ? { ...prev, email: e.target.value } : null
                        )
                      }
                      className="bg-gray-700 border border-gray-600 text-sm px-3 py-2 rounded w-full text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm block mb-1">Role</label>
                    <select
                      value={editUserEditable?.role || "User"}
                      onChange={(e) =>
                        setEditUserEditable((prev) =>
                          prev ? { ...prev, role: e.target.value } : null
                        )
                      }
                      className="bg-gray-700 border border-gray-600 text-sm px-3 py-2 rounded w-full text-white"
                    >
                      <option>User</option>
                      <option>Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm block mb-1">Status</label>
                    <select
                      value={editUserEditable?.status || "Active"}
                      onChange={(e) =>
                        setEditUserEditable((prev) =>
                          prev ? { ...prev, status: e.target.value } : null
                        )
                      }
                      className="bg-gray-700 border border-gray-600 text-sm px-3 py-2 rounded w-full text-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm block mb-1">
                      Change Profile Picture
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditUserEditable((prev) =>
                              prev
                                ? { ...prev, avatar: reader.result as string }
                                : null
                            );
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="text-white text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      if (
                        !editUserEditable ||
                        !isValidEmail(editUserEditable.email)
                      ) {
                        alert("Please provide a valid email.");
                        return;
                      }

                      setUsers((prev) =>
                        prev.map((u) =>
                          u.id === editUserEditable.id ? editUserEditable : u
                        )
                      );
                      setShowEditModal(false);
                      setEditUser(null);
                      setEditUserEditable(null);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm rounded"
                  >
                    Save all
                  </button>
                </div>
              </div>
            </div>
          )}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              {" "}
              <div className="bg-gray-800 p-6 rounded shadow-lg w-[500px] max-w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Add user</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm block mb-1">First Name</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                      className="bg-gray-700 border border-gray-600 text-sm px-3 py-2 rounded w-full text-white"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm block mb-1">Last Name</label>
                    <input
                      type="text"
                      value={newUser.surname}
                      onChange={(e) =>
                        setNewUser({ ...newUser, surname: e.target.value })
                      }
                      className="bg-gray-700 border border-gray-600 text-sm px-3 py-2 rounded w-full text-white"
                    />
                    {errors.surname && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.surname}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm block mb-1">Email</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      className="bg-gray-700 border border-gray-600 text-sm px-3 py-2 rounded w-full text-white"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm block mb-1">Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
                      }
                      className="bg-gray-700 border border-gray-600 text-sm px-3 py-2 rounded w-full text-white"
                    >
                      <option>User</option>
                      <option>Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm block mb-1">Status</label>
                    <select
                      value={newUser.status}
                      onChange={(e) =>
                        setNewUser({ ...newUser, status: e.target.value })
                      }
                      className="bg-gray-700 border border-gray-600 text-sm px-3 py-2 rounded w-full text-white"
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>

                  {/* 👉 Upload Image */}
                  <div className="col-span-2">
                    <label className="text-sm block mb-1">
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewUser((prev) => ({
                              ...prev,
                              avatar: reader.result as string,
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="text-white text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      if (!validateFields()) return;

                      const newId = users.length + 1;
                      setUsers([
                        ...users,
                        {
                          ...newUser,
                          id: newId,
                          avatar:
                            newUser.avatar ||
                            `https://randomuser.me/api/portraits/lego/${Math.floor(
                              Math.random() * 10
                            )}.jpg`,
                        },
                      ]);
                      setShowAddModal(false);
                      setNewUser({
                        name: "",
                        surname: "",
                        email: "",
                        role: "User",
                        status: "Active",
                        avatar: "",
                      });
                    }}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm rounded"
                  >
                    Add user
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
