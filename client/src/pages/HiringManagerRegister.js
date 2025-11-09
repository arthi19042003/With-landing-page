// client/src/pages/HiringManagerRegister.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css"; 

export default function HiringManagerRegister() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", companyName: "", email: "", phone: "", password: "", confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // ✅ FIX: Get both register and logout from useAuth
  const { register, logout } = useAuth(); 

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    const result = await register({
      firstName: form.firstName,
      lastName: form.lastName,
      companyName: form.companyName,
      email: form.email,
      phone: form.phone,
      password: form.password,
      role: "hiringManager" 
    });
    
    setLoading(false);

    // ✅ FIX: Changed navigation logic
    if (result.success) {
      logout(); // Log out to clear any session
      navigate("/login/hiring-manager", { 
        state: { message: "Registration successful! Please log in." } 
      });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-page-container"> 
      <div className="auth-card"> 
        <h2>Hiring Manager - Register</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name *</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" required/>
          </div>
          <div className="form-group">
            <label>Last Name *</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" required/>
          </div>
          <div className="form-group">
            <label>Company *</label>
            <input name="companyName" value={form.companyName} onChange={handleChange} placeholder="Company" required/>
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required/>
          </div>
          <div className="form-group">
            <label>Phone *</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required/>
          </div>
          <div className="form-group">
            <label>Password *</label>
            <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" required/>
          </div>
          <div className="form-group">
            <label>Confirm Password *</label>
            <input name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm Password" type="password" required/>
          </div>
          
          {error && <div className="error">{error}</div>}
          
          <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
        </form>
         <p>
          Already have an account? <Link to="/login/hiring-manager">Login here</Link>
        </p>
      </div>
    </div>
  );
}