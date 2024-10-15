const { Order, Cart, Food } = require('../models');
const Joi = require('joi');

const orderSchema = Joi.object({
  status: Joi.string().valid('pending', 'processing', 'completed', 'cancelled')
});

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await Cart.findAll({
      where: { UserId: userId },
      include: [{ model: Food, attributes: ['price'] }]
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const total = cartItems.reduce((sum, item) => sum + item.quantity * item.Food.price, 0);

    const order = await Order.create({
      UserId: userId,
      total,
      status: 'pending'
    });

    // Clear the cart
    await Cart.destroy({ where: { UserId: userId } });

    res.status(201).json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.findAll({ where: { UserId: userId } });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const order = await Order.findOne({ where: { id: orderId, UserId: userId } });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { error } = orderSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const userId = req.user.id;
    const orderId = req.params.id;
    const { status } = req.body;

    const order = await Order.findOne({ where: { id: orderId, UserId: userId } });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const order = await Order.findOne({ where: { id: orderId, UserId: userId } });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Cannot cancel order that is not pending' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};