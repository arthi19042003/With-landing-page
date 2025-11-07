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
  const { register } = useAuth();
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
    
    // Simple mock access code check. In a real app, this would be a server-side check.
    if (formData.accessCode !== "RECRUITER123") {
       setError("Invalid Access Code. Contact admin.");
       return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    // Add email domain check
    if (formData.email.endsWith('@gmail.com') || formData.email.endsWith('@yahoo.com') || formData.email.endsWith('@outlook.com')) {
      setError('Personal emails are not allowed. Please use your company email.');
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
      role: "recruiter" // Set the role
    };

    const result = await register(recruiterData); // Use the context's register function
    setLoading(false);

    if (result.success) {
      navigate('/recruiter/profile'); // Redirect to their new profile page
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
            <input type="text" name="accessCode" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Agency Name *</label>
            <input type="text" name="agencyName" onChange={handleChange} required />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>First Name *</label>
              <input type="text" name="firstName" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input type="text" name="lastName" onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Company Email *</label>
            <input type="email" name="email" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Phone *</label>
            <input type="tel" name="phone" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input type="password" name="password" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <input type="password" name="confirmPassword" onChange={handleChange} required />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Signing Up...' : 'Signup'}
          </button>
        </form>

        <p>
          Already registered? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default RecruiterRegister;