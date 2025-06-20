import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api/axiosConfig";
import { User } from "lucide-react";
import Swal from "sweetalert2";

//@ts-ignore
const baseUrl = import.meta.env.VITE_API_BASE_URL;

interface ProfileData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

interface UpdateData {
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  email: string | null;
  password: string | null;
}

const EditProfile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [sidebarProfile, setSidebarProfile] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const userId = decoded.userId;
        if (!userId) return;
        setUserId(userId);
        // Fetch user profile from backend for sidebar only
        api
          .get(`${baseUrl}/User/${userId}`)
          .then((res) => {
            setSidebarProfile({
              firstName: res.data.firstName || "",
              lastName: res.data.lastName || "",
              username: res.data.userName || "",
              email: res.data.email || "",
              password: "",
            });
          })
          .catch((err) => {
            console.error("Failed to fetch user profile:", err);
            if (err.response) {
              setError(err.response.data?.message || "Failed to fetch profile");
            } else if (err.request) {
              setError("Network error. Please check your connection");
            } else {
              setError("An unexpected error occurred");
            }
          });
      } catch (error) {
        console.error("Error decoding token:", error);
        setError("Invalid authentication token");
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const updateData: UpdateData = {
      firstName: profileData.firstName.trim() || null,
      lastName: profileData.lastName.trim() || null,
      username: profileData.username.trim() || null,
      email: profileData.email.trim() || null,
      password: profileData.password.trim() || null,
    };

    try {
      const response = await api.put(`${baseUrl}/User/${userId}`, updateData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setProfileData((prev) => ({ ...prev, password: "" }));

        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your profile has been successfully updated!",
          confirmButtonText: "Okay",
          confirmButtonColor: "#2563EB",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/");
          }
        });
      }
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 400) {
          setError("Invalid input data. Please check your information.");
        } else if (err.response.status === 401) {
          setError("Unauthorized. Please log in again.");
          navigate("/auth");
        } else if (err.response.status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(err.response.data?.message || "Failed to update profile");
        }
      } else if (err.request) {
        setError("Network error. Please check your connection");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="h-screen w-screen flex bg-gray-50">
      {/* Left navbar/sidebar */}
      <div className="w-72 bg-gray-100 border-r flex flex-col items-center py-12 h-full">
        <div className="flex flex-col items-center w-full">
          <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center mb-8 mx-auto">
            <User size={64} className="text-blue-700" />
          </div>
          {
            <div className="mb-4 text-lg font-semibold text-gray-700 text-center">
              Hello {sidebarProfile.username}
            </div>
            /* 
          <div className="mb-2 text-sm text-gray-600 text-center">
            <div className="mb-2">
              <span className="font-bold">First Name:</span>{" "}
              {sidebarProfile.firstName}
            </div>
            <div className="mb-2">
              <span className="font-bold">Last Name:</span>{" "}
              {sidebarProfile.lastName}
            </div>
            <div className="mb-2">
              <span className="font-bold">Email:</span> {sidebarProfile.email}
            </div>
            <div className="mb-2">
              <span className="font-bold">Username:</span>{" "}
              {sidebarProfile.username}
            </div>
          </div> */
          }
          <button
            onClick={() => navigate("/")}
            className="w-11/12 flex items-center justify-center gap-2 px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
      {/* Right column */}
      <div className="flex-1 flex flex-col justify-center px-16 py-8 h-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Account Settings
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              placeholder={`Current: ${sidebarProfile.email}`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={profileData.firstName}
              onChange={handleChange}
              placeholder={`Current: ${sidebarProfile.firstName}`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={profileData.lastName}
              onChange={handleChange}
              placeholder={`Current: ${sidebarProfile.lastName}`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={profileData.username}
              onChange={handleChange}
              placeholder={`Current: ${sidebarProfile.username}`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password (leave blank to keep current)
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={profileData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-4 pt-2">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
