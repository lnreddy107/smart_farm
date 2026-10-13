import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

router.get('/', (req, res) => {
  const { farmerId, category, search, status } = req.query;
  const products = db.getProducts({ farmerId, category, search, status });
  res.json({ success: true, count: products.length, products });
});

router.get('/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, product });
});

router.post('/', (req, res) => {
  const { name, category, price, unit, stock, organic, description, image, farmerId, farmName } = req.body;
  if (!name || !price || stock === undefined) {
    return res.status(400).json({ success: false, message: 'Product name, price, and initial stock are required' });
  }

  const newProduct = db.addProduct({
    name,
    category: category || 'Vegetables',
    price: Number(price),
    unit: unit || 'kg',
    stock: Number(stock),
    organic: Boolean(organic),
    description: description || 'Desi farm-harvested fresh organic produce.',
    image: image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
    farmerId: farmerId || 'user-farmer-1',
    farmName: farmName || 'Kisan Vikas Organic Farms'
  });

  res.status(201).json({
    success: true,
    message: 'Produce listed on marketplace successfully',
    product: newProduct
  });
});

router.put('/:id', (req, res) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({
    success: true,
    message: 'Product updated successfully',
    product: updated
  });
});

router.delete('/:id', (req, res) => {
  const deleted = db.deleteProduct(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, message: 'Product deleted successfully' });
});

export default router;
