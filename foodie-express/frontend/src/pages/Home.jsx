import React from "react";
import { Link } from "react-router-dom";
import { FaTruck, FaStar, FaClock, FaUtensils } from "react-icons/fa";
import "./Home.css";

const CATEGORIES = [
  { name: "Rice & Curry", emoji: "🍛" },
  { name: "Kottu", emoji: "🥘" },
  { name: "Biriyani", emoji: "🍚" },
  { name: "Burgers", emoji: "🍔" },
  { name: "Beverages", emoji: "🥤" },
  { name: "Desserts", emoji: "🍮" },
];

const Home = () => {
  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Delicious Food <br />
            <span className="highlight">Delivered Fast</span>
          </h1>
          <p>Order your favourite Sri Lankan dishes and get them delivered fresh to your door.</p>
          <div className="hero-btns">
            <Link to="/products" className="btn-primary">Browse Menu</Link>
            <Link to="/register" className="btn-secondary">Join Now</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-emoji">🍔🍛🍚</div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="features-grid">
          <div className="feature-card">
            <FaTruck className="feature-icon" />
            <h3>Fast Delivery</h3>
            <p>Your food delivered within 30-45 minutes</p>
          </div>
          <div className="feature-card">
            <FaStar className="feature-icon" />
            <h3>Top Quality</h3>
            <p>Fresh ingredients and authentic recipes</p>
          </div>
          <div className="feature-card">
            <FaClock className="feature-icon" />
            <h3>Open Daily</h3>
            <p>Available 7 days a week, 10AM – 10PM</p>
          </div>
          <div className="feature-card">
            <FaUtensils className="feature-icon" />
            <h3>Variety</h3>
            <p>Over 50+ dishes across 8 categories</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <h2>Explore Our <span className="highlight">Menu Categories</span></h2>
        <div className="categories-grid">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="category-card"
            >
              <span className="category-emoji">{cat.emoji}</span>
              <span className="category-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Order?</h2>
          <p>Create your account and start ordering your favourite meals today!</p>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
