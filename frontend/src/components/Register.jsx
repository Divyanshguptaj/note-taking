import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import authService from "../services/auth.service";
import rightImage from "../assets/right.png";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleGetOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/sendOTP", {
        email: formData.email,
        username: formData.username,
      });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
    setLoading(false);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          ...formData,
          otp,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-6 bg-white overflow-y-auto">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-900">HD</span>
          </div>

          {step === 1 ? (
            <>
              {/* Sign up header */}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Sign up
              </h1>
              <p className="text-gray-600 mb-6">
                Sign up to enjoy the feature of HD
              </p>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Jonas Khanwald"
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jonas_kahnwald@gmail.com"
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-sm"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleGetOtp}
                  disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm"
                >
                  {loading ? "Sending OTP..." : "Get OTP"}
                </button>
              </div>

              {/* Sign in link */}
              <p className="text-center text-gray-600 mt-4 text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  Sign in
                </button>
              </p>
            </>
          ) : (
            <>
              {/* OTP verification */}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Verify OTP
              </h1>
              <p className="text-gray-600 mb-6 text-sm">
                Enter the OTP sent to {formData.email}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OTP Code
                  </label>
                  <input
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    required
                    maxLength="6"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-center text-xl tracking-widest"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleOtpSubmit}
                  disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm"
                >
                  {loading ? "Verifying..." : "Verify OTP & Sign Up"}
                </button>
              </div>

              {/* Back button */}
              <button
                onClick={() => setStep(1)}
                className="w-full mt-3 text-gray-600 hover:text-gray-800 font-medium py-2 text-sm"
              >
                ← Back to Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      {/* Right side - Image (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-0">
        <div className="relative ">
          <img
            src={rightImage}
            alt="Abstract blue waves"
            className="object-contain rounded-2xl shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;