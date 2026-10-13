import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

router.get('/', (req, res) => {
  const { farmerId } = req.query;
  const crops = db.getCrops(farmerId);
  res.json({ success: true, count: crops.length, crops });
});

router.get('/:id', (req, res) => {
  const crop = db.getCropById(req.params.id);
  if (!crop) {
    return res.status(404).json({ success: false, message: 'Crop not found' });
  }
  res.json({ success: true, crop });
});

router.post('/', (req, res) => {
  const { name, variety, plot, acreage, plantingDate, expectedHarvestDate, stage, healthStatus, notes, farmerId } = req.body;
  if (!name || !plantingDate) {
    return res.status(400).json({ success: false, message: 'Crop name and planting date are required' });
  }

  const newCrop = db.addCrop({
    name,
    variety: variety || 'Standard',
    plot: plot || 'Main Plot',
    acreage: Number(acreage) || 1,
    plantingDate,
    expectedHarvestDate: expectedHarvestDate || '',
    stage: stage || 'Seeding',
    healthStatus: healthStatus || 'Optimal',
    notes: notes || '',
    farmerId: farmerId || 'user-farmer-1',
    farmId: 'farm-1'
  });

  res.status(201).json({
    success: true,
    message: 'Crop registered successfully',
    crop: newCrop
  });
});

router.put('/:id', (req, res) => {
  const updated = db.updateCrop(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Crop not found' });
  }
  res.json({
    success: true,
    message: 'Crop updated successfully',
    crop: updated
  });
});

router.delete('/:id', (req, res) => {
  const deleted = db.deleteCrop(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Crop not found' });
  }
  res.json({ success: true, message: 'Crop removed successfully' });
});

export default router;
