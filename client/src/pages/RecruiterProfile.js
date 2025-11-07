// client/src/pages/RecruiterProfile.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './Profile.css'; // Reuse candidate profile CSS

const RecruiterProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    address: '',
    majorSkills: [], // e.g., ['Development', 'Testing']
    partnerships: [], // e.g., ['Microsoft', 'AWS']
    companyWebsite: '',
    companyPhone: '',
    companyAddress: '',
    companyLocation: '',
    companyCertifications: [], // e.g., ['Women Owned']
    dunsNumber: '',
    employeeCount: '',
    // Rate Card (simplified as a string for this example)
    rateCard: '', 
  });

  const [skillInput, setSkillInput] = useState("");
  const [partnerInput, setPartnerInput] = useState("");
  const [certInput, setCertInput] = useState("");

  useEffect(() => {
    // Load existing profile data
    if (user?.profile) {
      setFormData(prev => ({ ...prev, ...user.profile }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddItem = (listName, setListName, input, setInput) => {
    if (input.trim() && !formData[listName].includes(input.trim())) {
      setFormData({
        ...formData,
        [listName]: [...formData[listName], input.trim()],
      });
      setInput("");
    }
  };

  const handleRemoveItem = (listName, itemToRemove) => {
    setFormData({
      ...formData,
      [listName]: formData[listName].filter((item) => item !== itemToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Use the general /api/profile route
      const response = await api.put("/profile", formData); 

      updateUser(response.data.user); // Update context
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page-bg">
      <div className="profile-container">
        <h1>Recruiter Profile</h1>

        <form onSubmit={handleSubmit}>
          {/* Company Info */}
          <div className="card">
            <h2>Agency / Company Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Company Website</label>
                <input type="text" name="companyWebsite" value={formData.companyWebsite || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Company Phone</label>
                <input type="tel" name="companyPhone" value={formData.companyPhone || ''} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label>Company Address</label>
              <input type="text" name="companyAddress" value={formData.companyAddress || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Company Location (City, State)</label>
              <input type="text" name="companyLocation" value={formData.companyLocation || ''} onChange={handleChange} />
            </div>
            <div className="form-row">
               <div className="form-group">
                <label>D-U-N-S® Number</label>
                <input type="text" name="dunsNumber" value={formData.dunsNumber || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Number of Employees</label>
                <input type="number" name="employeeCount" value={formData.employeeCount || ''} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Skills & Certifications */}
          <div className="card">
            <h2>Specialties & Certifications</h2>
            
            {/* Major Skills */}
            <div className="form-group">
              <label>Major Skills Area (e.g., Development, Testing)</label>
              <div className="skills-input">
                <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Add a skill area"/>
                <button type="button" onClick={() => handleAddItem('majorSkills', setFormData, skillInput, setSkillInput)} className="add-skill-btn">Add</button>
              </div>
              <div className="skills-list">
                {formData.majorSkills && formData.majorSkills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}
                    <button type="button" onClick={() => handleRemoveItem('majorSkills', skill)} className="skill-remove">×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Partnerships */}
            <div className="form-group">
              <label>Partnerships (e.g., Microsoft, AWS)</label>
              <div className="skills-input">
                <input type="text" value={partnerInput} onChange={(e) => setPartnerInput(e.target.value)} placeholder="Add a partner"/>
                <button type="button" onClick={() => handleAddItem('partnerships', setFormData, partnerInput, setPartnerInput)} className="add-skill-btn">Add</button>
              </div>
              <div className="skills-list">
                {formData.partnerships && formData.partnerships.map((item, index) => (
                  <span key={index} className="skill-tag">{item}
                    <button type="button" onClick={() => handleRemoveItem('partnerships', item)} className="skill-remove">×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="form-group">
              <label>Company Certifications (e.g., Women Owned)</label>
              <div className="skills-input">
                <input type="text" value={certInput} onChange={(e) => setCertInput(e.target.value)} placeholder="Add a certification"/>
                <button type="button" onClick={() => handleAddItem('companyCertifications', setFormData, certInput, setCertInput)} className="add-skill-btn">Add</button>
              </div>
              <div className="skills-list">
                {formData.companyCertifications && formData.companyCertifications.map((item, index) => (
                  <span key={index} className="skill-tag">{item}
                    <button type="button" onClick={() => handleRemoveItem('companyCertifications', item)} className="skill-remove">×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Rate Card */}
          <div className="card">
            <h2>Rate Card</h2>
            <div className="form-group">
              <label>Rate Card Details</label>
              <textarea
                name="rateCard"
                value={formData.rateCard || ''}
                onChange={handleChange}
                placeholder="List your rates for different roles, e.g., Sr. Developer: $100/hr, Architect: $120/hr..."
                rows="8"
              />
            </div>
          </div>

          {message.text && (
            <div className={message.type === "success" ? "success" : "error"}>
              {message.text}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save Recruiter Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecruiterProfile;