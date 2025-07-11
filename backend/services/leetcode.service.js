import axios from "axios";

const fetchLeetCodeStats = async (username) => {
    const query = `
    query getUserProfile($username: String!) {
        matchedUser(username: $username) {
        username
        submitStats: submitStatsGlobal {
            acSubmissionNum {
            difficulty
            count
            }
            totalSubmissionNum {
            difficulty
            count
            }
        }
        userCalendar {
            submissionCalendar
        }
        }
    }
    `;

    try {
        const res = await axios.post(
            "https://leetcode.com/graphql",
            {
                query,
                variables: { username }
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "Referer": `https://leetcode.com/${username}/`,
                    "Origin": "https://leetcode.com"
                }
            }
        );

        const user = res.data.data.matchedUser;
        if (!user) return null;

        const totalSolvedEstimate = user.submitStats.acSubmissionNum.find(
            (item) => item.difficulty === "All"
        )?.count || 0;

        const totalSubmissionsEstimate = user.submitStats.totalSubmissionNum.find(
            (item) => item.difficulty === "All"
        )?.count || 0;

        let maxDifficulty = "Easy";
        for (const { difficulty, count } of user.submitStats.acSubmissionNum) {
            if (difficulty === "Hard" && count > 0) maxDifficulty = "Hard";
            else if (difficulty === "Medium" && count > 0 && maxDifficulty !== "Hard") maxDifficulty = "Medium";
        }

        const calendar = user.userCalendar.submissionCalendar;
        const timestamps = Object.keys(JSON.parse(calendar)).map(t => parseInt(t) * 1000);
        timestamps.sort((a, b) => b - a);

        let streak = 0;
        let currentDate = new Date();

        for (let i = 0; i < timestamps.length; i++) {
            const submissionDate = new Date(timestamps[i]);
            const dayDiff = Math.floor((currentDate - submissionDate) / (1000 * 60 * 60 * 24));
            if (dayDiff === 0 || dayDiff === streak) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }

        return {
            totalSolved: totalSolvedEstimate,
            totalSubmissions: totalSubmissionsEstimate,
            currentStreak: streak,
            maxDifficulty
        };

    } catch (err) {
        console.error("LeetCode Fetch Error:", err.response?.data || err.message);
        return null;
    }
};

export default fetchLeetCodeStats;