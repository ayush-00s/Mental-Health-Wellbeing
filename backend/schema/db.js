import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: { type: String, 
            required: true 
        },
    email: {type: String, 
            required: true, 
            unique: true
    },
    password: {
        type: String,
        select: false,
    },
});

const blogsSchema = mongoose.Schema({
    title: String,
    content: String,
    author: String,
    date: String,
    image: String
});


const UserModel = mongoose.model("User", userSchema);
const BlogModel = mongoose.model("Blogs", blogsSchema);

export { UserModel, BlogModel };