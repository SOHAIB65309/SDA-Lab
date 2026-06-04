import ReturnModel from "../models/Return.model.js";
import OrderModel from "../models/Order.model.js";

// User: submit a return request
export const createReturn = async (req, res) => {
  try {
    const { userId, orderId, productId, productName, reason, quantity, refundAmount } = req.body;

    // Validate required fields
    if (!userId || !orderId || !productId || !reason || !quantity) {
      return res.status(400).json({ message: "Missing required fields: userId, orderId, productId, reason, quantity" });
    }
    if (!productName || productName.trim() === '') {
      return res.status(400).json({ message: "Product name is required" });
    }
    if (reason.trim().length < 10) {
      return res.status(400).json({ message: "Reason must be at least 10 characters" });
    }

    // Verify the order exists and belongs to this user
    const order = await OrderModel.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "This order does not belong to you" });
    }

    // Allow returns only for delivered orders
    if (order.status !== "delivered") {
      return res.status(400).json({
        message: `Cannot return an order with status "${order.status}". Only delivered orders can be returned.`
      });
    }

    // Check if a return for this product in this order already exists
    const existing = await ReturnModel.findOne({ userId, orderId, productId });
    if (existing) {
      return res.status(409).json({ message: "A return request for this product has already been submitted" });
    }

    const returnRequest = new ReturnModel({
      userId,
      orderId,
      productId,
      productName: productName.trim(),
      reason: reason.trim(),
      quantity: Number(quantity),
      refundAmount: refundAmount ? Number(refundAmount) : 0,
      status: "pending",
    });

    await returnRequest.save();
    res.status(201).json({ message: "Return request submitted successfully", returnRequest });
  } catch (error) {
    console.error("Error creating return:", error);
    // Mongoose cast error — invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({ message: `Invalid ID format for field: ${error.path}` });
    }
    res.status(500).json({ message: "Error submitting return request", error: error.message });
  }
};

// User: get their own return requests
export const getUserReturns = async (req, res) => {
  try {
    const { userId } = req.params;
    const returns = await ReturnModel.find({ userId })
      .populate("orderId", "totalAmount createdAt")
      .populate("productId", "name image")
      .sort({ createdAt: -1 });
    res.status(200).json(returns);
  } catch (error) {
    res.status(500).json({ message: "Error fetching returns", error: error.message });
  }
};

// Admin: get all return requests
export const getAllReturns = async (req, res) => {
  try {
    const returns = await ReturnModel.find()
      .populate("userId", "name email")
      .populate("orderId", "totalAmount createdAt status")
      .populate("productId", "name image new_price")
      .sort({ createdAt: -1 });
    res.status(200).json(returns);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all returns", error: error.message });
  }
};

// Admin: update return status (approve / reject / refunded)
export const updateReturnStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote, refundAmount } = req.body;

    const validStatuses = ["pending", "approved", "rejected", "refunded"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const returnRequest = await ReturnModel.findByIdAndUpdate(
      id,
      { status, adminNote: adminNote || "", refundAmount: refundAmount || 0 },
      { new: true }
    );

    if (!returnRequest) return res.status(404).json({ message: "Return request not found" });
    res.status(200).json({ message: "Return status updated", returnRequest });
  } catch (error) {
    res.status(500).json({ message: "Error updating return status", error: error.message });
  }
};

// Admin: get return stats
export const getReturnStats = async (req, res) => {
  try {
    const total = await ReturnModel.countDocuments();
    const pending = await ReturnModel.countDocuments({ status: "pending" });
    const approved = await ReturnModel.countDocuments({ status: "approved" });
    const rejected = await ReturnModel.countDocuments({ status: "rejected" });
    const refunded = await ReturnModel.countDocuments({ status: "refunded" });
    res.status(200).json({ total, pending, approved, rejected, refunded });
  } catch (error) {
    res.status(500).json({ message: "Error fetching return stats", error: error.message });
  }
};
