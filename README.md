# Blog Post API Backend

This is a complete backend service for a blog application, built with Node.js and Express. It provides a secure and robust API for user registration, authentication, and full CRUD (Create, Read, Update, Delete) functionality for blog posts.

## Features

- **Secure User Authentication**: User registration with password hashing (`bcrypt`) and login using JSON Web Tokens (JWT).
- **Protected Routes**: Middleware ensures that only authenticated users can create, update, or delete their own posts.
- **Full CRUD for Blog Posts**:
    - `CREATE` a new blog post.
    - `READ` all blog posts (publicly available) or a single post by its ID.
    - `UPDATE` an existing blog post (author only).
    - `DELETE` a blog post (author only).
- **RESTful API Design**: Follows REST principles for a clean and predictable API structure.
- **Serverless Database**: Uses Neon, a modern serverless Postgres database.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for building the API.
- **PostgreSQL (via `@neondatabase/serverless`)**: Database for storing user and post data.
- **`jsonwebtoken`**: For creating and verifying JWTs for authentication.
- **`bcrypt`**: For securely hashing user passwords.
- **`dotenv`**: For managing environment variables.

## API Endpoints

### User Routes

| Method | Endpoint                | Protection | Description                  |
| :----- | :---------------------- | :--------- | :--------------------------- |
| `POST` | `/api/users/register`   | Public     | Register a new user.         |
| `POST` | `/api/users/login`      | Public     | Log in an existing user.     |

### Blog Post Routes

| Method   | Endpoint         | Protection | Description                                      |
| :------- | :--------------- | :--------- | :----------------------------------------------- |
| `GET`    | `/api/blogs`     | Public     | Get a list of all blog posts.                    |
| `GET`    | `/api/blogs/:id` | Public     | Get a single blog post by its ID.                |
| `POST`   | `/api/blogs`     | Private    | Create a new blog post. (Requires token)         |
| `PUT`    | `/api/blogs/:id` | Private    | Update a blog post. (Requires token, author only) |
| `DELETE` | `/api/blogs/:id` | Private    | Delete a blog post. (Requires token, author only) |

## Setup and Installation

To get this project running locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd backendofblogpost
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file:**
    Create a `.env` file in the root of the `backend` directory and add the following environment variables.

    ```
    # Port for the server to run on
    PORT=3000

    # Your Neon database connection string
    DATABASE_URL="your_neon_database_connection_string"

    # A strong, secret key for signing JWTs
    JWT_SECRET="your_super_secret_jwt_key"
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The server will start on the port you specified in your `.env` file.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
