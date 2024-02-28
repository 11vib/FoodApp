import { Router } from 'express';
import { getAllFoods, getFoodById } from '../controller/foodController.js';
const router = Router();
router.get('/', getAllFoods);
router.get('/:id', getFoodById);

export default router;
