import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const fetchGroups = async () => {
    try {
      const res = await api.get("/admin/groups"); 
      setGroups(res.data.groups || []);
    } catch (err) {
      console.error("Failed to fetch groups", err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/group/add", { name });
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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Admin Dashboard
      </h1>

      {/* Create Group */}
      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="New Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="flex-1 px-4 py-2 rounded border dark:bg-gray-700 dark:text-white"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Group
        </button>
      </form>

      {/* Group List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {groups.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No groups created yet.</p>
        ) : (
          groups.map((group) => (
            <div
              key={group._id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:shadow-md cursor-pointer transition"
              onClick={() => navigate(`/group/${group._id}`)}
            >
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{group.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {group.students?.length || 0} students
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;