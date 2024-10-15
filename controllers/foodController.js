const { Food } = require('../models');
const Joi = require('joi');

const foodSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  price: Joi.number().positive().required()
});

exports.createFood = async (req, res) => {
  try {
    const { error } = foodSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const food = await Food.create(req.body);
    res.status(201).json(food);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllFood = async (req, res) => {
  try {
    const foods = await Food.findAll();
    res.json(foods);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findByPk(req.params.id);
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }
    res.json(food);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateFood = async (req, res) => {
  try {
    const { error } = foodSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const food = await Food.findByPk(req.params.id);
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }

    await food.update(req.body);
    res.json(food);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findByPk(req.params.id);
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }

    await food.destroy();
    res.json({ message: 'Food removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};