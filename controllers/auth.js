const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utilts/AppError');

// create first admin
const createFirstAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) return;

    await User.create({
      name: 'Super Admin',
      email: 'admin@example.com',
      password: '123456',
      role: 'admin',
      bio: 'system admin'
    });

    console.log('First admin created');
  } catch (err) {
    console.log('Error creating admin:', err.message);
  }
};


console.log("JWT_SECRET from env:", process.env.JWT_SECRET);
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

const signup = async (req, res, next) => {
  try {
    const { name, email, password, bio, role, photo } = req.body;
    const user = await User.create({ name, email, password, bio, role, photo });
    const token = signToken(user._id);
    res.status(201).json({ token, user });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return next(new AppError('Email and password required', 400));

    const user = await User.findOne({ email }).select('+password');
    if (!user) return next(new AppError('Incorrect email or password', 401));

    const ok = await user.correctPassword(password, user.password);
    if (!ok) return next(new AppError('Incorrect email or password', 401));

    const token = signToken(user._id);
    user.password = undefined;
    res.status(200).json({ token, user });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return next(new AppError('Not logged in', 401));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) return next(new AppError('User no longer exists', 401));

    req.user = currentUser;
    next();
  } catch (err) {
    next(new AppError('Invalid token', 401));
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
        console.log("User role:", req.user.role, "Allowed roles:", roles);
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Permission denied', 403));
    }
    next();
  };
};

module.exports = {
  createFirstAdmin,
  signup,
  login,
  protect,
  restrictTo,
};
