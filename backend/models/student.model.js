import mongoose from "mongoose";

const statsSchema = new mongoose.Schema({
    totalSolved: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    totalSubmissions: { type: Number, default: 0 },
    maxDifficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        default: "Easy"
    },
    contestRating: {
        type: Number,
        default: 0
    },
    fetchedAt: { type: Date, default: Date.now }
}, { _id: false });


const platformEntrySchema = new mongoose.Schema({
    platform: {
        type: String,
        enum: ["leetcode", "codeforces", "codechef"],
        required: true
    },
    handle: { type: String, required: true },
    language: { type: String },
    lastSynced: { type: Date, default: null },
    stats: statsSchema
}, { _id: false });

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    group: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group"
    }],
    platforms: [platformEntrySchema],
    lastSynced: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model("Student", studentSchema);