# Task-manager-MUI

# Task Manager Application

A frontend task management application built with React + Vite and Material

## Features

* User authentication (admin and regular user roles)
* Task creation, editing, and deletion
* Task approval workflow
* Calendar view for task deadlines
* User profile management
* Responsive design for all devices

## Tech Stack

* **Frontend:** React with JavaScript, Material UI and Tailwind CSS
* **Backend:** Localstorage + Seed
* **Authentication:** Simple username/password (demo purposes)

## Getting Started

### Installation

1.  Clone the repository
2.  Install dependencies:

    npm install
   

### Running the Application

1. To Start The Application

    npm run dev


    This will start the Vite development server, typically on port 8080.
3.  Open your browser and navigate to `http://localhost:8080`

### Demo Credentials

**Admin User:**

* Username: `admin`
* Password: `admin123`

**Regular User:**

* Username: `user`
* Password: `user123`

## Development Notes

* The backend uses an in-memory SQLite database.  Data will be reset each time the server restarts.
* In the future, the application can be connected to a persistent database.
