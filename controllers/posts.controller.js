const Post = require("../models/post.model");

async function getPosts(req, res) {
  const posts = await Post.find().populate("userId", "name email");
  res.json(posts);
}

async function getPostById(req, res) {
  const post = await Post.findById(req.params.id).populate("userId", "name email");
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
}

async function createPost(req, res) {
  const { title, content, userId } = req.body;
  const cdn = req.cdnUrls && req.cdnUrls[0];
  const local = req.file ? `/uploads/${req.file.filename}` : null;
  const photo = cdn || local || "no-image.png";

  const post = new Post({ title, content, userId, photo });
  await post.save();
  res.status(201).json(post);
}

async function updatePost(req, res) {
    try {
        const updates = { ...req.body };

        const cdn = req.cdnUrls && req.cdnUrls[0];
        const local = req.file ? `/uploads/${req.file.filename}` : null;

        if (cdn || local) updates.photo = cdn || local;
        const post = await Post.findByIdAndUpdate(req.params.id, updates, { new: true });

        if (!post) return res.status(404).json({ message: "Post not found" });

        res.json(post);
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}


async function deletePost(req, res) {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json({ message: "Post successfully deleted" });
}

module.exports = { getPosts, getPostById, createPost, updatePost, deletePost };
