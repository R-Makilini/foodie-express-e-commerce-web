import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaShoppingCart, FaHeart, FaRegHeart, FaClock, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
    if (user && user.role !== "admin") checkWishlist();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);
      setProduct(res.data.product);
    } catch (err) {
      toast.error("Product not found");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const checkWishlist = async () => {
    try {
      const res = await API.get("/wishlist");
      const ids = res.data.wishlist.products?.map((p) => p._id || p) || [];
      setInWishlist(ids.includes(id));
    } catch (err) {}
  };

  const handleAddToCart = async () => {
    if (!user) { toast.error("Please login first"); return; }
    try {
      await API.post("/cart/add", { productId: product._id, quantity });
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) { toast.error("Please login first"); return; }
    try {
      const res = await API.post("/wishlist/toggle", { productId: product._id });
      setInWishlist(res.data.added);
      toast.success(res.data.message);
    } catch (err) {
      toast.error("Failed to update wishlist");
    }
  };

  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!product) return null;

  return (
    <div className="detail-page">
      <button className="btn-back" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back to Menu
      </button>
      <div className="detail-container">
        <div className="detail-image">
          <img src={product.image} alt={product.name} />
          {!product.isAvailable && <div className="detail-unavailable">Currently Unavailable</div>}
        </div>
        <div className="detail-info">
          <span className="detail-category">{product.category}</span>
          <h1 className="detail-name">{product.name}</h1>
          <p className="detail-desc">{product.description}</p>
          <div className="detail-meta">
            <span className="detail-price">Rs. {product.price}</span>
            <span className="detail-time"><FaClock /> {product.preparationTime} mins</span>
          </div>
          <div className="quantity-selector">
            <label>Quantity:</label>
            <div className="qty-controls">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <span className="qty-total">Total: Rs. {product.price * quantity}</span>
          </div>
          <div className="detail-actions">
            <button className="btn-add-cart" onClick={handleAddToCart} disabled={!product.isAvailable}>
              <FaShoppingCart /> Add to Cart
            </button>
            <button
              className={`btn-wishlist ${inWishlist ? "wishlisted" : ""}`}
              onClick={handleToggleWishlist}
            >
              {inWishlist ? <FaHeart /> : <FaRegHeart />}
              {inWishlist ? "Wishlisted" : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
