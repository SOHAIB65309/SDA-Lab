import { model, Schema } from "mongoose";

// Define the Product schema
const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],  // Custom validation message
    trim: true,  // Remove extra whitespace
    minlength: [3, 'Product name must be at least 3 characters long']  // Min length validation
  },
  category: {
    type: String,
    required: [true, 'Product category is required']
  },
  image: {
    type: String,
    required: [true, 'Product image is required']
  },
  new_price: {
    type: Number,
    required: [true, 'New price is required'],
    min: [0, 'New price cannot be negative']  // Validation to ensure price is not negative
  },
  old_price: {
    type: Number,
    min: [0, 'Old price cannot be negative'],
    validate: {
      validator: function (value) {
        // Only validate when a value is actually provided
        if (value === null || value === undefined) return true;
        return value >= this.new_price;
      },
      message: 'Old price must be greater than or equal to the new price'
    },
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  uploaded_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',  // Reference the User model
    required: [true, 'Uploaded by field is required']
  },
  stars: {
    type: Number,
    required: false,
    default: 0,
    min: [0, 'Rating must be at least 0 stars'],
    max: [5, 'Rating cannot exceed 5 stars']
  },
  reviews: [
    {
      username: { type: String, required: true },
      comment: { type: String, required: true },
      rating: { type: Number, min: 1, max: 5, required: true }
    }
  ],
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt fields
});

// Export the Product model
export default model('Product', productSchema);
