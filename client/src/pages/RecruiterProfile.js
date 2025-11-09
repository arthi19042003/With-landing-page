// client/src/pages/RecruiterProfile.js
import React from 'react';
import { Link } from 'react-router-dom';
import './RecruiterProfile.css';

const RecruiterProfile = () => {
    // This component now acts as a hub
    return (
        <div className="profile-hub-container">
            <h1>Recruiter Profile Hub</h1>
            <p>Choose an action for your recruiter profile.</p>
            <div className="profile-hub-actions">
                <Link to="/recruiter/profile/view" className="hub-card view">
                    <h3>View Profile</h3>
                    <p>See how your profile appears to employers.</p>
                </Link>
                <Link to="/recruiter/profile/edit" className="hub-card edit">
                    <h3>Edit Profile</h3>
                    <p>Update your agency details, skills, and rates.</p>
                </Link>
            </div>
        </div>
    );
};

export default RecruiterProfile;