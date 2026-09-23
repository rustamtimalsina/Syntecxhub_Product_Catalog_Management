const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getCatalogStats,
} = require('../controllers/productController');
const protect = require('../middleware/authMiddleware');
const { productValidationRules, validate } = require('../middleware/validateProduct');

// Public routes — anyone can browse/search the catalog
router.get('/', getProducts);
router.get('/stats/catalog', getCatalogStats);
router.get('/:id', getProductById);

// Protected + validated routes
router.post('/', protect, productValidationRules, validate, createProduct);
router.put('/:id', protect, productValidationRules, validate, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;