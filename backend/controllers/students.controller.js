import studentModel from "../models/student.model.js";
import fetchLeetCodeStats from "../services/leetcode.service.js";
import groupModel from "../models/group.model.js";

const addStudent = async (req, res) => {
    try {
        const groupId = req.params.id;
        const { username, platforms, language } = req.body;

        const group = await groupModel.findById(groupId);
        if (!group) {
            return res.status(404).json({
                message: "Group not found"
            });
        }

        const existing = await studentModel.findOne({ username });

        if (existing) {
            return res.status(400).json({
                message: " Student already exists!!!"
            })
        }

        const stats = await fetchLeetCodeStats(username);

        const student = await studentModel.create({
            username,
            platforms,
            language,
            group: groupId,
            stats: {
                ...stats,
                fetchedAt: new Date()
            }
        });

        student.group.push(groupId);
        await student.save();

          group.students.push(student._id);
        await group.save();

        return res.status(201).json(student);
    } catch (err) {
        res.status(500).json({
            message: "Sever error!!!",
            err
        })
    }
}

const getstudents = async (req, res) => {
    try {
        const students = await studentModel.find().lean();
        return res.json(students);
    } catch (err) {
        res.status(500).json({
            message: "Sever error!!!",
            err
        })
    }
}

const deletestudent = async (req, res) => {
    try {
        await studentModel.findByIdAndDelete(req.params.id);
        await statsModel.deleteMany({ student: req.params.id });
        return res.sendStatus(204);
    } catch (err) {
        res.status(500).json({
            message: "Sever error!!!",
            err
        })
    }
}

const syncStudent = async (req, res) => {
    try {
        const student = await studentModel.findById(req.params.id);
        console.log("Looking for student:", req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found!!!"
            })
        }

        // if (student.platforms !== "leetcode") {
        //     return res.status(400).json({
        //         message: "Platform not supported yet"
        //     })
        // }

        const stats = await fetchLeetCodeStats(student.username);
        if (!stats) {
            return res.status(500).json({
                message: "Failed to fetch stats"
            });
        }

        await statsModel.findOneAndUpdate(
            { username: student.username },
            { totalSolved: stats.totalSolved },
            { currentStreak: stats.currentStreak },
            { student: student._id },
            { ...stats, fetchedAt: new Date() },
            { upsert: true, new: true }
        );

        student.lastSynced = new Date();
        await student.save();

        return res.json({
            message: "Stats synced successfully", stats
        });
    } catch (err) {
        res.status(500).json({
            message: "Sever error!!!",
            err
        })
    }
}

export { addStudent, getstudents, deletestudent, syncStudent };