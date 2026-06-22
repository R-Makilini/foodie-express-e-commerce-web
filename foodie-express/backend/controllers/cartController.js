const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc   Get user cart
// @route  GET /api/cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart) {
      cart = { items: [] };
    }
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching cart" });
  }
};

// @desc   Add item to cart
// @route  POST /api/cart/add
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }
    if (Number(quantity) < 1) {
      return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    if (!product.isAvailable) {
      return res.status(400).json({ success: false, message: "Product is not available" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if product already in cart
    const existingItem = cart.items.find((item) => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity) });
    }

    await cart.save();
    await cart.populate("items.product");

    res.json({ success: true, message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding to cart" });
  }
};

// @desc   Update cart item quantity
// @route  PUT /api/cart/update
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ success: false, message: "Product ID and quantity required" });
    }
    if (Number(quantity) < 1) {
      return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }

    item.quantity = Number(quantity);
    await cart.save();
    await cart.populate("items.product");

    res.json({ success: true, message: "Cart updated", cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating cart" });
  }
};

// @desc   Remove item from cart
// @route  DELETE /api/cart/remove/:productId
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    await cart.save();
    await cart.populate("items.product");

    res.json({ success: true, message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing from cart" });
  }
};

// @desc   Clear cart
// @route  DELETE /api/cart/clear
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error clearing cart" });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
