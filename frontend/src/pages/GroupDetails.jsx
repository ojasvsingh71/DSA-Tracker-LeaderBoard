import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { ToastContext } from "../context/ToastContext";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  Edit3,
  Trash2,
  Save,
  X,
  RefreshCw,
  PlusCircle,
  ArrowLeft,
  ExternalLink,
  Award,
  BookOpen,
  Code2
} from "lucide-react";

const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useContext(ToastContext);

  const [group, setGroup] = useState(null);
  const [newStudent, setNewStudent] = useState({ name: "", platform: "leetcode", handle: "", language: "" });
  const [addLoading, setAddLoading] = useState(false);
  const [syncingIds, setSyncingIds] = useState([]);

  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Edit states
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchGroup = async () => {
    try {
      const res = await api.get(`/group/${id}/leaderboard`);
      setGroup(res.data);
    } catch (err) {
      showToast("Failed to load group details.", "error");
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudent.name.trim()) return;

    setAddLoading(true);
    try {
      const platforms = newStudent.handle.trim()
        ? [
            {
              platform: newStudent.platform,
              handle: newStudent.handle,
              language: newStudent.language,
            },
          ]
        : [];

      const res = await api.post(`/student/${id}/add`, {
        name: newStudent.name,
        platforms,
      });
      setNewStudent({ name: "", platform: "leetcode", handle: "", language: "" });
      showToast(res.data.message || "Student added successfully!", "success");
      fetchGroup();
    } catch (err) {
      showToast(err.response?.data?.message || "Error adding student.", "error");
    } finally {
      setAddLoading(false);
    }
  };

  const openDeleteModal = (student) => {
    setStudentToDelete(student);
    setDeleteModalOpen(true);
  };

  const confirmDeleteStudent = async () => {
    if (!studentToDelete) return;
    try {
      await api.delete(`/student/${studentToDelete.id}/delete?groupId=${id}`);
      showToast("Student removed from group successfully.", "success");
      fetchGroup();
    } catch (err) {
      showToast("Failed to remove student from group.", "error");
    } finally {
      setDeleteModalOpen(false);
      setStudentToDelete(null);
    }
  };

  const handleSync = async (studentId) => {
    setSyncingIds((prev) => [...prev, studentId]);
    try {
      await api.post(`/student/${studentId}/sync`);
      showToast("Student statistics synchronized successfully!", "success");
      fetchGroup();
    } catch (err) {
      showToast("Synchronization failed for this student.", "error");
    } finally {
      setSyncingIds((prev) => prev.filter((id) => id !== studentId));
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setEditData({
      name: student.name,
      leetcodeHandle: student.leetcodeHandle !== "N/A" ? student.leetcodeHandle : "",
      codechefHandle: student.codechefHandle || "",
      codeforcesHandle: student.codeforcesHandle || "",
      language: student.language !== "N/A" ? student.language : "",
      codechefLanguage: student.codechefLanguage || "",
      codeforcesLanguage: student.codeforcesLanguage || "",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleSave = async (studentId) => {
    try {
      const platforms = [];
      if (editData.leetcodeHandle) {
        platforms.push({
          platform: "leetcode",
          handle: editData.leetcodeHandle,
          language: editData.language,
        });
      }
      if (editData.codechefHandle) {
        platforms.push({
          platform: "codechef",
          handle: editData.codechefHandle,
          language: editData.codechefLanguage,
        });
      }
      if (editData.codeforcesHandle) {
        platforms.push({
          platform: "codeforces",
          handle: editData.codeforcesHandle,
          language: editData.codeforcesLanguage,
        });
      }

      await api.patch(`/student/${studentId}/edit`, {
        name: editData.name,
        platforms,
      });

      setEditingId(null);
      showToast("Student updated. Fetching fresh statistics...", "success");
      handleSync(studentId);
    } catch (err) {
      showToast("Failed to update student settings.", "error");
    }
  };

  useEffect(() => {
    fetchGroup();
  }, [id]);

  // Difficulty/Platform styling helpers
  const getDifficultyColor = (count, level) => {
    if (level === "easy") return "text-emerald-600 dark:text-emerald-400 font-semibold";
    if (level === "medium") return "text-amber-500 dark:text-amber-400 font-semibold";
    if (level === "hard") return "text-rose-500 dark:text-rose-400 font-semibold";
    return "";
  };

  const getCodeforcesRatingClass = (rating) => {
    if (rating < 1200) return "text-slate-400 font-semibold";
    if (rating < 1400) return "text-emerald-500 font-semibold";
    if (rating < 1600) return "text-cyan-500 font-semibold";
    if (rating < 1900) return "text-indigo-500 font-semibold";
    if (rating < 2200) return "text-fuchsia-500 font-semibold";
    if (rating < 2400) return "text-amber-500 font-semibold";
    return "text-rose-500 font-bold";
  };

  if (!group) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">Loading roster...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header breadcrumb & info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-1">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Group: {group.groupName}
          </h1>
        </div>

        <div>
          <a
            href={`/leaderboard/${id}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/80 border border-indigo-100 dark:border-indigo-900/30 rounded-xl transition text-sm font-semibold"
          >
            <span>View Public Leaderboard</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Add Student Form Box */}
      <div className="bg-white dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-indigo-500" />
          <span>Add New Student to Group</span>
        </h2>

        <form onSubmit={handleAddStudent} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Student Name</label>
            <input
              type="text"
              placeholder="e.g. Ojasv Singh"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white transition"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Platform Handle <span className="text-[10px] text-slate-400 font-normal">(Optional if exists)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. handle_name"
              value={newStudent.handle}
              onChange={(e) => setNewStudent({ ...newStudent, handle: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Coding Platform</label>
            <select
              value={newStudent.platform}
              onChange={(e) => setNewStudent({ ...newStudent, platform: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white transition cursor-pointer"
            >
              <option value="leetcode">LeetCode</option>
              <option value="codechef">CodeChef</option>
              <option value="codeforces">Codeforces</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Language Preferred (Optional)</label>
            <input
              type="text"
              placeholder="e.g. C++, Java, Python"
              value={newStudent.language}
              onChange={(e) => setNewStudent({ ...newStudent, language: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white transition"
            />
          </div>

          <button
            type="submit"
            disabled={addLoading}
            className="sm:col-span-2 lg:col-span-4 mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/25 transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            {addLoading ? (
              <div className="flex items-center gap-1">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Adding Student...</span>
              </div>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" />
                <span>Add Student</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Roster list */}
      <div className="bg-white dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              <span>Student Roster</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Active tracking roster of handles and DSA progress details. Edit or refresh stats dynamically.
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-400">
            Total Solved & streaks correspond to LeetCode profiles.
          </div>
        </div>

        <div className="overflow-x-auto hidden lg:block">
          <table className="w-full border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-4">Name</th>
                <th scope="col" className="px-6 py-4">Platforms & Handles</th>
                <th scope="col" className="px-6 py-4 text-center">Solved (LeetCode)</th>
                <th scope="col" className="px-6 py-4 text-center">Contests (LC / CF / CC)</th>
                <th scope="col" className="px-6 py-4 text-center">Streak</th>
                <th scope="col" className="px-6 py-4 text-center">Total Attempted</th>
                <th scope="col" className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
              {group.leaderboard?.map((student) => {
                const isEditing = editingId === student.id;
                const isSyncing = syncingIds.includes(student.id);

                return (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors"
                  >
                    {/* Name Column */}
                    <td className="px-6 py-4 font-semibold text-slate-950 dark:text-white">
                      {isEditing ? (
                        <input
                          type="text"
                          className="px-2 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        />
                      ) : (
                        student.name
                      )}
                    </td>

                    {/* Platforms/Handles Column */}
                    <td className="px-6 py-4 space-y-1">
                      {isEditing ? (
                        <div className="flex flex-col gap-2 max-w-[200px]" onClick={(e) => e.stopPropagation()}>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">LeetCode</span>
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                placeholder="LC Handle"
                                className="w-full px-2 py-0.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-xs dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={editData.leetcodeHandle}
                                onChange={(e) => setEditData({ ...editData, leetcodeHandle: e.target.value })}
                              />
                              <input
                                type="text"
                                placeholder="Language"
                                className="w-20 px-2 py-0.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-xs dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={editData.language}
                                onChange={(e) => setEditData({ ...editData, language: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">Codeforces</span>
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                placeholder="CF Handle"
                                className="w-full px-2 py-0.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-xs dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={editData.codeforcesHandle}
                                onChange={(e) => setEditData({ ...editData, codeforcesHandle: e.target.value })}
                              />
                              <input
                                type="text"
                                placeholder="Language"
                                className="w-20 px-2 py-0.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-xs dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={editData.codeforcesLanguage}
                                onChange={(e) => setEditData({ ...editData, codeforcesLanguage: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">CodeChef</span>
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                placeholder="CC Handle"
                                className="w-full px-2 py-0.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-xs dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={editData.codechefHandle}
                                onChange={(e) => setEditData({ ...editData, codechefHandle: e.target.value })}
                              />
                              <input
                                type="text"
                                placeholder="Language"
                                className="w-20 px-2 py-0.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-xs dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={editData.codechefLanguage}
                                onChange={(e) => setEditData({ ...editData, codechefLanguage: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {student.leetcodeHandle && student.leetcodeHandle !== "N/A" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                              LeetCode: {student.leetcodeHandle} ({student.language})
                            </span>
                          )}
                          {student.codeforcesHandle && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/30">
                              Codeforces: {student.codeforcesHandle}
                            </span>
                          )}
                          {student.codechefHandle && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-900/30">
                              CodeChef: {student.codechefHandle}
                            </span>
                          )}
                          {!student.codechefHandle && (!student.leetcodeHandle || student.leetcodeHandle === "N/A") && !student.codeforcesHandle && (
                            <span className="text-slate-400 italic text-xs">No handles set</span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Solved Stats (LeetCode) */}
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex flex-col gap-1">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          {student.totalSolved || 0}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className={getDifficultyColor(student.easy, "easy")}>E: {student.easy || 0}</span>
                          <span className={getDifficultyColor(student.medium, "medium")}>M: {student.medium || 0}</span>
                          <span className={getDifficultyColor(student.hard, "hard")}>H: {student.hard || 0}</span>
                        </div>
                      </div>
                    </td>

                    {/* Ratings (LC / CF / CC) */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-amber-500 font-semibold" title="Leetcode Rating">
                            LC: {Math.floor(student.LeetcodecontestRating || 0)}
                          </span>
                          <span className={getCodeforcesRatingClass(student.CodeforcescontestRating || 0)} title="Codeforces Rating">
                            CF: {student.CodeforcescontestRating || 0}
                          </span>
                          <span className="text-orange-500 font-semibold" title="Codechef Rating">
                            CC: {student.CodechefcontestRating || 0}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Streak Column */}
                    <td className="px-6 py-4 text-center font-semibold text-slate-800 dark:text-slate-200">
                      {student.currentStreak || 0} 🔥
                    </td>

                    {/* Attempted (Total submissions) */}
                    <td className="px-6 py-4 text-center font-bold text-slate-800 dark:text-slate-200">
                      {student.totalSubmissions || 0}
                    </td>

                    {/* Actions Column */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSave(student.id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 rounded-lg transition"
                              title="Save"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(student)}
                              className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                              title="Edit Student"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleSync(student.id)}
                              disabled={isSyncing}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-50"
                              title="Sync student data"
                            >
                              <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin text-indigo-500" : ""}`} />
                            </button>
                            <button
                              onClick={() => openDeleteModal(student)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                              title="Delete Student"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {(!group.leaderboard || group.leaderboard.length === 0) && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400 italic">
                    No students currently added. Fill out the form above to enroll students.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile card layout */}
        <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800/80">
          {group.leaderboard?.map((student) => {
            const isEditing = editingId === student.id;
            const isSyncing = syncingIds.includes(student.id);

            return (
              <div key={student.id} className="p-4 space-y-4">
                {/* Header: Name and Actions */}
                <div className="flex items-start justify-between">
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        className="px-2 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      />
                    ) : (
                      <h4 className="text-base font-bold text-slate-950 dark:text-white">{student.name}</h4>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-1.5">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleSave(student.id)}
                          className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 rounded-lg transition"
                          title="Save"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(student)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Edit Student"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleSync(student.id)}
                          disabled={isSyncing}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-50"
                          title="Sync student data"
                        >
                          <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin text-indigo-500" : ""}`} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(student)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Handles editing or viewing */}
                {isEditing ? (
                  <div className="space-y-3 bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">LeetCode</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Handle"
                          className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs dark:text-white"
                          value={editData.leetcodeHandle}
                          onChange={(e) => setEditData({ ...editData, leetcodeHandle: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="Lang"
                          className="w-24 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs dark:text-white"
                          value={editData.language}
                          onChange={(e) => setEditData({ ...editData, language: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Codeforces</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="CF Handle"
                          className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs dark:text-white"
                          value={editData.codeforcesHandle}
                          onChange={(e) => setEditData({ ...editData, codeforcesHandle: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="Lang"
                          className="w-24 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs dark:text-white"
                          value={editData.codeforcesLanguage}
                          onChange={(e) => setEditData({ ...editData, codeforcesLanguage: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">CodeChef</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="CC Handle"
                          className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs dark:text-white"
                          value={editData.codechefHandle}
                          onChange={(e) => setEditData({ ...editData, codechefHandle: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="Lang"
                          className="w-24 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs dark:text-white"
                          value={editData.codechefLanguage}
                          onChange={(e) => setEditData({ ...editData, codechefLanguage: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {student.leetcodeHandle && student.leetcodeHandle !== "N/A" && (
                      <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                        LC: {student.leetcodeHandle} ({student.language})
                      </span>
                    )}
                    {student.codeforcesHandle && (
                      <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/30">
                        CF: {student.codeforcesHandle}
                      </span>
                    )}
                    {student.codechefHandle && (
                      <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-900/30">
                        CC: {student.codechefHandle}
                      </span>
                    )}
                    {!student.codechefHandle && (!student.leetcodeHandle || student.leetcodeHandle === "N/A") && !student.codeforcesHandle && (
                      <span className="text-slate-400 italic text-xs">No handles set</span>
                    )}
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-100 dark:border-slate-800 pt-3 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block font-sans">Solved (LeetCode)</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{student.totalSolved || 0}</span>
                    <div className="text-[9px] text-slate-400 space-x-1 mt-0.5">
                      <span className={getDifficultyColor(student.easy, "easy")}>E:{student.easy || 0}</span>
                      <span className={getDifficultyColor(student.medium, "medium")}>M:{student.medium || 0}</span>
                      <span className={getDifficultyColor(student.hard, "hard")}>H:{student.hard || 0}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block font-sans">Streak</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{student.currentStreak || 0} 🔥</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block font-sans">Contests (LC/CF/CC)</span>
                    <div className="space-y-0.5 mt-0.5">
                      <span className="text-amber-500 font-semibold block">LC: {Math.floor(student.LeetcodecontestRating || 0)}</span>
                      <span className={`${getCodeforcesRatingClass(student.CodeforcescontestRating || 0)} block`}>CF: {student.CodeforcescontestRating || 0}</span>
                      <span className="text-orange-500 font-semibold block">CC: {student.CodechefcontestRating || 0}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block font-sans">Attempted</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{student.totalSubmissions || 0}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {(!group.leaderboard || group.leaderboard.length === 0) && (
            <div className="p-8 text-center text-slate-400 italic text-sm">
              No students currently added. Fill out the form above to enroll students.
            </div>
          )}
        </div>
      </div>

      {/* Delete Student Custom Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete Student?"
        message={`Are you sure you want to remove ${studentToDelete?.name} from this group? This will sever their tracking data in this cohort.`}
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={confirmDeleteStudent}
        onCancel={() => {
          setDeleteModalOpen(false);
          setStudentToDelete(null);
        }}
        isDestructive={true}
      />
    </div>
  );
};

export default GroupDetails;