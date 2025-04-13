
# Task Manager Application

A full-stack task management application built with React and Express.

## Features

- User authentication (admin and regular user roles)
- Task creation, editing, and deletion
- Task approval workflow
- Calendar view for task deadlines
- User profile management
- Responsive design for all devices

## Tech Stack

- Frontend: React with TypeScript, Tailwind CSS, Shadcn UI
- Backend: Express.js with SQLite database
- Authentication: Simple username/password (demo purposes)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   node server.js
   ```
   This will start the Express server on port 5000.

2. In a new terminal, start the frontend:
   ```
   npm run dev
   ```
   This will start the Vite development server, typically on port 8080.

3. Open your browser and navigate to `http://localhost:8080`

### Demo Credentials

- Admin User:
  - Username: admin
  - Password: admin123

- Regular User:
  - Username: user
  - Password: user123

## Development Notes

- The backend uses an Local Storage
- In Future we can connect to backend and database
