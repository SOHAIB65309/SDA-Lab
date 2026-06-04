import { model, Schema } from "mongoose";

const wishlistSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
  },
  { timestamps: true }
);

// Prevent duplicate wishlist entries for same user + product
wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

export default model("Wishlist", wishlistSchema);
