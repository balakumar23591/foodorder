const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, cartController.addToCart);
router.get('/', authMiddleware, cartController.getCart);
router.put('/:id', authMiddleware, cartController.updateCartItem);
router.delete('/:id', authMiddleware, cartController.removeFromCart);

module.exports = router;