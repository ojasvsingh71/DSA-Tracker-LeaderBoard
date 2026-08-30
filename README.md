# 🧠 DSA Tracker Leaderboard

<p align="center">
  <strong>Track, compare, and compete — all in one place.</strong><br/>
  A full-stack web application for admins to manage student groups and showcase real-time DSA performance across LeetCode, CodeChef, and Codeforces.
</p>

<p align="center">
  <a href="https://dsa-tracker-leaderboard.vercel.app">
    <img src="https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel" alt="Live Demo" />
  </a>
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-brightgreen?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/License-ISC-yellow?style=for-the-badge" alt="License" />
</p>

---

<img width="959" height="500" alt="Screenshot 2026-08-30 151457" src="https://github.com/user-attachments/assets/a646cc3b-62e5-4f54-892e-652f5d9e3b49" />
<img width="959" height="498" alt="Screenshot 2026-08-30 151508" src="https://github.com/user-attachments/assets/e4f2b112-3287-46ea-9148-88552419c749" />


🔗 **Live Demo:** [View Sample Leaderboard](https://dsa-tracker-leaderboard.vercel.app/leaderboard/68713cbbdf2711a3a4b0529a)

---

## 📚 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#-architecture)
- [API Reference](#-api-reference)
- [Data Models](#-data-models)
- [Getting Started](#-getting-started-local-setup)
- [Environment Variables](#-environment-variables)
- [Deployment](#️-deployment)
- [Future Improvements](#-future-improvements)

---

## 🌟 Overview

**DSA Tracker Leaderboard** is a full-stack web application built for educators, mentors, and contest organizers to:

- **Manage student cohorts** by creating groups and adding students with their coding platform handles.
- **Auto-sync stats** from LeetCode (and soon Codeforces & CodeChef) every 10 minutes via a background cron job.
- **Rank students** on a sortable leaderboard by problems solved, streaks, contest rating, and difficulty breakdown.
- **Share public leaderboards** — no login required for viewers, just a shareable link.

> Built with dark/light theme support, toast notifications, protected routes, and a responsive UI designed for both desktop and mobile.

---

## 🔍 Features

| Feature | Description |
|---|---|
| 🔐 **Admin Authentication** | Secure register/login with JWT + bcrypt password hashing |
| 🧑‍🏫 **Group Management** | Create, edit, and delete student groups |
| 🧑‍💻 **Student Management** | Add/edit/remove students with platform handles (LeetCode, CodeChef, Codeforces) |
| 📈 **Live Leaderboard** | Sortable by total solved, streak, contest rating, easy/medium/hard counts |
| 🔄 **Auto-Sync via Cron** | Stats fetched automatically every 10 minutes in the background |
| 🔁 **Manual Sync** | Trigger per-student sync on demand from the dashboard |
| 🌐 **Public Leaderboard** | Shareable public link — no authentication needed for viewers |
| 🌗 **Dark / Light Mode** | System-aware theme switcher via React Context |
| 🔔 **Toast Notifications** | Contextual success/error/info toasts throughout the app |
| 🔒 **Protected Routes** | Dashboard and group pages require a valid JWT session |
| 📊 **Difficulty Breakdown** | Per-student Easy / Medium / Hard solve counts tracked |
| 🏆 **Contest Rating** | LeetCode contest rating displayed on the leaderboard |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **React 19** + **Vite** | UI framework & blazing-fast dev server |
| **Tailwind CSS v4** | Utility-first styling |
| **React Router v7** | Client-side routing with protected routes |
| **Axios** | HTTP client for API calls |
| **Lucide React** + **React Icons** | Icon libraries |
| **React Context API** | Auth, Theme, and Toast state management |

### Backend

| Technology | Purpose |
|---|---|
| **Node.js** + **Express v5** | REST API server |
| **MongoDB** + **Mongoose** | Database & ODM |
| **JWT** + **bcrypt** | Authentication & password security |
| **node-cron** | Scheduled background sync every 10 minutes |
| **Axios** | Fetching stats from external platform APIs |
| **CORS** + **dotenv** | Security & environment configuration |

---

## 🏗️ Architecture

```
DSA-Tracker-LeaderBoard/
├── frontend/                      # React + Vite app
│   └── src/
│       ├── pages/
│       │   ├── Login.jsx              # Admin login page
│       │   ├── Register.jsx           # Admin registration page
│       │   ├── Dashboard.jsx          # Group overview dashboard
│       │   ├── GroupDetails.jsx       # Student list + leaderboard for a group
│       │   └── PublicLeaderboard.jsx  # Public (unauthenticated) leaderboard view
│       ├── components/
│       │   ├── Navbar.jsx             # Top navigation with theme toggle
│       │   ├── ProtectedRoute.jsx     # Route guard for authenticated pages
│       │   ├── ConfirmationModal.jsx  # Reusable delete confirmation dialog
│       │   └── ToastContainer.jsx     # Global toast notification renderer
│       ├── context/
│       │   ├── AuthContext.jsx        # JWT auth state
│       │   ├── ThemeContext.jsx       # Dark/light mode state
│       │   └── ToastContext.jsx       # Toast notification state
│       └── api/                      # Axios API call definitions
│
└── backend/                       # Node.js + Express API
    ├── index.js                   # Entry point, middleware, route registration
    ├── routes/
    │   ├── admin.auth.js          # POST /auth/admin/register, /login
    │   ├── group.route.js         # CRUD routes for groups
    │   └── student.route.js       # CRUD + sync routes for students
    ├── controllers/
    │   ├── admin.control.js       # Register & login logic
    │   ├── groups.controller.js   # Group CRUD + public leaderboard fetch
    │   └── students.controller.js # Student CRUD, manual sync
    ├── models/
    │   ├── admin.model.js         # Admin schema
    │   ├── group.model.js         # Group schema
    │   └── student.model.js       # Student schema with nested platform stats
    ├── services/
    │   ├── leetcode.service.js    # LeetCode GraphQL stat fetcher
    │   ├── codechef.service.js    # CodeChef stat fetcher
    │   └── codeforces.service.js  # Codeforces stat fetcher
    ├── cron/
    │   └── syncStudents.cron.js   # Runs every 10 mins to sync all student stats
    ├── middlewares/
    │   └── admin.middleware.js    # JWT verification middleware
    └── lib/
        └── connectDB.js           # MongoDB connection
```

---

## 📡 API Reference

### Auth — `/auth/admin`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/admin/register` | Register a new admin | ❌ |
| `POST` | `/auth/admin/login` | Login and receive JWT | ❌ |

### Groups — `/group`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/group/add` | Create a new group | ✅ |
| `GET` | `/group/:id/leaderboard` | Fetch group leaderboard (public) | ❌ |
| `PATCH` | `/group/:id/edit` | Edit group details | ✅ |
| `DELETE` | `/group/:id/delete` | Delete a group | ✅ |

### Students — `/student`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/student/:id/add` | Add a student to a group | ✅ |
| `GET` | `/student/:id/get` | Get all students in a group | ✅ |
| `PATCH` | `/student/:id/edit` | Edit a student's details/handles | ✅ |
| `DELETE` | `/student/:id/delete` | Remove a student | ✅ |
| `POST` | `/student/:id/sync` | Manually sync a student's stats | ✅ |

> ✅ Requires `Authorization: Bearer <token>` header

---

## 🗄️ Data Models

### Student

```js
{
  name: String,
  group: [ObjectId],           // References to Group
  platforms: [{
    platform: "leetcode" | "codeforces" | "codechef",
    handle: String,
    language: String,
    lastSynced: Date,
    stats: {
      totalSolved: Number,
      currentStreak: Number,
      totalSubmissions: Number,
      maxDifficulty: "Easy" | "Medium" | "Hard",
      easy: Number,
      medium: Number,
      hard: Number,
      contestRating: Number,
      fetchedAt: Date
    }
  }]
}
```

### Group

```js
{ name: String, admin: ObjectId, students: [ObjectId] }
```

### Admin

```js
{ email: String, password: String /* bcrypt hashed */ }
```

---

## 🚀 Getting Started (Local Setup)

### Prerequisites

- Node.js ≥ 18
- MongoDB (local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/ojasvsingh71/DSA-Tracker-LeaderBoard.git
cd DSA-Tracker-LeaderBoard
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=2020
FRONTEND_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

> Server runs at `http://localhost:2020`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:2020
```

Start the frontend dev server:

```bash
npm run dev
```

> App runs at `http://localhost:5173`

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for signing JWTs | `supersecretkey123` |
| `PORT` | Port for the Express server | `2020` |
| `FRONTEND_URL` | Allowed CORS origin | `https://your-app.vercel.app` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:2020` |

---

## ☁️ Deployment

### Frontend → Vercel

1. Push the repository to GitHub.
2. Import the project on [Vercel](https://vercel.com).
3. Set **Root Directory** to `frontend`.
4. Add environment variable `VITE_API_URL` pointing to your deployed backend URL.
5. The included `vercel.json` handles SPA routing automatically.

### Backend → Render

1. Create a new **Web Service** on [Render](https://render.com).
2. Set **Root Directory** to `backend`.
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `node index.js`
5. Add all backend environment variables listed above.

---

## 🌐 Deployed Links

- **Frontend:** [https://dsa-tracker-leaderboard.vercel.app](https://dsa-tracker-leaderboard.vercel.app)
- **Backend:** [https://dsa-tracker-leaderboard.onrender.com](https://dsa-tracker-leaderboard.onrender.com)

---

## 📅 Future Improvements

- [ ] 🏅 Full **Codeforces & CodeChef** leaderboard integration
- [ ] 📊 **Weekly & Monthly** growth analytics with charts
- [ ] 📧 **Email reports** sent to students automatically
- [ ] 🎖️ **Gamification** — badges, trophies, and milestones
- [ ] 🔍 Search & filter students on the leaderboard
- [ ] 📱 Progressive Web App (PWA) / mobile support
- [ ] 🧾 Export leaderboard as CSV / PDF

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

<p align="center">Made with ❤️ by <a href="https://github.com/ojasvsingh71">Ojasv Singh</a></p>
