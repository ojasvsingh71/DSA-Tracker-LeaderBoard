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
};

const getGroup = async (req, res) => {
    try {
        const group = await groupModel.findById(req.params.id).populate("students");

        if (!group) {
            return res.status(404).json({
                message: "Group not found!!!"
            });
        }

        const leaderboard = group.students.map(student => {
            const leetCodeData = student.platforms.find(p => p.platform === "leetcode");

            return {
                id: student._id,
                name: student.name,
                leetcodeHandle: leetCodeData?.handle || "N/A",
                language: leetCodeData?.language || "N/A",
                totalSolved: leetCodeData?.stats?.totalSolved || 0,
                currentStreak: leetCodeData?.stats?.currentStreak || 0,
                maxDifficulty: leetCodeData?.stats?.maxDifficulty || "N/A"
            };
        });

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

const editGroup = async (req, res) => {
    try {
        const groupId = req.params.id;
        const { name } = req.body;

        const updatedGroup = await groupModel.findByIdAndUpdate(
            groupId,
            { name },
            { new: true }
        );

        if (!updatedGroup) {
            return res.status(404).json({
                message: "Group not found"
            });
        }

        res.json({
            message: "Group updated successfully",
            group: updatedGroup
        });
    } catch (err) {
        res.status(500).json({
            message: "Server error",
            err
        });
    }
};

const deleteGroup = async (req, res) => {
    try {
        const groupId = req.params.id;

        const group = await groupModel.findByIdAndDelete(groupId);

        if (!group) {
            return res.status(404).json({
                message: "Group not found!!"
            });
        }

        res.json({
            message: "Group deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            message: "Server error",
            err
        });
    }
};

export { addGroup, getGroup, editGroup, deleteGroup };