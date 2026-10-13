import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

router.get('/', (req, res) => {
  const farmerId = req.query.farmerId || 'user-farmer-1';
  const farm = db.getFarmByOwnerId(farmerId);
  if (!farm) {
    return res.status(404).json({ success: false, message: 'Farm profile not found' });
  }
  res.json({ success: true, farm });
});

router.get('/metrics', (req, res) => {
  const farmerId = req.query.farmerId || 'user-farmer-1';
  const metrics = db.getFarmerMetrics(farmerId);
  res.json({ success: true, metrics });
});

router.get('/:id', (req, res) => {
  const farm = db.getFarmById(req.params.id);
  if (!farm) {
    return res.status(404).json({ success: false, message: 'Farm not found' });
  }
  res.json({ success: true, farm });
});

router.put('/:id', (req, res) => {
  const updated = db.updateFarm(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Farm not found' });
  }
  res.json({ success: true, farm: updated, message: 'Farm profile updated successfully' });
});

export default router;
