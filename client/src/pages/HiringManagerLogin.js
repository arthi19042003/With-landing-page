// client/src/pages/HiringManagerLogin.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // ✅ Import Link
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css"; // ✅ Import the shared login styles

export default function HiringManagerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      // ✅ FIX: Point to the unified /api/auth/login route
      const res = await axios.post("/api/auth/login", { 
        email, 
        password, 
        role: "hiringManager" // ✅ Pass the role
      }); 
      
      const { data } = res; // ✅ data is at res.data
      localStorage.setItem("token", data.token);
      setUser(data.user); // ✅ user is at data.user
      navigate("/hiring-manager/dashboard");
    } catch (error) {
      setErr(error?.response?.data?.message || "Login failed");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container"> {/* ✅ Add wrapper for centering */}
      <div className="auth-card"> {/* ✅ Use the unified auth-card class */}
        <h2>Hiring Manager Login</h2>
        
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