import User from "../models/User.model.js";
import ProductModel from "../models/Product.model.js";
import OrderModel from "../models/Order.model.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
 
// Add Product to Cart
export const addToCart = async (req, res) => {
  try {
    const { userId } = req.params; // Assume `userId` is passed in the request params
    const { productId, quantity } = req.body;

    // Validate input
    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid product or quantity" });
    }

    // Find user and product
    const user = await User.findById(userId);
    const product = await ProductModel.findById(productId);
    if (!user || !product) {
      return res.status(404).json({ message: "User or Product not found" });
    }

    // Check if the product already exists in the cart
    const cartItem = user.cartData.find(
      (item) => item.productId.toString() === productId
    );

    if (cartItem) {
      // Update quantity if product exists in the cart
      cartItem.quantity += quantity;
    } else {
      // Add new product to cart
      user.cartData.push({
        productId,
        quantity,
        price: product.new_price,
      });
    }

    // Save user data
    await user.save();

    res.status(200).json({ message: "Product added to cart", cart: user.cartData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("cartData.productId");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ cart: user.cartData });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};
// Update cart item quantity
export const updateQuantity = async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: "Invalid quantity value" });
  }

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the cart item in the user's cartData array
    const cartItem = user.cartData.find(item => item.productId.toString() === productId);

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    // Update the quantity of the found cart item
    cartItem.quantity = quantity;
    await user.save();

    return res.status(200).json({ message: "Quantity updated successfully", cartItem });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const RemovefromCart = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    // Find the user and remove the cart item by productId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the cart item and remove it
    const cartItemIndex = user.cartData.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    // Remove the item from the cart
    user.cartData.splice(cartItemIndex, 1);
    await user.save();

    return res.status(200).json({ message: "Item removed from cart" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const Checkout = async (req, res) => {
  const { userId, shippingAddress } = req.body;

  try {
    // Validate the input
    if (!userId || !shippingAddress) {
      return res.status(400).json({ message: "User ID and Shipping address are required" });
    }

    // Fetch the user data from the database
    const user = await User.findById(userId).populate('cartData.productId');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract products from the user's cart and calculate the total amount
    const mockProducts = user.cartData.map(item => {
      const product = item.productId;
      const price = parseFloat(item.price);  // Ensure price is a valid number
      const quantity = parseInt(item.quantity, 10);  // Ensure quantity is a valid integer

      // Log the product details for debugging
      console.log(`Product: ${product.name}, Price: ${price}, Quantity: ${quantity}`);

      return {
        productId: product._id,
        name: product.name,  // Assuming 'name' is available in Product model
        price: price,  // Assuming 'price' is available in Product model
        quantity: quantity,
      };
    });

    // Calculate the total amount (in cents)
    const totalAmount = mockProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Log the total amount for debugging
    console.log(`Total Amount: ${totalAmount}`);

    // Check if totalAmount is valid
    if (isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({ message: "Invalid total amount" });
    }

    // Create a checkout session with Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: mockProducts.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,  // Dynamically set the product name
          },
          unit_amount: item.price * 100, // Convert price to cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`}/api/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/checkout`,
      metadata: {
        shipping: JSON.stringify(shippingAddress),
        userId: user._id.toString(),
        orderId: 'mock-order-id',
      },
    });

    // Respond with the session ID for the client to use
    res.json({
      sessionId: session.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
export const handleStripeSuccess = async (req, res) => {
  const { session_id } = req.query;  // The session ID passed in the success URL

  if (!session_id) {
    return res.status(400).json({ message: "Session ID is required" });
  }

  try {
    // Step 1: Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log("Session Metadata:", session.metadata);  // Check session metadata
    if (!session) {
      return res.status(400).json({ message: "Invalid session ID" });
    }

    // Step 2: Fetch the user from the session metadata
    const { userId } = session.metadata;  // Get userId from metadata
    if (!userId) {
      return res.status(400).json({ message: "User ID not found in session metadata" });
    }

    const user = await User.findById(userId).populate('cartData.productId');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 3: Parse shipping address from JSON string
    const shippingAddress = JSON.parse(session.metadata.shipping);  // Parse the JSON string to an object
    
    // Step 4: Create an order from the session data
    const order = new OrderModel({
      user: user._id,
      products: user.cartData.map(item => ({
        productId: item.productId._id,  // Change 'product' to 'productId'
        name: item.productId.name,
        quantity: item.quantity,
        price: item.productId.new_price,  // Use the correct price field (new_price)
      })),
      totalAmount: session.amount_total / 100,  // Convert cents to dollars
      shippingAddress: shippingAddress,  // Use the parsed shipping address object
    });

    // Save the order to the database
    await order.save();

    // Step 5: Clear the user's cart data
    user.cartData = [];
    await user.save();

    // Step 6: Respond with a success message or redirect to a success page
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/order-success?order_id=${order._id}`);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};



