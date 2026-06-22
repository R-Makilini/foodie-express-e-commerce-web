import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaClipboardList, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import API from "../../utils/api";
import "./UserPages.css";

const statusConfig = {
  pending: { icon: <FaClock />, label: "Pending", color: "#f39c12" },
  accepted: { icon: <FaCheckCircle />, label: "Accepted", color: "#27ae60" },
  rejected: { icon: <FaTimesCircle />, label: "Rejected", color: "#e74c3c" },
};

const MyOrders = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/requests/my");
      setRequests(res.data.requests);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-screen">Loading orders...</div>;

  return (
    <div className="user-page">
      <h1><FaClipboardList /> My Orders</h1>
      {requests.length === 0 ? (
        <div className="empty-state">
          <p>📋 No orders yet. Place your first order!</p>
        </div>
      ) : (
        <div className="orders-list">
          {requests.map((req) => {
            const status = statusConfig[req.status];
            return (
              <div key={req._id} className="order-card">
                <div className="order-header">
                  <div>
                    <span className="order-id">Order #{req._id.slice(-8).toUpperCase()}</span>
                    <span className="order-date">{new Date(req.createdAt).toLocaleDateString("en-LK", { year: "numeric", month: "short", day: "numeric" })}</span>
                  </div>
                  <span className="order-status" style={{ color: status.color, borderColor: status.color }}>
                    {status.icon} {status.label}
                  </span>
                </div>
                <div className="order-items">
                  {req.items.map((item, i) => (
                    <div key={i} className="order-item">
                      <img src={item.product?.image} alt={item.product?.name} className="order-item-img" />
                      <span>{item.product?.name}</span>
                      <span>x{item.quantity}</span>
                      <span>Rs. {item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="order-footer">
                  <span>📍 {req.deliveryAddress}</span>
                  <span className="order-total">Total: Rs. {req.totalAmount}</span>
                </div>
                {req.adminNote && (
                  <div className="admin-note">
                    <strong>Admin Note:</strong> {req.adminNote}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
