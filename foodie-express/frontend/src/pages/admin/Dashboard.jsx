import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaUsers, FaUtensils, FaClipboardList, FaCheckCircle,
  FaTimesCircle, FaClock, FaBan, FaChartBar
} from "react-icons/fa";
import API from "../../utils/api";
import "./AdminPages.css";

const StatCard = ({ icon, label, value, color, linkTo }) => (
  <Link to={linkTo || "#"} className="stat-card" style={{ borderTop: `4px solid ${color}` }}>
    <div className="stat-icon" style={{ color }}>{icon}</div>
    <div className="stat-info">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  </Link>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/admin/stats");
      setStats(res.data.stats);
    } catch (err) {
      toast.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-screen">Loading dashboard...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1><FaChartBar /> Admin Dashboard</h1>
        <p>Welcome back, Admin! Here's your overview.</p>
      </div>

      <div className="stats-grid">
        <StatCard icon={<FaUsers />} label="Total Users" value={stats.totalUsers} color="#3498db" linkTo="/admin/users" />
        <StatCard icon={<FaUtensils />} label="Total Products" value={stats.totalProducts} color="#9b59b6" linkTo="/admin/products" />
        <StatCard icon={<FaClipboardList />} label="Total Orders" value={stats.totalRequests} color="#1abc9c" linkTo="/admin/requests" />
        <StatCard icon={<FaClock />} label="Pending Orders" value={stats.pendingRequests} color="#f39c12" linkTo="/admin/requests" />
        <StatCard icon={<FaCheckCircle />} label="Accepted" value={stats.acceptedRequests} color="#27ae60" linkTo="/admin/requests" />
        <StatCard icon={<FaTimesCircle />} label="Rejected" value={stats.rejectedRequests} color="#e74c3c" linkTo="/admin/requests" />
        <StatCard icon={<FaBan />} label="Banned Users" value={stats.bannedUsers} color="#e67e22" linkTo="/admin/users" />
      </div>

      <div className="quick-links">
        <h2>Quick Actions</h2>
        <div className="quick-link-grid">
          <Link to="/admin/products" className="quick-link-card">
            <FaUtensils className="ql-icon" />
            <span>Manage Products</span>
          </Link>
          <Link to="/admin/requests" className="quick-link-card">
            <FaClipboardList className="ql-icon" />
            <span>View Orders</span>
          </Link>
          <Link to="/admin/users" className="quick-link-card">
            <FaUsers className="ql-icon" />
            <span>Manage Users</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
