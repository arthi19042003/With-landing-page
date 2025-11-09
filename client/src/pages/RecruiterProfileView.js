// client/src/pages/RecruiterProfileView.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import './RecruiterProfileView.css';

const RecruiterProfileView = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user?.profile) {
                // Use profile from context if available
                setProfile(user.profile);
                setLoading(false);
            } else if (user) {
                // Fetch profile if not in context
                try {
                    const response = await api.get('/profile');
                    setProfile(response.data.user.profile);
                } catch (error) {
                    console.error("Error fetching profile", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    if (loading) {
        return <div className="profile-view-page"><p>Loading profile...</p></div>;
    }

    if (!profile) {
        return (
            <div className="profile-view-page">
                <h2>Profile Not Found</h2>
                <p>You haven't set up your recruiter profile yet.</p>
                <Link to="/recruiter/profile/edit" className="profile-btn edit-btn">
                    Create Profile
                </Link>
            </div>
        );
    }

    const {
        agencyName,
        firstName,
        lastName,
        phone,
        companyWebsite,
        companyPhone,
        companyAddress,
        companyLocation,
        dunsNumber,
        employeeCount,
        rateCard,
        majorSkills = [],
        partnerships = [],
        companyCertifications = []
    } = profile;

    return (
        <div className="profile-view-page">
            <div className="profile-view-container">
                <div className="profile-view-header">
                    <h1>{agencyName || `${firstName} ${lastName}`}</h1>
                    <p>{companyLocation || 'Location not set'}</p>
                    <Link to="/recruiter/profile/edit" className="profile-btn edit-btn">
                        Edit Profile
                    </Link>
                </div>

                <div className="profile-view-grid">
                    {/* Column 1: Contact & Details */}
                    <div className="profile-view-card">
                        <h2>Agency Details</h2>
                        <ul className="details-list">
                            <li>
                                <strong>Contact:</strong>
                                <span>{firstName} {lastName}</span>
                            </li>
                            <li>
                                <strong>Email:</strong>
                                <span>{user.email}</span>
                            </li>
                            <li>
                                <strong>Phone:</strong>
                                <span>{phone || companyPhone || 'N/A'}</span>
                            </li>
                            <li>
                                <strong>Website:</strong>
                                <span>
                                    {companyWebsite ? 
                                        <a href={companyWebsite} target="_blank" rel="noopener noreferrer">{companyWebsite}</a> 
                                        : 'N/A'}
                                </span>
                            </li>
                             <li>
                                <strong>Address:</strong>
                                <span>{companyAddress || 'N/A'}</span>
                            </li>
                            <li>
                                <strong>DUNS:</strong>
                                <span>{dunsNumber || 'N/A'}</span>
                            </li>
                             <li>
                                <strong>Employees:</strong>
                                <span>{employeeCount || 'N/A'}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Column 2: Specialties & Rate Card */}
                    <div className="profile-view-card">
                        <h2>Specialties</h2>
                        <h3 className="list-title">Major Skill Areas</h3>
                        <div className="tag-list">
                            {majorSkills.length > 0 ? 
                                majorSkills.map(skill => <span key={skill} className="tag">{skill}</span>) 
                                : <p>No skills listed.</p>}
                        </div>

                        <h3 className="list-title">Partnerships</h3>
                        <div className="tag-list">
                             {partnerships.length > 0 ? 
                                partnerships.map(p => <span key={p} className="tag partner">{p}</span>) 
                                : <p>No partnerships listed.</p>}
                        </div>

                         <h3 className="list-title">Certifications</h3>
                        <div className="tag-list">
                             {companyCertifications.length > 0 ? 
                                companyCertifications.map(c => <span key={c} className="tag cert">{c}</span>) 
                                : <p>No certifications listed.</p>}
                        </div>
                    </div>
                </div>

                <div className="profile-view-card rate-card">
                    <h2>Rate Card</h2>
                    <pre>{rateCard || 'No rate card details provided.'}</pre>
                </div>

            </div>
        </div>
    );
};

export default RecruiterProfileView;