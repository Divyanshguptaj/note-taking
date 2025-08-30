import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/auth.service";
import rightImage from "../assets/right.png";
import { Trash2 } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const [notes, setNotes] = useState(["Note 1", "Note 2"]);

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  const handleAddNote = () => {
    const newNote = `Note ${notes.length + 1}`;
    setNotes([...notes, newNote]);
  };

  const handleDeleteNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Left Side - Dashboard Content */}
      <div className="w-full lg:w-1/2 flex flex-col p-4 lg:p-16 bg-white overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white animate-spin"
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
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900">Dashboard</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-blue-500 hover:text-blue-600 font-medium text-sm"
          >
            Sign Out
          </button>
        </div>

        {/* User Welcome Card */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            Welcome, {user?.username || user?.name || "User"} !
          </h2>
          <p className="text-gray-600 text-sm">Email: {user?.email}</p>
        </div>

        {/* Create Note Button */}
        <button
          onClick={handleAddNote}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm mb-6"
        >
          Create Note
        </button>

        {/* Notes Section */}
        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-3">Notes</h3>
          <div className="space-y-3">
            {notes.map((note, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white shadow-sm border border-gray-200 rounded-lg px-4 py-2"
              >
                <span className="text-gray-700 text-sm">{note}</span>
                <button
                  onClick={() => handleDeleteNote(index)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side Image (only for Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-0">
        <div className="relative">
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


export default Dashboard;
