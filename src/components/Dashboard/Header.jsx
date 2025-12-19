import React, { useState, useEffect } from "react";

const Header = ({ title, user, socket, setIsSidebarOpen }) => {
  const [userStatus, setUserStatus] = useState("Offline");

  useEffect(() => {
    if (!socket) return;

    const updateStatus = () => {
      if (socket.connected) setUserStatus("Online");
      else if (socket.active) setUserStatus("Connecting");
      else setUserStatus("Offline");
    };

    updateStatus();
    socket.on("connect", () => setUserStatus("Online"));
    socket.on("disconnect", () => setUserStatus("Offline"));
    socket.on("connect_error", () => setUserStatus("Connecting"));

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, [socket]);

  const getStatusTheme = () => {
    switch (userStatus) {
      case "Online": return "text-green-400 bg-green-500/10";
      case "Connecting": return "text-yellow-400 bg-yellow-500/10";
      default: return "text-slate-500 bg-slate-500/10";
    }
  };

  return (
    <header className="h-16 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 flex items-center px-4 sticky top-0 z-40">
      
      {/* Toggle Button - Mobile Only */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden flex flex-col gap-1.5 items-center justify-center h-10 w-10 rounded-lg hover:bg-white/5 transition-colors duration-200 text-slate-400 hover:text-white mr-3 flex-shrink-0"
        aria-label="Toggle sidebar"
      >
        <span className="w-5 h-0.5 bg-current rounded-full"></span>
        <span className="w-5 h-0.5 bg-current rounded-full"></span>
        <span className="w-5 h-0.5 bg-current rounded-full"></span>
      </button>
      
      {/* LEFT: Title & Status */}
      <div className="flex items-center gap-2 min-w-0 flex-1 md:flex-initial">
        <h1 className="text-sm md:text-base font-bold text-white tracking-tight whitespace-nowrap">
          {title}
        </h1>
        {/* Status Indicator */}
        <div className={`flex items-center gap-2 px-2 md:px-3 py-1 rounded-full border border-white/10 whitespace-nowrap text-xs md:text-xs ${getStatusTheme()}`}>
          <span className="relative flex h-2 w-2 flex-shrink-0">
            {userStatus === "Online" && (
              <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
            )}
            <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider">
            {userStatus}
          </span>
        </div>
      </div>

      {/* SPACER */}
      <div className="flex-1" />

      {/* RIGHT: User Identity */}
      {user && (
        <div className="flex items-center gap-2 md:gap-3 ml-auto min-w-fit">
          <div className="text-right hidden sm:block">
            <p className="text-xs md:text-sm font-semibold text-white leading-snug whitespace-nowrap">
              {user.username}
            </p>
            <p className="text-[10px] md:text-xs text-slate-400 font-medium whitespace-nowrap">
              Member
            </p>
          </div>
          
          {/* Avatar */}
          <div className="h-9 md:h-10 w-9 md:w-10 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 p-px shadow-md flex-shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-lg flex items-center justify-center text-xs md:text-sm font-bold text-blue-400">
              {user.username?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;