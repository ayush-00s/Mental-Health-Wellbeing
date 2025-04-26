import express from 'express';
import { getBlog } from '../controller/blog.controller.js';

const router = express.Router();

router.get("/", getBlog);

export default router;