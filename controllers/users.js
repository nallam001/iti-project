const AppError = require('../utilts/AppError');
const User = require('../models/userModel');

const createUser = async (req, res, next) => {
  try {
    const userData = {
      ...req.body,
      photo:
        (req.cdnUrls && req.cdnUrls[0]) ||
        (req.localFilenames && req.localFilenames[0]) ||
        req.body.photo
    };

    const user = new User(userData);
    const savedUser = await user.save();

    res.status(201).json({
      message: "User created successfully",
      user: savedUser
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return next(new AppError("User not found", 404));

    res.status(200).json(user);
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

const getUserPhoto = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError("User not found", 404));
    res.status(200).json({ images: user.photo });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

const updateUserPutMethod = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (req.cdnUrls || req.localFilenames) {
      updateData.photo = (req.cdnUrls && req.cdnUrls[0]) || (req.localFilenames && req.localFilenames[0]);
    }
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!user) return next(new AppError("User not found", 404));
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

const updateUserPatchMethod = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (req.cdnUrls || req.localFilenames) {
      updates.photo = (req.cdnUrls && req.cdnUrls[0]) || (req.localFilenames && req.localFilenames[0]);
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return next(new AppError("User not found", 404));
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(new AppError("User not found", 404));
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserPhoto,
  updateUserPutMethod,
  updateUserPatchMethod,
  deleteUser
};
