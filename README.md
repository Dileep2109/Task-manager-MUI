# Task-manager-MUI

A frontend task management application built with React + Vite and Material UI

## Features

* User authentication (admin and regular user roles)
* Task creation, editing, and deletion
* Task approval workflow
* Calendar view for task deadlines
* User profile management
* Responsive design for all devices

## Tech Stack

* **Frontend:** React with JavaScript, Material UI and Tailwind CSS

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

* Username: `smdileep@gmail.com`
* Password: `admin123`

**Regular User:**

* Username: `user@gmail.com`
* Password: `user123`


**##Features**

**User Roles:**
* Admin
Approve or reject submitted tasks with comments
View all users' tasks in a multi-user calendar
Create or delete any task

*Regular User
Create and manage personal tasks
Upload photo(s) to tasks
Submit tasks for admin approval
View only their own tasks in calendar

** Task Management**
* Create tasks with:
Title, Description, Progress (%), Deadline
Upload multiple images per task
Submit tasks for review

**User Profile**
*Profile page with:
Full Name
Mobile Number
Profile Photo
Role (read-only)
Editable profile (except role)
Track task status: Pending / Approved / Rejected

**Dashboard**
*Overview of:
Current tasks
Pending approvals
Upcoming deadlines
Task progress bars
Quick links to calendar and profile

**Calendar View**
* Built with react-big-calendar
* Color-coded tasks


**Light/Dark mode toggle**

**Filter tasks by:**
* Status
* User
* Date range

**Fully responsive design**

**Multiple image uploads with preview**



## Future Improvements

* The backend uses Localstorage.
* In the future we can connect to backend and real database
* Enable Admins to assign tasks to different users or reassign based on workload.
* Drag-and-Drop Task Reordering: Allow users to sort or rearrange tasks visually.
