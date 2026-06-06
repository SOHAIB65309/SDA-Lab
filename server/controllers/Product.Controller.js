import ProductModel from "../models/Product.model.js";
import UserModel from "../models/User.model.js";
// Get all products
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Fetch new collection
export const fetchNewCollection = async (req, res, next) => {
  try {
    const products = await ProductModel.find().populate('uploaded_by', 'name');
    const newCollection = products.slice(-8); // Fetch last 8 items
    res.status(200).json(newCollection);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching new collection', error });
  }
};

// Fetch popular in women — matches category "womens" as stored in DB
export const fetchPopularInWomen = async (req, res, next) => {
  try {
    const products = await ProductModel.find({ category: "womens" }).populate('uploaded_by', 'name');
    const popularInWomen = products.slice(0, 4);
    res.status(200).json(popularInWomen);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching popular items in women', error });
  }
};

// Get a product by ID
export const getProductById = async (req, res, next) => {
  const productId = req.params.id;
  try {
    const products = await ProductModel.findById(productId);
    if (!products) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(products);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, category, new_price, old_price, status, uploaded_by } = req.body;

    // Check file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Product image is required' });
    }

    // Construct the image URL
    let imageUrl;
    if (req.file.buffer) {
      // If we have a buffer (Memory Storage / Vercel), convert to Data URI for permanent storage in DB
      const b64 = req.file.buffer.toString('base64');
      imageUrl = `data:${req.file.mimetype};base64,${b64}`;
    } else {
      // If we have a filename (Disk Storage / Local), use the dynamic server path
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      imageUrl = `${baseUrl}/images/${req.file.filename}`;
    }

    // Ensure required fields are provided
    if (!name || !category || !new_price || !uploaded_by) {
      return res.status(400).json({ message: 'Missing required fields: name, category, new_price, uploaded_by' });
    }

    // Validate that 'uploaded_by' exists in the database
    const userExists = await UserModel.findById(uploaded_by);
    if (!userExists) {
      return res.status(400).json({ message: 'Invalid user ID for uploaded_by' });
    }

    // Parse prices as numbers
    const parsedNewPrice = parseFloat(new_price);
    const parsedOldPrice = old_price && old_price !== 'null' && old_price !== '' ? parseFloat(old_price) : null;

    // Validate old_price >= new_price if provided
    if (parsedOldPrice !== null && parsedOldPrice < parsedNewPrice) {
      return res.status(400).json({ message: 'Old price must be greater than or equal to new price' });
    }

    // Create the new product object
    const product = new ProductModel({
      name,
      category,
      image: imageUrl,
      new_price: parsedNewPrice,
      old_price: parsedOldPrice,
      status: status || 'active',
      uploaded_by,
      stars: 0,
    });

    // Save the product to the database
    await product.save();

    // Return the newly created product
    res.status(201).json(product);

  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};


// Update a product by ID
export const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const { name, category, new_price, old_price, status, stars } = req.body;

  try {
    // Find the product by ID
    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Handle new image upload if provided
    if (req.file) {
      if (req.file.buffer) {
        // Vercel / Memory Storage
        const b64 = req.file.buffer.toString('base64');
        product.image = `data:${req.file.mimetype};base64,${b64}`;
      } else {
        // Local / Disk Storage
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        product.image = `${baseUrl}/images/${req.file.filename}`;
      }
    }

    // Validate incoming data based on your schema
    if (new_price !== undefined && new_price !== null && new_price !== '') {
      const parsedPrice = parseFloat(new_price);
      if (parsedPrice < 0) return res.status(400).json({ message: 'New price cannot be negative' });
      product.new_price = parsedPrice;
    }

    if (old_price !== undefined && old_price !== null && old_price !== '') {
      const parsedOld = parseFloat(old_price);
      if (parsedOld < 0) return res.status(400).json({ message: 'Old price cannot be negative' });
      product.old_price = parsedOld;
    }

    if (stars !== undefined && stars !== null && stars !== '') {
      const parsedStars = parseFloat(stars);
      if (parsedStars < 0 || parsedStars > 5) return res.status(400).json({ message: 'Rating must be between 0 and 5 stars' });
      product.stars = parsedStars;
    }

    // Update other fields
    if (name) product.name = name;
    if (category) product.category = category;
    if (status) product.status = status;

    // Save the updated product
    await product.save();

    // Return the updated product as response
    res.status(200).json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// Delete a product by ID
export const deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await ProductModel.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};
// Get a product by ID
export const getReviewById = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id).select("reviews");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product.reviews);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
// Post a review on a product
export const PostReviewById = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { username, comment, rating } = req.body;
    if (!username || !comment || !rating) {
      return res.status(400).json({ message: "username, comment, and rating are required" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    product.reviews.push({ username, comment, rating: Number(rating) });

    // Recalculate average star rating
    const total = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.stars = parseFloat((total / product.reviews.length).toFixed(1));

    await product.save();
    res.status(201).json(product.reviews[product.reviews.length - 1]);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};