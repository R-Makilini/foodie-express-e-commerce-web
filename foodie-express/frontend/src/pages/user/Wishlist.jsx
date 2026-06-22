import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHeart, FaTrash, FaShoppingCart } from "react-icons/fa";
import API from "../../utils/api";
import "./UserPages.css";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchWishlist(); }, []);

  const fetchWishlist = async () => {
    try {
      const res = await API.get("/wishlist");
      setWishlist(res.data.wishlist);
    } catch (err) {
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await API.delete(`/wishlist/remove/${productId}`);
      setWishlist(res.data.wishlist);
      toast.info("Removed from wishlist");
    } catch (err) {
      toast.error("Failed to remove");
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await API.post("/cart/add", { productId, quantity: 1 });
      toast.success("Added to cart!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  if (loading) return <div className="loading-screen">Loading wishlist...</div>;

  return (
    <div className="user-page">
      <h1><FaHeart style={{ color: "#e74c3c" }} /> My Wishlist</h1>
      {wishlist.products.length === 0 ? (
        <div className="empty-state">
          <p>💔 Your wishlist is empty</p>
          <button className="btn-primary" onClick={() => navigate("/products")}>Explore Menu</button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.products.map((product) => (
            <div key={product._id} className="wishlist-card">
              <img src={product.image} alt={product.name} className="wishlist-img" />
              <div className="wishlist-info">
                <h4>{product.name}</h4>
                <p className="wishlist-category">{product.category}</p>
                <p className="wishlist-price">Rs. {product.price}</p>
              </div>
              <div className="wishlist-actions">
                <button className="btn-cart-small" onClick={() => handleAddToCart(product._id)}>
                  <FaShoppingCart /> Add to Cart
                </button>
                <button className="btn-remove" onClick={() => handleRemove(product._id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
