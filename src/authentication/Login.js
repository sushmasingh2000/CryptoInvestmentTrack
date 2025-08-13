import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { endpoint } from "../utils/APIRoutes"; // ensure this file has login URL
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Both email and password are required");
      return;
    }

    try {
      const res = await axios.post(endpoint.login, {
        email,
        password,
      });
      if (res.status === 200) {
        toast(res?.data.msg);
        localStorage.setItem("id", res?.data?.user?.id)
        navigate("/dashboard");
      } else {
        setError(res?.data.msg || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">
      <div className="bg-gray-900 p-7 rounded-xl shadow-xl w-full max-w-md border border-emerald-400">
        <h2 className="text-3xl font-bold text-emerald-400 mb-6 text-center">
          Welcome Back
        </h2>

        {/* Error message */}
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your Email"
              className="w-full mt-1 p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your Password"
              className="w-full mt-1 p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded bg-emerald-500 text-black font-bold hover:bg-emerald-600 transition"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-emerald-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
