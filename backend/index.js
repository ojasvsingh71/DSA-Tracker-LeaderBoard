import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./lib/connectDB.js"

const app = express();

dotenv.config();

app.use(cors());

connectDB();

app.listen(process.env.PORT, () => {
    console.log(`\nServer is running on http://localhost:${process.env.PORT}\n`);
})

app.get("/", (req, res) => {
    res.send("API is running!!!");
})
