import { sql } from "../config/db.js";

export const getAllBlogs = async(req,res) => {
    try{
        const allBlogs = await sql `
            SELECT * FROM blogPosts 
        `;
        return res.status(200).json({data: allBlogs});
    } catch (error) {
        console.error("Error fetching posts: ", error);
        return res.status(400).json({message: "Internal sever error"});
    }
};

export const createBlog = async(req,res) => {
    const {title, content} = req.body;
    const author_id = req.user.id;

    if (!title || !content){
        return res.status(400).json({message: "Title and Content are required"});
    }

    try{
        const newBlog = await sql `
            INSERT INTO blogPosts (title, content, author_id)
            VALUES (${title}, ${content}, ${author_id})
            RETURNING *
        `
        return res.status(200).json({data: newBlog});

    } catch(error){
        console.error("Error creating posts: ", error);
        return res.status(400).json({message: "Internal server error"});
    }

};

export const getBlogById = async(req,res) => {
    const {id} = req.params;
    try{
        const getBlog = await sql `
         SELECT * FROM blogPosts WHERE id = ${id}
        `;
        if(getBlog === 0){
            return res.status(400).json({message: "post not found"});
        }
        return res.status(200).json({data: getBlog[0]});
    } catch(error){
        console.error("Error fetching blog post: ", error);
        return res.status(400).json({message: "Internal server error"});
    }

};

export const updateBlog = async(req,res) => {
    // Grt the POST ID from the url
    const {id} = req.params;
    //Get the new title and the content from the request body
    const {title, content} = req.body;
    //Get the logged-in user id
    const author_id = req.user.id;

    if (!title || !content){
        return res.status(400).json({message: "All the fields are required"});
    }
    try{
        // first get the POST to check who the author is 
        const existingBlog = await sql `
            SELECT author_id FROM blogPosts WHERE id = ${id}
        `;
        if (existingBlog.length === 0){
            return res.status(400).json({message: "Post not found"});
        }

        //Srcurity check: Ensure that the loggedin user is the author 
        if(existingBlog[0].author_id !== author_id) {
            return res.status(400).json({message:"You're not the author of this Blog"});
        }

        // if the check passes, update the post
        const updatedBlog = await sql`
            UPDATE blogPosts
            SET title = ${title}, content = ${content}
            WHERE id = ${id}
            RETURNING *
        `;
        return res.status(200).json({data: updatedBlog[0]});
    } catch(error){
        console.error("Error updating post: ", error);
        return res.status(400).json({message: "Internal server error"});
    }
};

export const deleteBlog = async(req,res) => {
    //get the post id from the url 
    const {id} = req.params;
    // get the logged in user's id
    const author_id = req.user.id;

    try{
        // first get the post to check who the author is 
        const existingBlog = await sql`
            SELECT author_id FROM blogPosts WHERE id = ${id}
        `;
        if(existingBlog.length === 0){
            return res.status(400).json({message: "post not found"});
        }
        if(existingBlog[0].author_id !== author_id){
            return res.status(400).json({message: "You are not the author of the post"});
        }

        // if the check passes, delete the post 
        await sql `
            DELETE FROM blogPosts WHERE id = ${id}
        `;
        return res.status(204).send();
    } catch (error) {
        console.error("Error deleting post: ", error);
        return res.status(400).json({message: "Internal Server error"});
    }
};



//Source 1: The Logged-In User


//    * When a user logs in, your application gives them a token (a JWT).
//    * To make a request to updatePost or deletePost, the user must send that token with the request.
//    * A special function, called middleware, will run before updatePost. This middleware's only job is to check the token and see which user it
//      belongs to.
//    * If the token is valid, the middleware gets the user's data from the database and attaches it to the request object as req.user.
//    * So, const author_id = req.user.id; gets the ID of the user who is currently sending the request. This variable represents the person at
//      the keyboard.

//   Source 2: The Post in the Database


//    * The user wants to update a specific post, for example, the post with an ID of 5. This 5 is in the URL (/api/posts/5) and is put into the
//      id variable with const { id } = req.params;.
//    * The SQL query SELECT author_id FROM posts WHERE id = ${id} does one thing: it looks into the posts table, finds the row for post 5, and
//      reads the author_id value that is stored in that row.
//    * This value, which we get from existingPost[0].author_id, represents the ID of the person who originally created the post. This is the
//      post's true owner, according to your database.

//   The Comparison


//   The line if(existingPost[0].author_id !== author_id) compares these two sources.

//    * existingPost[0].author_id: The ID of the post's owner.
//    * author_id (from req.user.id): The ID of the person making the request.


//   The code checks: "Is the person making this request the same person who owns this post?"

//   If they are not the same, the request is forbidden. This is the security check. We cannot trust that the person making the request is the
//   owner; we must verify it by checking the data stored in our database.