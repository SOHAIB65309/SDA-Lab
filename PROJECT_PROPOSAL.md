# Project Proposal
## ShopEase — Full-Stack E-Commerce Web Application

---

## 1. Project Overview

**Project Title:** ShopEase — Full-Stack E-Commerce Platform  
**Course:** Software Design and Architecture (SDA) Lab / Software Quality Engineering (SQE)  
**Project Type:** Web Application (Full-Stack MERN)  
**Submitted By:** Muhammad Sharib  
**Date:** May 2026  

---

ShopEase is a fully functional, production-ready e-commerce web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). The platform enables customers to browse products by category, manage a shopping cart and wishlist, submit product returns, and complete purchases through a secure Stripe payment gateway. A dedicated admin panel allows administrators to manage products, orders, banners, returns, and wishlist analytics in real time.

---

## 2. Problem Statement

Traditional retail businesses face significant challenges in reaching customers beyond their physical location. Small and medium-sized businesses often lack the technical resources to build and maintain an online store. Existing platforms charge high commissions and offer limited customization.

ShopEase addresses these problems by providing:
- A clean, modern storefront that customers can browse without friction
- A self-hosted solution where the business owner retains full control
- A powerful admin panel that requires no technical knowledge to operate
- Secure, industry-standard payment processing via Stripe
- Customer engagement features like Wishlist and Product Returns

---

## 3. Objectives

1. Build a complete e-commerce platform with user authentication and role-based access control
2. Implement a full product lifecycle — from admin upload to customer purchase
3. Integrate a real payment gateway (Stripe) for secure transactions
4. Provide an admin dashboard with live business metrics
5. Allow dynamic homepage customization through an admin-managed banner slider
6. Implement Wishlist and Product Return modules with unique MongoDB IDs per user
7. Deliver a responsive, sky-blue/white aesthetic UI accessible on all devices
8. Ensure the application is testable with Selenium for SQE requirements

---

## 4. Scope of the Project

### In Scope

| Area | Features |
|------|----------|
| Authentication | Registration, Login, JWT tokens, Role-based access (user/admin), Auto-redirect by role |
| Product Management | Add, Edit, Delete, View products with image upload, 10-category system |
| Shopping | Browse by category, Search, Filter, Product detail page with reviews |
| Cart | Add to cart, Update quantity, Remove items (persisted in database) |
| Wishlist | Save products, Remove from wishlist, Admin analytics |
| Checkout | Shipping address form, Stripe payment integration |
| Orders | Order creation, Order history per user, Order status tracking |
| Product Returns | Submit return request, Admin approve/reject/refund, Status tracking |
| Admin Panel | Dashboard with stats, Product management, Order management, Banner management, Return management, Wishlist analytics |
| Banners | Admin-controlled homepage image slider (add, hide, delete slides) |
| Reviews | Customers can submit star ratings and comments on products |
| Categories | 10 categories: Clothing, Electronics, Shoes, Watches, Mobiles, Gaming, Accessories, Men's, Women's, Kids' |

### Out of Scope
- Email notifications
- Inventory/stock tracking
- Discount codes and coupons
- Multi-vendor support
- Mobile native application

---

## 5. Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI component library |
| React Router DOM v6 | Client-side routing |
| Tailwind CSS v3 | Utility-first styling framework |
| @stripe/stripe-js | Stripe client-side SDK |
| react-icons | Icon library (FaHeart, FaShoppingCart, etc.) |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| Multer | File/image upload middleware |
| Morgan | HTTP request logging |
| dotenv | Environment variable management |
| CORS | Cross-origin resource sharing |

### Database
| Technology | Purpose |
|------------|---------|
| MongoDB Atlas | Cloud-hosted NoSQL database |
| Mongoose ODM | Schema definition and data validation |

### Security & Authentication
| Technology | Purpose |
|------------|---------|
| bcryptjs | Password hashing (salt rounds: 10) |
| jsonwebtoken | Stateless JWT authentication (7-day expiry) |

