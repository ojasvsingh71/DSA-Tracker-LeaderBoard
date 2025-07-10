import mongoose from "mongoose";

const statsSchema = new mongoose.Schema({
    totalSolved: {
        type: Number,
        default: 0
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    maxDifficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Easy'
    },
    fetchedAt: {
        type: Date,
        default: Date.now
    }
});

const studentSchema = new mongoose.Schema({
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
    },
    group: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group"
    }],
    stats: statsSchema
}, { timestamps: true });

export default mongoose.model("Student", studentSchema);