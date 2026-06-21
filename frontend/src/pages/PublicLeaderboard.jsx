import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import {
  Flame,
  Star,
  Zap,
  Award,
  Search,
  ArrowUpDown,
  Trophy,
  Filter,
  Users
} from "lucide-react";

const PublicLeaderboard = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("solved"); // 'solved' | 'leetcodeRating' | 'codechefRating' | 'codeforcesRating' | 'streak'

  const fetchGroup = async () => {
    try {
      const res = await api.get(`/group/${id}/leaderboard`);
      setGroup(res.data);
    } catch (err) {
      console.error("Error fetching group leaderboard", err);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, [id]);

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">Loading Leaderboard...</span>
        </div>
      </div>
    );
  }

  // Rank Styling helpers
  const getRankBadge = (rank) => {
    if (rank === 0) return "🥇";
    if (rank === 1) return "🥈";
    if (rank === 2) return "🥉";
    return `#${rank + 1}`;
  };

  const getDifficultyStyle = (count, level) => {
    const colorMap = {
      easy: "text-emerald-600 dark:text-emerald-400",
      medium: "text-amber-500 dark:text-amber-400",
      hard: "text-rose-500 dark:text-rose-400",
    };
    return (
      <span className={`font-semibold ${colorMap[level]}`}>
        {count}
      </span>
    );
  };

  const getRatingIcon = (rating) => {
    if (!rating || isNaN(rating)) return;
    if (rating > 1800) return <Star className="text-purple-600 dark:text-purple-400 inline w-4 h-4" />;
    if (rating > 1500) return <Star className="text-orange-500 dark:text-orange-400 inline w-4 h-4" />;
    return <Star className="text-slate-400 dark:text-slate-600 inline w-4 h-4" />;
  };

  const getStreakIcon = (streak) => {
    if (!streak || isNaN(streak)) return <Zap className="text-slate-300 dark:text-slate-700 inline w-4 h-4" />;
    if (streak >= 100) return <Flame className="text-rose-600 dark:text-rose-400 inline w-4 h-4 animate-pulse" />;
    if (streak >= 1) return <Zap className="text-amber-400 dark:text-amber-400 inline w-4 h-4" />;
    return <Zap className="text-slate-300 dark:text-slate-700 inline w-4 h-4" />;
  };

  const getStarIcons = (rating) => {
    if (!rating || isNaN(rating)) return null;
    let stars = 0;
    if (rating <= 1399) stars = 1;
    else if (rating <= 1599) stars = 2;
    else if (rating <= 1799) stars = 3;
    else if (rating <= 1999) stars = 4;
    else if (rating <= 2199) stars = 5;
    else if (rating <= 2499) stars = 6;
    else stars = 7;

    return Array.from({ length: stars }, (_, i) => (
      <Star key={i} className="text-amber-400 inline w-3 h-3 fill-amber-400" />
    ));
  };

  const getCodeforcesColor = (rating) => {
    if (!rating) return <span className="text-slate-400">0</span>;
    if (rating < 1200) return <span className="text-slate-400 font-semibold">{rating}</span>;
    if (rating < 1400) return <span className="text-emerald-500 font-semibold">{rating}</span>;
    if (rating < 1600) return <span className="text-cyan-500 font-semibold">{rating}</span>;
    if (rating < 1900) return <span className="text-indigo-500 font-semibold">{rating}</span>;
    if (rating < 2200) return <span className="text-fuchsia-500 font-semibold">{rating}</span>;
    if (rating < 2400) return <span className="text-amber-500 font-semibold">{rating}</span>;
    return <span className="text-rose-500 font-bold">{rating}</span>;
  };

  // Sort logic
  const sortStudents = (a, b) => {
    if (sortBy === "solved") {
      return (b.totalSolved ?? 0) - (a.totalSolved ?? 0);
    }
    if (sortBy === "leetcodeRating") {
      return (b.LeetcodecontestRating ?? 0) - (a.LeetcodecontestRating ?? 0);
    }
    if (sortBy === "codechefRating") {
      return (b.CodechefcontestRating ?? 0) - (a.CodechefcontestRating ?? 0);
    }
    if (sortBy === "codeforcesRating") {
      return (b.CodeforcescontestRating ?? 0) - (a.CodeforcescontestRating ?? 0);
    }
    if (sortBy === "streak") {
      return (b.currentStreak ?? 0) - (a.currentStreak ?? 0);
    }
    return 0;
  };

  const allStudents = [...(group.leaderboard || [])];
  const sortedAll = allStudents.sort(sortStudents);

  const filteredStudents = sortedAll.filter((student) =>
    student.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Top 3 for podium
  const topThree = sortedAll.slice(0, 3);
  const restStudents = filteredStudents;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-950 to-slate-900 dark:from-indigo-400 dark:via-indigo-100 dark:to-white bg-clip-text text-transparent">
          Leaderboard – {group.groupName}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base flex items-center justify-center gap-1.5 font-medium">
          <Users className="w-4 h-4 text-indigo-500" />
          <span>Public Cohort Rankings</span>
        </p>
        <p className="text-xs text-amber-500/80 dark:text-amber-400/80 font-mono">
          * Note: The number of solved questions displayed is based on LeetCode data
        </p>
      </div>

      {/* Podium Showcase for Top 3 (Only visible if we sort by default 'solved' and have students) */}
      {sortBy === "solved" && topThree.length > 0 && !searchQuery && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto pt-6">
          {/* Rank 2 (Silver) */}
          {topThree[1] && (
            <div className="bg-white/60 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition flex flex-col items-center justify-center text-center order-2 md:order-1 h-64 md:h-56 relative overflow-hidden group">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-slate-300 dark:bg-slate-700" />
              <span className="text-4xl">🥈</span>
              <span className="text-sm font-semibold text-slate-400 mt-2 block">2nd Place</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {topThree[1].name}
              </h3>
              <div className="mt-3 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{topThree[1].totalSolved || 0} Solved</span>
              </div>
              <div className="text-xs text-slate-400 mt-2 font-medium">
                Streak: {topThree[1].currentStreak || 0} 🔥
              </div>
            </div>
          )}

          {/* Rank 1 (Gold) */}
          {topThree[0] && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-md hover:shadow-2xl transition flex flex-col items-center justify-center text-center order-1 md:order-2 h-72 md:h-64 relative overflow-hidden ring-4 ring-indigo-500/10 dark:ring-indigo-400/5 group">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-amber-400" />
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-2xl text-amber-500 shadow-md">
                <Trophy className="w-8 h-8" />
              </div>
              <span className="text-sm font-bold text-amber-500 mt-3 block tracking-wider uppercase">1st Place</span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {topThree[0].name}
              </h3>
              <div className="mt-3 flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 px-4 py-1.5 rounded-xl border border-amber-100 dark:border-amber-900/10">
                <span className="text-sm font-bold">{topThree[0].totalSolved || 0} Solved</span>
              </div>
              <div className="text-xs text-slate-400 mt-2 font-medium">
                Streak: {topThree[0].currentStreak || 0} 🔥
              </div>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {topThree[2] && (
            <div className="bg-white/60 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition flex flex-col items-center justify-center text-center order-3 h-64 md:h-48 relative overflow-hidden group">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-amber-700/80" />
              <span className="text-4xl">🥉</span>
              <span className="text-sm font-semibold text-slate-400 mt-2 block">3rd Place</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {topThree[2].name}
              </h3>
              <div className="mt-3 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{topThree[2].totalSolved || 0} Solved</span>
              </div>
              <div className="text-xs text-slate-400 mt-2 font-medium">
                Streak: {topThree[2].currentStreak || 0} 🔥
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900/30 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Search by student name..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Sort by:</span>
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white cursor-pointer"
          >
            <option value="solved">LeetCode Solved</option>
            <option value="leetcodeRating">LeetCode Rating</option>
            <option value="codeforcesRating">Codeforces Rating</option>
            <option value="codechefRating">CodeChef Rating</option>
            <option value="streak">Current Streak</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto hidden lg:block">
          <table className="w-full border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-4 text-center">Rank</th>
                <th scope="col" className="px-6 py-4">Student</th>
                <th scope="col" className="px-6 py-4 text-center">LeetCode Solved</th>
                <th scope="col" className="px-6 py-4 text-center">Difficulty Details</th>
                <th scope="col" className="px-6 py-4 text-center">Streak</th>
                <th scope="col" className="px-6 py-4 text-center">Leetcode Rating</th>
                <th scope="col" className="px-6 py-4 text-center">Codeforces Rating</th>
                <th scope="col" className="px-6 py-4 text-center">CodeChef Stars</th>
                <th scope="col" className="px-6 py-4 text-center">Total Attempted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
              {restStudents.map((student, idx) => {
                // Determine absolute rank
                const absoluteRank = searchQuery
                  ? sortedAll.findIndex((s) => s.id === student.id)
                  : idx;

                const isTopThree = absoluteRank < 3 && !searchQuery;

                return (
                  <tr
                    key={student.id || idx}
                    className={`hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors ${
                      isTopThree
                        ? absoluteRank === 0
                          ? "bg-amber-50/10 dark:bg-amber-950/5 border-l-4 border-l-amber-400"
                          : absoluteRank === 1
                          ? "bg-slate-50/20 dark:bg-slate-900/10 border-l-4 border-l-slate-300"
                          : "bg-amber-900/5 dark:bg-amber-900/2 border-l-4 border-l-amber-700"
                        : ""
                    }`}
                  >
                    {/* Rank Badge */}
                    <td className="px-6 py-4 text-center font-bold text-slate-800 dark:text-slate-200">
                      {getRankBadge(absoluteRank)}
                    </td>

                    {/* Name / Handles */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-slate-950 dark:text-white text-base">
                          {student.name}
                        </span>
                        {/* Compact handles */}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {student.leetcodeHandle && student.leetcodeHandle !== "N/A" && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-md border border-amber-100 dark:border-amber-900/20">
                              LC: {student.leetcodeHandle}
                            </span>
                          )}
                          {student.codeforcesHandle && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400 rounded-md border border-cyan-100 dark:border-cyan-900/20">
                              CF: {student.codeforcesHandle}
                            </span>
                          )}
                          {student.codechefHandle && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 rounded-md border border-orange-100 dark:border-orange-900/20">
                              CC: {student.codechefHandle}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Solved Count */}
                    <td className="px-6 py-4 text-center text-slate-950 dark:text-white font-bold text-base">
                      {student.totalSolved ?? 0}
                    </td>

                    {/* Difficulties */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3 text-xs">
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">Easy</span>
                          {getDifficultyStyle(student.easy || 0, "easy")}
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">Medium</span>
                          {getDifficultyStyle(student.medium || 0, "medium")}
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">Hard</span>
                          {getDifficultyStyle(student.hard || 0, "hard")}
                        </div>
                      </div>
                    </td>

                    {/* Streak */}
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                        {getStreakIcon(student.currentStreak)}
                        <span>{student.currentStreak || 0}</span>
                      </div>
                    </td>

                    {/* LeetCode Rating */}
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1 text-slate-800 dark:text-slate-200 font-semibold">
                        {getRatingIcon(student.LeetcodecontestRating)}
                        <span>{Math.floor(student.LeetcodecontestRating || 0)}</span>
                      </div>
                    </td>

                    {/* Codeforces Rating */}
                    <td className="px-6 py-4 text-center">
                      {getCodeforcesColor(student.CodeforcescontestRating || 0)}
                    </td>

                    {/* CodeChef Stars */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-slate-800 dark:text-slate-200 font-semibold">
                          {Math.floor(student.CodechefcontestRating || 0)}
                        </span>
                        <div className="flex items-center justify-center gap-0.5">
                          {getStarIcons(student.CodechefcontestRating)}
                        </div>
                      </div>
                    </td>

                    {/* Total submissions */}
                    <td className="px-6 py-4 text-center font-bold text-slate-800 dark:text-slate-200">
                      {student.totalSubmissions ?? 0}
                    </td>
                  </tr>
                );
              })}

              {restStudents.length === 0 && (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-slate-400 italic">
                    No matching student records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile card layout */}
        <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800/80">
          {restStudents.map((student, idx) => {
            const absoluteRank = searchQuery
              ? sortedAll.findIndex((s) => s.id === student.id)
              : idx;

            return (
              <div key={student.id || idx} className="p-4 space-y-3">
                {/* Header: Rank, Name, Solved count */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{getRankBadge(absoluteRank)}</span>
                    <span className="font-semibold text-slate-950 dark:text-white text-base">{student.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold font-sans block">Solved</span>
                    <span className="font-bold text-slate-950 dark:text-white text-sm">{student.totalSolved ?? 0}</span>
                  </div>
                </div>

                {/* Handles badges */}
                <div className="flex flex-wrap gap-1">
                  {student.leetcodeHandle && student.leetcodeHandle !== "N/A" && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-md border border-amber-100 dark:border-amber-900/20 font-mono">
                      LC: {student.leetcodeHandle}
                    </span>
                  )}
                  {student.codeforcesHandle && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400 rounded-md border border-cyan-100 dark:border-cyan-900/20 font-mono">
                      CF: {student.codeforcesHandle}
                    </span>
                  )}
                  {student.codechefHandle && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 rounded-md border border-orange-100 dark:border-orange-900/20 font-mono">
                      CC: {student.codechefHandle}
                    </span>
                  )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 dark:border-slate-800/80 pt-3 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold font-sans">Difficulty Details</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span>E:{getDifficultyStyle(student.easy || 0, "easy")}</span>
                      <span>M:{getDifficultyStyle(student.medium || 0, "medium")}</span>
                      <span>H:{getDifficultyStyle(student.hard || 0, "hard")}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold font-sans block">Streak</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">{student.currentStreak || 0} 🔥</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold font-sans block">Contest Ratings</span>
                    <div className="space-y-0.5 mt-0.5 text-[10px]">
                      <span className="text-amber-500 font-semibold block">LC: {Math.floor(student.LeetcodecontestRating || 0)}</span>
                      <span className="text-cyan-500 font-semibold block">CF: {getCodeforcesColor(student.CodeforcescontestRating || 0)}</span>
                      <span className="text-orange-500 font-semibold block">CC: {Math.floor(student.CodechefcontestRating || 0)}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold font-sans block">Attempted</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{student.totalSubmissions ?? 0}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {restStudents.length === 0 && (
            <div className="p-8 text-center text-slate-400 italic text-sm">
              No matching student records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicLeaderboard;