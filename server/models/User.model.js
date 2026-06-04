import { model, Schema } from "mongoose";

// Define User Schema
const userSchema = new Schema(
  {
    name: { 
      type: String, 
      required: [true, "Name is required"], 
      trim: true, 
      minlength: [3, "Name must be at least 3 characters long"] 
    },
    email: { 
      type: String, 
      required: [true, "Email is required"], 
      unique: true, 
      match: [/^\S+@\S+\.\S+$/, "Email is not valid"] 
    },  
    password: { 
      type: String, 
      required: [true, "Password is required"], 
      minlength: [6, "Password must be at least 6 characters long"] 
    },
    role: { 
      type: String, 
      enum: ["user", "admin"], 
      default: "user" 
    },
    cartData: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("User", userSchema);
