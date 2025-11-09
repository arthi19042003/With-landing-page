// client/src/pages/RecruiterRegister.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import "../styles/Login.css"; // We can reuse the same login styles

const RecruiterRegister = () => {
  const [formData, setFormData] = useState({
    accessCode: '',
    agencyName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // ✅ FIX 1: Import logout from useAuth
  const { register, logout } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Note: You should ideally validate the accessCode on the backend
    // but leaving your existing client-side checks as-is.
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const recruiterData = {
      agencyName: formData.agencyName,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: "recruiter", // Set the role
      accessCode: formData.accessCode // Pass access code
    };

    const result = await register(recruiterData); // Register function will still log in
    setLoading(false);

    if (result.success) {
      // ✅ FIX 2: Log the user out immediately after registration
      logout();
      
      // ✅ FIX 3: Navigate to the new recruiter login page with a success message
      navigate('/login/recruiter', { 
        state: { message: 'Registration successful! Please log in.' } 
      });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card" style={{ maxWidth: "600px" }}>
        <h2>Recruiter Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Access Code *</label>
            <input type="text" name="accessCode" value={formData.accessCode} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Agency Name *</label>
            <input type="text" name="agencyName" value={formData.agencyName} onChange={handleChange} required />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>First Name *</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Company Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Phone *</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Signing Up...' : 'Signup'}
          </button>
        </form>

        <p>
          {/* ✅ FIX 4: Update link to point to the new login page */}
          Already registered? <Link to="/login/recruiter">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default RecruiterRegister;