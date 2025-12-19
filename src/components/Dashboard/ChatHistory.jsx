import React, { useState, useEffect } from "react";

const ChatHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [sessionMessages, setSessionMessages] = useState([]);
  const [showMobileList, setShowMobileList] = useState(true);

  const currentUserId = "my-user-id"; 

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("https://aibackend-la7w.onrender.com/api/chat/history");
        const data = await res.json();
        const sortedData = data.sort((a, b) => new Date(b.lastTime) - new Date(a.lastTime));
        setHistory(sortedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching history:", err);
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleViewSession = async (sessionId) => {
    try {
      setSelectedSessionId(sessionId);
      const res = await fetch(`https://aibackend-la7w.onrender.com/api/chat/messages/${sessionId}`);
      const data = await res.json();
      setSessionMessages(Array.isArray(data) ? data : []);
      setShowMobileList(false);
    } catch (err) {
      console.error("Error fetching session messages:", err);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm("Delete this conversation?")) return;
    try {
      const res = await fetch(`https://aibackend-la7w.onrender.com/api/chat/history/${sessionId}`, { method: "DELETE" });
      if (res.ok) {
        setHistory(history.filter((h) => h._id !== sessionId));
        if (selectedSessionId === sessionId) {
          setSelectedSessionId(null);
          setSessionMessages([]);
          setShowMobileList(true);
        }
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B1120]">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 text-xs tracking-widest uppercase">Syncing Data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0B1120] text-slate-200 p-0 md:p-6">
      <div className="flex w-full max-w-6xl mx-auto h-full border border-slate-800 rounded-none md:rounded-3xl overflow-hidden bg-[#0F172A] shadow-2xl shadow-black/50">
        
        {/* SIDEBAR: History List */}
        <div className={`${showMobileList ? "flex" : "hidden"} md:flex w-full md:w-80 border-r border-slate-800 flex-col bg-[#0F172A]`}>
          <div className="p-6 border-b border-slate-800 bg-[#0F172A]/50 backdrop-blur-xl">
            <h2 className="font-bold text-xl text-white">History</h2>
            <p className="text-[10px] text-slate-500 uppercase mt-1 tracking-widest">{history.length} Saved Sessions</p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
            {history.map((session) => (
              <button
                key={session._id}
                onClick={() => handleViewSession(session._id)}
                className={`w-full text-left group relative p-4 rounded-2xl transition-all duration-300 border ${
                  selectedSessionId === session._id 
                  ? "bg-blue-600/10 border-blue-500/40" 
                  : "bg-transparent border-transparent hover:bg-slate-800/50"
                }`}
              >
                <div className="pr-8">
                  <p className={`text-sm truncate font-medium ${selectedSessionId === session._id ? "text-blue-400" : "text-slate-300"}`}>
                    {session.lastMessage || "📎 Attachment sent"}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[9px] text-slate-500 font-mono">
                      {session.lastTime ? new Date(session.lastTime).toLocaleDateString() : "Recent"}
                    </span>
                  </div>
                </div>
                <div 
                  onClick={(e) => { e.stopPropagation(); handleDeleteSession(session._id); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT AREA: Messages */}
        <div className={`${!showMobileList ? "flex" : "hidden"} md:flex flex-1 flex-col bg-slate-950/20`}>
          {!selectedSessionId ? (
            <div className="flex-1 flex flex-col items-center justify-center opacity-30">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <p className="mt-4 text-sm font-light">Select a thread to view logs</p>
            </div>
          ) : (
            <>
              <header className="h-[73px] border-b border-slate-800 flex items-center justify-between px-6 bg-[#0F172A]/30 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <button onClick={() => setShowMobileList(true)} className="md:hidden p-2 -ml-2 text-blue-400">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
                  </button>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-none">Conversation View</h3>
                    <p className="text-[10px] text-blue-500 font-mono mt-1 tracking-tighter uppercase">ID: {String(selectedSessionId).slice(-8)}</p>
                  </div>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar bg-transparent">
                {sessionMessages.map((msg, i) => {
                  const isMe = msg.from === currentUserId || msg.from === "user";
                  return (
                    <div key={msg._id || i} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                      {!isMe && (
                        <span className="text-[9px] text-blue-400 font-black mb-2 ml-1 uppercase tracking-widest">
                          {msg.from || "Client"}
                        </span>
                      )}
                      
                      <div className={`relative max-w-[85%] md:max-w-[70%] px-5 py-3.5 rounded-3xl text-sm leading-relaxed ${
                        isMe 
                        ? "bg-blue-600 text-white rounded-tr-none shadow-xl shadow-blue-900/10" 
                        : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50"
                      }`}>
                        
                        {/* 🟢 IMAGE RENDERING LOGIC */}
                        {msg.file && msg.fileType?.startsWith("image/") && (
                          <img 
                            src={msg.file} 
                            alt="Attachment" 
                            className="rounded-xl mb-2 max-h-80 w-auto object-contain border border-white/5 shadow-md"
                          />
                        )}

                        {/* 🟢 FILE/DOCUMENT RENDERING LOGIC */}
                        {msg.file && !msg.fileType?.startsWith("image/") && (
                          <div className="flex items-center gap-3 mb-2 p-3 bg-black/20 rounded-xl text-xs border border-white/5">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                              <polyline points="13 2 13 9 20 9"/>
                            </svg>
                            <a 
                              href={msg.file} 
                              download={msg.fileName || "download"} 
                              className="truncate hover:underline text-blue-400 font-medium cursor-pointer"
                            >
                              Download {msg.fileName || "File"}
                            </a>
                          </div>
                        )}

                        {/* Render text if it exists */}
                        {msg.text && <p className="break-words">{msg.text}</p>}
                      </div>

                      <span className="text-[9px] text-slate-600 mt-2 px-1 font-mono">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;