const express = require("express");
const router = express.Router();
const { getPosts, getPostById, createPost, updatePost, deletePost } = require("../controllers/posts.controller");
const validate = require("../middlewares/vaidate");
const { createPostSchema, updatePostSchema } = require("../utilts/validarion/post.validation");
const { uploadLocal, uploadCDN } = require("../middlewares/multer-upload");
const uploadImageKit = require("../middlewares/uplaodImageKit");
const { protect } = require("../controllers/auth");

router.get("/", getPosts);
router.get("/:id", getPostById);

router.post(
  "/",
  protect,
  uploadLocal.single("photo"),
  uploadCDN.single("photo"),
  uploadImageKit(false),
  validate(createPostSchema),
  createPost
);

router.patch(
  "/:id",
  protect,
  uploadLocal.single("photo"),
  uploadCDN.single("photo"),
  uploadImageKit(false),
  validate(updatePostSchema),
  updatePost
);

// Delete
router.delete("/:id", protect, deletePost);

module.exports = router;
