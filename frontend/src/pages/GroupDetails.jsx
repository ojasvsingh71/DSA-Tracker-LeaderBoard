import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosInstance";

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
      const res = await api.post(`/student/${id}/add`, {
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
      await api.delete(`/student/${studentId}`);
      fetchGroup();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleSync = async (studentId) => {
    try {
      await api.put(`/student/${studentId}/sync`);
      fetchGroup();
    } catch (err) {
      console.error("Sync failed", err);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, [id]);

  if (!group) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
        Group: {group.groupName}
      </h1>

      <a
        href={`/public/leaderboard/${id}`}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 underline mb-6 inline-block"
      >
        View Public Leaderboard ↗
      </a>

      {/* Add Student Form */}
      <form onSubmit={handleAddStudent} className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-6">
        <input
          type="text"
          placeholder="Student Name"
          value={newStudent.name}
          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
          className="px-2 py-1 rounded border"
          required
        />
        <input
          type="text"
          placeholder="DSA Handle"
          value={newStudent.handle}
          onChange={(e) => setNewStudent({ ...newStudent, handle: e.target.value })}
          className="px-2 py-1 rounded border"
          required
        />
        <select
          value={newStudent.platform}
          onChange={(e) => setNewStudent({ ...newStudent, platform: e.target.value })}
          className="px-2 py-1 rounded border"
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
          className="px-2 py-1 rounded border"
        />
        <button
          type="submit"
          className="sm:col-span-4 bg-green-600 text-white py-1 px-4 rounded hover:bg-green-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Student"}
        </button>
      </form>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Platform</th>
              <th className="p-2">Handle</th>
              <th className="p-2">Language</th>
              <th className="p-2">Solved</th>
              <th className="p-2">Streak</th>
              <th className="p-2">Max Difficulty</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {group.leaderboard?.map((student, idx) => (
              <tr key={idx} className="border-t dark:border-gray-700">
                <td className="p-2">{student.username}</td>
                <td className="p-2">{student.platform}</td>
                <td className="p-2">{student.handle}</td>
                <td className="p-2">{student.language}</td>
                <td className="p-2">{student.totalSolved}</td>
                <td className="p-2">{student.currentStreak}</td>
                <td className="p-2">{student.maxDifficulty}</td>
                <td className="p-2 space-x-2">
                  <button onClick={() => handleSync(student._id)} className="text-blue-600 hover:underline">Sync</button>
                  <button onClick={() => handleDelete(student._id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {group.leaderboard?.length === 0 && (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-500">No students yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GroupDetails;