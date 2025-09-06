// src/pages/SignupPage.jsx
import React, { useState } from "react";
import { signupUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const token = await signupUser(username, email, password);
      localStorage.setItem("username", username);
      localStorage.setItem("token", token);
      navigate("/locations"); // redirect to Explore page
      window.location.reload(); // refresh navbar
    } catch (err) {
      console.error("Signup failed:", err);
      setError("Signup failed. Try a different username or email.");
    }
  };

  return (
    <div className="signup-page p-8 max-w-md mx-auto">
      <h2 className="text-center text-2xl mb-4">Sign Up</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-grey rounded hover:bg-blue-600"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
