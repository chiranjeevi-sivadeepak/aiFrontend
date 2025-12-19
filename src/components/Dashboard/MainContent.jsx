import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import EmojiPicker from "emoji-picker-react";
import ClientOverview from "./ClientOverview";
import ChatHistory from "./ChatHistory";

function MainContent({ activeTab, user, socket, setIsSidebarOpen }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState([]);
  
  const GROUP_SESSION_ID = "GROUP_CHAT"; 

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);
  const emojiRef = useRef(null);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchGroupHistory = async () => {
      try {
        const res = await fetch("https://aibackend-la7w.onrender.com/api/chat/group-history");
        const data = await res.json();
        const formattedMessages = data.map(msg => ({
          ...msg,
          isMe: msg.from === user.username
        }));
        setMessages(formattedMessages);
      } catch (err) {
        console.error("Failed to load group history:", err);
      }
    };

    if (activeTab === "group" && user) {
      fetchGroupHistory();
    }
  }, [activeTab, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  useEffect(() => {
    if (!socket || !user) return;

    const onMessage = (msg) => {
      if (msg.sessionId === GROUP_SESSION_ID) {
        setMessages((prev) => {
          const exists = prev.find(m => m._id === msg._id);
          if (exists) return prev;
          return [...prev, { ...msg, isMe: msg.from === user.username }];
        });
      }
    };

    socket.on("message", onMessage);
    socket.on("typing", (d) => d.username !== user.username && setTypingUser(d.username));
    socket.on("stop-typing", () => setTypingUser(null));
    socket.on("connected-users", (users) => setConnectedUsers(users));
    
    socket.emit("register-user", { username: user.username });
    
    return () => {
      socket.off("message", onMessage);
      socket.off("typing");
      socket.off("stop-typing");
      socket.off("connected-users");
    };
  }, [socket, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      // For non-images, we still convert to Base64 so it can be sent via Socket
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    
    // 🟢 CHANGE: Allow sending if there is text OR a file selected
    if (!inputText.trim() && !filePreview) return;

    const messageData = {
      from: user.username,
      text: inputText.trim(), // Can be empty string now
      sessionId: GROUP_SESSION_ID,
      file: filePreview, 
      fileName: selectedFile?.name,
      fileType: selectedFile?.type,
      time: new Date().toISOString()
    };

    socket.emit("message", messageData);
    socket.emit("stop-typing");
    
    // Clear inputs
    setInputText("");
    setSelectedFile(null);
    setFilePreview(null);
    setShowEmoji(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleTyping = (e) => {
    setInputText(e.target.value);
    socket.emit("typing", { username: user.username });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => socket.emit("stop-typing"), 1000);
  };

  const onEmojiClick = (emojiData) => {
    setInputText((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="flex flex-col h-full bg-[#0B1120] text-slate-200 overflow-hidden relative font-sans">
      <div className="z-30">
        <Header
          title={activeTab === "group" ? "Live Group Chat" : activeTab === "clients" ? "Active Network" : "Archived Sessions"}
          user={user}
          socket={socket}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-12 py-6 space-y-6 custom-scrollbar">
        {activeTab === "group" && (
          <div className="max-w-6xl mx-auto flex flex-col gap-6">
            {messages.map((msg, i) => {
               const isMe = msg.isMe;
               return (
                <div key={msg._id || i} className={`flex ${isMe ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}>
                  <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                    {!isMe && <span className="text-[10px] font-bold text-blue-400 mb-1 ml-2 uppercase tracking-tighter">{msg.from}</span>}
                    <div className={`px-4 py-3 rounded-2xl shadow-xl transition-all ${isMe ? "bg-blue-600 text-white rounded-tr-none" : "bg-slate-800/90 text-slate-100 rounded-2xl rounded-tl-none border border-slate-700/50"}`}>
                      
                      {/* Image Viewer */}
                      {msg.file && msg.fileType?.startsWith("image/") && (
                        <img src={msg.file} alt="attachment" className="rounded-lg mb-2 max-h-80 w-auto object-contain border border-white/5 shadow-md" />
                      )}
                      
                      {/* File Download Component */}
                      {msg.file && !msg.fileType?.startsWith("image/") && (
                        <div className="flex items-center gap-3 mb-2 p-3 bg-black/20 rounded-xl text-xs border border-white/5">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                          <a href={msg.file} download={msg.fileName} className="truncate hover:underline text-blue-400 font-medium cursor-pointer">
                            Download {msg.fileName}
                          </a>
                        </div>
                      )}
                      
                      {msg.text && <p className="text-sm md:text-[15px] leading-relaxed break-words">{msg.text}</p>}
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 px-1">{new Date(msg.time || msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
               );
            })}
          </div>
        )}
        
        {typingUser && (
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-slate-500 animate-pulse ml-2 text-xs">
            <div className="flex gap-1"><span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></span></div>
            {typingUser} is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
        {activeTab === "clients" && <ClientOverview clients={connectedUsers} />}
        {activeTab === "history" && <ChatHistory />}
      </div>

      {activeTab === "group" && (
        <div className="p-4 md:p-8 bg-gradient-to-t from-slate-950 to-transparent">
          <div className="max-w-6xl mx-auto relative">
            
            {showEmoji && (
              <div ref={emojiRef} className="absolute bottom-24 left-0 z-50 shadow-2xl animate-in zoom-in-95 duration-200">
                <EmojiPicker theme="dark" onEmojiClick={onEmojiClick} width={320} height={400} />
              </div>
            )}

            {filePreview && (
              <div className="absolute bottom-full mb-4 left-0 p-3 bg-slate-900 border border-blue-500/50 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-4">
                {selectedFile?.type.startsWith("image/") ? (
                  <img src={filePreview} alt="preview" className="w-14 h-14 rounded-xl object-cover border border-white/10" />
                ) : (
                  <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center text-blue-400">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/></svg>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-200 truncate max-w-[150px]">{selectedFile?.name}</span>
                  <span className="text-[10px] text-blue-400 font-medium tracking-wide uppercase">Ready to send</span>
                </div>
                <button type="button" onClick={() => {setSelectedFile(null); setFilePreview(null); if(fileInputRef.current) fileInputRef.current.value=""}} className="ml-2 p-2 hover:bg-red-500/20 text-red-400 rounded-full transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            )}

            <form onSubmit={handleSend} className="bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 rounded-[28px] p-2.5 flex items-center gap-2 shadow-2xl focus-within:border-blue-500/50 transition-all ring-1 ring-white/5">
              
              <button type="button" onClick={() => setShowEmoji(!showEmoji)} className={`p-3 rounded-full transition-all ${showEmoji ? "bg-blue-600 text-white scale-110" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
              </button>

              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              <button type="button" onClick={() => fileInputRef.current.click()} className={`p-3 rounded-full transition-all ${selectedFile ? "text-blue-400 bg-blue-400/10" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
              </button>

              <input
                value={inputText}
                onChange={handleTyping}
                placeholder={selectedFile ? "Add a caption..." : "Write your message here..."}
                className="flex-1 bg-transparent text-slate-100 px-4 py-2 focus:outline-none font-medium"
              />
              
              <button disabled={!inputText.trim() && !filePreview} type="submit" className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:scale-100 text-white w-12 h-12 flex items-center justify-center rounded-full active:scale-95 transition-transform shadow-lg shadow-blue-500/20 flex-shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="rotate-45 -translate-y-0.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainContent;