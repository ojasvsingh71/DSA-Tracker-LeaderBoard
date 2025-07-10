import studentModel from "../models/student.model.js";
import fetchLeetCodeStats from "../services/leetcode.service.js";
import groupModel from "../models/group.model.js";

const addStudent = async (req, res) => {
    try {
        const groupId = req.params.id;
        const { name, platforms } = req.body;

        const group = await groupModel.findById(groupId);
        if (!group) {
            return res.status(404).json({ 
                message: "Group not found" 
            });
        }

        let student = await studentModel.findOne({ name });

        if (student) {
            if (!student.group.includes(groupId)) {
                student.group.push(groupId);
                await student.save();
            }

            if (!group.students.includes(student._id)) {
                group.students.push(student._id);
                await group.save();
            }

            return res.status(200).json({
                message: "Student already existed. Added to new group.",
                student
            });
        }

        const updatedPlatforms = [];

        for (let entry of platforms) {
            const { platform, handle, language } = entry;
            let stats = {};

            if (platform === "leetcode") {
                stats = await fetchLeetCodeStats(handle);
            }

            updatedPlatforms.push({
                platform,
                handle,
                language,
                stats: {
                    ...stats,
                    fetchedAt: new Date()
                }
            });
        }

        student = await studentModel.create({
            name,
            platforms: updatedPlatforms,
            lastSynced: new Date(),
            group: [groupId]
        });

        group.students.push(student._id);
        await group.save();

        return res.status(201).json({
            message: "New student created and added to group",
            student
        });

    } catch (err) {
        res.status(500).json({
            message: "Server error",
            err
        });
    }
};

const getstudent = async (req, res) => {
    try {
        const studentId = req.params.id;

        const student = await studentModel.findById(studentId);
        return res.json(student);
    } catch (err) {
        res.status(500).json({
            message: "Server error",
            err
        });
    }
};

const editstudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        const { name, platforms } = req.body;

        const student = await studentModel.findById(studentId);
        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        student.name = name || student.name;
        student.platforms = platforms || student.platforms;
        await student.save();

        return res.json({
            message: "Student updated successfully",
            student
        });
    } catch (err) {
        res.status(500).json({
            message: "Server error",
            err
        });
    }
};

const deletestudent = async (req, res) => {
    try {
        await studentModel.findByIdAndDelete(req.params.id);
        return res.sendStatus(204);
    } catch (err) {
        res.status(500).json({
            message: "Server error",
            err
        });
    }
};

const syncStudent = async (req, res) => {
    try {
        const student = await studentModel.findById(req.params.id);
        if (!student) {
            return res.status(404).json({
                message: "Student not found!"
            });
        }

        const updatedPlatforms = [];

        for (let entry of student.platforms) {
            let stats = {};
            if (entry.platform === "leetcode") {
                stats = await fetchLeetCodeStats(entry.handle);
            }

            updatedPlatforms.push({
                ...entry,
                stats: {
                    ...stats,
                    fetchedAt: new Date()
                }
            });
        }

        student.platforms = updatedPlatforms;
        student.lastSynced = new Date();
        await student.save();

        return res.json({
            message: "Stats synced successfully",
            student
        });
    } catch (err) {
        res.status(500).json({
            message: "Server error", err
        });
    }
};

export { addStudent, getstudent, deletestudent, syncStudent, editstudent };