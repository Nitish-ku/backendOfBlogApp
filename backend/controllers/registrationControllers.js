import { sql } from "../config/db.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
    const { gmail, password } = req.body
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
        if (existingUser.length > 0){
            return res.status(400).json({message:"User already registered"});
        }

        // Hashing the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Inserting the new  user into database 
        const newUser = await sql `
            INSERT INTO users (gmail, password)
            VALUES (${gmail}, ${hashedPassword})
        `;
        return res.status(200).json({data: newUser[0], message:"use has been registered"});
    } catch(error){
        return res.status(400).json({message: "Internal server error"});
    }
};