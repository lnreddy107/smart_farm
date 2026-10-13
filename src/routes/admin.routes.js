import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

router.get('/metrics', (req, res) => {
  const metrics = db.getAdminMetrics();
  res.json({ success: true, metrics });
});

router.get('/users', (req, res) => {
  const { role } = req.query;
  let users = db.getUsers();
  if (role) {
    users = users.filter(u => u.role === role);
  }
  res.json({ success: true, count: users.length, users });
});

router.put('/users/:id', (req, res) => {
  const updated = db.updateUser(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, user: updated, message: 'User profile updated' });
});

router.get('/reports', (req, res) => {
  const orders = db.getOrders();
  const products = db.getProducts();

  // Category breakdown
  const categorySales = {};
  orders.forEach(order => {
    order.items?.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      const cat = prod?.category || 'Other';
      categorySales[cat] = (categorySales[cat] || 0) + (item.subtotal || item.price * item.quantity);
    });
  });

  // Top products
  const productPerformance = products.map(p => {
    let unitsSold = 0;
    let revenue = 0;
    orders.forEach(o => {
      o.items?.forEach(item => {
        if (item.productId === p.id) {
          unitsSold += item.quantity;
          revenue += item.subtotal || (item.price * item.quantity);
        }
      });
    });
    return {
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      stock: p.stock,
      unitsSold,
      revenue: Number(revenue.toFixed(2)),
      rating: p.rating
    };
  }).sort((a, b) => b.unitsSold - a.unitsSold);

  res.json({
    success: true,
    reports: {
      categorySales,
      topProducts: productPerformance.slice(0, 5),
      recentActivity: orders.slice(0, 5).map(o => ({
        id: o.id,
        customer: o.customerName,
        total: o.totalAmount,
        status: o.orderStatus,
        date: o.createdAt
      }))
    }
  });
});

router.post('/reset-db', (req, res) => {
  db.reset();
  res.json({ success: true, message: 'Database reset to initial demo seeds.' });
});

export default router;
