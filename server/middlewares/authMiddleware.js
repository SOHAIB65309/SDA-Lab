import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "my_dear_pineapple";

export const fetchUser = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access Denied. No token provided." });
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; // Add decoded token to request
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid Token" });
    }
  };
