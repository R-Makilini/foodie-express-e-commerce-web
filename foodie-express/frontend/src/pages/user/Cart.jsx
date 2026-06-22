import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaTrash, FaShoppingCart, FaMapMarkerAlt } from "react-icons/fa";
import API from "../../utils/api";
import "./UserPages.css";

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [ordering, setOrdering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      setCart(res.data.cart);
    } catch (err) {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      const res = await API.put("/cart/update", { productId, quantity });
      setCart(res.data.cart);
    } catch (err) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await API.delete(`/cart/remove/${productId}`);
      setCart(res.data.cart);
      toast.info("Item removed from cart");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 5) {
      toast.error("Please enter a valid delivery address");
      return;
    }
    if (cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setOrdering(true);
    try {
      await API.post("/requests", { deliveryAddress });
      toast.success("Order placed! Waiting for admin approval.");
      setCart({ items: [] });
      setDeliveryAddress("");
      navigate("/my-orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setOrdering(false);
    }
  };

  const totalAmount = cart.items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity, 0
  );

  if (loading) return <div className="loading-screen">Loading cart...</div>;

  return (
    <div className="user-page">
      <h1><FaShoppingCart /> My Cart</h1>
      {cart.items.length === 0 ? (
        <div className="empty-state">
          <p>🛒 Your cart is empty</p>
          <button className="btn-primary" onClick={() => navigate("/products")}>Browse Menu</button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.product?._id} className="cart-item">
                <img src={item.product?.image} alt={item.product?.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <h4>{item.product?.name}</h4>
                  <p className="cart-item-price">Rs. {item.product?.price} each</p>
                </div>
                <div className="qty-controls">
                  <button onClick={() => handleUpdate(item.product._id, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleUpdate(item.product._id, item.quantity + 1)}>+</button>
                </div>
                <span className="cart-item-total">Rs. {item.product?.price * item.quantity}</span>
                <button className="btn-remove" onClick={() => handleRemove(item.product._id)}>
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-line">
              <span>Items ({cart.items.length})</span>
              <span>Rs. {totalAmount}</span>
            </div>
            <div className="summary-line summary-total">
              <span>Total</span>
              <span>Rs. {totalAmount}</span>
            </div>
            <div className="address-section">
              <label><FaMapMarkerAlt /> Delivery Address *</label>
              <textarea
                rows="3"
                placeholder="Enter your full delivery address..."
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
            </div>
            <button className="btn-order" onClick={handlePlaceOrder} disabled={ordering}>
              {ordering ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
