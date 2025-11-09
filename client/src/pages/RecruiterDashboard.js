// client/src/pages/RecruiterDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './RecruiterDashboard.css';

const RecruiterDashboard = () => {
    return (
        <div className="recruiter-dashboard">
            <header className="dashboard-header">
                <h1>Recruiter Dashboard</h1>
                <p>Welcome, Recruiter! Manage your profile and submissions.</p>
            </header>
            
            <div className="dashboard-widgets">
                <Link to="/recruiter/profile/view" className="widget-card profile-card">
                    <h3>View My Profile</h3>
                    <p>See your public-facing agency profile.</p>
                </Link>
                
                <Link to="/recruiter/profile/edit" className="widget-card profile-card-edit">
                    <h3>Update Profile</h3>
                    <p>Keep your agency details and skills up to date.</p>
                </Link>

                <Link to="/recruiter/submit-resume" className="widget-card submit-card">
                    <h3>Submit Resume</h3>
                    <p>Submit a new candidate for an open position.</p>
                </Link>
                
                <Link to="/recruiter/submission-status" className="widget-card status-card">
                    <h3>Submission Status</h3>
                    <p>Track the status of all your submitted candidates.</p>
                </Link>
            </div>
        </div>
    );
};

export default RecruiterDashboard;