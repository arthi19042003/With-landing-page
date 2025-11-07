import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ Import Link
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../styles/Login.css"; // ✅ Import the shared login styles

export default function EmployerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // ✅ Add error state
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // ✅ Clear error
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
        role: "employer",
      });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        navigate("/employer/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check credentials."); // ✅ Set error
      console.error(err);
    }
  };

  return (
    <div className="auth-page-container"> {/* ✅ Add wrapper for centering */}
      <div className="auth-card"> {/* ✅ Use the unified auth-card class */}
        <h2>Employer Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
          </div>
          
          {error && <div className="error">{error}</div>} {/* ✅ Show error */}
          
          <button type="submit">Login</button>
        </form>
        <p>
          Need an employer account? <Link to="/register/employer">Register here</Link>
        </p>
      </div>
    </div>
  );
}