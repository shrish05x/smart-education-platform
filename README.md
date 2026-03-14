# Smart Education Platform

A full-stack MERN (MongoDB, Express.js, React, Node.js) education platform with AI-powered tutoring, mentorship, community forums, mental health support, and internship listings.

## Tech Stack

- **Frontend:** React (Vite) + TailwindCSS + React Router DOM + Axios
- **Backend:** Node.js + Express.js + Mongoose
- **Database:** MongoDB
- **Real-Time:** Socket.io
- **Auth:** JWT with role-based access control
- **AI:** OpenAI API integration

## Project Structure

```
smart-education-platform/
├── client/          # React frontend
├── server/          # Express backend
├── docs/            # Documentation
├── scripts/         # Utility scripts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (running locally or Atlas URI)
- OpenAI API Key (for AI features)

### Backend Setup

```bash
cd server
npm install
# Create .env file (see .env.example)
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

App runs on `http://localhost:5173`

## User Roles

- **Student** – Access AI tutor, join study groups, connect with mentors
- **Mentor** – Provide mentorship, chat with students
- **Counselor** – Provide mental health support sessions
- **Admin** – Manage platform, users, and content

## Features

- 🤖 AI-Powered Tutoring & Resource Recommendations
- 👨‍🏫 Mentor Directory & Session Booking
- 💬 Community Forum & Study Groups
- 🧠 Mental Health Support & Counseling
- 💼 Internship Board
- 🔔 Real-Time Notifications & Chat
- 📊 Analytics Dashboard
- 🔐 JWT Authentication with Role-Based Access

## API Endpoints

| Prefix                | Module        |
|-----------------------|---------------|
| `/api/auth`           | Authentication|
| `/api/users`          | Users         |
| `/api/mentors`        | Mentors       |
| `/api/mentorship`     | Mentorship    |
| `/api/community`      | Community     |
| `/api/counseling`     | Counseling    |
| `/api/internships`    | Internships   |
| `/api/ai`             | AI Services   |
| `/api/notifications`  | Notifications |
| `/api/analytics`      | Analytics     |
| `/api/admin`          | Admin         |

## License

MIT
