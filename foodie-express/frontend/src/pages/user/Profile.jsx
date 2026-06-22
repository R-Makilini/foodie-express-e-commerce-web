import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaUser, FaPhone, FaMapMarkerAlt, FaCamera } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import API from "../../utils/api";
import "./UserPages.css";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowed.includes(file.type)) {
      toast.error("Only jpg and png images allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!form.phone || !/^[0-9]{10}$/.test(form.phone)) e.phone = "Phone must be 10 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      if (imageFile) formData.append("profileImage", imageFile);

      const res = await API.put("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(res.data.user);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-page">
      <h1><FaUser /> My Profile</h1>
      <div className="profile-container">
        <div className="profile-image-section">
          <div className="profile-img-wrapper">
            <img
              src={imagePreview || user?.profileImage || `https://ui-avatars.com/api/?name=${user?.name}&background=e74c3c&color=fff&size=150`}
              alt="Profile"
              className="profile-img"
            />
            <label className="img-upload-btn">
              <FaCamera />
              <input type="file" accept="image/jpeg,image/jpg,image/png" onChange={handleImageChange} hidden />
            </label>
          </div>
          <h3>{user?.name}</h3>
          <p>{user?.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Full Name *</label>
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input type="text" name="name" value={form.name} onChange={handleChange} />
            </div>
            {errors.name && <span className="error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>Phone Number *</label>
            <div className="input-wrapper">
              <FaPhone className="input-icon" />
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} />
            </div>
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>
          <div className="form-group">
            <label>Delivery Address</label>
            <div className="input-wrapper">
              <FaMapMarkerAlt className="input-icon" />
              <input type="text" name="address" value={form.address} onChange={handleChange} />
            </div>
          </div>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
