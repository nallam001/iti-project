require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/database');
const userRoutes = require('./routes/users');
const postsRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');
const AppError = require('./utilts/AppError');
const errorHandler = require('./middlewares/errorHandler');
const { createFirstAdmin } = require("./controllers/auth");

connectDB().then(createFirstAdmin);


const app = express();

// DB
connectDB().then(createFirstAdmin);

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postsRoutes);

// 404
app.use((req, res, next) => {
  next(new AppError('Route not found', 404));
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
