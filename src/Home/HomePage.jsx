import React, { useState, useEffect } from "react";
import Sidebar from "../components/Navigation/Sidebar";
import MainContent from "../components/Dashboard/MainContent";

function HomePage({ user, socket }) {
  const [activeTab, setActiveTab] = useState("group");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Use the user prop directly, fallback to sessionStorage if needed
  const currentUser = user || JSON.parse(sessionStorage.getItem("user") || "null");

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 text-slate-100">
      {/* ===== SIDEBAR ===== */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-72 shrink-0
          bg-slate-900 border-r border-slate-800
          transform transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsSidebarOpen(false); // ✅ auto-close on mobile
          }}
          onLogout={handleLogout}
          user={currentUser}
          onProfileClick={() => setShowProfile(true)}
        />
      </aside>

      {/* ===== OVERLAY (MOBILE) ===== */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 min-w-0 flex flex-col">
        <MainContent
          activeTab={activeTab}
          user={currentUser}
          socket={socket}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </main>

      {/* ===== USER PROFILE MODAL (FULL SCREEN) ===== */}
      {showProfile && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-lg z-[9999] flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowProfile(false)}
        >
          <div 
            className="bg-gradient-to-br from-[#0F172A] via-[#0B1120] to-[#080D1A] border border-blue-500/20 rounded-2xl shadow-2xl w-full max-w-md p-6 backdrop-blur-xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white tracking-tight">Profile</h2>
              <button
                onClick={() => setShowProfile(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all active:scale-95"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-400 hover:text-white">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Profile Content */}
            <div className="space-y-4">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 border-2 border-white/20 flex items-center justify-center text-3xl font-black text-white shadow-lg">
                    {currentUser?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-3 border-[#0B1120] rounded-full animate-pulse"></span>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-black text-white">
                    {currentUser?.username || "Username"}
                  </h3>
                  <p className="text-xs text-emerald-400 font-bold mt-1">● Online</p>
                </div>
              </div>

              {/* Credentials */}
              <div className="space-y-2 border-t border-white/10 pt-4">
                <div className="bg-white/[0.05] rounded-lg p-3 border border-white/10">
                  <p className="text-xs text-slate-400 font-bold mb-1">Email</p>
                  <p className="text-sm font-semibold text-blue-300 break-all">{currentUser?.email || "user@example.com"}</p>
                </div>
                <div className="bg-white/[0.05] rounded-lg p-3 border border-white/10">
                  <p className="text-xs text-slate-400 font-bold mb-1">Username</p>
                  <p className="text-sm font-semibold text-blue-300">@{currentUser?.username || "username"}</p>
                </div>
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
                <div className="bg-blue-500/10 rounded-lg p-2.5 border border-blue-500/20 text-center">
                  <p className="text-[10px] text-slate-400 font-bold mb-1">Account</p>
                  <p className="text-xs font-bold text-blue-300">✓ Verified</p>
                </div>
                <div className="bg-emerald-500/10 rounded-lg p-2.5 border border-emerald-500/20 text-center">
                  <p className="text-[10px] text-slate-400 font-bold mb-1">Session</p>
                  <p className="text-xs font-bold text-emerald-300">✓ Active</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setShowProfile(false)}
                  className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all active:scale-95"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowProfile(false);
                    handleLogout();
                  }}
                  className="flex-1 py-2.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 font-bold text-sm border border-red-600/30 transition-all active:scale-95"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
