import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosInstance";
import { Edit3, Trash2, Save, X, RefreshCw, PlusCircle } from "lucide-react";

const GroupDetails = () => {
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [newStudent, setNewStudent] = useState({ name: "", platform: "leetcode", handle: "", language: "" });
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

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

    const handleEdit = (student) => {
        setEditingId(student.id);
        setEditData({
            name: student.name,
            handle: student.leetcodeHandle,
            language: student.language,
        });
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditData({});
    };

    const handleSave = async (studentId) => {
        try {
            await api.patch(`/student/${studentId}/edit`, {
                name: editData.name,
                platforms: [{
                    platform: "leetcode",
                    handle: editData.handle,
                    language: editData.language,
                }]
            });
            setEditingId(null);
            handleSync(studentId);
            fetchGroup();
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    useEffect(() => {
        fetchGroup();
    }, [id]);

    if (!group) return <div className="p-6 text-center text-gray-600 dark:text-gray-300">Loading...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
            <h1 className="text-4xl font-extrabold mb-6 text-gray-900 dark:text-white">
                Group: {group.groupName}
            </h1>

            <a
                href={`/leaderboard/${id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block mb-6 text-blue-600 dark:text-blue-400 hover:underline"
            >
                🌐 View Public Leaderboard ↗
            </a>

            <form onSubmit={handleAddStudent} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
                    <option value="codechef">CodeChef</option>
                    <option value="codeforces">Codeforces</option>
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
                    {loading ? "Adding..." : (
                        <>
                            <PlusCircle className="w-4 h-4 inline mr-2" /> Add Student
                        </>
                    )}
                </button>
            </form>

            <div className="overflow-x-auto rounded-xl shadow-lg border dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-blue-50 text-white dark:bg-gray-900 sticky top-0 z-10">
                        <tr className="uppercase text-xs text-center">
                            <th className="p-3">Name</th>
                            <th className="p-3">Handle</th>
                            <th className="p-3">Language</th>
                            <th className="p-3">Solved</th>
                            <th className="p-3">Easy</th>
                            <th className="p-3">Medium</th>
                            <th className="p-3">Hard</th>
                            <th className="p-3">LeetCode Rating</th>
                            <th className="p-3">Codechef Rating</th>
                            <th className="p-3">Codeforces Rating</th>
                            <th className="p-3">Streak</th>
                            <th className="py-3 px-4">Total Attempted</th>
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
                                <td className="p-3 font-medium">
                                    {editingId === student.id ? (
                                        <input
                                            type="text"
                                            value={editData.name}
                                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                            className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600"
                                        />
                                    ) : (
                                        student.name
                                    )}
                                </td>
                                <td className="p-3 font-semibold text-indigo-600 dark:text-indigo-400">
                                    {
                                        student.leetcodeHandle || "N/A"
                                    }
                                </td>
                                <td className="p-3">
                                    {
                                        student.language
                                    }
                                </td>
                                <td className="p-3">{student.totalSolved}</td>
                                <td className="p-3">{student.easy}</td>
                                <td className="p-3">{student.medium}</td>
                                <td className="p-3">{student.hard}</td>
                                <td className="p-3">{Math.floor(student.LeetcodecontestRating) || 0}</td>
                                <td className="p-3">{student.CodechefcontestRating || 0}</td>
                                <td className="p-3">{student.CodeforcescontestRating || 0}</td>
                                <td className="p-3">{student.currentStreak}</td>
                                <td className={`p-3 font-bold `}>
                                    {student.totalSubmissions}
                                </td>
                                <td className="p-3 flex items-center justify-center gap-3">
                                    {editingId === student.id ? (
                                        <>
                                            <button
                                                onClick={() => handleSave(student.id)}
                                                className="text-green-600 hover:underline"
                                                title="Save"
                                            >
                                                <Save className="w-4 h-4" />

                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="text-gray-600 dark:text-gray-300 hover:underline"
                                                title="Cancel"
                                            >
                                                <X className="w-4 h-4" />

                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleEdit(student)}
                                                className="text-yellow-500 hover:underline"
                                                title="Edit"
                                            >
                                                <Edit3 className="w-4 h-4" />

                                            </button>
                                            <button
                                                onClick={() => handleSync(student.id)}
                                                className="text-blue-600 dark:text-blue-400 hover:underline"
                                                title="Sync Data"
                                            >
                                                <RefreshCw className="w-4 h-4" />

                                            </button>
                                            <button
                                                onClick={() => handleDelete(student.id)}
                                                className="text-red-600 dark:text-red-400 hover:underline"
                                                title="Delete Student"
                                            >
                                                <Trash2 className="w-4 h-4" />

                                            </button>
                                        </>
                                    )}
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