import studentModel from "../models/student.model.js";
import fetchLeetCodeStats from "../services/leetcode.service.js";
import groupModel from "../models/group.model.js";
import fetchCodechefStats from "../services/codechef.service.js";
import fetchCodeforcesStats from "../services/codeforces.service.js";

const addStudent = async (req, res) => {
    try {
        const groupId = req.params.id;
        const { name, platforms } = req.body;
        const reqPlatforms = platforms || [];

        const group = await groupModel.findById(groupId);
        if (!group) {
            return res.status(404).json({
                message: "Group not found"
            });
        }

        // 1. Search if the student already exists by name case-insensitively
        let student = await studentModel.findOne({
            name: { $regex: new RegExp("^" + name.trim() + "$", "i") }
        });

        // 2. If not found by name, check if any student has one of the platform handles we are adding
        if (!student && reqPlatforms.length > 0) {
            for (let entry of reqPlatforms) {
                if (entry.handle) {
                    student = await studentModel.findOne({
                        "platforms.platform": entry.platform,
                        "platforms.handle": { $regex: new RegExp("^" + entry.handle.trim() + "$", "i") }
                    });
                    if (student) break;
                }
            }
        }

        if (student) {
            // Associate student to this group if not already
            if (!student.group.includes(groupId)) {
                student.group.push(groupId);
            }

            if (!group.students.includes(student._id)) {
                group.students.push(student._id);
                await group.save();
            }

            // Merge any new platforms that this student doesn't have configured yet
            for (let entry of reqPlatforms) {
                const { platform, handle, language } = entry;
                if (!handle) continue;

                const exists = student.platforms.some(p => p?.platform === platform);
                if (!exists) {
                    let stats = {};
                    try {
                        if (platform === "leetcode") {
                            stats = await fetchLeetCodeStats(handle);
                        } else if (platform === "codechef") {
                            stats = await fetchCodechefStats(handle);
                        } else if (platform === "codeforces") {
                            stats = await fetchCodeforcesStats(handle);
                        }
                    } catch (fetchErr) {
                        console.error(`Error fetching stats for platform ${platform} handle ${handle}:`, fetchErr);
                    }

                    student.platforms.push({
                        platform,
                        handle,
                        language,
                        stats: {
                            ...stats,
                            fetchedAt: new Date()
                        }
                    });
                }
            }

            // Force sync all student platforms to get fresh statistics
            for (let entry of student.platforms) {
                try {
                    let stats = {};
                    if (entry.platform === "leetcode") {
                        stats = await fetchLeetCodeStats(entry.handle);
                    } else if (entry.platform === "codechef") {
                        stats = await fetchCodechefStats(entry.handle);
                    } else if (entry.platform === "codeforces") {
                        stats = await fetchCodeforcesStats(entry.handle);
                    }
                    entry.stats = {
                        ...stats,
                        fetchedAt: new Date()
                    };
                } catch (syncErr) {
                    console.error(`Failed to sync platform ${entry.platform} for existing student:`, syncErr);
                }
            }

            student.lastSynced = new Date();
            await student.save();

            return res.status(200).json({
                message: "Student already existed. Associated with group and stats fully synced.",
                student
            });
        }

        // If student is new, create platforms array and stats
        const updatedPlatforms = [];

        for (let entry of reqPlatforms) {
            const { platform, handle, language } = entry;
            if (!handle) continue;

            let stats = {};
            try {
                if (platform === "leetcode") {
                    stats = await fetchLeetCodeStats(handle);
                } else if (platform === "codechef") {
                    stats = await fetchCodechefStats(handle);
                } else if (platform === "codeforces") {
                    stats = await fetchCodeforcesStats(handle);
                }
            } catch (fetchErr) {
                console.error(`Error fetching stats for platform ${platform} handle ${handle}:`, fetchErr);
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
        console.error("Error in addStudent:", err);
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
        const studentId = req.params.id;
        const { groupId } = req.query;

        const student = await studentModel.findById(studentId);
        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        if (groupId) {
            // Remove student from the specific group's students array
            await groupModel.findByIdAndUpdate(groupId, {
                $pull: { students: studentId }
            });

            // Remove group ID from student's group array
            student.group = student.group.filter(g => g.toString() !== groupId);

            // Clean up the student entirely if they no longer belong to any group
            if (student.group.length === 0) {
                await studentModel.findByIdAndDelete(studentId);
            } else {
                await student.save();
            }
        } else {
            // Fallback: Delete from all groups and database
            await groupModel.updateMany(
                { _id: { $in: student.group } },
                { $pull: { students: studentId } }
            );
            await studentModel.findByIdAndDelete(studentId);
        }

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
            } else if (entry.platform === "codechef") {
                stats = await fetchCodechefStats(entry.handle);
            } else if (entry.platform === "codeforces") {
                stats = await fetchCodeforcesStats(entry.handle);
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
        console.error(err);
        res.status(500).json({
            message: "Server error", err
        });
    }
};

export { addStudent, getstudent, deletestudent, syncStudent, editstudent };