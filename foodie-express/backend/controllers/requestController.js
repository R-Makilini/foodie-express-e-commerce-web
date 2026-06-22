const Request = require("../models/Request");
const Cart = require("../models/Cart");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendStatusEmail = async (userEmail, userName, status, items, totalAmount, adminNote) => {
  const statusText = status === "accepted" ? "✅ Accepted" : "❌ Rejected";
  const itemsList = items
    .map((i) => `<li>${i.product.name} x${i.quantity} — Rs. ${i.price * i.quantity}</li>`)
    .join("");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Foodie Express — Your Order has been ${status.toUpperCase()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
        <div style="background: #e74c3c; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🍔 Foodie Express</h1>
        </div>
        <div style="padding: 30px;">
          <h2>Hi ${userName},</h2>
          <p>Your order request has been <strong>${statusText}</strong></p>
          <h3>Order Summary:</h3>
          <ul>${itemsList}</ul>
          <p><strong>Total Amount: Rs. ${totalAmount}</strong></p>
          ${adminNote ? `<p><strong>Admin Note:</strong> ${adminNote}</p>` : ""}
          <p style="color: #777; font-size: 12px;">Thank you for choosing Foodie Express!</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// @desc   Place order request from cart
// @route  POST /api/requests
const placeRequest = async (req, res) => {
  try {
    const { deliveryAddress } = req.body;

    if (!deliveryAddress || deliveryAddress.trim().length < 5) {
      return res.status(400).json({ success: false, message: "Please provide a valid delivery address" });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Your cart is empty. Add items before requesting." });
    }

    const items = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const totalAmount = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const request = await Request.create({
      user: req.user._id,
      items,
      totalAmount,
      deliveryAddress: deliveryAddress.trim(),
    });

    // Clear cart after request
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    await request.populate("items.product");

    res.status(201).json({ success: true, message: "Order placed successfully! Waiting for admin approval.", request });
  } catch (error) {
    console.error("Place request error:", error);
    res.status(500).json({ success: false, message: "Error placing request" });
  }
};

// @desc   Get user's requests
// @route  GET /api/requests/my
const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching requests" });
  }
};

// @desc   Get all requests (Admin)
// @route  GET /api/requests/all
const getAllRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = {};
    if (status && status !== "all") query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Request.countDocuments(query);
    const requests = await Request.find(query)
      .populate("user", "name email phone")
      .populate("items.product")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, requests, total, totalPages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching requests" });
  }
};

// @desc   Accept or Reject request (Admin)
// @route  PUT /api/requests/:id/status
const updateRequestStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be accepted or rejected" });
    }

    const request = await Request.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product");

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    request.status = status;
    request.adminNote = adminNote || "";
    await request.save();

    // Send email notification
    try {
      await sendStatusEmail(
        request.user.email,
        request.user.name,
        status,
        request.items,
        request.totalAmount,
        adminNote
      );
    } catch (emailErr) {
      console.error("Email error:", emailErr.message);
    }

    res.json({ success: true, message: `Request ${status} successfully`, request });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating request status" });
  }
};

module.exports = { placeRequest, getMyRequests, getAllRequests, updateRequestStatus };
