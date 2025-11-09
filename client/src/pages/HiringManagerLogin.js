// client/src/pages/HiringManagerLogin.js
import React, { useState } from "react";
import axios from "axios";
// ✅ FIX: Import useLocation
import { useNavigate, Link, useLocation } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css"; 

export default function HiringManagerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  // ✅ FIX: Get location and message from state
  const location = useLocation();
  const message = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", { 
        email, 
        password, 
        role: "hiringManager" 
      }); 
      
      const { data } = res; 
      localStorage.setItem("token", data.token);
      setUser(data.user); 
      navigate("/hiring-manager/dashboard");
    } catch (error) {
      setErr(error?.response?.data?.message || "Login failed");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container"> 
      <div className="auth-card"> 
        <h2>Hiring Manager Login</h2>
        
        {/* ✅ FIX: Display success message if it exists */}
        {message && (
          <div className="success">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" required />
          </div>
          
          {err && <div className="error">{err}</div>}
          
          <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </form>
        <p>
          Need a manager account? <Link to="/register/hiring-manager">Register here</Link>
        </p>
      </div>
    </div>
  );
}