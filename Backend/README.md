# Backend Chat Application

This project is a backend server for a user and AI chatbot application. It provides endpoints for user authentication, chat management, and interaction with an AI model. The application uses Express, Supabase for database management, and NodeMailer for sending emails.

## Features

- User authentication with JWT tokens
- Email confirmation for user sign-up
- Chat management including creating, retrieving, and deleting chats
- Interaction with an AI model (mock implementation)
- Streaming responses for chat interactions

## Project Structure

```
Backend
├── src
│   ├── controllers
│   │   ├── authController.ts       # Handles user authentication
│   │   ├── chatController.ts       # Manages chat interactions
│   ├── middlewares
│   │   ├── authMiddleware.ts       # Middleware for JWT authentication
│   ├── models
│   │   ├── userModel.ts            # User model for Supabase
│   │   ├── chatModel.ts            # Chat model for Supabase
│   ├── routes
│   │   ├── authRoutes.ts           # Routes for authentication
│   │   ├── chatRoutes.ts           # Routes for chat management
│   ├── services
│   │   ├── emailService.ts         # Service for sending emails
│   │   ├── aiService.ts            # Service for AI interactions
│   ├── utils
│   │   ├── jwtUtils.ts             # Utility functions for JWT handling
│   ├── app.ts                      # Initializes the Express application
│   ├── server.ts                   # Entry point for starting the server
├── package.json                    # Project dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # Project documentation
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd Backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables for Supabase and NodeMailer in a `.env` file.

4. Start the server:
   ```
   npm run start
   ```

## API Endpoints

### Authentication

- **POST /api/auth/signup**: Sign up a new user (email confirmation required).
- **POST /api/auth/login**: Log in an existing user.

### Chat Management

- **POST /api/chat**: Create a new chat.
- **GET /api/chat**: Retrieve previous chats (pagination supported).
- **DELETE /api/chat/:id**: Delete a specific chat.
- **POST /api/chat/:id/message**: Interact with the AI model for a specific chat.

## Usage Examples

- To sign up a new user, send a POST request to `/api/auth/signup` with the user's email and password.
- To retrieve previous chats, send a GET request to `/api/chat` with optional pagination parameters.

## License

This project is licensed under the MIT License.