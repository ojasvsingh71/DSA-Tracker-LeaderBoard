import axios from "axios";

const fetchLeetCodeStats = async (username) => {
    const initQuery = `
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
                activeYears
            }
        }
        userContestRanking(username: $username) {
            attendedContestsCount
            rating
            globalRanking
            topPercentage
        }
    }
    `;

    try {
        const headers = {
            "Content-Type": "application/json",
            "Referer": `https://leetcode.com/${username}/`,
        };

        const initRes = await axios.post(
            "https://leetcode.com/graphql",
            { query: initQuery, variables: { username } },
            { headers }
        );

        const user = initRes.data.data.matchedUser;
        if (!user) return null;

        const activeYears = user.userCalendar.activeYears; 

        const yearRequests = activeYears.map(year => {
            const yearQuery = `
            query getUserCalendar($username: String!, $year: Int) {
                matchedUser(username: $username) {
                    userCalendar(year: $year) {
                        submissionCalendar
                    }
                }
            }
            `;
            return axios.post(
                "https://leetcode.com/graphql",
                { query: yearQuery, variables: { username, year } },
                { headers }
            );
        });

        const yearResponses = await Promise.all(yearRequests);

        const activeDaysSet = new Set();
        
        yearResponses.forEach(response => {
            const calendarData = response.data.data.matchedUser.userCalendar.submissionCalendar;
            const submissions = JSON.parse(calendarData);
            
            Object.keys(submissions).forEach(ts => {
                const date = new Date(parseInt(ts) * 1000);
                const dateStr = date.toISOString().split('T')[0];
                activeDaysSet.add(dateStr);
            });
        });

        let streak = 0;
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const yesterdayDate = new Date(now);
        yesterdayDate.setDate(now.getDate() - 1);
        const yesterday = yesterdayDate.toISOString().split('T')[0];

        let checkDate = null;
        if (activeDaysSet.has(today)) {
            checkDate = new Date(now);
        } else if (activeDaysSet.has(yesterday)) {
            checkDate = yesterdayDate;
        }

        if (checkDate) {
            while (true) {
                const dateStr = checkDate.toISOString().split('T')[0];
                if (activeDaysSet.has(dateStr)) {
                    streak++;
                    checkDate.setDate(checkDate.getDate() - 1);
                } else {
                    break;
                }
            }
        }

        const ranking = initRes.data.data.userContestRanking;
        const hardCount = user.submitStats.acSubmissionNum.find(i => i.difficulty === "Hard")?.count || 0;
        const mediumCount = user.submitStats.acSubmissionNum.find(i => i.difficulty === "Medium")?.count || 0;
        let maxDifficulty = "Easy";
        if (hardCount > 0) maxDifficulty = "Hard";
        else if (mediumCount > 0) maxDifficulty = "Medium";

        return {
            totalSolved: user.submitStats.acSubmissionNum.find(i => i.difficulty === "All")?.count || 0,
            totalSubmissions: user.submitStats.totalSubmissionNum.find(i => i.difficulty === "All")?.count || 0,
            currentStreak: streak,
            maxDifficulty,
            easy: user.submitStats.acSubmissionNum.find(i => i.difficulty === "Easy")?.count || 0,
            medium: mediumCount,
            hard: hardCount,
            contestRating: ranking?.rating || null,
            contestCount: ranking?.attendedContestsCount || 0,
            globalRanking: ranking?.globalRanking || null,
            topPercentage: ranking?.topPercentage || null
        };

    } catch (err) {
        console.error("LeetCode Fetch Error:", err.response?.data || err.message);
        return null;
    }
};

export default fetchLeetCodeStats;