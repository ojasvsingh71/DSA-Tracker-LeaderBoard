import mongoose from "mongoose";

export default async function connectDB() {
    mongoose.connect(process.env.DATABASE).then(()=>{
        console.log("\nConnected to database!!!\n");
    })
}