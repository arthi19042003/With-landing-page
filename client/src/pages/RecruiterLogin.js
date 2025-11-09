// client/src/pages/RecruiterLogin.js
import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios"; // Use the axios instance
import "../styles/Login.css"; // Use the shared login styles

export default function RecruiterLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Get setUser to update context manually

  const location = useLocation();
  const message = location.state?.message;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Use the general /api/auth/login route, specifying the role
      const res = await api.post("/auth/login", {
        email,
        password,
        role: "recruiter", // Specify the role
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        navigate("/dashboard"); // Redirect to the main dashboard
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check credentials.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h2>Recruiter Login</h2>

        {/* Display success message from registration */}
        {message && (
          <div className="success" style={{ textAlign: 'center', marginBottom: '15px' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={loading}>
             {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p>
          Need a recruiter account?{" "}
          <Link to="/register/recruiter">Register here</Link>
        </p>
      </div>
    </div>
  );
}