const express = require('express');
const store = require('../db/store');

const router = express.Router();

// GET /orders — list all orders.
router.get('/', (req, res) => {
  res.json(store.listOrders());
});

// GET /orders/:id — fetch one order, or 404 if it doesn't exist.
router.get('/:id', (req, res) => {
  const order = store.getOrder(Number(req.params.id));
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  return res.json(order);
});

// POST /orders — create an order. Requires userId, productId, and quantity.
router.post('/', (req, res) => {
  const { userId, productId, quantity, status } = req.body;
  if (!userId || !productId || !quantity) {
    return res.status(400).json({ error: 'userId, productId, and quantity are required' });
  }
  const order = store.createOrder({ userId, productId, quantity, status });
  return res.status(201).json(order);
});

// PUT /orders/:id — update an existing order (status and/or quantity).
router.put('/:id', (req, res) => {
  const { status, quantity } = req.body;
  if (status === undefined && quantity === undefined) {
    return res.status(400).json({ error: 'status or quantity is required' });
  }
  const order = store.updateOrder(Number(req.params.id), { status, quantity });
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  return res.json(order);
});

module.exports = router;
