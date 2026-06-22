import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaUtensils } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";
import "./AuthPages.css";

const Register = () => {
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "", phone: "", address: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Valid email is required";
    if (!form.password || form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!form.phone || !/^[0-9]{10}$/.test(form.phone)) e.phone = "Phone must be 10 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
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
      const res = await API.post("/auth/register", form);
      login(res.data.user, res.data.token);
      toast.success("Registered successfully! Welcome to Foodie Express!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <FaUtensils className="auth-logo" />
          
          <h2>Create Account</h2>
          <p>Join Foodie Express today</p>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input type="text" name="name" placeholder="Your full name" value={form.name} onChange={handleChange} />
              </div>
              {errors.name && <span className="error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input type="email" name="email" placeholder="your@email.com" value={form.email} onChange={handleChange} />
              </div>
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input type="password" name="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} />
              </div>
              {errors.password && <span className="error">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label>Confirm Password *</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input type="password" name="confirmPassword" placeholder="Repeat your password" value={form.confirmPassword} onChange={handleChange} />
              </div>
              {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone Number *</label>
              <div className="input-wrapper">
                <FaPhone className="input-icon" />
                <input type="tel" name="phone" placeholder="10-digit phone" value={form.phone} onChange={handleChange} />
              </div>
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>
            <div className="form-group">
              <label>Delivery Address</label>
              <div className="input-wrapper">
                <FaMapMarkerAlt className="input-icon" />
                <input type="text" name="address" placeholder="Your address (optional)" value={form.address} onChange={handleChange} />
              </div>
            </div>
          </div>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
