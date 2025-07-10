import mongoose from "mongoose";

const student = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    platforms: [{
        type: String,
        enum: ['leetcode', 'codeforces', 'codechef'],
        required: true
    }],
    language: {
        type: String
    },
    lastSynced: {
        type: Date,
        default: null
    }
}, { timestamp: true });

export default mongoose.model("Student", student);