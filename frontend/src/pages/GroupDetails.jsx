import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosInstance";
import { FaSyncAlt, FaTrash } from "react-icons/fa";

const GroupDetails = () => {
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [newStudent, setNewStudent] = useState({ name: "", platform: "leetcode", handle: "", language: "" });
    const [loading, setLoading] = useState(false);

    const fetchGroup = async () => {
        try {
            const res = await api.get(`/group/${id}/leaderboard`);
            setGroup(res.data);
        } catch (err) {
            console.error("Failed to fetch group", err);
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(`/student/${id}/add`, {
                name: newStudent.name,
                platforms: [{
                    platform: newStudent.platform,
                    handle: newStudent.handle,
                    language: newStudent.language
                }]
            });
            setNewStudent({ name: "", platform: "leetcode", handle: "", language: "" });
            fetchGroup();
        } catch (err) {
            console.error("Error adding student", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (studentId) => {
        if (!window.confirm("Are you sure you want to delete this student?")) return;
        try {
            await api.delete(`/student/${studentId}/delete`);
            fetchGroup();
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const handleSync = async (studentId) => {
        try {
            await api.post(`/student/${studentId}/sync`);
            fetchGroup();
        } catch (err) {
            console.error("Sync failed", err);
        }
    };

    useEffect(() => {
        fetchGroup();
    }, [id]);

    if (!group) return <div className="p-6 text-center text-gray-600 dark:text-gray-300">Loading...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-6 text-gray-900 dark:text-white">
                Group: {group.groupName}
            </h1>

            <a
                href={`/public/leaderboard/${id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block mb-6 text-blue-600 dark:text-blue-400 hover:underline"
            >
                🌐 View Public Leaderboard ↗
            </a>

            {/* Add Student Form */}
            <form
                onSubmit={handleAddStudent}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
                <input
                    type="text"
                    placeholder="Name"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    className="px-3 py-2 rounded border dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    required
                />
                <input
                    type="text"
                    placeholder="DSA Handle"
                    value={newStudent.handle}
                    onChange={(e) => setNewStudent({ ...newStudent, handle: e.target.value })}
                    className="px-3 py-2 rounded border dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    required
                />
                <select
                    value={newStudent.platform}
                    onChange={(e) => setNewStudent({ ...newStudent, platform: e.target.value })}
                    className="px-3 py-2 rounded border dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                    <option value="leetcode">LeetCode</option>
                    <option value="codeforces">Codeforces</option>
                    <option value="codechef">CodeChef</option>
                </select>
                <input
                    type="text"
                    placeholder="Language"
                    value={newStudent.language}
                    onChange={(e) => setNewStudent({ ...newStudent, language: e.target.value })}
                    className="px-3 py-2 rounded border dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
                <button
                    type="submit"
                    className="col-span-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60 transition"
                    disabled={loading}
                >
                    {loading ? "Adding..." : "➕ Add Student"}
                </button>
            </form>

            {/* Leaderboard Table */}
            <div className="overflow-x-auto rounded-md border dark:border-gray-700 shadow">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                        <tr className="uppercase text-xs text-center">
                            <th className="p-3">Name</th>
                            <th className="p-3">Platform</th>
                            <th className="p-3">Handle</th>
                            <th className="p-3">Language</th>
                            <th className="p-3">Solved</th>
                            <th className="p-3">Streak</th>
                            <th className="p-3">Difficulty</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-center text-gray-800 dark:text-gray-100">
                        {group.leaderboard?.map((student, idx) => (
                            <tr
                                key={idx}
                                className="border-t dark:border-gray-700 even:bg-white odd:bg-gray-50 
                 dark:even:bg-[#1e1e2f] dark:odd:bg-[#2a2a40] 
                 hover:bg-indigo-50 dark:hover:bg-[#3b3b5c] transition-colors"
                            >
                                <td className="p-3 font-medium">{student.name}</td>
                                <td className="p-3 capitalize">Leetcode</td>
                                <td className="p-3 font-semibold text-indigo-600 dark:text-indigo-400">{student.leetcodeHandle || "N/A"}</td>
                                <td className="p-3">{student.language}</td>
                                <td className="p-3">{student.totalSolved}</td>
                                <td className="p-3">{student.currentStreak}</td>
                                <td
                                    className={`p-3 font-bold ${student.maxDifficulty === "Hard"
                                            ? "text-red-600"
                                            : student.maxDifficulty === "Medium"
                                                ? "text-yellow-500"
                                                : "text-green-600"
                                        }`}
                                >
                                    {student.maxDifficulty}
                                </td>
                                <td className="p-3 space-x-3">
                                    <button
                                        onClick={() => handleSync(student.id)}
                                        className="text-blue-600 dark:text-blue-400 hover:underline"
                                        title="Sync Data"
                                    >
                                        <FaSyncAlt />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(student.id)}
                                        className="text-red-600 dark:text-red-400 hover:underline"
                                        title="Delete Student"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {group.leaderboard?.length === 0 && (
                            <tr>
                                <td colSpan="8" className="p-6 text-center text-gray-500 dark:text-gray-400">
                                    No students in this group yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GroupDetails;