import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { User } from "lucide-react";

//@ts-ignore
const baseUrl = import.meta.env.VITE_API_BASE_URL;

interface ProfileData {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  password: string;
}

interface UpdateData {
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  email: string | null;
  password: string | null;
}

const EditProfile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    password: "",
  });
  const [originalData, setOriginalData] = useState<ProfileData | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log("Decoded token:", decoded);
        const userId = decoded.userId;
        if (!userId) {
          console.error("No userId found in token");
          return;
        }
        setUserId(userId);
        fetchUserData(userId);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const fetchUserData = async (id: string) => {
    try {
      console.log("Fetching user data for ID:", id);
      const response = await axios.get(`${baseUrl}/User/${id}`);
      console.log("API Response:", response.data);

      if (response.data) {
        const userData = {
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          name: response.data.name || "",
          email: response.data.email || "",
          password: "",
        };
        setProfileData(userData);
        setOriginalData(userData);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to fetch user data");
    }
  };

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
    setSuccess("");

    try {
      // Only include fields that have changed from original data
      const updateData: UpdateData = {
        firstName: profileData.firstName !== originalData?.firstName ? profileData.firstName : null,
        lastName: profileData.lastName !== originalData?.lastName ? profileData.lastName : null,
        name: profileData.name !== originalData?.name ? profileData.name : null,
        email: profileData.email !== originalData?.email ? profileData.email : null,
        password: profileData.password ? profileData.password : null
      };

      // Password validation only if password is provided
      if (updateData.password) {
        const hasUpperCase = /[A-Z]/.test(updateData.password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(updateData.password);
        const isLongEnough = updateData.password.length >= 8;

        if (!hasUpperCase || !hasSpecialChar || !isLongEnough) {
          setError("Password must be at least 8 characters long, contain one uppercase letter, and one special character");
          return;
        }
      }

      console.log("Sending update data:", JSON.stringify(updateData, null, 2));
      console.log("User ID:", userId);
      console.log("Request URL:", `${baseUrl}/User/${userId}`);

      const response = await axios.put(
        `${baseUrl}/User/${userId}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.status === 200) {
        setSuccess("Profile updated successfully!");
        // Update original data with new values
        setOriginalData({
          firstName: updateData.firstName || "",
          lastName: updateData.lastName || "",
          name: updateData.name || "",
          email: updateData.email || "",
          password: ""
        });
        // Clear password field after successful update
        setProfileData(prev => ({ ...prev, password: "" }));
      }
    } catch (err: any) {
      console.error("Error updating profile:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to update profile. Please try again.");
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
          <div className="mb-8 text-lg font-semibold text-gray-700 text-center">
            Hello {profileData.name}
          </div>
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

        {success && (
          <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-lg">
            {success}
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={profileData.name}
              onChange={handleChange}
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
