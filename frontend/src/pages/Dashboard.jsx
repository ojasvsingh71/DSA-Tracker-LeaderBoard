import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosInstance";

const Dashboard = () => {
  const { id } = useParams();
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const fetchGroups = async () => {
    try {
      const res = await api.get(`auth/admin/${id}/groups`);
      setGroups(res.data.groups || []);
    } catch (err) {
      console.error("Failed to fetch groups", err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/group/add", { id, name });
      setGroups([...groups, res.data.group]);
      setName("");
    } catch (err) {
      console.error("Error creating group", err);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-100 dark:from-gray-950 dark:to-slate-800 p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900 dark:text-white tracking-tight">
        Admin Dashboard
      </h1>

      <form onSubmit={handleCreate} className="flex flex-col sm:flex-row items-center gap-4 mb-8 max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Enter group name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="flex-1 px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        <button
          type="submit"
          className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition font-medium"
        >
          ➕ Create Group
        </button>
      </form>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400 mt-6">
            🚫 No groups created yet. Start by creating your first group!
          </div>
        ) : (
          groups.map((group) => (
            <div
              key={group._id}
              onClick={() => navigate(`/group/${group._id}`)}
              className="bg-white dark:bg-[#1e1e2f] p-5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400">{group.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                👥 {group.students?.length || 0} student{group.students?.length === 1 ? "" : "s"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;