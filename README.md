# AI Screening Agent Server

This is the backend server for the AI Screening Agent application. It handles user authentication, manages testimonials, and interacts with the n8n automation platform.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Features

- User registration and authentication (local, Google OAuth)
- JWT-based authentication for secure API access
- Testimonial management (create, read, update, delete)
- Integration with n8n for automated workflows
- Secure API with rate limiting, helmet, and cors
- Centralized logging with Winston
- API documentation with Swagger

## Getting Started

### Prerequisites

- Node.js (v20.10.6 or later)
- npm
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ai-screening-agent-server.git
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add the following environment variables:
   ```
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

### Running the Application

- **Development Mode:**
  ```bash
  npm run dev
  ```
- **Production Mode:**
  ```bash
  npm run build
  npm start
  ```

## API Endpoints

The API endpoints are documented using Swagger. You can access the Swagger UI at `/api-docs` when the server is running.

### Authentication

- `POST /api/auth/signup`: Register a new user.
- `POST /api/auth/login`: Login a user.
- `GET /api/auth/verify-email`: Verify user email.
- `POST /api/auth/forgot-password`: Send password reset email.
- `POST /api/auth/reset-password`: Reset user password.
- `GET /api/auth/login/google`: Login with Google.
- `GET /api/auth/register/google`: Register with Google.
- `GET /api/auth/google/callback`: Google callback.
- `GET /api/auth/me`: Get the authenticated user.
- `POST /api/auth/logout`: Logout a user.

### Testimonials

- `GET /api/testimonials`: Get all testimonials.
- `GET /api/testimonials/approved`: Get all approved testimonials.
- `GET /api/testimonials/:id`: Get a testimonial by ID.
- `POST /api/testimonials`: Create a new testimonial.
- `PUT /api/testimonials/:id`: Update a testimonial.
- `DELETE /api/testimonials/:id`: Delete a testimonial.

### Users

- `GET /api/users`: Get all users.
- `GET /api/users/:id`: Get a user by ID.
- `PUT /api/users/:id`: Update a user.
- `DELETE /api/users/:id`: Delete a user.

### n8n

- `POST /api/n8n`: Handle n8n webhook.

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** Passport.js (local, Google OAuth), JWT
- **Testing:** Jest, Supertest
- **Linting:** ESLint
- **Other:** TypeScript, Nodemailer, Winston, Swagger

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the ISC License.
