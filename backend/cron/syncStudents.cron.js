import cron from "node-cron";
import studentModel from "../models/student.model.js";
import fetchLeetCodeStats from "../services/leetcode.service.js";
import fetchCodechefStats from "../services/codechef.service.js";
import fetchCodeforcesStats from "../services/codeforces.service.js";

cron.schedule("*/10 * * * *", async () => {
    console.log(" Auto Sync Started: ");

    try {
        const students = await studentModel.find();

        for (const student of students) {
            const updatedPlatforms = await Promise.all(
                student.platforms.map(async (entry) => {
                    if (entry?.platform === "leetcode") {

                        const stats = await fetchLeetCodeStats(entry.handle);
                        if (!stats) return entry;

                        console.log(`Leetcode Synced: ${entry.handle}`);

                        return {
                            ...entry,
                            stats: {
                                totalSolved: stats.totalSolved,
                                totalSubmissions: stats.totalSubmissions,
                                currentStreak: stats.currentStreak,
                                maxDifficulty: stats.maxDifficulty,
                                contestRating: stats.contestRating,
                                easy: stats.easy,
                                medium: stats.medium,
                                hard: stats.hard,
                                fetchedAt: new Date()
                            }
                        };
                    } else if (entry?.platform === "codechef") {

                        const stats = await fetchCodechefStats(entry.handle);
                        if (!stats) return entry;

                        console.log(`Codechef Synced: ${entry.handle}`);
                        return {
                            ...entry,
                            stats: {
                                contestRating: stats.contestRating,
                                fetchedAt: new Date()
                            }
                        };
                    } else if (entry?.platform === "codeforces") {
                        const stats = await fetchCodeforcesStats(entry.handle);
                        if (!stats) return entry;

                        console.log(`Codeforces Synced ${entry.handle}`);
                        return {
                            ...entry,
                            stats: {
                                constestRating: stats.contestRating,
                                fetchedAt: new Date()
                            }
                        }
                    }
                })
            );

            student.platforms = updatedPlatforms;
            student.lastSynced = new Date();
            await student.save();
        }

        console.log(" Auto Sync Finished");
    } catch (err) {
        console.error("Cron Job Error:", err.message);
    }
});