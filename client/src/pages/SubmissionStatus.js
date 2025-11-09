// client/src/pages/SubmissionStatus.js
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import './SubmissionStatus.css';

const SubmissionStatus = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSubmissions = async () => {
            setLoading(true);
            try {
                // This endpoint needs to exist on your backend, 
                // e.g., GET /api/recruiter/submissions
                // For now, we'll use the generic /api/submissions
                // and assume the backend filters by req.user.id
                const response = await api.get('/api/submissions'); 
                
                // Filter on client-side if backend doesn't
                // This is a placeholder. Ideally, backend should filter.
                // const recruiterId = "YOUR_LOGGED_IN_RECRUITER_ID"; 
                // setSubmissions(response.data.filter(s => s.submittedBy === recruiterId));
                
                setSubmissions(response.data);

            } catch (err) {
                console.error("Error fetching submissions:", err);
                setError('Failed to load submission data.');
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, []);

    const getStatusClassName = (status) => {
        return (status || 'submitted').toLowerCase().replace(' ', '-');
    };
    
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString("en-US", {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    return (
        <div className="submission-status-page">
            <div className="status-container">
                <h1>Submission Status</h1>
                <p>Track the progress of your candidates through the hiring pipeline.</p>

                {loading && <p className="loading-text">Loading submissions...</p>}
                {error && <p className="error-text">{error}</p>}
                
                {!loading && !error && submissions.length === 0 && (
                    <p className="empty-text">You have not submitted any candidates yet.</p>
                )}

                {!loading && !error && submissions.length > 0 && (
                    <div className="status-table-container">
                        <table className="status-table">
                            <thead>
                                <tr>
                                    <th>Candidate</th>
                                    <th>Position</th>
                                    <th>Submitted On</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map(sub => (
                                    <tr key={sub._id}>
                                        <td>{sub.candidate?.name || sub.candidate?.firstName || 'N/A'}</td>
                                        <td>{sub.position?.title || 'N/A'}</td>
                                        <td>{formatDate(sub.createdAt)}</td>
                                        <td>
                                            <span className={`status-badge ${getStatusClassName(sub.status)}`}>
                                                {sub.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubmissionStatus;