// FILE: src/pages/Login.js (Complete, Corrected Code)

import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'; 
// ✅ FIX: Use the AuthContext hook
import { useAuth } from '../context/AuthContext'; 

// ✅ FIX 1: Use the correct shared CSS file
import '../styles/Login.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  // ✅ FIX: Get the login function from context
  const { login } = useAuth(); 

  const location = useLocation();
  const message = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // ✅ FIX: Use the login function from context
      const result = await login(email, password); 
      
      if (result.success) {
        navigate('/dashboard'); 
      } else {
        setLoading(false);
        setError(result.error || 'Login failed. Please check your credentials.');
      }

    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    // ✅ FIX 2: Use the correct wrapper class from Login.css
    <div className="auth-page-container"> 
      {/* ✅ FIX 3: Use the auth-card class for consistent styling */}
      <div className="auth-card"> 
        <h2>Login</h2>

        {/* This displays the message from registration */}
        {message && (
          <div className="success">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
            <div className="error">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p>
          Don't have an account?{' '}
          {/* ✅ FIX 4: Changed link from "/candidates" to "/register" */}
          <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;