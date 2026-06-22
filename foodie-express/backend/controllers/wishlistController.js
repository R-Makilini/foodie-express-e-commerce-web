const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// @desc   Get user wishlist
// @route  GET /api/wishlist
const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");
    if (!wishlist) wishlist = { products: [] };
    res.json({ success: true, wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching wishlist" });
  }
};

// @desc   Toggle wishlist item
// @route  POST /api/wishlist/toggle
const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    const exists = wishlist.products.includes(productId);
    if (exists) {
      wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
      await wishlist.save();
      return res.json({ success: true, message: "Removed from wishlist", added: false });
    } else {
      wishlist.products.push(productId);
      await wishlist.save();
      return res.json({ success: true, message: "Added to wishlist", added: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating wishlist" });
  }
};

// @desc   Remove item from wishlist
// @route  DELETE /api/wishlist/remove/:productId
const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return res.status(404).json({ success: false, message: "Wishlist not found" });

    wishlist.products = wishlist.products.filter((id) => id.toString() !== req.params.productId);
    await wishlist.save();
    await wishlist.populate("products");

    res.json({ success: true, message: "Removed from wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing from wishlist" });
  }
};

module.exports = { getWishlist, toggleWishlist, removeFromWishlist };
