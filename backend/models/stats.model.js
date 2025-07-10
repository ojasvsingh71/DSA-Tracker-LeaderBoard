import mongoose from "mongoose";

const stat = mongoose.Schema({
    username: {
        type: String
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
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
})

export default mongoose.model("Stats", stat);