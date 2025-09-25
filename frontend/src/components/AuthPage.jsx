import React, { useState, useContext, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Button from "../components/Ui/Button";

const AuthPage = () => {
  const { login, signup, isLoggedIn } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("login"); // login or signup
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if(isLoggedIn){
        navigate("/");
    }
  })

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      alert("Login successful!");
    } catch (err) {
      console.error(err);
      alert("Login failed!");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(username, email, password);
      alert("Signup successful!");
    } catch (err) {
      console.error(err);
      alert("Signup failed!");
    }
  };

  return (
    <div className="max-w-screen min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Tabs */}
        <div className="flex mb-6 bg-gray-100 rounded-xl overflow-hidden">
          <button
            className={`flex-1 py-2 text-sm font-semibold transition-colors ${
              activeTab === "login"
                ? "bg-indigo-600 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 text-sm font-semibold transition-colors ${
              activeTab === "signup"
                ? "bg-indigo-600 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Login Form */}
        {activeTab === "login" && (
          <form className="space-y-4" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <p onClick={() => setActiveTab("signup")} className="text-xs text-blue-300 cursor-pointer">Don't have an account? Signup now</p>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
            >
              Login
            </Button>
          </form>
        )}

        {/* Signup Form */}
        {activeTab === "signup" && (
          <form className="space-y-4" onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <p onClick={() => setActiveTab("login")} className="text-xs text-blue-300 cursor-pointer">Already have an account? Login now</p>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
            >
              Sign Up
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
