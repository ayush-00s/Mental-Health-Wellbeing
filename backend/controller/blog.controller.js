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