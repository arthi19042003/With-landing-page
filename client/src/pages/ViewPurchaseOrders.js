// client/src/pages/ViewPurchaseOrders.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Use AuthContext

export default function ViewPurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = useAuth(); // ✅ Get token from context

  // ✅ Fetch POs from backend
  const fetchPOs = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/purchase-orders", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Use context token
        },
      });
      if (!res.ok) throw new Error("Failed to fetch purchase orders");
      const result = await res.json();
      setPurchaseOrders(result);
    } catch (err) {
      console.error("Error fetching POs:", err);
      // Optional: remove alert to prevent spamming if fetch fails on load
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update PO status
  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/purchase-orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      await fetchPOs();
    } catch (err) {
      console.error("Error updating PO status:", err);
      alert("❌ Failed to update status");
    }
  };

  // ✅ Download PO (Placeholder)
  const downloadPO = (po) => {
    alert(`🧾 Download feature for ${po.poNumber} coming soon!`);
  };

  useEffect(() => {
    fetchPOs();
    // eslint-disable-next-line
  }, [token]);

  if (loading)
    return <p className="text-center mt-8 text-lg">Loading purchase orders...</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-secondary">🧾 View Purchase Orders</h2>
        <button
          onClick={() => navigate("/hiring-manager/create-po")}
          className="btn btn-primary"
        >
          ➕ Create New PO
        </button>
      </div>

      {purchaseOrders.length === 0 ? (
        <p className="text-muted">No purchase orders found.</p>
      ) : (
        <div className="table-responsive shadow-sm rounded bg-white">
          <table className="table table-hover border mb-0">
            <thead className="bg-light">
              <tr>
                <th className="p-3">PO Number</th>
                <th className="p-3">Candidate</th>
                <th className="p-3">Position</th>
                <th className="p-3">Department</th>
                <th className="p-3">Rate ($/hr)</th>
                <th className="p-3">Start Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.map((po) => (
                <tr key={po._id}>
                  <td className="p-3">{po.poNumber}</td>
                  <td className="p-3">{po.candidateName}</td>
                  <td className="p-3">{po.positionTitle || po.position}</td>
                  <td className="p-3">{po.department}</td>
                  <td className="p-3">{po.rate}</td>
                  <td className="p-3">
                    {po.startDate ? new Date(po.startDate).toLocaleDateString() : "-"}
                  </td>
                  <td className="p-3">
                    <span className={`badge ${po.status === "Approved" ? "bg-success" : "bg-warning text-dark"}`}>
                        {po.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="d-flex gap-2 justify-content-center">
                        {po.status !== "Approved" && (
                        <button
                            onClick={() => updateStatus(po._id, "Approved")}
                            className="btn btn-sm btn-success"
                        >
                            ✅ Approve
                        </button>
                        )}
                        <button
                        onClick={() => downloadPO(po)}
                        className="btn btn-sm btn-outline-primary"
                        >
                        ⬇️ Download
                        </button>
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