import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { io } from "socket.io-client";

import LoginPage from "./Login/loginPage";
import RegisterPage from "./Register/registerPage";
import HomePage from "./Home/HomePage";

function App() {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  /* ===== LOAD USER FROM STORAGE ===== */
  useEffect(() => {
    const loadUser = () => {
      const stored = sessionStorage.getItem("user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (err) {
          console.error("Error parsing user:", err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsReady(true);
    };

    loadUser();

    // Listen for custom login event from LoginPage
    const handleLogin = () => {
      loadUser();
    };

    // Also listen for storage changes (for other tabs)
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        loadUser();
      }
    };

    window.addEventListener("user-login", handleLogin);
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("user-login", handleLogin);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  /* ===== CREATE SOCKET WHEN USER EXISTS ===== */
  useEffect(() => {
    if (!user) return;

    // Prevent duplicate sockets
    if (socketRef.current) return;

    const s = io("https://aibackend-la7w.onrender.com", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    s.on("connect", () => {
      console.log("🟢 Socket connected:", s.id);

      s.emit("register-user", {
        username: user.username,
      });
    });

    s.on("disconnect", (reason) => {
      console.log("🔴 Socket disconnected:", reason);
    });

    socketRef.current = s;
    setSocket(s);

    /* ===== CLEANUP ===== */
    return () => {
      console.log("🧹 Cleaning up socket");
      s.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isReady ? <Navigate to={user ? "/home" : "/login"} /> : null}
        />

        <Route
          path="/login"
          element={
            isReady ? (user ? <Navigate to="/home" /> : <LoginPage />) : null
          }
        />

        <Route
          path="/register"
          element={
            isReady ? (user ? <Navigate to="/home" /> : <RegisterPage />) : null
          }
        />

        <Route
          path="/home"
          element={
            isReady ? (
              user ? (
                socket ? (
                  <HomePage user={user} socket={socket} />
                ) : (
                  <div className="flex items-center justify-center min-h-screen bg-slate-950">
                    <p className="text-slate-100">Connecting...</p>
                  </div>
                )
              ) : (
                <Navigate to="/login" />
              )
            ) : null
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
