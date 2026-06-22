import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSearch, FaShoppingCart, FaHeart, FaRegHeart, FaClock, FaStar } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";
import "./Products.css";

const CATEGORIES = ["All", "Rice & Curry", "Kottu", "Biriyani", "Noodles", "Short Eats", "Desserts", "Beverages", "Burgers"];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, [category, currentPage]);

  useEffect(() => {
    if (user && user.role !== "admin") fetchWishlist();
  }, [user]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit: 8 };
      if (search.trim()) params.search = search.trim();
      if (category !== "All") params.category = category;

      const res = await API.get("/products", { params });
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await API.get("/wishlist");
      setWishlistIds(res.data.wishlist.products?.map((p) => p._id || p) || []);
    } catch (err) {}
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setCurrentPage(1);
  };

  const handleAddToCart = async (productId) => {
    if (!user) { toast.error("Please login to add to cart"); return; }
    try {
      await API.post("/cart/add", { productId, quantity: 1 });
      toast.success("Added to cart!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleToggleWishlist = async (productId) => {
    if (!user) { toast.error("Please login to use wishlist"); return; }
    try {
      const res = await API.post("/wishlist/toggle", { productId });
      if (res.data.added) {
        setWishlistIds([...wishlistIds, productId]);
        toast.success("Added to wishlist!");
      } else {
        setWishlistIds(wishlistIds.filter((id) => id !== productId));
        toast.info("Removed from wishlist");
      }
    } catch (err) {
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Our <span className="highlight">Menu</span></h1>
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit"><FaSearch /></button>
        </form>
      </div>

      <div className="category-filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${category === cat ? "active" : ""}`}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-screen">Loading menu...</div>
      ) : products.length === 0 ? (
        <div className="no-products">
          <p>😕 No dishes found. Try a different search or category.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image-wrapper">
                <img src={product.image} alt={product.name} className="product-img" />
                {!product.isAvailable && <span className="unavailable-badge">Unavailable</span>}
                <button
                  className={`wishlist-btn ${wishlistIds.includes(product._id) ? "wishlisted" : ""}`}
                  onClick={() => handleToggleWishlist(product._id)}
                >
                  {wishlistIds.includes(product._id) ? <FaHeart /> : <FaRegHeart />}
                </button>
              </div>
              <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-desc">{product.description.substring(0, 70)}...</p>
                <div className="product-meta">
                  <span className="product-price">Rs. {product.price}</span>
                  <span className="product-time"><FaClock /> {product.preparationTime} min</span>
                </div>
                <div className="product-actions">
                  <Link to={`/products/${product._id}`} className="btn-view">View Details</Link>
                  <button
                    className="btn-cart"
                    onClick={() => handleAddToCart(product._id)}
                    disabled={!product.isAvailable}
                  >
                    <FaShoppingCart /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`page-btn ${currentPage === page ? "active" : ""}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
