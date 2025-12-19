import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logoImage from "../assets/5539745.png";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email.trim() || !password.trim()) {
      setMessage("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://aibackend-la7w.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      // ✅ store user + token
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));

      // 🔔 dispatch event to notify App.jsx of login
      window.dispatchEvent(new Event("user-login"));

      navigate("/home", { replace: true });
    } catch (error) {
      console.error(error);
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

        {/* LOGO */}
        <img
          src={logoImage}
          alt="iChat Logo"
          className="w-20 h-20 mx-auto mb-4 rounded-xl"
        />

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center text-slate-100 mb-8">
          iChat Login
        </h1>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl
                         border border-slate-700 focus:outline-none
                         focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl
                         border border-slate-700 focus:outline-none
                         focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition
              ${
                loading
                  ? "bg-blue-800/50 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500"
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* ERROR MESSAGE */}
        {message && (
          <p className="mt-6 text-center text-red-500 bg-slate-800/50
                        border border-red-500/40 rounded-lg p-2">
            {message}
          </p>
        )}

        {/* REGISTER LINK */}
        <p className="mt-6 text-center text-slate-400 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
