# Team Task Manager

A full-stack Team Task Management System built using Flask, React, TypeScript, PostgreSQL, and JWT Authentication.

This application allows admins to create projects, assign tasks, manage members, and monitor submissions, while members can track and update their assigned work through a modern dashboard UI.

---

# Features

## Authentication & Authorization

- JWT Authentication
- Role-based access control
- Admin and Member dashboards
- Protected frontend routes
- Protected backend APIs

---

# Admin Features

- Create projects
- Add members to projects
- Create and assign tasks
- Set task priorities
- Set task due dates
- Monitor task progress
- View member submissions
- Dashboard statistics

---

# Member Features

- View assigned tasks
- Update task status
- Submit work using submission URLs
- Separate sections for:
  - Ongoing Tasks
  - Completed Tasks
  - Overdue Tasks
- Deadline protection for expired tasks
- Profile modal
- Toast notifications

---

# Tech Stack

## Frontend

- React
- TypeScript
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast
- Vite

## Backend

- Flask
- Flask JWT Extended
- Flask SQLAlchemy
- PostgreSQL
- Flask CORS
- Python Dotenv

---

# Project Structure

```bash
team-task-manager/
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── decorators/
│   ├── config.py
│   ├── app.py
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── services/
│
└── README.md