import express from "express";

import { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } from "../controllers/blogPostsController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// public routes
router.get("/api/blogs", getAllBlogs);
router.get("/api/blogs/:id", getBlogById);

//protected routes (only loggedin users can access)

router.post("/api/blogs", protect, createBlog);
router.put("/api/blogs/:id", protect, updateBlog);
router.delete("/api/blogs/:id", protect, deleteBlog);

export default router;