const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, foodController.createFood);
router.get('/', foodController.getAllFood);
router.get('/:id', foodController.getFoodById);
router.put('/:id', authMiddleware, foodController.updateFood);
router.delete('/:id', authMiddleware, foodController.deleteFood);

module.exports = router;