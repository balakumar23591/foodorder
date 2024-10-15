const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Food = sequelize.define('Food', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  });

  return Food;
};