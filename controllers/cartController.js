const { Cart, Food } = require('../models');
const Joi = require('joi');

const cartSchema = Joi.object({
  foodId: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().positive().required()
});

exports.addToCart = async (req, res) => {
  try {
    const { error } = cartSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { foodId, quantity } = req.body;
    const userId = req.user.id;

    const food = await Food.findByPk(foodId);
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }

    let cartItem = await Cart.findOne({ where: { UserId: userId, FoodId: foodId } });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        UserId: userId,
        FoodId: foodId,
        quantity
      });
    }

    res.status(201).json(cartItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await Cart.findAll({
      where: { UserId: userId },
      include: [{ model: Food, attributes: ['name', 'price'] }]
    });

    res.json(cartItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { error } = cartSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { quantity } = req.body;
    const userId = req.user.id;
    const cartItemId = req.params.id;

    const cartItem = await Cart.findOne({ where: { id: cartItemId, UserId: userId } });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.json(cartItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItemId = req.params.id;

    const cartItem = await Cart.findOne({ where: { id: cartItemId, UserId: userId } });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await cartItem.destroy();
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};