require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');
const userRoutes = require('./routes/userRoutes');
const foodRoutes = require('./routes/foodRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Global error handler
app.use(errorHandler);

sequelize.sync().then(() => {
  console.log('Database connected');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});