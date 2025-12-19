import React from "react";

function ClientOverview({ clients = [] }) {
  return (
    <div className="flex flex-col h-full">
      {/* ===== HEADER ===== */}
      <div className="p-4 border-b border-slate-700/50 bg-slate-800/50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100">
            Connected Clients
          </h2>
          <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-xs font-bold rounded-full">
            {clients.length} Online
          </span>
        </div>
      </div>

      {/* ===== CLIENTS LIST ===== */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-slate-400 space-y-2">
              <div className="text-4xl mb-2">👥</div>
              <p className="text-sm font-medium">No users connected</p>
              <p className="text-xs text-slate-500">Waiting for connections...</p>
            </div>
          </div>
        ) : (
          clients.map((user) => (
            <div
              key={user.socketId}
              className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm text-slate-200 px-4 py-3 rounded-lg w-full border border-slate-700/30 hover:border-slate-600/50 transition-all group"
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-600/80 rounded-lg flex items-center justify-center text-white text-xs font-bold group-hover:bg-blue-500 transition-colors">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <p className="text-sm font-semibold text-white flex-1">
                  {user.username}
                </p>
                <span className="flex items-center gap-1.5 text-green-400 text-xs font-medium">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Online
                </span>
              </div>
              
              {/* Socket Info */}
              <div className="flex items-center justify-between px-1">
                <p className="text-[11px] text-slate-400 font-mono">
                  ID: {user.socketId.slice(0, 8)}...
                </p>
                <p className="text-[10px] text-slate-500">Connected</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ClientOverview;
