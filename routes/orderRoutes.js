const express = require('express');
const Order = require('../models/orderModel');

const router = express.Router();


// POST: Create a new order
router.post('/', async (req, res) => {
  try {
    const { items, shippingAddress, subtotal, tax, shippingFee, total, userId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart items cannot be empty' });
    }

    const newOrder = await Order.create({
      user: userId || null,
      items,
      shippingAddress,
      subtotal,
      tax,
      shippingFee,
      total,
      status: 'Processing'
    });

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});
// GET: Fetch orders for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user orders', error: error.message });
  }
});

// GET: Fetch an order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving order' });
  }
});

module.exports = router;