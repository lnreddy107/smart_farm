import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

router.get('/', (req, res) => {
  const farmerId = req.query.farmerId || 'user-farmer-1';
  const expenses = db.getExpenses(farmerId);
  const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  res.json({
    success: true,
    count: expenses.length,
    totalAmount: Number(totalExpense.toFixed(2)),
    expenses
  });
});

router.post('/', (req, res) => {
  const { title, category, amount, date, notes, farmerId } = req.body;
  if (!title || !amount) {
    return res.status(400).json({ success: false, message: 'Expense title and amount are required' });
  }

  const newExpense = db.addExpense({
    title,
    category: category || 'General Farm Maintenance',
    amount: Number(amount),
    date: date || new Date().toISOString().split('T')[0],
    notes: notes || '',
    farmerId: farmerId || 'user-farmer-1'
  });

  res.status(201).json({
    success: true,
    message: 'Expense recorded successfully',
    expense: newExpense
  });
});

router.delete('/:id', (req, res) => {
  const deleted = db.deleteExpense(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Expense record not found' });
  }
  res.json({ success: true, message: 'Expense deleted successfully' });
});

export default router;
