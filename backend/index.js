import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./lib/connectDB.js"
import AdminAuth from "./routes/admin.auth.js"
import StudentRouter from "./routes/student.route.js"
import GroupRouter from "./routes/group.route.js"
import "./cron/syncStudents.cron.js"

const app = express();

dotenv.config();

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173",process.env.frontend_url],
  credentials: true, 
}));

connectDB();

app.use("/auth/admin", AdminAuth);
app.use("/student", StudentRouter);
app.use("/group", GroupRouter);

app.listen(process.env.PORT, () => {
    console.log(`\nServer is running on http://localhost:${process.env.PORT}\n`);
})

app.get("/", (req, res) => {
    res.send("API is running!!!");
})
