const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      // restricts category to one of these values only
      enum: [
        'Smartphones',
        'Laptops',
        'Audio',
        'Wearables',
        'Gaming',
        'Accessories',
        'Cameras',
      ],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    image: {
      type: String, // URL to product image
      required: [true, 'Image URL is required'],
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    tags: [String], // e.g. ["wireless", "noise-cancelling"]
  },
  { timestamps: true }
);

// Text index enables MongoDB's built-in search on these fields
productSchema.index({ name: 'text', brand: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);