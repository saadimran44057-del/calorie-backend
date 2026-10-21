import { Router } from 'express';
import { Entry } from '../models/Entry.js';

const router = Router();

// GET /api/entries → list all foods, oldest first
router.get('/', async (req, res) => {
  try {
    const entries = await Entry.findAll({ order: [['createdAt', 'ASC']] });
    res.json(entries);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/entries → add a food
router.post('/', async (req, res) => {
  const { name, calories, protein, carbs, fat, grams } = req.body;

  if (!name || !grams || Number(grams) <= 0) {
    return res.status(400).json({ error: 'name and grams are required' });
  }

  try {
    const entry = await Entry.create({
      name,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      grams: Number(grams),
    });
    res.status(201).json(entry);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/entries/:id → remove one food
router.delete('/:id', async (req, res) => {
  try {
    const count = await Entry.destroy({ where: { id: req.params.id } });
    if (count === 0) return res.status(404).json({ error: 'Entry not found' });
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/entries → clear all foods
router.delete('/', async (req, res) => {
  try {
    await Entry.destroy({ where: {} });
    res.json({ cleared: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;