import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { ToastContext } from "../context/ToastContext";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  Plus,
  Search,
  Users,
  Trash2,
  Edit3,
  Copy,
  Folder,
  ArrowRight,
  ExternalLink,
  GraduationCap,
  Save,
  X
} from "lucide-react";

const Dashboard = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  // States for deleting group
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);

  // States for editing/renaming group
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [editGroupName, setEditGroupName] = useState("");

  const fetchGroups = async () => {
    try {
      const res = await api.get(`auth/admin/${id}/groups`);
      setGroups(res.data.groups || []);
    } catch (err) {
      showToast("Failed to fetch groups.", "error");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    setCreateLoading(true);
    try {
      const res = await api.post("/group/add", { id, name: newGroupName });
      setGroups((prev) => [...prev, res.data.group]);
      setNewGroupName("");
      showToast("Group created successfully!", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Error creating group.", "error");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCopyLink = (groupId, e) => {
    e.stopPropagation(); // prevent clicking card
    const url = `${window.location.origin}/leaderboard/${groupId}`;
    navigator.clipboard.writeText(url);
    showToast("Public leaderboard link copied to clipboard!", "success");
  };

  const openDeleteModal = (group, e) => {
    e.stopPropagation();
    setGroupToDelete(group);
    setDeleteModalOpen(true);
  };

  const confirmDeleteGroup = async () => {
    if (!groupToDelete) return;
    try {
      await api.delete(`/group/${groupToDelete._id}/delete`);
      setGroups((prev) => prev.filter((g) => g._id !== groupToDelete._id));
      showToast(`Group "${groupToDelete.name}" deleted successfully.`, "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete group.", "error");
    } finally {
      setDeleteModalOpen(false);
      setGroupToDelete(null);
    }
  };

  const startRename = (group, e) => {
    e.stopPropagation();
    setEditingGroupId(group._id);
    setEditGroupName(group.name);
  };

  const saveRename = async (groupId, e) => {
    e.stopPropagation();
    if (!editGroupName.trim()) return;
    try {
      const res = await api.patch(`/group/${groupId}/edit`, { name: editGroupName });
      setGroups((prev) =>
        prev.map((g) => (g._id === groupId ? { ...g, name: res.data.group.name } : g))
      );
      setEditingGroupId(null);
      showToast("Group renamed successfully!", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to rename group.", "error");
    }
  };

  const cancelRename = (e) => {
    e.stopPropagation();
    setEditingGroupId(null);
    setEditGroupName("");
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStudents = groups.reduce((acc, curr) => acc + (curr.students?.length || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Heading */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome back, {user?.name || "Admin"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage your student cohorts and check public leaderboard stats
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Folder className="w-6 h-6" />
          </div>
          <div>
            <span className="text-sm text-slate-400 font-medium block">Total Groups</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {groups.length}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 backdrop-blur border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 rounded-xl">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-sm text-slate-400 font-medium block">Tracked Students</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {totalStudents}
            </span>
          </div>
        </div>
      </div>

      {/* Controls: Search and Add Group */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Search groups..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Add Group Form */}
        <form onSubmit={handleCreate} className="flex gap-2 w-full lg:max-w-lg">
          <input
            type="text"
            placeholder="Enter new group name..."
            required
            className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white transition"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <button
            type="submit"
            disabled={createLoading}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition flex items-center gap-1.5 shadow-md shadow-indigo-500/10 cursor-pointer disabled:opacity-60"
          >
            <Plus className="w-5 h-5" />
            <span>Create</span>
          </button>
        </form>
      </div>

      {/* Group Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <Folder className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Groups Found</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto text-sm">
              {searchQuery ? "No groups match your search criteria." : "Create your first group above to start tracking students."}
            </p>
          </div>
        ) : (
          filteredGroups.map((group) => (
            <div
              key={group._id}
              onClick={() => navigate(`/group/${group._id}`)}
              className="group relative bg-white dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 p-5 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Editing Inline Mode */}
                {editingGroupId === group._id ? (
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      className="w-full px-2.5 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white text-base font-semibold"
                      value={editGroupName}
                      onChange={(e) => setEditGroupName(e.target.value)}
                      autoFocus
                    />
                    <button
                      onClick={(e) => saveRename(group._id, e)}
                      className="p-1 bg-green-500/10 hover:bg-green-500/20 text-green-600 rounded-lg transition"
                      title="Save"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={cancelRename}
                      className="p-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 rounded-lg transition"
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {group.name}
                    </h3>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => startRename(group, e)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="Rename Group"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => openDeleteModal(group, e)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="Delete Group"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Group Details */}
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm mt-3">
                  <Users className="w-4 h-4 text-indigo-500" />
                  <span>
                    {group.students?.length || 0} student{group.students?.length === 1 ? "" : "s"} enrolled
                  </span>
                </div>
              </div>

              {/* Action footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                <button
                  onClick={(e) => handleCopyLink(group._id, e)}
                  className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition"
                  title="Copy Public Link"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </button>
                <div className="flex items-center gap-0.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all">
                  <span>Enter Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirmation Modal for Group Deletion */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete Group?"
        message={`Are you sure you want to delete the group "${groupToDelete?.name}"? All students enrolled in this group will lose this connection.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteGroup}
        onCancel={() => {
          setDeleteModalOpen(false);
          setGroupToDelete(null);
        }}
        isDestructive={true}
      />
    </div>
  );
};

export default Dashboard;