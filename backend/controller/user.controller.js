import { UserModel } from "../schema/db.js";  
import bcryptjs from "bcryptjs";  //used to hash the password

export const signup = async (req, res) => {  
    try {
        const {name, email, password} = req.body;
        
        // Check if user exists
        const existingUser = await UserModel.findOne({email});  
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        
        const hashPassword = await bcryptjs.hash(password, 10);
        // Create new user
        const newUser = new UserModel({ 
            name: name,
            email: email,
            password: hashPassword 
        });
        
        await newUser.save();  
        res.status(201).json({message:"User created successfully"});
    } catch (error) {
        console.log("error: " + error.message);
        res.status(500).json({message:"Internal server error"});        
    }
}

export const signin = async (req, res) => {
    try {
        const {email,password} = req.body;
        const user = await UserModel.findOne({email}).select('+password');
        
        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }
        
        const isMatch = await bcryptjs.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        
        res.status(200).json({
            message:"Login successful",
            user:{
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error){
        console.log("error: " + error.message);
        res.status(500).json({message:"Internal server error"});
    }
}