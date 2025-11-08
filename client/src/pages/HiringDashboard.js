// client/src/pages/HiringDashboard.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css"; // Re-use the existing Dashboard CSS for styling

const HiringManagerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">
        Welcome, {user?.profile?.firstName || 'Manager'}
      </h2>

      <p className="dashboard-subtitle">
        Manage positions, candidates, and hiring operations
      </p>

      <div className="dashboard-grid">
        {/* --- New Navigation Cards --- */}
        <div className="dashboard-card">
          <h3>Inbox</h3>
          <p>View messages and candidate communications</p>
          <Link to="/hiring-manager/inbox">
            <button className="purple-btn">Open Inbox</button>
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Open Positions</h3>
          <p>View, filter, and manage current job openings</p>
          <Link to="/hiring-manager/open-positions">
            <button className="purple-btn">View Positions</button>
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>All Candidates</h3>
          <p>Review applicants and their submission history</p>
          <Link to="/hiring-manager/candidates">
            <button className="purple-btn">View Candidates</button>
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Schedule Interviews</h3>
          <p>Plan and organize interviews with candidates</p>
          <Link to="/hiring-manager/schedule">
            <button className="purple-btn">Manage Schedule</button>
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Onboarding</h3>
          <p>Track new hires and their onboarding status</p>
          <Link to="/hiring-manager/onboarding">
            <button className="purple-btn">View Onboarding</button>
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Purchase Orders</h3>
          <p>Generate new POs and view past reports</p>
          <Link to="/hiring-manager/reports">
            <button className="purple-btn">View POs</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HiringManagerDashboard;