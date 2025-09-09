import { useState, useEffect } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch current user info
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/accounts/me", {
          headers: { Authorization: `Token ${token}` },
        });
        setUsername(res.data.username);
        setEmail(res.data.email);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.patch(
        "http://localhost:8000/api/accounts/me",
        { email, ...(password ? { password } : {}) },
        { headers: { Authorization: `Token ${token}` } }
      );

      setMessage("Profile updated successfully");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile");
    }
  };

  return (
    <div className="max-w-md mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      {message && <p className="text-green-500 mb-2">{message}</p>}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={username}
          disabled
          className="p-2 border rounded bg-gray-100 cursor-not-allowed"
        />
        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="password"
          value={password}
          placeholder="New password"
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="password"
          value={confirmPassword}
          placeholder="Confirm new password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-grey rounded hover:bg-blue-600"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}
