# 🍔 Foodie Express — Online Food Ordering System

A full-stack e-commerce web application for online food ordering, built with React.js, Node.js, Express.js, and MongoDB.

---

## 📌 E-Commerce Theme
**Online Food Ordering System** — Customers can browse Sri Lankan food items, add to cart or wishlist, and place orders. Admins can manage products, view and accept/reject orders, and manage users.

---

## 🛠 Technology Stack

### Frontend
- React.js (v18)
- React Router DOM (v6) — navigation and routing
- Axios — API requests
- React Icons — icon library
- React Toastify — toast notifications
- CSS — custom responsive styles

### Backend
- Node.js + Express.js
- JWT (jsonwebtoken) — authentication
- bcryptjs — password hashing
- Mongoose — MongoDB ODM
- AWS-S3— image upload
- Nodemailer — email notifications
- dotenv, cors, nodemon

### Database
- MongoDB Atlas (cloud)

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- AWS account
- Gmail account (for Nodemailer)

---

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file (copy from `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/foodie-express
JWT_SECRET=your_secret_key


EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password

ADMIN_EMAIL=admin@foodieexpress.com
ADMIN_PASSWORD=Admin@123
```

```bash
npm run dev   # starts on http://localhost:5000
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm start     # starts on http://localhost:3000
```

---

### Database Setup

1. Create a free cluster on [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a database user
3. Whitelist your IP address
4. Copy the connection string into `MONGO_URI` in `.env`
5. Collections are auto-created by Mongoose when data is saved

---

## 🔐 Login Credentials

### Admin Login
| Field | Value |
|-------|-------|
| Email | admin@foodieexpress.com |
| Password | Admin@123 |

### Test User Login
Register a new account via `/register`

---

## 🌐 Environment Variables (No Secret Values)

| Variable | Description |
|----------|-------------|
| `PORT` | Backend server port (default 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `EMAIL_USER` | Gmail address for Nodemailer |
| `EMAIL_PASS` | Gmail App Password |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |

---

## 🔄 Main Workflow

### User Flow
1. Register / Login → browse menu → search & filter by category
2. View product details → add to cart or wishlist
3. Adjust cart quantities → enter delivery address → place order
4. View order status (Pending / Accepted / Rejected) on My Orders page
5. Receive email notification when admin accepts or rejects

### Admin Flow
1. Login with admin credentials → view Dashboard with live stats
2. Add / Edit / Delete products with Cloudinary image upload
3. View all customer orders → filter by status
4. Accept or Reject orders with optional note → email sent automatically
5. Manage users — view list, ban or unban users

---

## ✨ Additional Features Implemented

| Feature | Status |
|---------|--------|
| Nodemailer — Contact Form | ✅ |
| Nodemailer — Order Status Email | ✅ |
| aws — Profile Image Upload | ✅ |
| aws — Product Image Upload | ✅ |
| Search and Category Filter | ✅ |
| Responsive Design | ✅ |
| React Icons | ✅ |
| Toast Notifications | ✅ |

---

## 📁 Project Structure

```
foodie-express/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── wishlistController.js
│   │   ├── requestController.js
│   │   ├── adminController.js
│   │   └── contactController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Wishlist.js
│   │   └── Request.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── wishlistRoutes.js
│   │   ├── requestRoutes.js
│   │   ├── adminRoutes.js
│   │   └── contactRoutes.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/common/
    │   │   ├── Navbar.jsx / .css
    │   │   └── Footer.jsx / .css
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx / .css
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Products.jsx / .css
    │   │   ├── ProductDetail.jsx / .css
    │   │   ├── Contact.jsx / .css
    │   │   ├── AuthPages.css
    │   │   ├── user/
    │   │   │   ├── Cart.jsx
    │   │   │   ├── Wishlist.jsx
    │   │   │   ├── MyOrders.jsx
    │   │   │   ├── Profile.jsx
    │   │   │   └── UserPages.css
    │   │   └── admin/
    │   │       ├── Dashboard.jsx
    │   │       ├── Products.jsx
    │   │       ├── Requests.jsx
    │   │       ├── Users.jsx
    │   │       └── AdminPages.css
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

---

## ⚠️ Challenges Faced

- JWT token expiry handling — solved using Axios interceptor to auto-redirect on 401
- Cloudinary image deletion on product update — used `imagePublicId` stored in DB
- Cart & Wishlist sync — used MongoDB populate() to get full product details
- Role-based routing — created separate ProtectedRoute and UserRoute components
- FormData with image upload — used `multipart/form-data` header in Axios

---

## 🔮 Future Improvements

- Payment gateway integration (Stripe / PayHere)
- Real-time order tracking with Socket.io
- Product rating and review system
- Order history export as PDF
- Push notifications for mobile
- Coupon / discount code system
