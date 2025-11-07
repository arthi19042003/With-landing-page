// client/src/pages/PurchaseOrders.js
import React, { useState, useEffect } from "react";
import api from "../api/axios"; // Import configured axios
import "./PurchaseOrders.css";

const PurchaseOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get("/po"); // Fetch from API endpoint
        setOrders(response.data);
      } catch (err) {
          console.error("Error fetching purchase orders:", err);
          setError("Failed to load purchase orders. Please try again later.");
          setOrders([]); // Clear data on error
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Function to handle updating status via API
  const updateOrderStatus = async (id, newStatus) => {
    const originalOrders = [...orders]; // Store original for revert
    // Optimistic UI update
    setOrders(
      orders.map((order) =>
        order._id === id ? { ...order, status: newStatus } : order
      )
    );
    setError(''); // Clear previous errors

    try {
      // Make API call to update status
      await api.put(`/po/${id}/status`, { status: newStatus });
      console.log(`Order ${id} status updated to ${newStatus}.`);
      // No need to setOrders again if API call is successful
    } catch (err) {
      console.error(`Error updating order ${id} status to ${newStatus}:`, err);
      setError(`Failed to update order ${id}. Please try again.`);
      setOrders(originalOrders); // Revert UI on API error
    }
  };


  // --- Helper function to format date ---
   const formatDate = (dateString) => {
     if (!dateString) return 'N/A';
     // Handles the "YYYY-MM-DD" string format from the seed
     try {
       // Split the string and create a Date object correctly
       const parts = dateString.split('-');
       if (parts.length === 3) {
           const date = new Date(parts[0], parts[1] - 1, parts[2]); // Month is 0-indexed
           return date.toLocaleDateString("en-US", {
              year: 'numeric', month: 'short', day: 'numeric'
           });
       }
       return dateString; // Fallback if format is unexpected
     } catch (e) {
       console.error("Invalid date format:", dateString, e);
       return 'Invalid Date';
     }
   };


  if (loading) {
    return <div className="po-container"><p className="loading">Loading purchase orders...</p></div>;
  }

  // Error is displayed below the title

  return (
    <div className="po-container">
      <h2>Purchase Orders</h2>
      {error && !loading && <p className="error">{error}</p>}

      <div className="po-card">
        <table className="po-table">
          <thead>
            <tr>
              <th>PO ID</th>
              <th>Vendor</th>
              <th>Amount ($)</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && !loading && !error ? (
                <tr><td colSpan="6" className="empty">No purchase orders found.</td></tr>
            ) : (
                orders.map((order) => (
                // Use _id from MongoDB as key
                <tr key={order._id}>
                    {/* Use fields from PurchaseOrder model */}
                    <td>{order.poId}</td>
                    <td>{order.vendor || 'N/A'}</td>
                    {/* Format amount */}
                    <td>{order.amount != null ? order.amount.toLocaleString() : 'N/A'}</td>
                    {/* Format date */}
                    <td>{formatDate(order.date)}</td>
                    <td>
                    <span className={`status ${order.status?.toLowerCase() || 'pending'}`}>
                        {order.status || 'Pending'}
                    </span>
                    </td>
                    <td>
                      {/* Show buttons only if status is Pending */}
                    {order.status === "Pending" ? (
                        <>
                        <button
                            className="approve-btn"
                            onClick={() => updateOrderStatus(order._id, "Approved")}
                        >
                            Approve
                        </button>
                        <button
                            className="reject-btn"
                            onClick={() => updateOrderStatus(order._id, "Rejected")}
                        >
                            Reject
                        </button>
                        </>
                    ) : (
                        <span className="no-action">—</span> // Show dash if not pending
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

export default PurchaseOrders;