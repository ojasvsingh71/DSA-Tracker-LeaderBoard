# 🧠 DSA Tracker Leaderboard

A full-stack web application to track and showcase student performance in Data Structures and Algorithms across multiple platforms like LeetCode. Admins can manage student groups, sync progress, and view real-time leaderboards.

<img width="1919" height="861" alt="Screenshot 2025-07-11 214820" src="https://github.com/user-attachments/assets/8cf9c320-b4cb-42d6-81c1-e311a35ee695" />

---

## 🔍 Features

- ✅ **Admin Authentication** (JWT-based)
- 🧑‍🏫 **Group & Student Management**
- 📈 **Leaderboard View with Sorting**
- 🧮 **Daily Streak and Submission Stats**
- 🌐 **Public Leaderboard Sharing**
- 🔒 **Protected Routes**
- 🔄 **Auto-syncing via Cron Job**
- 🧠 **Multi-platform ready** (LeetCode supported for now)

---

## 🛠️ Tech Stack

### Frontend
- React.js + Vite
- Tailwind CSS
- React Router

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Axios
- CORS, JWT, dotenv

---

## 🌐 Deployed Links

- **Frontend:** [https://dsa-tracker-leaderboard.vercel.app](https://dsa-tracker-leaderboard.vercel.app)
- **Backend:** [https://dsa-tracker-leaderboard.onrender.com](https://dsa-tracker-leaderboard.onrender.com)

---

## 🧪 How It Works

- Admins register and login.
- Admins create student groups.
- Add students with platform handles (LeetCode).
- Stats like `totalSolved`, `totalSubmissions`, and `currentStreak` are fetched via LeetCode GraphQL API.
- Students are ranked automatically on the leaderboard.
- Public leaderboard links can be shared.

---

## 🚀 Getting Started (Local Setup)

1. **Clone the repo**

   ```
   git clone https://github.com/your-username/dsa-tracker-leaderboard.git
   ```

2. **Frontend Setup**
```
cd frontend
npm install
npm run dev
```
3. **Backend Setup**

```
cd backend
npm install
npm run dev
```

4. **Create .env in backend/:**
```
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
PORT=2020
frontend_url=https://dsa-tracker-leaderboard.vercel.app
```

# 📅 Future Improvements

- Add support for Codeforces & CodeChef

- Weekly & Monthly growth analytics

- Email reports to students

- Gamification & badges

