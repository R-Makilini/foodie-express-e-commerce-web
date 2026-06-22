const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// @desc   Send contact form email
// @route  POST /api/contact
const sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email address" });
    }
    if (message.trim().length < 10) {
      return res.status(400).json({ success: false, message: "Message must be at least 10 characters" });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Foodie Express Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #e74c3c;">New Contact Form Message</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Send confirmation to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "We received your message — Foodie Express",
      html: `<p>Hi ${name}, thank you for contacting us! We'll get back to you shortly.</p>`,
    });

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Contact email error:", error);
    res.status(500).json({ success: false, message: "Failed to send message. Please try again." });
  }
};

module.exports = { sendContactEmail };
