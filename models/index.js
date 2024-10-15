const { Sequelize } = require('sequelize');
const config = require('../config/config.json')['development'];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect
});

const User = require('./User')(sequelize);
const Food = require('./Food')(sequelize);
const Cart = require('./Cart')(sequelize);
const Order = require('./Order')(sequelize);

// Define associations
User.hasMany(Cart);
Cart.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

Food.hasMany(Cart);
Cart.belongsTo(Food);

Food.hasMany(Order);
Order.belongsTo(Food);

module.exports = {
  sequelize,
  User,
  Food,
  Cart,
  Order
};