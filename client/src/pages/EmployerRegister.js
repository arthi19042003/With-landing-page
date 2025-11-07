import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import "../styles/Login.css"; 

const EmployerRegister = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    hiringManagerFirstName: '',
    hiringManagerLastName: '',
    email: '',
    hiringManagerPhone: '',
    password: '',
    confirmPassword: ''
    
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ FIX: Get the logout function from useAuth
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

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const employerData = {
      companyName: formData.companyName.trim(),
      hiringManagerFirstName: formData.hiringManagerFirstName.trim(),
      hiringManagerLastName: formData.hiringManagerLastName.trim(),
      email: formData.email.trim(),
      hiringManagerPhone: formData.hiringManagerPhone.trim(),
      password: formData.password,
      role: "employer" 
    };

    const result = await register(employerData);
    setLoading(false);

    if (result.success) {
      // ✅ FIX: Log the user out and redirect to the employer login page
      logout();
      navigate('/login/employer'); 
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-page-container"> 
      <div className="auth-card"> 
        <h2>Employer Signup</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name *</label>
            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Manager First Name *</label>
            <input type="text" name="hiringManagerFirstName" value={formData.hiringManagerFirstName} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Manager Last Name *</label>
            <input type="text" name="hiringManagerLastName" value={formData.hiringManagerLastName} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Phone (optional)</label>
            <input type="tel" name="hiringManagerPhone" value={formData.hiringManagerPhone} onChange={handleChange} />
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
          Already registered? <Link to="/login/employer">Login here</Link>
        </p>
        <p>
          Are you a candidate? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default EmployerRegister;