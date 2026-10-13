import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// Track current simulated session user in-memory (defaults to farmer)
let currentUser = db.getUserById('user-farmer-1');

router.get('/current', (req, res) => {
  if (!currentUser) {
    currentUser = db.getUserById('user-farmer-1');
  }
  // Refresh data from db
  const fresh = db.getUserById(currentUser.id);
  if (fresh) currentUser = fresh;
  
  res.json({ success: true, user: currentUser });
});

router.get('/users', (req, res) => {
  const users = db.getUsers();
  res.json({ success: true, users });
});

router.post('/switch', (req, res) => {
  const { role, userId } = req.body;
  let targetUser = null;

  if (userId) {
    targetUser = db.getUserById(userId);
  } else if (role) {
    targetUser = db.getUsers().find(u => u.role === role);
  }

  if (!targetUser) {
    return res.status(404).json({ success: false, message: 'User persona not found' });
  }

  currentUser = targetUser;
  res.json({
    success: true,
    message: `Switched active persona to ${currentUser.name} (${currentUser.role})`,
    user: currentUser
  });
});

export default router;
