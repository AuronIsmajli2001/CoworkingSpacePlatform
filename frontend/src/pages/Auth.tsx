import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import React from "react";
import { jwtDecode } from "jwt-decode";

//@ts-ignore
const baseUrl = import.meta.env.VITE_API_BASE_URL;
//@ts-ignore
const frontUrl = import.meta.env.VITE_FRONTEND_URL;

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const validate = () => {
    let valid = true;
    const newErrors = {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    };

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = "Must contain at least one uppercase letter";
      valid = false;
    } else if (!/(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = "Must contain at least one special character";
      valid = false;
    }

    if (!isLogin) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
        valid = false;
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
        valid = false;
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
        valid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = "Email is invalid";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  var accessToken;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setApiError("");

    try {
      if (isLogin) {
        // Login logic
        await axios
          .post(`${baseUrl}/api/Auth/login`, {
            username: formData.username,
            password: formData.password,
          })
          .then((e) => {
            localStorage.setItem("accessToken", e.data.accessToken);
            localStorage.setItem("refreshToken", e.data.refreshToken);
            accessToken = e.data.accessToken;
            const a: any = jwtDecode(accessToken);
            const role: string = a.role;
            const userId: string = a.userId;
            localStorage.setItem("user_role", role);

            if (role === "User") {
              // Redirect to home page for User role
              window.location.href = `${frontUrl}`;
            } else if (role === "Staff" || role === "SuperAdmin") {
              // Redirect to dashboard for Staff or SuperAdmin roles
              window.location.href = `${frontUrl}/dashboard`;
            } else {
              // Optional: Handle case for unknown roles or errors
              console.error("Unknown role:", role);
            }
          });
      } else {
        // Signup logic
        console.log(formData.username);
        await axios
          .post(`${baseUrl}/api/Auth/signup`, {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
          })
          .then((e) => console.log(e));

        alert("Registration successful! Please login.");
        window.location.href = `${frontUrl}/Auth`;
        setIsLogin(true);
        setFormData({
          firstName: "",
          lastName: "",
          username: "",
          email: "",
          password: "",
        });
      }
    } catch (error: any) {
      setApiError(
        error.response?.data?.message ||
          error.message ||
          "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setApiError("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Form Container - Left Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {isLogin ? "Login" : "Create Account"}
          </h2>

          {apiError && (
            <div className="mb-4 p-3 bg-red-500/20 text-red-700 rounded-lg text-sm">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`bg-white border ${
                          errors.firstName
                            ? "border-red-500"
                            : "border-gray-300"
                        } text-gray-900 rounded-lg block w-full pl-10 p-2.5 text-sm`}
                        placeholder="John"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`bg-white border ${
                          errors.lastName ? "border-red-500" : "border-gray-300"
                        } text-gray-900 rounded-lg block w-full pl-10 p-2.5 text-sm`}
                        placeholder="Doe"
                      />
                    </div>
                    {errors.lastName && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`bg-white border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } text-gray-900 rounded-lg block w-full pl-10 p-2.5 text-sm`}
                      placeholder="your@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className={`bg-white border ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  } text-gray-900 rounded-lg block w-full pl-10 p-2.5 text-sm`}
                  placeholder="johndoe"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-xs text-red-500">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`bg-white border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } text-gray-900 rounded-lg block w-full pl-10 p-2.5 text-sm`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
              {!isLogin && (
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 6 characters with 1 uppercase letter
                  and 1 special character
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 transition-colors ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : isLogin ? (
                "Login"
              ) : (
                "Sign Up"
              )}
            </button>

            <div className="text-sm text-center text-gray-500 pt-2">
              {isLogin ? "Need an account?" : "Already registered?"}{" "}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="text-blue-600 hover:text-blue-800 font-medium underline focus:outline-none"
              >
                {isLogin ? "Sign up" : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Image Container - Right Side */}
      <div className="hidden md:flex md:w-1/2 bg-blue-600 items-center justify-center">
        {/* You can add your image here */}
        <img
          src="../../public/images/coworkingAuth.webp"
          alt="Welcome illustration"
          className="w-full h-full object-fit"
        />
      </div>
    </div>
  );
}
