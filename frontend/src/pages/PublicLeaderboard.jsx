import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { Flame, Star, Zap, Smile, Meh, Frown } from "lucide-react";

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

    const getDifficultyStyle = (count, level) => {
        const colorMap = {
            easy: "text-green-600",
            medium: "text-yellow-500",
            hard: "text-red-500",
        };

        return (
            <span className={`font-semibold ${colorMap[level]}`}>
                 {count}
            </span>
        );
    };

    const getRatingIcon = (rating) => {
        if (rating > 1800) return <Star className="text-purple-600 inline w-4 h-4" />;
        if (rating > 1500) return <Star className="text-orange-500 inline w-4 h-4" />;
        return <Star className="text-gray-400 inline w-4 h-4" />;
    };

    const getStreakIcon = (streak) => {
        if (streak >= 100) return <Flame className="text-orange-600 inline w-4 h-4" />;
        if (streak >= 1) return <Zap className="text-yellow-400 inline w-4 h-4" />;
        return <Zap className="text-gray-400 inline w-4 h-4" />;
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-100 dark:from-gray-950 dark:to-slate-800 p-6">
            <h1 className="text-4xl font-extrabold mb-2 text-center text-gray-900 dark:text-white tracking-tight">
                Leaderboard – {group.groupName}
            </h1>
            <p className="text-center text-blue-600 dark:text-blue-400 mb-6 text-sm sm:text-base">
                📊 Public Group Rankings
            </p>

            <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm md:text-base whitespace-nowrap">
                    <thead className="bg-blue-50 dark:bg-gray-900 sticky top-0 z-10 text-gray-700 dark:text-gray-300 uppercase text-xs tracking-wider">
                        <tr className="text-center">
                            <th className="py-3 px-4">Rank</th>
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Platform</th>
                            <th className="py-3 px-4">Handle</th>
                            <th className="text-cyan-500 py-3 px-4">Solved</th>
                            <th className="text-green-600 py-3 px-4">🟢Easy</th>
                            <th className="text-yellow-500 py-3 px-4">🟡Medium</th>
                            <th className="text-red-500 py-3 px-4">🔴Hard</th>
                            <th className="text-purple-600 py-3 px-4">Rating</th>
                            <th className="text-orange-500 py-3 px-4">Streak</th>
                            <th className="text-blue-600 py-3 px-4">Total Attempted</th>
                        </tr>
                    </thead>

                    <tbody className="text-center text-gray-800 dark:text-gray-100">
                        {[...group.leaderboard]
                            .sort((a, b) => (b.totalSolved ?? 0) - (a.totalSolved ?? 0))
                            .map((student, idx) => {

                                return (
                                    <tr
                                        key={idx}
                                        className={`border-t dark:border-gray-700 even:bg-white odd:bg-gray-50 dark:even:bg-[#1e1e2f] dark:odd:bg-[#2a2a40] hover:bg-indigo-50 dark:hover:bg-[#3b3b5c] transition-colors`
                                        }>
                                        <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-100">
                                            {getRankEmoji(idx)}</td>
                                        <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-100">
                                            {student.name || "N/A"}
                                        </td>
                                        <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-100">
                                            LeetCode
                                        </td>
                                        <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-100">
                                            {student.leetcodeHandle || "N/A"}
                                        </td>
                                        <td className="py-3 px-4 font-medium text-cyan-400 dark">
                                            {student.totalSolved ?? 0}
                                        </td>
                                        <td className="py-3 px-4">
                                            {getDifficultyStyle(student.easy || 0, "easy")}
                                        </td>

                                        <td className="py-3 px-4">
                                            {getDifficultyStyle(student.medium || 0, "medium")}
                                        </td>

                                        <td className="py-3 px-4">
                                            {getDifficultyStyle(student.hard || 0, "hard")}
                                        </td>

                                        <td className="py-3 px-4">
                                            {getRatingIcon(student.contestRating)} {Math.floor(student.contestRating || 0)}
                                        </td>

                                        <td className="py-3 px-4">
                                            {getStreakIcon(student.currentStreak)} {student.currentStreak || 0}
                                        </td>

                                        <td className={`py-3 px-4 font-medium text-gray-800 dark:text-gray-100 font-bold `}>
                                            {student.totalSubmissions || "N/A"}
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
            {group.leaderboard?.length === 0 && (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-6 italic">
                    No students added yet.
                </div>
            )}
        </div>
    );
};

export default PublicLeaderboard;