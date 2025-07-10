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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center dark:text-white">
        Public Leaderboard – {group.groupName}
      </h1>

      <div className="overflow-x-auto shadow rounded border dark:border-gray-700">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Platform</th>
              <th className="p-2">Handle</th>
              <th className="p-2">Solved</th>
              <th className="p-2">Streak</th>
              <th className="p-2">Max Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {group.leaderboard?.map((student, idx) => (
              <tr key={idx} className="border-t dark:border-gray-700 text-center">
                <td className="p-2">{student.username}</td>
                <td className="p-2">{student.platform}</td>
                <td className="p-2">{student.handle}</td>
                <td className="p-2">{student.totalSolved}</td>
                <td className="p-2">{student.currentStreak}</td>
                <td className="p-2">{student.maxDifficulty}</td>
              </tr>
            ))}
            {group.leaderboard?.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-gray-500">No students in this group yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PublicLeaderboard;