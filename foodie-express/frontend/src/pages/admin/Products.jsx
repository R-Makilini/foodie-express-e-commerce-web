import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaPlus, FaEdit, FaTrash, FaUtensils, FaTimes } from "react-icons/fa";
import API from "../../utils/api";
import "./AdminPages.css";

const CATEGORIES = ["Rice & Curry", "Kottu", "Biriyani", "Noodles", "Short Eats", "Desserts", "Beverages", "Burgers"];

const EMPTY_FORM = {
  name: "", description: "", price: "", category: "Rice & Curry",
  isAvailable: "true", preparationTime: "20",
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCat, setFilterCat] = useState("All");

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products", { params: { limit: 100 } });
      setProducts(res.data.products);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditProduct(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview("");
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      category: product.category,
      isAvailable: String(product.isAvailable),
      preparationTime: String(product.preparationTime),
    });
    setImageFile(null);
    setImagePreview(product.image);
    setErrors({});
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Only jpg, png, webp images allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.price || Number(form.price) <= 0) e.price = "Valid price is required";
    if (!form.category) e.category = "Category is required";
    if (!editProduct && !imageFile) e.image = "Product image is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      if (imageFile) formData.append("image", imageFile);

      if (editProduct) {
        await API.put(`/products/${editProduct._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated successfully!");
      } else {
        await API.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product added successfully!");
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Delete "${productName}"? This cannot be undone.`)) return;
    try {
      await API.delete(`/products/${productId}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCat === "All" || p.category === filterCat;
    return matchSearch && matchCat;
  });

  if (loading) return <div className="loading-screen">Loading products...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1><FaUtensils /> Manage Products</h1>
        <button className="btn-add" onClick={openAddModal}>
          <FaPlus /> Add New Product
        </button>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-search"
        />
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="admin-select">
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Prep Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr><td colSpan="7" className="no-data">No products found</td></tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img src={product.image} alt={product.name} className="table-product-img" />
                  </td>
                  <td className="product-name-cell">{product.name}</td>
                  <td><span className="category-badge">{product.category}</span></td>
                  <td className="price-cell">Rs. {product.price}</td>
                  <td>{product.preparationTime} min</td>
                  <td>
                    <span className={`status-badge ${product.isAvailable ? "available" : "unavailable"}`}>
                      {product.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-edit" onClick={() => openEditModal(product)}>
                        <FaEdit />
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(product._id, product.name)}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editProduct ? "Edit Product" : "Add New Product"}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="modal-form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Chicken Biriyani" />
                  {errors.name && <span className="error">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select name="category" value={form.category} onChange={handleChange} className="form-select">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows="3" placeholder="Describe the dish..." />
                {errors.description && <span className="error">{errors.description}</span>}
              </div>
              <div className="modal-form-row">
                <div className="form-group">
                  <label>Price (Rs.) *</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="350" min="1" />
                  {errors.price && <span className="error">{errors.price}</span>}
                </div>
                <div className="form-group">
                  <label>Preparation Time (min)</label>
                  <input type="number" name="preparationTime" value={form.preparationTime} onChange={handleChange} placeholder="20" min="1" />
                </div>
                <div className="form-group">
                  <label>Availability</label>
                  <select name="isAvailable" value={form.isAvailable} onChange={handleChange} className="form-select">
                    <option value="true">Available</option>
                    <option value="false">Unavailable</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Product Image {!editProduct && "*"}</label>
                <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleImageChange} />
                {errors.image && <span className="error">{errors.image}</span>}
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                )}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? "Saving..." : editProduct ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
