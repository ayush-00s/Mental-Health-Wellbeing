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

const mentalHealthReportSchema = new mongoose.Schema({
    user: {
      type: String, 
       
      required: true,
    },
    user_responses: String,
    analysis_result: String,
    created_at: {
      type: Date,
      default: Date.now,
    }
  });

  


const UserModel = mongoose.model("User", userSchema);
const BlogModel = mongoose.model("Blogs", blogsSchema);
const MentalHealthReport = mongoose.model("MentalHealthReport", mentalHealthReportSchema);

export { UserModel, BlogModel, MentalHealthReport };