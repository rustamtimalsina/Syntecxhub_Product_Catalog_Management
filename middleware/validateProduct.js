const { body, validationResult } = require('express-validator');

// Rules: what makes a valid product creation/update request
exports.productValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required'),

  body('brand')
    .trim()
    .notEmpty()
    .withMessage('Brand is required'),

  body('category')
    .isIn([
      'Smartphones',
      'Laptops',
      'Audio',
      'Wearables',
      'Gaming',
      'Accessories',
      'Cameras',
    ])
    .withMessage('Category must be one of the allowed values'),

  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),

  body('image')
    .trim()
    .notEmpty()
    .withMessage('Image URL is required'),

  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative whole number'),
];

// Middleware that actually checks the rules above and stops the request if they fail
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};