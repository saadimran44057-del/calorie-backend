import { Router } from 'express';
import { Goal } from '../models/Goal.js';

const router = Router();

// Get the goals row, or create it with default values the first time
const getGoals = async () => {
  const [goal] = await Goal.findOrCreate({ where: { id: 1 } });
  return goal;
};

// GET /api/goals → read goals
router.get('/', async (req, res) => {
  try {
    res.json(await getGoals());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/goals → update goals
router.put('/', async (req, res) => {
  try {
    const goal = await getGoals();
    const { calories, protein, carbs, fat } = req.body;
    await goal.update({
      calories: Number(calories) || goal.calories,
      protein: Number(protein) || goal.protein,
      carbs: Number(carbs) || goal.carbs,
      fat: Number(fat) || goal.fat,
    });
    res.json(goal);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;