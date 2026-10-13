import express from 'express';
import { db } from '../db/database.js';
import { config } from '../config/index.js';

const router = express.Router();

router.get('/', (req, res) => {
  const { customerId, farmerId, status } = req.query;
  const orders = db.getOrders({ customerId, farmerId, status });
  res.json({ success: true, count: orders.length, orders });
});

router.get('/:id', (req, res) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, order });
});

router.post('/', (req, res) => {
  const { items, customerId, customerName, customerEmail, shippingAddress, paymentMethod } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
  }

  // Calculate pricing in Rupees (₹)
  let subtotal = 0;
  const processedItems = [];

  for (const item of items) {
    const product = db.getProductById(item.productId);
    if (!product) {
      return res.status(400).json({ success: false, message: `Product ${item.productId} does not exist` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for "${product.name}". Available: ${product.stock}`
      });
    }

    const itemSubtotal = product.price * item.quantity;
    subtotal += itemSubtotal;

    processedItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      quantity: item.quantity,
      farmerId: product.farmerId,
      farmName: product.farmName,
      subtotal: Number(itemSubtotal.toFixed(2))
    });
  }

  const deliveryFee = 40.00; // Flat ₹40 delivery in India
  const platformFee = Number((subtotal * config.platformCommissionRate).toFixed(2));
  const totalAmount = Number((subtotal + deliveryFee).toFixed(2));

  const newOrder = db.createOrder({
    customerId: customerId || 'user-customer-1',
    customerName: customerName || 'Priya Sharma',
    customerEmail: customerEmail || 'priya.sharma@gmail.com',
    shippingAddress: shippingAddress || 'Flat 402, Shanti Niketan, Indiranagar, Bengaluru, Karnataka - 560038',
    items: processedItems,
    subtotal: Number(subtotal.toFixed(2)),
    deliveryFee,
    platformFee,
    totalAmount,
    paymentMethod: paymentMethod || 'UPI / PhonePe',
    paymentStatus: (paymentMethod && paymentMethod.includes('Cash')) ? 'pending' : 'paid',
    orderStatus: 'Confirmed'
  });

  res.status(201).json({
    success: true,
    message: 'Order placed successfully! Farm order confirmed.',
    order: newOrder
  });
});

router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
    });
  }

  const updated = db.updateOrderStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  res.json({
    success: true,
    message: `Order status updated to "${status}"`,
    order: updated
  });
});

export default router;
