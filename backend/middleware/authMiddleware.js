
//   This file will contain our protect function. This function will:
//    1. Look for a token in the Authorization header of the request.
//    2. Validate the token to make sure it's legitimate.
//    3. If it's valid, decode it to get the user's ID.
//    4. Fetch that user from the database.
//    5. Attach the user's information to the req object as req.user.
//    6. Pass the request on to the next function in the chain (e.g., createPost).

import JWT from "jsonwebtoken";
import { sql } from "../config/db.js";

export const protect = async (req, res, next) => {
    let token;
    //check if authorization header exist and start with bearer 
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
            // get token from header (it's in the format "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            //verify the token using your secret key
            const decoded = JWT.verify(token, process.env.JWT_SECRET);

            // get user from the database using the id from the token 
            // we select everything EXCEPT the password for security
            const result = await sql `
                SELECT id, gmail, created_at FROM users WHERE id = ${decoded.id}
            `;

            req.user = result[0];

            //Move on to the next middleware controller
            next();

        } catch (error) {
            console.error(error);
            return res.status(400).json({message: "Not authorized, token failed"});
        }
    }
    if (!token){
        return res.status(400).json({message: "Not authorized, no token"});
    }
};