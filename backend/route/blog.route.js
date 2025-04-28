import express from 'express';
import { createBlog, getBlog, getBlogById } from '../controller/blog.controller.js';

const router = express.Router();

router.get("/", getBlog);
router.post("/create", createBlog);
router.get("/:id", getBlogById);

export default router;