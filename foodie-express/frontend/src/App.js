import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";

// User Pages
import UserCart from "./pages/user/Cart";
import UserWishlist from "./pages/user/Wishlist";
import UserOrders from "./pages/user/MyOrders";
import UserProfile from "./pages/user/Profile";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminRequests from "./pages/admin/Requests";
import AdminUsers from "./pages/admin/Users";

// Components
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

// Protected Route
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" />;
  return children;
};

const UserRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role === "admin") return <Navigate to="/admin/dashboard" />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/"} /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/contact" element={<Contact />} />

          {/* User Routes */}
          <Route path="/cart" element={<UserRoute><UserCart /></UserRoute>} />
          <Route path="/wishlist" element={<UserRoute><UserWishlist /></UserRoute>} />
          <Route path="/my-orders" element={<UserRoute><UserOrders /></UserRoute>} />
          <Route path="/profile" element={<UserRoute><UserProfile /></UserRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute adminOnly><AdminProducts /></ProtectedRoute>} />
          <Route path="/admin/requests" element={<ProtectedRoute adminOnly><AdminRequests /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
