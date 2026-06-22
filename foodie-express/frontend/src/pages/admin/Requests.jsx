import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaClipboardList, FaCheckCircle, FaTimesCircle, FaClock, FaEye, FaTimes } from "react-icons/fa";
import API from "../../utils/api";
import "./AdminPages.css";

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedReq, setSelectedReq] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => { fetchRequests(); }, [filterStatus]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await API.get("/requests/all", {
        params: { status: filterStatus, limit: 50 },
      });
      setRequests(res.data.requests);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (reqId, status) => {
    setUpdating(true);
    try {
      await API.put(`/requests/${reqId}/status`, { status, adminNote });
      toast.success(`Order ${status} successfully! Email sent to customer.`);
      setSelectedReq(null);
      setAdminNote("");
      fetchRequests();
    } catch (err) {
      toast.error("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  const statusColors = { pending: "#f39c12", accepted: "#27ae60", rejected: "#e74c3c" };
  const statusIcons = {
    pending: <FaClock />,
    accepted: <FaCheckCircle />,
    rejected: <FaTimesCircle />,
  };

  if (loading) return <div className="loading-screen">Loading orders...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1><FaClipboardList /> Manage Orders</h1>
        <div className="status-filter-tabs">
          {["all", "pending", "accepted", "rejected"].map((s) => (
            <button
              key={s}
              className={`tab-btn ${filterStatus === s ? "active" : ""}`}
              onClick={() => setFilterStatus(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr><td colSpan="7" className="no-data">No orders found</td></tr>
            ) : (
              requests.map((req) => (
                <tr key={req._id}>
                  <td className="order-id-cell">#{req._id.slice(-8).toUpperCase()}</td>
                  <td>
                    <div className="customer-info">
                      <span className="customer-name">{req.user?.name}</span>
                      <span className="customer-email">{req.user?.email}</span>
                    </div>
                  </td>
                  <td>{req.items.length} item(s)</td>
                  <td className="price-cell">Rs. {req.totalAmount}</td>
                  <td>{new Date(req.createdAt).toLocaleDateString("en-LK")}</td>
                  <td>
                    <span className="status-badge-colored" style={{ color: statusColors[req.status], borderColor: statusColors[req.status] }}>
                      {statusIcons[req.status]} {req.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-view-req" onClick={() => { setSelectedReq(req); setAdminNote(req.adminNote || ""); }}>
                      <FaEye /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedReq && (
        <div className="modal-overlay" onClick={() => setSelectedReq(null)}>
          <div className="modal-box modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order #{selectedReq._id.slice(-8).toUpperCase()}</h2>
              <button className="modal-close" onClick={() => setSelectedReq(null)}><FaTimes /></button>
            </div>

            <div className="order-detail-body">
              <div className="order-detail-customer">
                <h4>Customer Info</h4>
                <p><strong>Name:</strong> {selectedReq.user?.name}</p>
                <p><strong>Email:</strong> {selectedReq.user?.email}</p>
                <p><strong>Phone:</strong> {selectedReq.user?.phone}</p>
                <p><strong>Address:</strong> {selectedReq.deliveryAddress}</p>
                <p><strong>Ordered:</strong> {new Date(selectedReq.createdAt).toLocaleString("en-LK")}</p>
              </div>

              <div className="order-detail-items">
                <h4>Order Items</h4>
                {selectedReq.items.map((item, i) => (
                  <div key={i} className="detail-order-item">
                    <img src={item.product?.image} alt={item.product?.name} className="detail-item-img" />
                    <span className="detail-item-name">{item.product?.name}</span>
                    <span>x{item.quantity}</span>
                    <span className="detail-item-price">Rs. {item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="detail-total">
                  <strong>Total Amount: Rs. {selectedReq.totalAmount}</strong>
                </div>
              </div>

              {selectedReq.status === "pending" && (
                <div className="order-action-section">
                  <h4>Admin Note (optional)</h4>
                  <textarea
                    rows="3"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Add a note for the customer (sent via email)..."
                    className="admin-note-input"
                  />
                  <div className="order-decision-btns">
                    <button
                      className="btn-accept"
                      onClick={() => handleUpdateStatus(selectedReq._id, "accepted")}
                      disabled={updating}
                    >
                      <FaCheckCircle /> {updating ? "Processing..." : "Accept Order"}
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => handleUpdateStatus(selectedReq._id, "rejected")}
                      disabled={updating}
                    >
                      <FaTimesCircle /> {updating ? "Processing..." : "Reject Order"}
                    </button>
                  </div>
                </div>
              )}
              {selectedReq.status !== "pending" && (
                <div className="status-info-box" style={{ borderColor: statusColors[selectedReq.status] }}>
                  <p>This order has been <strong>{selectedReq.status}</strong>.</p>
                  {selectedReq.adminNote && <p>Note: {selectedReq.adminNote}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRequests;
