import express from "express";
import dotenv from "dotenv";
import {sql} from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import blogPostsRoutes from "./routes/blogPostsRoutes.js";

const app = express();

dotenv.config();

const {PORT} = process.env;

app.use(express.json());

app.use(userRoutes);
app.use(blogPostsRoutes);

const initDB = async() => {
   try{
    await sql `
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            gmail TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    // new table for the blog posts
    await sql `
        CREATE TABLE IF NOT EXISTS blogPosts (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            author_id INTEGER NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `;
    console.log("Database initialized");
   } catch (error){
        console.error("Database error: ", error);
        process.exit(1); // stop the server
   }
};

// start server
const startServer = async()=>{
    await initDB();
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
};

startServer();

