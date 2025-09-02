const express = require('express');
const {
  signup,
  login,
  protect,
  restrictTo,
  createFirstAdmin
} = require('../controllers/auth');

const router = express.Router();

router.get('/create-admin', async (req, res, next) => {
  try {
    await createFirstAdmin();
    res.status(200).json({ message: 'Admin check done' });
  } catch (err) {
    next(err);
  }
});

router.post('/signup', signup);
router.post('/login', login);

router.get('/profile', protect, (req, res) => {
  res.status(200).json({ user: req.user });
});

router.get('/admin-only', protect, restrictTo('admin'), (req, res) => {
  res.status(200).json({ message: 'Welcome admin' });
});

module.exports = router;
