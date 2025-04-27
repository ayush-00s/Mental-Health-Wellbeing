import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import blogRoute from "./route/blog.route.js";
import userRoute from "./route/user.route.js";
import mentalHealthRoute from "./route/mentalhealth.route.js";

dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const URI = process.env.MongoDBURI;

// connect to mongodb
try {
    await mongoose.connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("Connected to MongoDB");
} catch (error) {
    console.log("Error:", error);
}

// defining routes
app.use("/Blog", blogRoute);
app.use("/User", userRoute);
app.use("/MentalHealth", mentalHealthRoute);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});