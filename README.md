# 🛒 ShopEase — Full-Stack E-Commerce Platform

> A production-ready MERN stack e-commerce application with a complete admin panel, Stripe payments, Wishlist, Product Returns, and a dynamic category-based product display.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![Stripe](https://img.shields.io/badge/Payments-Stripe-blueviolet?logo=stripe)
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38bdf8?logo=tailwindcss)

---

## 📸 Features at a Glance

| Feature | Description |
|---------|-------------|
| 🏠 **Home Page** | Hero slider + products grouped by category (4 per row) |
| 🗂️ **10 Categories** | Clothing, Electronics, Shoes, Watches, Mobiles, Gaming, Accessories, Men's, Women's, Kids' |
| 🔐 **Auth System** | JWT login/signup with role-based auto-redirect (Admin → `/admin`, User → `/`) |
| 🛍️ **Shopping Cart** | Add, update quantity, remove — persisted in MongoDB |
| ❤️ **Wishlist** | Save products with heart button, view on dedicated page |
| 📦 **Product Returns** | Submit return requests for delivered orders, admin approves/rejects |
| 💳 **Stripe Payments** | Full Stripe Checkout Session integration |
| ⭐ **Reviews** | Star rating + comment on any product |
| 🖼️ **Banner Slider** | Admin uploads/manages homepage carousel images |
| 👑 **Admin Panel** | Dashboard, Products, Orders, Returns, Wishlist Analytics, Banners |

---

## 🚀 Tech Stack

**Frontend:** React 18, React Router v6, Tailwind CSS, react-icons, Stripe.js  
**Backend:** Node.js, Express.js, Multer, Morgan, dotenv  
**Database:** MongoDB Atlas, Mongoose ODM  
**Auth:** bcryptjs, JSON Web Token (JWT)  
**Payment:** Stripe Checkout Sessions API  

---

## 📁 Project Structure

```
SDA-Lab-main/
├── client/          # React frontend (localhost:3000)
│   └── src/
│       ├── Admin/                 # Admin panel shell
│       ├── AdminComponents/       # Products, Orders, Returns, Wishlist, Banners
│       └── components/            # Customer pages, Cart, Wishlist, Returns
│
└── server/          # Express API (localhost:9999)
    ├── controllers/               # Business logic
    ├── models/                    # Mongoose schemas
    ├── routes/                    # API routes
    ├── middlewares/               # Auth + Upload
    └── config/                    # MongoDB connection
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Stripe account (test keys)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/SDA-Lab.git
cd SDA-Lab-main
```

### 2. Setup Server
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=9999
MONGODB_URI=your_mongodb_atlas_connection_string/E-commerce
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

Start the server:
```bash
npm start
```

### 3. Setup Client
```bash
cd ../client
npm install
npm start
```

The app opens at **http://localhost:3000**

---

## 🔑 Default Credentials

| Role | How to Access |
|------|--------------|
| **User** | Sign up at `/signup` |
| **Admin** | Sign up → Set `role: "admin"` in MongoDB Atlas → Log back in |

Once logged in as admin, an **⚙ Admin** button appears in the navbar.

---

## 📌 Key Pages

| URL | Description |
|-----|-------------|
| `/` | Home — hero slider + products by category |
| `/products` | All products with search + category filter |
| `/categories` | All 10 category cards |
| `/category/:name` | Products filtered by category |
| `/products/:id` | Product detail + reviews + wishlist |
| `/cart` | Shopping cart |
| `/checkout` | Stripe checkout |
| `/wishlist` | Saved products |
| `/returns` | Submit / track return requests |
| `/profile` | Order history + quick links |
| `/admin` | Admin dashboard (admin only) |

---

## 🗄️ Database Collections

| Collection | Description |
|------------|-------------|
| `users` | User accounts with embedded cart |
| `products` | Products with reviews and category |
| `orders` | Orders with shipping + payment status |
| `wishlists` | User-product saves (unique per pair) |
| `returns` | Return requests with status tracking |
| `banners` | Homepage slider images |

---

## 🧪 Selenium Testing (SQE)

The project includes a Selenium test plan covering:
- ✅ Auth (login, signup, role redirect)
- ✅ Products (browse, filter, search)
- ✅ Cart (add, update, remove)
- ✅ Wishlist (add, remove, verify)
- ✅ Returns (submit, status check)
- ✅ Admin (add product, update order)

See `PROJECT_PROPOSAL.md` for full test suite and Java code examples.

---

## 📡 API Overview

```
POST   /api/signup              Register user
POST   /api/login               Login
GET    /api/products            All products
POST   /api/addproduct          Add product (admin)
GET    /api/cart/:userId        Get cart
POST   /api/cart/:userId        Add to cart
GET    /api/wishlist/:userId    Get wishlist
POST   /api/wishlist            Add to wishlist
DELETE /api/wishlist/:u/:p      Remove from wishlist
POST   /api/returns             Submit return request
GET    /api/returns/user/:id    User's returns
GET    /api/orders              All orders (admin)
POST   /api/checkout            Create Stripe session
GET    /api/banners             Active banners
```

---

## 📄 License

This project is for academic purposes — SDA Lab & SQE Course, 2026.

---

## 👨‍💻 Author

**Muhammad Sharib** — Full Stack Developer  
Built with ❤️ using the MERN Stack
