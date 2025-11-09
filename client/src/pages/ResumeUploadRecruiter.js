// client/src/pages/ResumeUploadRecruiter.js
import React, { useState } from 'react';
import api from '../api/axios'; // Use your configured axios instance
import './ResumeUploadRecruiter.css';

const ResumeUploadRecruiter = () => {
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        jobTitle: '',
        skills: '',
        experience: '',
        education: '',
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage({ type: 'error', text: 'Please select a resume file to upload.' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        const uploadData = new FormData();
        uploadData.append('resume', file);
        
        // Append all other form data
        Object.keys(formData).forEach(key => {
            uploadData.append(key, formData[key]);
        });

        try {
            // Adjust this endpoint to your actual backend route for resume submission
            // This assumes a new route /recruiter/submit for handling this form
            const response = await api.post('/recruiter/submit', uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            setMessage({ type: 'success', text: response.data.message || 'Resume submitted successfully!' });
            // Clear form
            setFile(null);
            setFormData({
                firstName: '', lastName: '', email: '', phone: '',
                jobTitle: '', skills: '', experience: '', education: '',
            });
            // Clear file input
            document.getElementById('resume-file-input').value = null;

        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Submission failed. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="resume-upload-page">
            <div className="upload-container">
                <h1>Submit Candidate Resume</h1>
                <p>Fill in the candidate details and upload their resume.</p>

                {message.text && (
                    <div className={`message-box ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="upload-form">
                    <div className="form-card">
                        <h2>Candidate Details</h2>
                        <div className="form-row">
                            <div className="form-group">
                                <label>First Name *</label>
                                <input type="text" name="firstName" value={formData.firstName} onChange={handleFormChange} required />
                            </div>
                            <div className="form-group">
                                <label>Last Name *</label>
                                <input type="text" name="lastName" value={formData.lastName} onChange={handleFormChange} required />
                            </div>
                        </div>
                        <div className="form-row">
                             <div className="form-group">
                                <label>Email *</label>
                                <input type="email" name="email" value={formData.email} onChange={handleFormChange} required />
                            </div>
                             <div className="form-group">
                                <label>Phone *</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} required />
                            </div>
                        </div>
                         <div className="form-group">
                            <label>Job Title / Position Applied For *</label>
                            <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleFormChange} required />
                        </div>
                    </div>

                    <div className="form-card">
                        <h2>Resume File</h2>
                         <div className="form-group">
                            <label>Upload Resume (PDF, DOC, DOCX) *</label>
                            <input 
                                id="resume-file-input"
                                type="file" 
                                name="resume" 
                                onChange={handleFileChange} 
                                accept=".pdf,.doc,.docx"
                                required 
                            />
                        </div>
                    </div>
                    
                    <div className="form-card">
                        <h2>Key Information (Optional)</h2>
                        <p>Help parse the resume by providing key details.</p>
                         <div className="form-group">
                            <label>Skills (comma-separated)</label>
                            <input type="text" name="skills" value={formData.skills} onChange={handleFormChange} placeholder="e.g., React, Node.js, Python" />
                        </div>
                        <div className="form-group">
                            <label>Years of Experience</label>
                            <input type="number" name="experience" value={formData.experience} onChange={handleFormChange} placeholder="e.g., 5" />
                        </div>
                         <div className="form-group">
                            <label>Highest Education</label>
                            <input type="text" name="education" value={formData.education} onChange={handleFormChange} placeholder="e.g., B.S. Computer Science" />
                        </div>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Candidate Resume'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResumeUploadRecruiter;