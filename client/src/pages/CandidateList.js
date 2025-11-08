// client/src/pages/CandidateList.js
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import api from "../api/axios";
import "./CandidateList.css"; 

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");

  const fetchCandidates = async () => {
    // ... (existing code)
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/candidates");
      setCandidates(response.data);
    } catch (err) {
      console.error("Error fetching candidates:", err);
      setError("Failed to load candidates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    // ... (existing code)
    try {
      const response = await api.put(`/candidates/${id}/status`, { status: newStatus });
      setCandidates(prev => 
        prev.map(c => (c._id === id ? response.data.candidate : c))
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  // ✅ NEW: Handle Resume Download
  const handleResumeDownload = async (candidateId, fileName) => {
    try {
      const response = await api.get(`/candidates/resume/${candidateId}`, {
        responseType: 'blob', // Important for file downloads
      });
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'resume.pdf'); // Use original name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading resume:", err);
      setError("Failed to download resume. It may not exist.");
    }
  };

  const filteredCandidates = candidates.filter(c => {
    // ... (existing code)
    const fullName = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();
    const email = (c.email || '').toLowerCase();
    const position = (c.position || '').toLowerCase();
    const search = filter.toLowerCase();
    return fullName.includes(search) || email.includes(search) || position.includes(search);
  });

  // ... (loading/error renders)
  if (loading) {
    return <div className="candidates-container"><p className="empty">Loading candidates...</p></div>;
  }

  if (error) {
    return <div className="candidates-container"><p className="error">{error}</p></div>;
  }

  return (
    <div className="candidates-container">
      <h2>All Candidates</h2>
      <p className="subtitle">Review, shortlist, or reject candidates in the pipeline</p>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by name, email, or position..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="table-wrapper">
        <table className="candidates-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email & Phone</th>
              <th>Position</th>
              <th>Status</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty">No candidates found.</td>
              </tr>
            ) : (
              filteredCandidates.map((c) => (
                <tr key={c._id}>
                  <td>
                    <Link to={`/hiring-manager/candidate/${c._id}`} className="candidate-link">
                      {c.firstName} {c.lastName}
                    </Link>
                  </td>
                  <td>
                    <div>{c.email}</div>
                    <div className="phone">{c.phone}</div>
                  </td>
                  <td>{c.position}</td>
                  <td>
                    <span className={`status-badge ${c.status?.toLowerCase().replace(" ", "-")}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="actions">
                    {/* ✅ NEW: View Resume Button */}
                    {c.resumePath && (
                      <button 
                        className="btn view"
                        onClick={() => handleResumeDownload(c._id, c.resumeOriginalName)}
                      >
                        Resume
                      </button>
                    )}
                    {c.status !== "Shortlisted" && (
                      <button 
                        className="btn shortlist"
                        onClick={() => handleStatusChange(c._id, "Shortlisted")}
                      >
                        Shortlist
                      </button>
                    )}
                    {c.status !== "Rejected" && (
                      <button 
                        className="btn reject"
                        onClick={() => handleStatusChange(c._id, "Rejected")}
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CandidateList;