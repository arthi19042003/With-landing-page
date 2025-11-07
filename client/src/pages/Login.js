// FILE: src/pages/Login.js (Complete, Corrected Code)

import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'; 
import axios from 'axios';
// import { useAuth } from '../context/AuthContext'; 

// 1. IMPORT THE CSS (from your Candidates/Register page)
import './Candidates.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  // const { login } = useAuth(); 

  const location = useLocation();
  const message = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data } = await axios.post('/api/auth/login', { email, password }); 
      
      localStorage.setItem('userToken', data.token); 
      // login(data.token, data.user); 
      
      navigate('/dashboard'); 

    } catch (err) {
      setLoading(false);
      setError(err.response && err.response.data.message
        ? err.response.data.message
        : 'Login failed. Please check your credentials.'
      );
    }
  };

  return (
    // 2. USE THE SAME CSS CLASSES AS YOUR REGISTER PAGE
    <div className="register-container"> 
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {/* This displays the message from registration */}
        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {/* 3. THIS IS THE MISSING EMAIL FIELD */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <div className="error-message-box">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="register-button">
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="login-link">
          Don't have an account?{' '}
          <Link to="/candidates">Register here</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;