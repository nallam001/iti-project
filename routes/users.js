const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  getUserPhoto,
  updateUserPutMethod,
  updateUserPatchMethod,
  deleteUser,
} = require("../controllers/users");

const {
  createUserSchema,
  updateUserPutSchema,
  updateUserSchema,
} = require("../utilts/validarion/user");

const validate = require("../middlewares/vaidate");
const { uploadCDN } = require('../middlewares/multer-upload');
const uploadImageKit = require("../middlewares/uplaodImageKit");
const { protect, restrictTo } = require("../controllers/auth");

router.post(
  "/",
  uploadCDN.single('photo'),
  uploadImageKit(false),
  validate(createUserSchema),
  createUser
);

router.get("/", protect, restrictTo("admin"), getAllUsers);
router.get("/photo/:id", protect, getUserPhoto);
router.get("/:id", protect, getUserById);

router.put("/:id", protect, validate(updateUserPutSchema), updateUserPutMethod);
router.patch("/:id", protect, validate(updateUserSchema), updateUserPatchMethod);

router.delete("/:id", protect, restrictTo("admin"), deleteUser);

module.exports = router;
