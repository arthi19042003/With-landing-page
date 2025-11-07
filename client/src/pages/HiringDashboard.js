import React, { useState, useEffect } from "react";
import "./HiringDashboard.css";

const HiringDashboard = () => {
  const [filter, setFilter] = useState("");
  const [stats, setStats] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // === Fetch dashboard data ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, submissionsRes] = await Promise.all([
          fetch("http://localhost:5000/api/dashboard/summary", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
          fetch("http://localhost:5000/api/dashboard/submissions", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
        ]);


        const summary = await summaryRes.json();
        const subs = await submissionsRes.json();

        setStats([
          { title: "Total Submissions", value: summary.total || 0 },
          { title: "Shortlisted", value: summary.shortlisted || 0 },
          { title: "Hired", value: summary.hired || 0 },
        ]);
        setSubmissions(subs.data || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = submissions.filter((s) =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(filter.toLowerCase()) ||
    (s.position || "").toLowerCase().includes(filter.toLowerCase()) ||
    (s.status || "").toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <div className="hiring-dashboard"><p>Loading dashboard...</p></div>;

  return (
    <div className="hiring-dashboard">
      <h2>Hiring Manager Dashboard</h2>

      {/* === Stats Section === */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <h3>{stat.value}</h3>
            <p>{stat.title}</p>
          </div>
        ))}
      </div>

      {/* === Filter/Search === */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search candidate, position, or status..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* === Recent Submissions Table === */}
      <div className="recent-submissions">
        <h3>Recent Candidate Submissions</h3>
        <table>
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Position</th>
              <th>Status</th>
              <th>Date Submitted</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={i}>
                <td>{row.firstName} {row.lastName}</td>
                <td>{row.position || "-"}</td>
                <td className={`status ${row.status?.toLowerCase().replace(" ", "-")}`}>
                  {row.status}
                </td>
                <td>{new Date(row.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "10px" }}>
                  No candidates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HiringDashboard;
