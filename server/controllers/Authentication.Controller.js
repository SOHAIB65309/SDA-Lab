import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Secret key for JWT (make sure to store this securely)
const JWT_SECRET = process.env.JWT_SECRET || "my_dear_pineapple";

// Signup function
export const signup = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ name, email, password: hashedPassword });
      await user.save();
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "30d" });
      res.status(201).json({ message: "User registered successfully", token, user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Login function
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Update profile function
export const updateProfile = async (req, res) => {
  try {
    const { name, age, hobbies } = req.body;
    const userId = req.user.userId; // Retrieve userId from middleware

    // Update user information
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, age, hobbies },
      { new: true, runValidators: true }
    );

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get profile function
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Retrieve userId from middleware
    const user = await User.findById(userId).select("-password"); // Exclude password from response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

