const Product = require('../models/Product');

// @route  POST /api/products
// @desc   Create a new product
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/products
// @desc   Get products, with optional search, category filter, and pagination
exports.getProducts = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;

    // build a filter object step by step, based on what the user provided
    const filter = {};

    if (search) {
      // uses the text index we created on the Product model
      filter.$text = { $search: search };
    }

    if (category) {
      filter.category = category;
    }

    // pagination math: skip = how many documents to skip over
    // e.g. page 2 with limit 10 means skip the first 10, then take the next 10
    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/products/stats/catalog
// @desc   MongoDB aggregation demo: stats grouped by category
exports.getCatalogStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          averagePrice: { $avg: '$price' },
          totalProducts: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          maxPrice: { $max: '$price' },
          minPrice: { $min: '$price' },
        },
      },
      { $sort: { totalProducts: -1 } },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};