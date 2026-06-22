import React from "react";
import { Link } from "react-router-dom";
import { FaUtensils, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import "./Footer.css";

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-brand">
        <FaUtensils className="footer-logo-icon" />
        <h3>Foodie Express</h3>
        <p>Delicious food delivered to your doorstep. Fresh, fast, and flavourful.</p>
        <div className="social-icons">
          <FaFacebook /> <FaInstagram /> <FaTwitter />
        </div>
      </div>
      <div className="footer-links">
        <h4>Quick Links</h4>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Menu</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>
      <div className="footer-contact">
        <h4>Contact Us</h4>
        <p>📍 Main Street, Kilinochchi</p>
        <p>📞 077-1234567</p>
        <p>✉ info@foodieexpress.lk</p>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© 2026 Foodie Express. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
