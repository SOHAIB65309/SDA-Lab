import WishlistModel from "../models/Wishlist.model.js";
import ProductModel from "../models/Product.model.js";

// Get all wishlist items for a user
export const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const items = await WishlistModel.find({ userId })
      .populate("productId", "name image new_price old_price category stars status")
      .sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist", error: error.message });
  }
};

// Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ message: "userId and productId are required" });
    }

    // Check product exists
    const product = await ProductModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Try to create — unique index will reject duplicates
    const item = new WishlistModel({ userId, productId });
    await item.save();

    res.status(201).json({ message: "Added to wishlist", item });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Product already in wishlist" });
    }
    res.status(500).json({ message: "Error adding to wishlist", error: error.message });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const deleted = await WishlistModel.findOneAndDelete({ userId, productId });
    if (!deleted) return res.status(404).json({ message: "Wishlist item not found" });
    res.status(200).json({ message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Error removing from wishlist", error: error.message });
  }
};

// Check if a product is in user's wishlist
export const checkWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const item = await WishlistModel.findOne({ userId, productId });
    res.status(200).json({ inWishlist: !!item });
  } catch (error) {
    res.status(500).json({ message: "Error checking wishlist", error: error.message });
  }
};

// Admin: get all wishlists with user info (to see popular products)
export const getAllWishlists = async (req, res) => {
  try {
    const items = await WishlistModel.find()
      .populate("userId", "name email")
      .populate("productId", "name image new_price category")
      .sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all wishlists", error: error.message });
  }
};

// Admin: get most wishlisted products (analytics)
export const getWishlistStats = async (req, res) => {
  try {
    const stats = await WishlistModel.aggregate([
      { $group: { _id: "$productId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 1,
          count: 1,
          "product.name": 1,
          "product.image": 1,
          "product.new_price": 1,
          "product.category": 1,
        },
      },
    ]);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist stats", error: error.message });
  }
};
