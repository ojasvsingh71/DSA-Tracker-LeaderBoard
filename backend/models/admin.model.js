import mongoose from "mongoose";

const admin = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    group: [{
        type: String
    }]
})

export default mongoose.model("Admin", admin);