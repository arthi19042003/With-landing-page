// client/src/pages/SubmitCandidate.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Profile.css'; // Reuse profile styling

const SubmitCandidate = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    rate: '',
    currentLocation: '',
    availability: '',
    skypeId: '',
    githubProfile: '',
    linkedinProfile: '',
    positionId: '',
    hiringManagerId: '',
  });
  
  const [positions, setPositions] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  // Fetch positions and managers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [posRes, mgrRes] = await Promise.all([
          api.get('/positions'),
          api.get('/recruiter/managers')
        ]);
        setPositions(posRes.data || []);
        setManagers(mgrRes.data || []);
      } catch (error) {
        setMessage({ type: 'error', text: 'Could not load positions or managers.' });
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (!formData.positionId || !formData.hiringManagerId) {
        setMessage({ type: 'error', text: 'Please select a position and a hiring manager.' });
        setLoading(false);
        return;
    }

    try {
      await api.post('/recruiter/submit', formData);
      
      setMessage({ type: 'success', text: 'Candidate submitted successfully!' });
      setTimeout(() => {
        navigate('/dashboard'); // Or a "submissions history" page
      }, 1500);

    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to submit candidate',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page-bg">
      <div className="profile-container" style={{maxWidth: "900px"}}>
        <h1>Submit New Candidate</h1>
        <p>Submit a candidate for an open position.</p>

        <form onSubmit={handleSubmit}>
          <div className="card">
            <h2>Candidate Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
              </div>
            </div>
             <div className="form-row">
              <div className="form-group">
                <label>Current Location</label>
                <input type="text" name="currentLocation" value={formData.currentLocation} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Availability</label>
                <input type="text" name="availability" value={formData.availability} onChange={handleChange} placeholder="e.g., Immediate, 2 weeks" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Hourly Rate ($)</label>
                <input type="text" name="rate" value={formData.rate} onChange={handleChange} placeholder="e.g., 90/hr" />
              </div>
              <div className="form-group">
                <label>Skype ID</label>
                <input type="text" name="skypeId" value={formData.skypeId} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>LinkedIn Profile</label>
                <input type="text" name="linkedinProfile" value={formData.linkedinProfile} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>GitHub Profile</label>
                <input type="text" name="githubProfile" value={formData.githubProfile} onChange={handleChange} />
              </div>
            </div>
          </div>
          
          <div className="card">
            <h2>Submission Details</h2>
             <div className="form-group">
              <label>Select Position *</label>
              <select name="positionId" value={formData.positionId} onChange={handleChange} required>
                <option value="">-- Select a position --</option>
                {positions.map(pos => (
                  <option key={pos._id} value={pos._id}>{pos.title} ({pos.department})</option>
                ))}
              </select>
            </div>
             <div className="form-group">
              <label>Select Hiring Manager (to notify) *</label>
              <select name="hiringManagerId" value={formData.hiringManagerId} onChange={handleChange} required>
                <option value="">-- Select a manager --</option>
                {managers.map(mgr => (
                  <option key={mgr._id} value={mgr._id}>
                    {mgr.profile.firstName} {mgr.profile.lastName} ({mgr.email})
                  </option>
                ))}
              </select>
            </div>
            <p style={{fontSize: "0.8rem", color: "#666"}}>Note: A resume is not required for this initial submission. You can add it later if the candidate is shortlisted.</p>
          </div>

          {message.text && (
            <div className={`form-message ${message.type === 'success' ? 'success' : 'error'}`}>
              {message.text}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit Candidate"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitCandidate;