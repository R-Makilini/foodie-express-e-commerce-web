import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser, FaPaperPlane } from "react-icons/fa";
import API from "../utils/api";
import "./Contact.css";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Valid email is required";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim() || form.message.trim().length < 10) e.message = "Message must be at least 10 characters";
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
      const res = await API.post("/contact", form);
      toast.success(res.data.message);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contact <span className="highlight">Us</span></h1>
        <p>We'd love to hear from you. Send us a message!</p>
      </div>
      <div className="contact-container">
        <div className="contact-info">
          <h2>Get In Touch</h2>
          <div className="info-item"><FaMapMarkerAlt className="info-icon" /><div><h4>Address</h4><p>Main Street, Kilinochchi, Sri Lanka</p></div></div>
          <div className="info-item"><FaPhone className="info-icon" /><div><h4>Phone</h4><p>077-1234567</p></div></div>
          <div className="info-item"><FaEnvelope className="info-icon" /><div><h4>Email</h4><p>info@foodieexpress.lk</p></div></div>
        </div>
        <div className="contact-form-wrapper">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label>Your Name *</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input type="text" name="name" placeholder="Full name" value={form.name} onChange={handleChange} />
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
            <div className="form-group">
              <label>Subject *</label>
              <input type="text" name="subject" placeholder="How can we help?" value={form.subject} onChange={handleChange} style={{padding:"12px",border:"1.5px solid #ddd",borderRadius:"8px",width:"100%",boxSizing:"border-box"}} />
              {errors.subject && <span className="error">{errors.subject}</span>}
            </div>
            <div className="form-group">
              <label>Message *</label>
              <textarea name="message" rows="5" placeholder="Write your message here..." value={form.message} onChange={handleChange} style={{padding:"12px",border:"1.5px solid #ddd",borderRadius:"8px",width:"100%",resize:"vertical",boxSizing:"border-box",fontFamily:"inherit"}} />
              {errors.message && <span className="error">{errors.message}</span>}
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              <FaPaperPlane /> {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
