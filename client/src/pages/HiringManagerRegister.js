// client/src/pages/HiringManagerRegister.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ Import Link
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css"; // ✅ Import the shared login styles

export default function HiringManagerRegister() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", companyName: "", email: "", phone: "", password: "", confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth(); // ✅ Use register from context

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    // ✅ Use the register function from context
    const result = await register({
      firstName: form.firstName,
      lastName: form.lastName,
      companyName: form.companyName,
      email: form.email,
      phone: form.phone,
      password: form.password,
      role: "hiringManager" // ✅ Specify the role
    });
    
    setLoading(false);

    if (result.success) {
      navigate("/hiring-manager/dashboard");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-page-container"> {/* ✅ Add wrapper for centering */}
      <div className="auth-card"> {/* ✅ Use the unified auth-card class */}
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