### Payment
| Technology | Purpose |
|------------|---------|
| Stripe | Payment gateway (Checkout Sessions API) |

---

## 6. System Architecture

ShopEase follows a **three-tier architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT TIER                             │
│  React SPA (localhost:3000)                                  │
│  ┌──────────────────────┐  ┌──────────────────────────────┐ │
│  │   Customer Storefront │  │      Admin Panel             │ │
│  │   (App.js)            │  │      (AdminApp.js)           │ │
│  │                       │  │                              │ │
│  │  Home / Products /    │  │  Dashboard / Products /      │ │
│  │  Cart / Wishlist /    │  │  Orders / Returns /          │ │
│  │  Returns / Profile    │  │  Wishlist Stats / Banners    │ │
│  └──────────────────────┘  └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      SERVER TIER                             │
│  Express.js REST API (localhost:9999)                        │
│  ┌──────────┐  ┌────────────────┐  ┌─────────────────────┐  │
│  │  Routes  │  │  Controllers   │  │    Middlewares       │  │
│  │  /api/*  │  │  (Business     │  │  (Auth JWT,          │  │
│  │          │  │   Logic)       │  │   Multer Upload,     │  │
│  │          │  │                │  │   Error Handler)     │  │
│  └──────────┘  └────────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │ Mongoose ODM
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE TIER                             │
│  MongoDB Atlas — Database: "E-commerce"                      │
│  Collections: users, products, orders, banners,              │
│               wishlists, returns                             │
└─────────────────────────────────────────────────────────────┘
```

### Design Patterns Used

**1. MVC (Model-View-Controller)**  
Routes define endpoints, Controllers contain business logic, Models define data schemas. Each resource has its own dedicated controller file.

**2. Middleware Chain Pattern**  
`authMiddleware` verifies JWT tokens, `uploadMiddleware` handles image uploads via Multer, `morgan` logs all HTTP requests, global error handler catches unhandled exceptions.

**3. Embedded Document Pattern (Cart)**  
The shopping cart is stored as an embedded subdocument array (`cartData`) inside the User document, keeping cart operations to a single database call.

**4. Stripe Checkout Session Pattern**  
Server creates a Stripe Checkout Session with order details in metadata. On payment success, Stripe redirects to a server-side callback that atomically creates the Order and clears the cart.

**5. Dual-App Frontend Pattern**  
Customer storefront (`App.js`) and admin panel (`AdminApp.js`) are separate React router trees with independent layouts and access control.

**6. Role-Based Access Control (RBAC)**  
Users have a `role` field (`user` or `admin`). `ProtectedRoutes` component checks role before rendering admin routes. Login auto-redirects based on role.

---

## 7. Database Design

### User Collection
```json
{
  "_id": "ObjectId (unique)",
  "name": "String",
  "email": "String (unique)",
  "password": "String (bcrypt hashed)",
  "role": "user | admin",
  "cartData": [{ "productId": "ref:Product", "quantity": "Number", "price": "Number" }],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Product Collection
```json
{
  "_id": "ObjectId (unique)",
  "name": "String",
  "category": "clothing | electronics | shoes | watches | mobiles | gaming | accessories | mens | womens | kids",
  "image": "String (URL)",
  "new_price": "Number",
  "old_price": "Number | null",
  "status": "active | inactive",
  "uploaded_by": "ref:User",
  "stars": "Number (0-5, auto-calculated from reviews)",
  "reviews": [{ "username": "String", "comment": "String", "rating": "Number" }],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Order Collection
```json
{
  "_id": "ObjectId (unique)",
  "user": "ref:User",
  "products": [{ "productId": "ref:Product", "name": "String", "quantity": "Number", "price": "Number" }],
  "totalAmount": "Number",
  "status": "pending | processed | shipped | delivered | cancelled",
  "shippingAddress": { "street": "String", "city": "String", "state": "String", "postalCode": "String", "country": "String" },
  "paymentStatus": "pending | paid | failed | refunded",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Wishlist Collection
```json
{
  "_id": "ObjectId (unique per user+product pair)",
  "userId": "ref:User",
  "productId": "ref:Product",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```
> **Unique Index:** `{ userId: 1, productId: 1 }` — prevents duplicate wishlist entries

### Return Collection
```json
{
  "_id": "ObjectId (unique)",
  "userId": "ref:User",
  "orderId": "ref:Order",
  "productId": "ref:Product",
  "productName": "String",
  "reason": "String (min 10 chars)",
  "status": "pending | approved | rejected | refunded",
  "adminNote": "String",
  "quantity": "Number",
  "refundAmount": "Number",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Banner Collection
```json
{
  "_id": "ObjectId (unique)",
  "image": "String (URL)",
  "title": "String",
  "subtitle": "String",
  "order": "Number",
  "active": "Boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## 8. API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/signup | Register new user |
| POST | /api/login | Login and receive JWT |
| GET | /api/profile | Get logged-in user profile |
| PUT | /api/profile | Update user profile |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Get all products |
| GET | /api/products/:id | Get product by ID |
| POST | /api/addproduct | Add new product (with image) |
| PUT | /api/editproducts/:id | Update product |
| DELETE | /api/removeproduct/:id | Delete product |
| GET | /api/products/:id/review | Get product reviews |
| POST | /api/products/:id/reviews | Submit a review |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/cart/:userId | Get user's cart |
| POST | /api/cart/:userId | Add item to cart |
| PUT | /api/cart/update/:userId/:productId | Update item quantity |
| DELETE | /api/cart/delete/:userId/:productId | Remove item from cart |

### Wishlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/wishlist/:userId | Get user's wishlist |
| POST | /api/wishlist | Add product to wishlist |
| DELETE | /api/wishlist/:userId/:productId | Remove from wishlist |
| GET | /api/wishlist/check/:userId/:productId | Check if product is wishlisted |
| GET | /api/admin/wishlists | All wishlists (admin) |
| GET | /api/admin/wishlist-stats | Most wishlisted products (admin) |

### Returns
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/returns | Submit return request |
| GET | /api/returns/user/:userId | Get user's return requests |
| GET | /api/admin/returns | All return requests (admin) |
| PUT | /api/admin/returns/:id | Update return status (admin) |
| GET | /api/admin/return-stats | Return statistics (admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/checkout | Create Stripe checkout session |
| GET | /api/success | Handle Stripe payment success |
| GET | /api/orders | Get all orders (admin) |
| GET | /api/order/:userId | Get orders by user |
| GET | /api/orders/:order_id | Get single order details |
| PUT | /api/orders/status | Update order status |

### Banners
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/banners | Get active banners (public) |
| GET | /api/banners/all | Get all banners (admin) |
| POST | /api/banners | Upload new banner |
| PUT | /api/banners/:id/toggle | Toggle banner visibility |
| DELETE | /api/banners/:id | Delete banner |

---

## 9. Key Features Description

### 9.1 Role-Based Authentication & Auto-Redirect
Users register and receive a JWT token (7-day expiry). On login, the system reads the user's role and automatically redirects: `admin → /admin`, `user → /`. If already logged in, visiting `/login` or `/signup` immediately redirects to the appropriate home. Protected routes check role before rendering.

### 9.2 Category-Based Product Display
The home page groups all products by their category, displaying each group with a heading, icon, and 4 products per row. A horizontal scrollable category strip provides quick navigation. The navbar has a "Categories" dropdown with all 10 categories. Each category has its own dedicated page at `/category/:name`.

### 9.3 Dynamic Homepage Slider
Administrators upload banner images through the admin panel. Each banner has an optional title, subtitle, and display order. Banners can be toggled active/inactive. The homepage fetches active banners and displays them in an auto-advancing carousel with arrows and dot indicators.

### 9.4 Wishlist Module (SQE Testable)
Users save products by clicking the heart icon on any product card or detail page. Each wishlist entry is stored in MongoDB with a unique `_id`, `userId`, and `productId`. A unique compound index prevents duplicates. Admin can view which products are most wishlisted. Selenium-testable: add to wishlist → verify heart fills red → remove → verify heart empties.

### 9.5 Product Return Module (SQE Testable)
After an order is delivered, users can submit a return request with a reason (min 10 chars). Each return has a unique MongoDB `_id` linked to `userId`, `orderId`, and `productId`. Admin reviews requests and can approve, reject, or mark as refunded with an optional note. Status flow: `pending → approved → rejected → refunded`. Selenium-testable: submit return → verify pending status → admin approves → verify status change.

### 9.6 Stripe Payment Integration
Server creates a Stripe Checkout Session with cart items as line items and embeds `userId` + `shippingAddress` in session metadata. After payment, Stripe redirects to the server's success endpoint which creates the Order record and clears the cart — all server-side, ensuring data integrity.

### 9.7 Admin Dashboard
Live statistics: total products, orders, users, revenue, wishlist saves, and pending returns. Quick action cards for all admin functions. Recent orders table and pending returns panel. Collapsible sidebar with all 7 navigation items.

---

## 10. Project Structure

```
SDA-Lab-main/
│
├── client/                              # React Frontend
│   ├── public/
│   └── src/
│       ├── Admin/                       # Admin panel shell
│       │   ├── Admin.jsx                # Dashboard with live stats
│       │   ├── AdminApp.js              # Admin router + sidebar layout
│       │   ├── Navigation.jsx           # Admin top navigation
│       │   └── Sidebar.jsx              # Sidebar reference component
│       ├── AdminComponents/             # Admin feature pages
│       │   ├── Banners/ManageBanners.jsx
│       │   ├── Orders/Orders.jsx
│       │   ├── Returns/ManageReturns.jsx
│       │   ├── Wishlist/WishlistAnalytics.jsx
│       │   └── Products/
│       │       ├── AddProduct.jsx       # 10-category card picker
│       │       ├── EditProduct.jsx      # Full edit with category picker
│       │       └── ViewProducts.jsx
│       ├── components/                  # Customer-facing pages
│       │   ├── Cart/Cart.jsx
│       │   ├── Checkout/Checkout.jsx
│       │   ├── HeroSlider.jsx           # Auto-advancing banner carousel
│       │   ├── Login/Login.jsx          # Role-based redirect on login
│       │   ├── SignUp/SignUp.jsx
│       │   ├── OrderSuccess/OrderSuccess.jsx
│       │   ├── Products/
│       │   │   ├── Cards.jsx            # Product grid with wishlist hearts
│       │   │   ├── CategorySection.jsx  # Per-category section on home
│       │   │   ├── CategoryPage.jsx     # /category/:name page
│       │   │   ├── CategoriesPage.jsx   # /categories listing page
│       │   │   └── ProductDetails.jsx   # Detail + reviews + wishlist
│       │   ├── Profile/Pofile.jsx       # Orders + wishlist + returns links
│       │   ├── Returns/ReturnRequest.jsx
│       │   ├── Wishlist/Wishlist.jsx
│       │   ├── Navigation.jsx           # Categories dropdown
│       │   ├── Footer.jsx
│       │   ├── Home.jsx                 # Products grouped by category
│       │   ├── AboutUs.jsx
│       │   └── ContactUs.jsx
│       ├── middlewares/
│       │   ├── ProtectedRoutes/         # Role-based route guard
│       │   └── PrivateRoutes/           # Auth-only route guard
│       ├── App.js                       # Main router (hides nav on auth pages)
│       └── index.js                     # App entry + admin route split
│
└── server/                              # Express Backend
    ├── config/
    │   └── mongoose.config.js           # MongoDB connection
    ├── controllers/
    │   ├── Authentication.Controller.js
    │   ├── Banner.Controller.js
    │   ├── cartController.Controller.js
    │   ├── OrderController.Controller.js
    │   ├── Product.Controller.js
    │   ├── Return.Controller.js         # NEW
    │   ├── User.Controller.js
    │   └── Wishlist.Controller.js       # NEW
    ├── middlewares/
    │   ├── authMiddleware.js            # JWT verification
    │   └── uploadMiddleware.js          # Multer image upload
    ├── models/
    │   ├── Banner.model.js
    │   ├── Order.model.js
    │   ├── Product.model.js
    │   ├── Return.model.js              # NEW
    │   ├── User.model.js
    │   └── Wishlist.model.js            # NEW
    ├── routes/
    │   └── routes.js                    # All API routes
    ├── upload/images/                   # Uploaded product/banner images
    ├── .env                             # Environment variables
    └── server.js                        # App entry point
```

---

## 11. Selenium Testing Plan (SQE)

### Test Suite Structure
```
ShopEase Test Suite
├── AuthTests
│   ├── testLoginSuccess()              — valid credentials → redirected to home
│   ├── testAdminLoginRedirect()        — admin login → redirected to /admin
│   ├── testLoginWrongPassword()        — invalid → error message shown
│   ├── testSignupSuccess()             — new user → account created
│   └── testSignupDuplicateEmail()      — duplicate → error message shown
│
├── ProductTests
│   ├── testProductsPageLoads()         — /products shows product grid
│   ├── testCategoryFilter()            — click category pill → filtered results
│   ├── testSearchProduct()             — type in search → results update
│   └── testProductDetailPage()         — click product → detail page loads
│
├── CartTests
│   ├── testAddToCart()                 — click Add to Cart → cart count increases
│   ├── testUpdateQuantity()            — +/- buttons → quantity updates
│   └── testRemoveFromCart()            — remove → item disappears
│
├── WishlistTests
│   ├── testAddToWishlist()             — click heart → heart fills red
│   ├── testRemoveFromWishlist()        — click filled heart → heart empties
│   ├── testWishlistPageShows()         — /wishlist → saved items visible
│   └── testMoveToCartFromWishlist()    — Add to Cart from wishlist → cart updates
│
├── ReturnTests
│   ├── testSubmitReturnRequest()       — fill form → success message shown
│   ├── testReturnAppearsInHistory()    — submit → appears in My Returns tab
│   ├── testReturnOnNonDelivered()      — non-delivered order → not in dropdown
│   └── testAdminApproveReturn()        — admin approves → status changes
│
└── AdminTests
    ├── testAdminDashboardLoads()       — /admin → stats cards visible
    ├── testAddProduct()                — fill form → product appears in list
    ├── testEditProduct()               — edit name → updated in view products
    ├── testDeleteProduct()             — delete → removed from list
    └── testUpdateOrderStatus()         — change dropdown → status updates
```

### Sample Selenium Test (Java)
```java
@Test
public void testAddToWishlist() {
    driver.get("http://localhost:3000/products");
    
    // Click heart button on first product
    WebElement heartBtn = driver.findElement(By.cssSelector(".shop-card button[title='Save to wishlist']"));
    heartBtn.click();
    
    // Wait for heart to fill red
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(3));
    wait.until(ExpectedConditions.attributeContains(heartBtn, "style", "ef4444"));
    
    // Navigate to wishlist and verify product is there
    driver.get("http://localhost:3000/wishlist");
    List<WebElement> items = driver.findElements(By.cssSelector(".shop-card"));
    Assert.assertTrue(items.size() > 0, "Wishlist should contain at least 1 item");
}

@Test
public void testSubmitReturnRequest() {
    driver.get("http://localhost:3000/returns");
    
    // Select order
    Select orderSelect = new Select(driver.findElement(By.cssSelector("select[value='']")));
    orderSelect.selectByIndex(1);
    
    // Select product
    Select productSelect = new Select(driver.findElements(By.cssSelector("select")).get(1));
    productSelect.selectByIndex(1);
    
    // Enter reason
    WebElement reason = driver.findElement(By.cssSelector("textarea"));
    reason.sendKeys("The product arrived damaged. The packaging was torn and the item was broken.");
    
    // Submit
    driver.findElement(By.cssSelector("button[type='submit']")).click();
    
    // Verify success message
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
    WebElement success = wait.until(ExpectedConditions.visibilityOfElementLocated(
        By.xpath("//*[contains(text(),'submitted successfully')]")));
    Assert.assertTrue(success.isDisplayed());
}
```

---

## 12. Security Considerations

| Concern | Implementation |
|---------|---------------|
| Password Storage | bcryptjs with 10 salt rounds — never stored in plain text |
| Authentication | JWT tokens with 7-day expiry |
| Authorization | Role-based access control — admin routes protected both client-side and server-side |
| Environment Secrets | All sensitive keys (MongoDB URI, JWT secret, Stripe keys) stored in `.env` |
| Input Validation | Mongoose schema-level validation on all models with custom error messages |
| File Uploads | Multer restricts uploads to `upload/images/` directory |
| Error Handling | Global error handler in Express catches unhandled exceptions |
| Route Protection | 404 handler for unknown routes, 403 page for unauthorized access |

---

## 13. Expected Outcomes

Upon completion, ShopEase delivers:

1. A fully functional e-commerce storefront at `localhost:3000`
2. Products displayed by category on the home page (4 per row per category)
3. A Categories page and dropdown with 10 categories
4. A secure admin panel at `localhost:3000/admin` with full management capabilities
5. Real payment processing via Stripe with automatic order creation
6. A dynamic homepage with admin-controlled banner slider
7. Wishlist module — users save products, admin sees analytics
8. Product Return module — users submit returns, admin processes them
9. Complete user journey: Register → Browse by Category → Wishlist → Cart → Checkout → Pay → View Orders → Return
10. Role-based authentication ensuring customers and admins have appropriate access

---

## 14. Timeline

| Week | Milestone |
|------|-----------|
| Week 1 | Project setup, database design, authentication (signup/login/JWT/RBAC) |
| Week 2 | Product CRUD, image upload, 10-category system, admin panel foundation |
| Week 3 | Shopping cart, checkout flow, Stripe integration, order management |
| Week 4 | Wishlist module, Product Return module, MongoDB unique IDs |
| Week 5 | Banner slider, category pages, UI polish, bug fixes |
| Week 6 | Selenium test suite, documentation, final presentation |

---

## 15. Tools & Development Environment

| Tool | Purpose |
|------|---------|
| Kiro IDE / VS Code | Code editor |
| MongoDB Atlas | Cloud database hosting |
| Stripe Dashboard | Payment testing and monitoring |
| Postman | API testing |
| Git | Version control |
| npm | Package management |
| nodemon | Auto-restart server during development |
| Selenium WebDriver | Automated UI testing (SQE) |
| Java / JUnit | Selenium test framework |

---

## 16. Conclusion

ShopEase demonstrates the practical application of modern full-stack web development principles combined with software quality engineering practices. By combining React for a dynamic frontend, Express.js for a RESTful backend, MongoDB for flexible data storage, and Stripe for secure payments, the project covers the complete software development lifecycle.

The project applies key Software Design and Architecture concepts including layered architecture (MVC), middleware patterns, role-based access control, and RESTful API design. The addition of the Wishlist and Product Return modules — each generating unique MongoDB IDs per user interaction — provides rich, testable functionality for the Software Quality Engineering course.

The Selenium test suite covers authentication, product browsing, cart operations, wishlist management, and return request submission, demonstrating thorough test coverage across all major user flows.

ShopEase is not just a lab exercise — it is a deployable, production-ready application that reflects industry standards and best practices across both software design and quality engineering.

---

*Prepared for SDA Lab & SQE Course — May 2026*
