import React, { useState } from "react";
import logoImage from "../../assets/5539745.png";

export const navItems = [
  { id: "group", label: "Group Chat", icon: "chat" },
  { id: "clients", label: "Active Network", icon: "users" },
  { id: "history", label: "Chat History", icon: "history" },
];

const Sidebar = ({ activeTab, setActiveTab, onLogout, user, onProfileClick }) => {
  const renderIcon = (type, isActive) => {
    const props = {
      className: `transition-all duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`,
      width: "18", height: "18", viewBox: "0 0 24 24", fill: "none",
      stroke: "currentColor", strokeWidth: isActive ? "2.5" : "2",
      strokeLinecap: "round", strokeLinejoin: "round",
    };

    if (type === "chat") return <svg {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
    if (type === "users") return <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    if (type === "history") return <svg {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
    return null;
  };

  return (
    <aside className="h-full w-72 bg-[#020617] border-r border-white/5 flex flex-col z-50">
      
      {/* ===== LOGO SECTION ===== */}
      <div className="h-20 flex items-center px-6 py-4">
        <div className="flex items-center gap-4 group cursor-default">
          <div className="relative group-hover:scale-110 transition-all duration-300">
            <img src={logoImage} alt="iChat" className="w-12 h-12 brightness-150" />
          </div>
          <span className="text-white font-black text-2xl tracking-tighter uppercase italic">
            i<span className="text-blue-400">Chat</span>
          </span>
        </div>
      </div>

      {/* ===== NAVIGATION ===== */}
      <nav className="flex-1 px-4 mt-6 space-y-2">
        <div className="flex items-center justify-between px-3 mb-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Workspace</p>
        </div>
        
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? "bg-blue-600/10 text-blue-400" 
                  : "text-slate-400 hover:bg-white/[0.03] hover:text-slate-200"
              }`}
            >
              {/* Active Bar Indicator - Solid */}
              {isActive && (
                <div className="absolute left-0 w-1 h-full bg-blue-500 rounded-r-md"></div>
              )}
              
              <span className={`transition-colors duration-300 ${isActive ? "text-blue-500" : "text-slate-500 group-hover:text-slate-300"}`}>
                {renderIcon(item.icon, isActive)}
              </span>
              <span className="font-semibold text-[13.5px] tracking-wide">{item.label}</span>

              {/* Subtle Active Glow */}
              {isActive && (
                <div className="absolute inset-0 bg-blue-500/5 rounded-xl pointer-events-none border border-blue-500/20" />
              )}
            </button>
          );
        })}
      </nav>

      {/* ===== PROFILE CARD SECTION ===== */}
      <div className="p-4 mt-auto">
        <div 
          onClick={() => onProfileClick()}
          className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 shadow-2xl hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-white font-bold text-sm shadow-inner group-hover:border-blue-500/30 transition-all">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#020617] rounded-full"></span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-tight">Login As</span>
              <span className="text-sm font-bold text-slate-100 truncate tracking-tight hover:text-blue-400 transition-colors">
                {user?.email || "user@example.com"}
              </span>
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter mt-0.5">@{user?.username || "username"}</span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onLogout();
            }}
            className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.03] hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-white/5 hover:border-red-500/20 transition-all duration-300 text-[11px] font-bold uppercase tracking-widest"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;