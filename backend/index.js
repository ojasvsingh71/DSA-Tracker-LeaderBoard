import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./lib/connectDB.js"
import AdminAuth from "./routes/admin.auth.js"

const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());

connectDB();

app.use("/", AdminAuth);

app.listen(process.env.PORT, () => {
    console.log(`\nServer is running on http://localhost:${process.env.PORT}\n`);
})

app.get("/", (req, res) => {
    res.send("API is running!!!");
})
