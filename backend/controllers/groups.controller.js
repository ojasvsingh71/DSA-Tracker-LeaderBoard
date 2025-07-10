import groupModel from "../models/group.model.js";

const addGroup = async (req, res) => {
    const { name } = req.body;

    try {
        const newGroup = await groupModel.create({
            name,
            admin: req.adminId,
            students: []
        });

        res.status(201).json({
            message: "Group created successfully!!!",
            group: newGroup
        });
    } catch (err) {
        res.status(500).json({
            message: "Server error",
            err
        });
    }
}

const getGroup = async (req, res) => {
    try {
        const group = await groupModel.findById(req.params.id).populate("students");

        if (!group) {
            return res.status(404).json({
                message: "Group not found!!!"
            });
        }

        const leaderboard = group.students.map(student => ({
            username: student.username,
            language: student.language,
            totalSolved: student.stats?.totalSolved || 0,
            currentStreak: student.stats?.currentStreak || 0,
            maxDifficulty: student.stats?.maxDifficulty || "N/A"
        }));

        res.json({
            groupName: group.name,
            leaderboard
        });

    } catch (err) {
        console.error("Group Fetch Error:", err);
        res.status(500).json({
            message: "Server error",
            err
        });
    }
};

export { addGroup, getGroup };