// client/src/components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
// ✅ FIX: Import HashLink
import { HashLink } from 'react-router-hash-link'; 
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const role = (user?.role || user?.userType || "").toLowerCase();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* ✅ FIX: Changed to HashLink. Goes to /#top if logged out, /dashboard if logged in. */}
        <HashLink smooth to={user ? "/dashboard" : "/#top"} className="navbar-logo">
          Smart Submissions
        </HashLink>

        <div className="navbar-menu">
          {!user ? (
            <>
              {/* ✅ FIX: Use HashLink for scrolling links */}
              <HashLink smooth to="/#top" className="navbar-link">Home</HashLink>
              <HashLink smooth to="/#features" className="navbar-link">Features</HashLink>
              <HashLink smooth to="/#pricing" className="navbar-link">Sign Up</HashLink>
              
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register/employer" className="navbar-btn">Post Job</Link>
            </>
          ) : (
            <>
              {/* Role-based links */}
              {role === "employer" && (
                <>
                  <Link to="/employer/dashboard" className="navbar-link">Dashboard</Link>
                  <Link to="/employer/profile" className="navbar-link">Profile</Link>
                  <Link to="/positions/new" className="navbar-link">Post Job</Link>
                </>
              )}

              {role === "hiringmanager" && (
                <>
                  <Link to="/hiring-manager/dashboard" className="navbar-link">Dashboard</Link>
                  <Link to="/hiring-manager/open-positions" className="navbar-link">Positions</Link>
                  <Link to="/hiring-manager/inbox" className="navbar-link">Inbox</Link>
                  <Link to="/positions/new" className="navbar-link">Post Job</Link>
                </>
              )}
              
              {role === "recruiter" && ( 
                <>
                  <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                  <Link to="/recruiter/profile" className="navbar-link">Profile</Link>
                  <Link to="/recruiter/submit" className="navbar-link">Submit Candidate</Link>
                </>
              )}

              {role === "candidate" && (
                <>
                  <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                  <Link to="/profile" className="navbar-link">Profile</Link>
                  <Link to="/resume" className="navbar-link">Resume</Link>
                  <Link to="/interviews" className="navbar-link">Interviews</Link>
                </>
              )}

              <button onClick={handleLogout} className="navbar-btn">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}