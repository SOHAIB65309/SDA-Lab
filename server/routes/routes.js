import Router from 'express';
import { getAllProducts, getReviewById, PostReviewById, fetchNewCollection, fetchPopularInWomen, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/Product.Controller.js';
import { getAllBanners, getAllBannersAdmin, createBanner, toggleBanner, deleteBanner } from '../controllers/Banner.Controller.js';
import { getWishlist, addToWishlist, removeFromWishlist, checkWishlist, getAllWishlists, getWishlistStats } from '../controllers/Wishlist.Controller.js';
import { createReturn, getUserReturns, getAllReturns, updateReturnStatus, getReturnStats } from '../controllers/Return.Controller.js';
import upload from '../middlewares/uploadMiddleware.js';
import {
  createUser,
  getOneUser,
  updateOneUserById,
  deleteOneUser,
  getAllUser
} from '../controllers/User.Controller.js';
import { signup, login, updateProfile, getProfile } from "../controllers/Authentication.Controller.js";
import { addToCart, getCart, updateQuantity, RemovefromCart ,Checkout,handleStripeSuccess} from "../controllers/cartController.Controller.js";
import {getOrderDetails,getOrdersByUserId,getAllOrders ,updateOrderStatus} from "../controllers/OrderController.Controller.js";
import { fetchUser } from "../middlewares/authMiddleware.js";
const router = Router();

// CRUD routes for products
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.get('/products/:id/review', getReviewById);
router.post('/products/:id/reviews', PostReviewById);
router.post('/addproduct', upload.single('image'), createProduct);
router.put('/editproducts/:id', upload.single('image'), updateProduct);
router.delete('/removeproduct/:id', deleteProduct);

// Banner routes
router.get('/banners', getAllBanners);
router.get('/banners/all', getAllBannersAdmin);
router.post('/banners', upload.single('image'), createBanner);
router.put('/banners/:id/toggle', toggleBanner);
router.delete('/banners/:id', deleteBanner);

// Wishlist routes — specific routes BEFORE parameterized ones
router.get('/wishlist/check/:userId/:productId', checkWishlist);
router.get('/admin/wishlists', getAllWishlists);
router.get('/admin/wishlist-stats', getWishlistStats);
router.get('/wishlist/:userId', getWishlist);
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:userId/:productId', removeFromWishlist);

// Return routes
router.post('/returns', createReturn);
router.get('/returns/user/:userId', getUserReturns);
router.get('/admin/returns', getAllReturns);
router.put('/admin/returns/:id', updateReturnStatus);
router.get('/admin/return-stats', getReturnStats);

router.post("/cart/:userId", addToCart);
router.get("/cart/:userId", getCart);
router.put("/cart/update/:userId/:productId", updateQuantity);
router.delete("/cart/delete/:userId/:productId", RemovefromCart);
router.get('/newcollection', fetchNewCollection);
router.get('/popularinwomen', fetchPopularInWomen);
router.get('/success', handleStripeSuccess); 
router.post("/checkout", Checkout);

// CRUD routes for Users
router.get("/users", getAllUser);
router.get("/users/:id", getOneUser);
router.post("/users", createUser);
router.put("/users/:id", updateOneUserById);
router.delete("/users/:id", deleteOneUser);

// Public routes
router.post("/signup", signup);
router.post("/login", login);

router.get('/orders/:order_id', getOrderDetails);
router.get("/order/:userId", getOrdersByUserId);
router.get("/orders", getAllOrders);
router.put("/orders/status", updateOrderStatus);
router.put("/profile", fetchUser, updateProfile);
router.get("/profile", fetchUser, getProfile);

export default router;