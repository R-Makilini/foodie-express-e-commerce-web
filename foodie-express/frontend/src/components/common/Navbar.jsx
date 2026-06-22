import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaUser, FaBars, FaTimes, FaUtensils } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <FaUtensils className="logo-icon" />
          <span>Foodie Express</span>
        </Link>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/products" onClick={() => setMenuOpen(false)}>Menu</Link></li>
          <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>

          {!user ? (
            <>
              <li><Link to="/login" className="btn-nav" onClick={() => setMenuOpen(false)}>Login</Link></li>
              <li><Link to="/register" className="btn-nav-outline" onClick={() => setMenuOpen(false)}>Register</Link></li>
            </>
          ) : user.role === "admin" ? (
            <>
              <li><Link to="/admin/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
              <li><Link to="/admin/products" onClick={() => setMenuOpen(false)}>Products</Link></li>
              <li><Link to="/admin/requests" onClick={() => setMenuOpen(false)}>Orders</Link></li>
              <li><Link to="/admin/users" onClick={() => setMenuOpen(false)}>Users</Link></li>
              <li><button className="btn-logout" onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li>
                <Link to="/cart" className="nav-icon-link" onClick={() => setMenuOpen(false)}>
                  <FaShoppingCart /> Cart
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="nav-icon-link" onClick={() => setMenuOpen(false)}>
                  <FaHeart /> Wishlist
                </Link>
              </li>
              <li>
                <Link to="/my-orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
              </li>
              <li>
                <Link to="/profile" className="nav-icon-link" onClick={() => setMenuOpen(false)}>
                  <FaUser /> {user.name.split(" ")[0]}
                </Link>
              </li>
              <li><button className="btn-logout" onClick={handleLogout}>Logout</button></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
