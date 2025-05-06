import { useState } from 'react';
import { Lock, Mail, User, Eye, EyeOff } from 'lucide-react';
import React from 'react';
import Header from '../components/Header';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });

  const toggleAuthMode = () => {
    // Clear form and errors when switching modes
    setFormData({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
    });
    setErrors({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
    });
    setIsLogin(!isLogin);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    let valid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
    };

    // Username validation (for both login and signup)
    if (!formData.username) {
      newErrors.username = 'Username is required';
      valid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    } else if (!/(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one special character';
      valid = false;
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
      valid = false;
    }

    // Signup specific validations
    if (!isLogin) {
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
        valid = false;
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
        valid = false;
      }
      if (!formData.email) {
        newErrors.email = 'Email is required';
        valid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form submitted:', formData);
      // API call would go here
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="flex w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg overflow-hidden" style={{ maxHeight: '600px' }}>
          {/* Left side - Form */}
          <div className="w-full md:w-1/2 p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {isLogin ? 'Login' : 'Create Account'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`bg-gray-700 border ${errors.firstName ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg block w-full pl-10 p-2 text-sm`}
                        placeholder="John"
                      />
                    </div>
                    {errors.firstName && <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`bg-gray-700 border ${errors.lastName ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg block w-full pl-10 p-2 text-sm`}
                        placeholder="Doe"
                      />
                    </div>
                    {errors.lastName && <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className={`bg-gray-700 border ${errors.username ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg block w-full pl-10 p-2 text-sm`}
                    placeholder="johndoe"
                  />
                </div>
                {errors.username && <p className="mt-1 text-xs text-red-400">{errors.username}</p>}
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg block w-full pl-10 p-2 text-sm`}
                      placeholder="your@email.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className={`bg-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg block w-full pl-10 p-2 text-sm`}
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
                {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
                {!isLogin && (
                  <p className="mt-1 text-xs text-gray-400">
                    Password must be at least 6 characters with 1 uppercase letter and 1 special character
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 mt-2 transition-colors"
              >
                {isLogin ? 'Login' : 'Sign Up'}
              </button>

              <div className="text-sm text-center text-gray-400 pt-2">
                {isLogin ? "Need an account?" : "Already registered?"}{' '}
                <button
                  type="button"
                  onClick={toggleAuthMode}
                  className="text-blue-400 hover:text-blue-300 font-medium underline focus:outline-none"
                >
                  {isLogin ? 'Sign up' : 'Login'}
                </button>
              </div>
            </form>
          </div>
           
          <div className="hidden md:block md:w-1/2 bg-gray-700">
            <img 
              src="/Images/login.png" 
              alt="Login visual" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
