import { BlogModel } from "../schema/db.js";

export const getBlog = async (req, res) => {
    try {
        const blog = await BlogModel.find();
        res.status(200).json(blog);
    } catch (error) {
        console.log("error: ", error);
        res.status(500).json(error);
    }
};

export const createBlog = async (req, res) => {
    try {
        const { title, content, author, image, category } = req.body;
        
        // Validate required fields
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }
        
        // Create new blog post
        const newBlog = new BlogModel({
            title,
            content,
            author: author || "Anonymous", // Default author if not provided
            date: new Date().toISOString(),
            image,
            category
        });
        
        await newBlog.save();
        
        res.status(201).json({ 
            success: true, 
            message: "Blog created successfully",
            blog: newBlog
        });
    } catch (error) {
        console.log("error creating blog: ", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to create blog post",
            error: error.message
        });
    }
};

export const getBlogById = async (req, res) => {
    try {
        const blog = await BlogModel.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog post not found" });
        }
        res.status(200).json(blog);
    } catch (error) {
        console.log("error: ", error);
        res.status(500).json(error);
    }
};