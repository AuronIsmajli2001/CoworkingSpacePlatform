import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Sidebar from "../components/Sidebar";
import { Pencil, Trash2 } from "lucide-react";
import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editUserEditable, setEditUserEditable] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  //@ts-ignore
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const handleNextPage = () => {
    if (indexOfLastUser < users.length) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5234/User");

        const mappedUsers = response.data.map((user: any) => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          status: user.active ? "Active" : "Inactive",
          avatar: `https://randomuser.me/api/portraits/lego/${Math.floor(
            Math.random() * 10
          )}.jpg`,
        }));
        setUsers(mappedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

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

  const handleDeleteConfirmed = async () => {
    try {
      if (userToDelete !== null) {
        // Single user deletion
        const response = await axios.delete(`${baseUrl}/User/${userToDelete}`);
        if (response.status === 200) {
          setUsers((prev) => prev.filter((user) => user.id !== userToDelete));
          setUserToDelete(null);
        }
      } else {
        // Bulk deletion
        const deletePromises = selectedUsers.map(userId => 
          axios.delete(`${baseUrl}/User/${userId}`)
        );
        await Promise.all(deletePromises);
        setUsers((prev) =>
          prev.filter((user) => !selectedUsers.includes(user.id))
        );
        setSelectedUsers([]);
      }
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Error deleting user(s):", error);
      alert("Failed to delete user(s). Please try again.");
    }
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "User",
    status: "Active"
  });

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  }>({});

  const validateFields = () => {
    const newErrors: { firstName?: string; lastName?: string; email?: string; password?: string } = {};

    if (!newUser.firstName.trim()) newErrors.firstName = "First name is required";
    if (!newUser.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!newUser.email.trim() || !isValidEmail(newUser.email))
      newErrors.email = "Valid email is required";
    if (!newUser.password.trim()) newErrors.password = "Password is required";

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

  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [showRoleFilter, setShowRoleFilter] = useState(false);
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 pb-0 pt-0">
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
                  <th className="p-3 relative">
                    <div className="flex items-center gap-1">
                      Role
                      <button
                        onClick={() => setShowRoleFilter((prev) => !prev)}
                        className="text-gray-400 hover:text-white"
                        title="Filter by role"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M3 5a1 1 0 012 0v1h10V5a1 1 0 112 0v1a1 1 0 01-1 1H4a1 1 0 01-1-1V5zM5 9h10a1 1 0 010 2H5a1 1 0 010-2zm3 4h4a1 1 0 010 2H8a1 1 0 010-2z" />
                        </svg>
                      </button>
                    </div>

                    {showRoleFilter && (
                      <div className="absolute top-full left-0 mt-2 bg-gray-800 border border-gray-700 rounded shadow-md z-10 p-2">
                        <select
                          value={filterRole}
                          onChange={(e) => {
                            setFilterRole(e.target.value);
                            setShowRoleFilter(false);
                          }}
                          className="bg-gray-700 text-white p-1 text-xs rounded"
                        >
                          <option value="All">All</option>
                          <option value="User">User</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </div>
                    )}
                  </th>

                  <th className="p-3 relative">
                    <div className="flex items-center gap-1">
                      Status
                      <button
                        onClick={() => setShowStatusFilter((prev) => !prev)}
                        className="text-gray-400 hover:text-white"
                        title="Filter by status"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M3 5a1 1 0 012 0v1h10V5a1 1 0 112 0v1a1 1 0 01-1 1H4a1 1 0 01-1-1V5zM5 9h10a1 1 0 010 2H5a1 1 0 010-2zm3 4h4a1 1 0 010 2H8a1 1 0 010-2z" />
                        </svg>
                      </button>
                    </div>

                    {showStatusFilter && (
                      <div className="absolute top-full left-0 mt-2 bg-gray-800 border border-gray-700 rounded shadow-md z-10 p-2">
                        <select
                          value={filterStatus}
                          onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setShowStatusFilter(false);
                          }}
                          className="bg-gray-700 text-white p-1 text-xs rounded"
                        >
                          <option value="All">All</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    )}
                  </th>

                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers
                  .filter((user) =>
                    user.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .filter(
                    (user) => filterRole === "All" || user.role === filterRole
                  )
                  .filter(
                    (user) =>
                      filterStatus === "All" || user.status === filterStatus
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
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
              >
                ←
              </button>
              <span className="text-sm text-gray-300">
                Page {currentPage} of {Math.ceil(users.length / usersPerPage)}
              </span>
              <button
                onClick={handleNextPage}
                disabled={indexOfLastUser >= users.length}
                className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
              >
                →
              </button>
            </div>
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
          {showEditModal && editUserEditable && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded shadow-lg w-[400px] max-w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Edit User Role</h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm block mb-1 text-gray-300">Role</label>
                    <select
                      value={editUserEditable.role}
                      onChange={(e) =>
                        setEditUserEditable((prev) =>
                          prev ? { ...prev, role: e.target.value } : null
                        )
                      }
                      className="bg-gray-700 border border-gray-600 text-sm px-3 py-2 rounded w-full text-white"
                    >
                      <option value="SuperAdmin">SuperAdmin</option>
                      <option value="Staff">Staff</option>
                      <option value="User">User</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm block mb-1 text-gray-300">Status</label>
                    <select
                      value={editUserEditable.status}
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
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 rounded text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const response = await axios.put(
                          `${baseUrl}/User/${editUserEditable.id}/role`,
                          {
                            role: editUserEditable.role,
                            isActive: editUserEditable.status === "Active"
                          }
                        );

                        if (response.status === 200) {
                          setUsers((prev) =>
                            prev.map((u) =>
                              u.id === editUserEditable.id ? editUserEditable : u
                            )
                          );
                          setShowEditModal(false);
                          setEditUser(null);
                          setEditUserEditable(null);
                        }
                      } catch (error) {
                        console.error("Error updating user:", error);
                        alert("Failed to update user. Please try again.");
                      }
                    }}
                    className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded text-white"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded shadow-lg w-[500px] max-w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Add user</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm block mb-1 text-gray-300">First Name</label>
                    <input
                      type="text"
                      value={newUser.firstName}
                      onChange={(e) =>
                        setNewUser({ ...newUser, firstName: e.target.value })
                      }
                      className="bg-gray-700 border border-gray-600 text-sm px-3 py-2 rounded w-full text-white"
                    />
                    {errors.firstName && (
                      <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm block mb-1 text-gray-300">Last Name</label>
                    <input
                      type="text"
                      value={newUser.lastName}
                      onChange={(e) =>
                        setNewUser({ ...newUser, lastName: e.target.value })
                      }
                      className="bg-gray-700 border border-gray-600 text-sm px-3 py-2 rounded w-full text-white"
                    />
                    {errors.lastName && (
                      <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm block mb-1 text-gray-300">Email</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      className="bg-gray-700 border border-gray-600 text-sm px-3 py-2 rounded w-full text-white"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm block mb-1 text-gray-300">Password</label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                      className="bg-gray-700 border border-gray-600 text-sm px-3 py-2 rounded w-full text-white"
                    />
                    {errors.password && (
                      <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm block mb-1 text-gray-300">Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
                      }
                      className="bg-gray-700 border border-gray-600 text-sm px-3 py-2 rounded w-full text-white"
                    >
                      <option value="SuperAdmin">SuperAdmin</option>
                      <option value="Staff">Staff</option>
                      <option value="User">User</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 rounded text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!validateFields()) return;

                      try {
                        const userName = `${newUser.firstName.toLowerCase()}.${newUser.lastName.toLowerCase()}`;
                        const response = await axios.post(`${baseUrl}/User`, {
                          firstName: newUser.firstName,
                          lastName: newUser.lastName,
                          userName: userName,
                          email: newUser.email,
                          password: newUser.password,
                          role: newUser.role
                        });

                        if (response.status === 200 || response.status === 201) {
                          // Refresh the users list
                          const usersResponse = await axios.get(`${baseUrl}/User`);
                          const mappedUsers = usersResponse.data.map((user: any) => ({
                            id: user.id,
                            name: `${user.firstName} ${user.lastName}`,
                            email: user.email,
                            role: user.role,
                            status: user.active ? "Active" : "Inactive",
                            avatar: `https://randomuser.me/api/portraits/lego/${Math.floor(
                              Math.random() * 10
                            )}.jpg`,
                          }));
                          setUsers(mappedUsers);
                          
                          setShowAddModal(false);
                          setNewUser({
                            firstName: "",
                            lastName: "",
                            email: "",
                            password: "",
                            role: "User",
                            status: "Active"
                          });
                        }
                      } catch (error) {
                        console.error("Error adding user:", error);
                        alert("Failed to add user. Please try again.");
                      }
                    }}
                    className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded text-white"
                  >
                    Add User
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
