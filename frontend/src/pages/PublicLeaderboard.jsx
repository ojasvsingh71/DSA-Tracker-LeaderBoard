import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axiosInstance";

const PublicLeaderboard = () => {
    const { id } = useParams();
    const [group, setGroup] = useState(null);

    const fetchGroup = async () => {
        try {
            const res = await api.get(`/group/${id}/leaderboard`);
            setGroup(res.data);
        } catch (err) {
            console.error("Error fetching group", err);
        }
    };

    useEffect(() => {
        fetchGroup();
    }, [id]);

    if (!group) return <div className="p-6">Loading leaderboard...</div>;

    const getRankEmoji = (rank) => {
        if (rank === 0) return "🥇";
        if (rank === 1) return "🥈";
        if (rank === 2) return "🥉";
        return `#${rank + 1}`;
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-4xl bg-indigo-400 font-extrabold mb-8 text-center text-gray-900 dark:text-white tracking-tight">
                Leaderboard – {group.groupName}
            </h1>

            <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <table className="w-full table-auto border-collapse text-sm md:text-base">
                    <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 uppercase text-center shadow-sm">
                        <tr>
                            <th className="py-3 px-4">Rank</th>
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Platform</th>
                            <th className="py-3 px-4">Handle</th>
                            <th className="py-3 px-4">Solved</th>
                            <th className="py-3 px-4">Streak</th>
                            <th className="py-3 px-4">Max Difficulty</th>
                        </tr>
                    </thead>
                    <tbody className="text-center text-gray-800 dark:text-gray-200">
                        {group.leaderboard?.map((student, idx) => {
                            const difficultyColor =
                                student.maxDifficulty === "Hard"
                                    ? "text-red-600 dark:text-red-400"
                                    : student.maxDifficulty === "Medium"
                                        ? "text-yellow-600 dark:text-yellow-400"
                                        : "text-green-600 dark:text-green-400";

                            return (
                                <tr
                                    key={idx}
                                    className={`border-t dark:border-gray-600 even:bg-gray-50 dark:even:bg-gray-800 hover:bg-indigo-100 dark:hover:bg-indigo-700 transition-colors`}
                                >
                                    <td className="py-3 px-4 font-semibold">{getRankEmoji(idx)}</td>
                                    <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-700">
                                        {student.name || "N/A"}
                                    </td>
                                    <td className="py-3 px-4 capitalize text-gray-700 dark:text-gray-700">
                                        LeetCode
                                    </td>
                                    <td className="py-3 px-4 text-blue-700 dark:text-blue-300">
                                        {student.leetcodeHandle || "N/A"}
                                    </td>
                                    <td className="py-3 px-4 text-gray-800 dark:text-gray-700">
                                        {student.totalSolved ?? 0}
                                    </td>
                                    <td className="py-3 px-4 text-gray-800 dark:text-gray-700">
                                        {student.currentStreak ?? 0}
                                    </td>
                                    <td className={`py-3 px-4 font-bold ${difficultyColor}`}>
                                        {student.maxDifficulty || "N/A"}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PublicLeaderboard;