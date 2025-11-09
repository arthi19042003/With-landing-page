import React, { useEffect, useState } from "react";
import "./SubmissionStatus.css";
import { Spinner, Alert } from "react-bootstrap";
import api from "../config";

const filterFields = {
  submissionId: "Submission ID",
  candidateName: "Candidate Name",
  email: "Email",
  phone: "Phone",
  hiringManager: "Hiring Manager",
  company: "Company",
};

const initialFilters = Object.keys(filterFields).reduce((acc, key) => {
  acc[key] = "";
  return acc;
}, {});

const SubmissionStatus = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setMessage("");

      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v.trim() !== "")
      );

      const res = await api.get("/resume", { params: activeFilters });

      const sorted = res.data.sort((a, b) => {
        const dateA = a.statusHistory?.[0]?.changedAt || a.submittedAt;
        const dateB = b.statusHistory?.[0]?.changedAt || b.submittedAt;
        return new Date(dateB) - new Date(dateA);
      });

      setSubmissions(sorted);
      setMessage(res.data.length === 0 ? "ℹ️ No submissions found." : "");
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setMessage("❌ Failed to load submissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSubmissions();
  };

  const handleView = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/resume/download/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Failed to open resume");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const newTab = window.open();
      newTab.location.href = url;
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    } catch {
      setMessage("❌ Failed to open resume");
    }
  };

  const handleDownload = async (id, filename) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/resume/download/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || "resume";
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setMessage("❌ Failed to download resume");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/resume/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      setSubmissions(submissions.filter((s) => s._id !== id));
      setMessage("✅ Resume deleted successfully");
    } catch {
      setMessage("❌ Failed to delete resume");
    }
  };

  return (
    <div className="submission-status-page">
      <div className="submission-status-card">
        <h2 className="submission-status-title">My Submissions</h2>

        <form onSubmit={handleSearch} className="submission-status-search">
          {Object.entries(filterFields).map(([key, placeholder]) => (
            <input
              key={key}
              type="text"
              name={key}
              placeholder={placeholder}
              value={filters[key]}
              onChange={handleChange}
              className="submission-status-input"
            />
          ))}
          <button type="submit" className="submission-status-btn">
            Search
          </button>
        </form>

        {loading && (
          <div className="submission-status-loading">
            <Spinner animation="border" variant="dark" /> Loading Submissions...
          </div>
        )}

        {message && (
          <Alert variant={message.startsWith("❌") ? "danger" : "info"}>
            {message}
          </Alert>
        )}

        {submissions.length > 0 && (
          <div className="submission-status-table-wrapper">
            <table className="submission-status-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Company</th>
                  <th>Hiring Manager</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr key={s._id}>
                    <td>{s.candidateName}</td>
                    <td>{s.company}</td>
                    <td>{s.hiringManager}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          s.status?.toLowerCase() || ""
                        }`}
                      >
                        {s.status || "Unknown"}
                      </span>
                    </td>
                    <td className="submission-status-actions">
                      <button
                        className="submission-status-view"
                        onClick={() => handleView(s._id)}
                      >
                        View
                      </button>
                      <button
                        className="submission-status-download"
                        onClick={() => handleDownload(s._id, s.fileName)}
                      >
                        Download
                      </button>
                      <button
                        className="submission-status-delete"
                        onClick={() => handleDelete(s._id)}
                      >
                        Delete
                      </button>
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
