// client/src/pages/OpenPositions.js
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
// ✅ Import AuthContext from your existing project structure
import { useAuth } from "../context/AuthContext"; 

export default function OpenPositions() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: "", location: "", openings: 1, requiredSkills: "" });
  
  // ✅ Use the token from your existing AuthContext
  const { token } = useAuth(); 

  // ✅ Fetch all positions
  const fetchPositions = async () => {
    if (!token) return; 
    try {
      setLoading(true);
      const res = await fetch("/api/positions", {
        // ✅ Use token in Authorization header
        headers: { Authorization: `Bearer ${token}` }, 
      });
      if (!res.ok) throw new Error("Failed to load positions");
      const data = await res.json();
      setPositions(data);
    } catch (err) {
      console.error("Error fetching positions:", err);
      toast.error("Failed to load positions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
    // eslint-disable-next-line
  }, [token]); 

  // ✅ Handle save edit
  const handleSave = async (id) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/positions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify(editData),
      });

      if (!res.ok) throw new Error("Failed to update position");

      toast.success("Position updated successfully!");
      setEditingId(null);
      fetchPositions();
    } catch (err) {
      console.error(err);
      toast.error("Error updating position");
    }
  };

  // ✅ Close position
  const handleClose = async (id) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/positions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ status: "Closed" }),
      });
      if (!res.ok) throw new Error("Failed to close position");
      toast.success("Position closed!");
      fetchPositions();
    } catch (err) {
      console.error(err);
      toast.error("Error closing position");
    }
  };

  // ✅ Delete position
  const handleDelete = async (id) => {
    if (!token) return;
    if (!window.confirm("Are you sure you want to delete this position?")) return;
    try {
      const res = await fetch(`/api/positions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      if (!res.ok) throw new Error("Failed to delete position");
      toast.success("Position deleted");
      fetchPositions();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting position");
    }
  };
  
  // ✅ Handle edit button click
  const handleEdit = (position) => {
    setEditingId(position._id);
    setEditData({
      title: position.title,
      location: position.location,
      openings: position.openings,
      // ✅ Handle array or string for skills to avoid crashes
      requiredSkills: Array.isArray(position.requiredSkills) ? position.requiredSkills.join(", ") : (position.requiredSkills || ""),
    });
  };

  if (loading) return <p className="text-center mt-8 text-lg">Loading positions...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Open Positions</h2>

      {positions.length === 0 ? (
        <p className="text-center text-gray-600">No open positions yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover shadow-sm bg-white rounded">
            <thead className="table-light">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Location</th>
                <th className="p-3">Required Skills</th>
                <th className="p-3">Openings</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((pos) => (
                <tr key={pos._id}>
                  <td className="p-3">
                    {editingId === pos._id ? (
                      <input
                        type="text"
                        value={editData.title}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        className="form-control"
                      />
                    ) : (
                      pos.title
                    )}
                  </td>
                  <td className="p-3">
                    {editingId === pos._id ? (
                      <input
                        type="text"
                        value={editData.location}
                        onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                        className="form-control"
                      />
                    ) : (
                      pos.location
                    )}
                  </td>
                  <td className="p-3">
                    {editingId === pos._id ? (
                      <input
                        type="text"
                        value={editData.requiredSkills}
                        onChange={(e) => setEditData({ ...editData, requiredSkills: e.target.value })}
                        className="form-control"
                      />
                    ) : (
                      Array.isArray(pos.requiredSkills) ? pos.requiredSkills.join(", ") : pos.requiredSkills
                    )}
                  </td>
                  <td className="p-3">
                    {editingId === pos._id ? (
                      <input
                        type="number"
                        value={editData.openings}
                        onChange={(e) => setEditData({ ...editData, openings: e.target.value })}
                        className="form-control"
                        style={{ width: "80px" }}
                      />
                    ) : (
                      pos.openings
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`badge ${pos.status === 'Open' ? 'bg-success' : 'bg-secondary'}`}>
                      {pos.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="d-flex gap-2">
                      {editingId === pos._id ? (
                        <>
                          <button
                            onClick={() => handleSave(pos._id)}
                            className="btn btn-sm btn-success"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="btn btn-sm btn-secondary"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(pos)}
                            className="btn btn-sm btn-primary"
                          >
                            Edit
                          </button>
                          {pos.status === "Open" && (
                            <button
                              onClick={() => handleClose(pos._id)}
                              className="btn btn-sm btn-warning text-white"
                            >
                              Close
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(pos._id)}
                            className="btn btn-sm btn-danger"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}