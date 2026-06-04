import ProductModel from "../models/Product.model.js";
import User  from "../models/User.model.js";
import OrderModel from "../models/Order.model.js";
export const getOrderDetails = async (req, res) => {
    const { order_id } = req.params; // Extract order_id from route parameters
  
    try {
      // Fetch the order by its ID, populate product details and user details
      const order = await OrderModel.findById(order_id).populate('products.productId').populate('user');
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Send the order data back in the response
      res.status(200).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while fetching the order', error: error.message });
    }
  };
  // Get orders by user ID
export const getOrdersByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch orders for the given user ID
    const orders = await OrderModel.find({ user: userId })
      .populate("user", "name email") // Populate user details (optional)
      .populate("products.productId", "name price"); // Populate product details (optional)

    if (!orders.length) {
      return res.status(200).json([]); // Return empty array, not 404
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};
export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find().populate("user", "name email").populate("products.productId", "name");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;

  try {
    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { status: status, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error" });
  }
};