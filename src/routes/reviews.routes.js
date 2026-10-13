import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

router.get('/', (req, res) => {
  const { productId } = req.query;
  const reviews = db.getReviews(productId);
  res.json({ success: true, count: reviews.length, reviews });
});

router.post('/', (req, res) => {
  const { productId, rating, comment, customerId, customerName } = req.body;

  if (!productId || !rating || !comment) {
    return res.status(400).json({ success: false, message: 'Product ID, rating (1-5), and review text are required' });
  }

  const newReview = db.addReview({
    productId,
    rating: Number(rating),
    comment,
    customerId: customerId || 'user-customer-1',
    customerName: customerName || 'Priya Sharma'
  });

  res.status(201).json({
    success: true,
    message: 'Dhanyawad! Your review has been published.',
    review: newReview
  });
});

export default router;
