import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock, FaUtensils } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";
import "./AuthPages.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Invalid email format";
    if (!form.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      login(res.data.user, res.data.token);
      toast.success(res.data.message);
      navigate(res.data.user.role === "admin" ? "/admin/dashboard" : "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <FaUtensils className="auth-logo" />
          <h2>Welcome Back</h2>
          <p>Sign in to your Foodie Express account</p>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input type="email" name="email" placeholder="your@email.com" value={form.email} onChange={handleChange} />
            </div>
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input type="password" name="password" placeholder="Enter your password" value={form.password} onChange={handleChange} />
            </div>
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
