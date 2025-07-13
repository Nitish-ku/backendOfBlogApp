import {sql} from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// helper function to generate a token

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: "30d", // The token will expire in 30 days
    });
};

export const loginUser = async(req,res) => {
    const {gmail, password} = req.body;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if ( !gmail || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    if (!regex.test(gmail)){
        return res.status(400).json({message: "Invalid gmail format"});
    }


    try{
        const existingUser = await sql`
            SELECT * FROM users WHERE gmail = ${gmail}
        `;
        if (existingUser.length === 0){
            return res.status(400).json({message: "User not found"});
        } 
        
            const user = existingUser[0];
            const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch){
            return res.status(400).json({message: "incorrect password"});
        } 
        if (isMatch){
        // if password is correct, generate a token and send it back
        const token = generateToken(user.id);
        return res.status(200).json({message: "Login successful", token: token, user: {
            id: user.id,
            gmail: user.gmail
        }});
        } 

        } catch (error){
            console.log("Login Error: ", error);
            return res.status(400).json({message: "Error in the server"});
        }

    };
