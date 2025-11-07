// client/src/pages/Positions.js
import React, { useEffect, useState } from "react";
import api from '../api/axios'; // Import the configured axios instance
import "./Positions.css";

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPositions = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get("/positions"); // Fetch from API
        setPositions(response.data);
      } catch (err) {
        console.error("Error fetching positions:", err);
        setError("Failed to load positions. Please try again later.");
        setPositions([]); // Clear data on error
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []); // Empty dependency array means this runs once on mount

  // --- Helper function to get status class ---
  const getStatusClass = (status) => {
    if (!status) return 'open'; // Default to open if status is missing
    return status.toLowerCase() === 'closed' ? 'closed' : 'open';
  };

  if (loading) {
    return <div className="positions-container"><p className="empty">Loading positions...</p></div>;
  }

  if (error) {
     return <div className="positions-container"><p className="error">{error}</p></div>; // Display error message
  }

  return (
    <div className="positions-container">
      <h2>Open Positions</h2>
      <p className="subtitle">Manage and view your organization’s job openings</p>

      {positions.length === 0 ? (
        <p className="empty">No positions found.</p>
      ) : (
        <div className="positions-grid">
          {positions.map((pos) => (
            // Use _id from MongoDB as key
            <div
              key={pos._id}
              className={`position-card ${getStatusClass(pos.status)}`}
            >
              <div className="card-header">
                {/* Use title from API data */}
                <h3>{pos.title || 'Untitled Position'}</h3>
                {/* Use status from API data */}
                <span
                  className={`status-tag ${
                    getStatusClass(pos.status) === "open" ? "status-open" : "status-closed"
                  }`}
                >
                  {/* Display status, default to 'Open' */}
                  {pos.status || 'Open'}
                </span>
              </div>
              {/* Use fields from the Position model */}
              <p>
                <strong>Department:</strong> {pos.department || 'N/A'}
              </p>
              <p>
                <strong>Project:</strong> {pos.project || 'N/A'}
              </p>
              <p>
                <strong>Skills:</strong>
                {/* Check if skills array exists and join, otherwise show N/A */}
                {Array.isArray(pos.skills) && pos.skills.length > 0
                  ? pos.skills.join(", ")
                  : 'N/A'}
              </p>
               {/* Display description if available */}
               {pos.description && <p><strong>Description:</strong> {pos.description}</p>}
               {/* Openings field is not in the Position model, so removed */}
               {/* <p><strong>Openings:</strong> {pos.openings}</p> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Positions;