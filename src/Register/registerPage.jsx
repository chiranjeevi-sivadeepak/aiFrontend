import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../assets/5539745.png";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!username || !email || !password) {
      return setMessage("All fields are required.");
    }

    setLoading(true);
    try {
      const response = await fetch("https://aibackend-la7w.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      // parse JSON safely
      let data = {};
      try {
        data = await response.json();
      } catch (err) {
        console.error("Non-JSON response from register:", err);
      }

      if (!response.ok) {
        const errMsg = data.message || `Registration failed (${response.status})`;
        setMessage(errMsg);
        setLoading(false);
        return;
      }

      // success
      setMessage(data.message || "Signup successful");
      setLoading(false);
      
      // Optional: Delay slightly to show success message before redirect
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      
    } catch (error) {
      console.error("Network error during register:", error);
      setMessage("Registration failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 px-4">
      <div className="flex flex-col items-center justify-center w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl shadow-slate-900/50">
        <img
          src={logoImage}
          alt="Logo"
          className="w-20 h-20 mb-4 rounded-xl object-contain"
        />
        <h1 className="text-3xl font-bold mb-8 text-slate-100 tracking-wide">
          Create Account
        </h1>

        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          
          {/* USERNAME INPUT */}
          <label className="block mb-5">
            <span className="block text-slate-300 mb-2 text-left text-sm font-semibold">
              Username
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              className="bg-slate-800 text-slate-100 border border-slate-700 rounded-xl w-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </label>

          {/* EMAIL INPUT */}
          <label className="block mb-5">
            <span className="block text-slate-300 mb-2 text-left text-sm font-semibold">
              Email Address
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-slate-800 text-slate-100 border border-slate-700 rounded-xl w-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </label>

          {/* PASSWORD INPUT */}
          <label className="block mb-8">
            <span className="block text-slate-300 mb-2 text-left text-sm font-semibold">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="bg-slate-800 text-slate-100 border border-slate-700 rounded-xl w-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </label>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-bold rounded-xl py-3 transition duration-300 shadow-md ${
              loading
                ? "bg-blue-800/50 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-500 shadow-blue-500/30" 
            }`}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* ERROR/SUCCESS MESSAGE */}
        {message && (
          <p className={`text-center mt-6 font-medium p-2 rounded-lg border w-full max-w-sm ${
            message.includes("success") 
              ? "text-green-400 bg-green-900/20 border-green-500/30" 
              : "text-red-500 bg-slate-800/50 border-red-500/40"
          }`}>
            {message}
          </p>
        )}

        {/* FOOTER LINK */}
        <p className="mt-6 text-slate-400 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 font-bold hover:text-blue-400 transition underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;