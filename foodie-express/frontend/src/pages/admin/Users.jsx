import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaUsers, FaBan, FaCheckCircle, FaSearch } from "react-icons/fa";
import API from "../../utils/api";
import "./AdminPages.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [toggling, setToggling] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data.users);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async (userId, userName, isBanned) => {
    const action = isBanned ? "unban" : "ban";
    if (!window.confirm(`Are you sure you want to ${action} "${userName}"?`)) return;
    setToggling(userId);
    try {
      const res = await API.put(`/admin/users/${userId}/ban`);
      toast.success(res.data.message);
      setUsers(users.map((u) => u._id === userId ? { ...u, isBanned: !u.isBanned } : u));
    } catch (err) {
      toast.error("Failed to update user status");
    } finally {
      setToggling(null);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading-screen">Loading users...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1><FaUsers /> Manage Users</h1>
        <div className="admin-search-wrapper">
          <FaSearch className="search-icon-abs" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search admin-search-icon"
          />
        </div>
      </div>

      <div className="users-summary">
        <span>Total: <strong>{users.length}</strong></span>
        <span>Active: <strong>{users.filter((u) => !u.isBanned).length}</strong></span>
        <span>Banned: <strong>{users.filter((u) => u.isBanned).length}</strong></span>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Profile</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr><td colSpan="8" className="no-data">No users found</td></tr>
            ) : (
              filteredUsers.map((user, index) => (
                <tr key={user._id} className={user.isBanned ? "banned-row" : ""}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=e74c3c&color=fff&size=40`}
                      alt={user.name}
                      className="user-avatar"
                    />
                  </td>
                  <td className="user-name-cell">{user.name}</td>
                  <td className="user-email-cell">{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString("en-LK")}</td>
                  <td>
                    <span className={`status-badge ${user.isBanned ? "banned" : "active"}`}>
                      {user.isBanned ? "Banned" : "Active"}
                    </span>
                  </td>
                  <td>
                    <button
                      className={user.isBanned ? "btn-unban" : "btn-ban"}
                      onClick={() => handleToggleBan(user._id, user.name, user.isBanned)}
                      disabled={toggling === user._id}
                    >
                      {toggling === user._id ? "..." : user.isBanned ? (<><FaCheckCircle /> Unban</>) : (<><FaBan /> Ban</>)}
                    </button>
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

export default AdminUsers;
