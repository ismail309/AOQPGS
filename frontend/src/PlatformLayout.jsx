// frontend/src/PlatformLayout.jsx
import { useState } from "react";
import PlatformAdmin from "./PlatformAdmin";

export default function PlatformLayout({ user, onLogout }) {
  const [activeNav, setActiveNav] = useState("dashboard");

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-2xl font-bold text-indigo-600 tracking-tight">
            PaperPilot
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveNav("dashboard")}
            className={`w-full text-left block px-4 py-2 rounded-lg font-medium ${activeNav === "dashboard" ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}`}
          >
            Platform Overview
          </button>
          <button
            onClick={() => setActiveNav("manage")}
            className={`w-full text-left block px-4 py-2 rounded-lg font-medium ${activeNav === "manage" ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}`}
          >
            Manage Tenants & Users
          </button>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg"
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-gray-800">
            {activeNav === "dashboard"
              ? "Platform Overview"
              : "Management Portal"}
          </h1>
          <div className="flex items-center gap-4">
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              Platform Admin
            </span>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              {user.first_name[0]}
              {user.last_name[0]}
            </div>
          </div>
        </header>

        {activeNav === "dashboard" ? (
          <div className="p-8 text-gray-500">
            Platform stats (Head Offices, Campuses, Users) go here.
          </div>
        ) : (
          <PlatformAdmin />
        )}
      </main>
    </div>
  );
}
