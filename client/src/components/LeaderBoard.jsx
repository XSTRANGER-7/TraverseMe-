
import { useState, useEffect } from "react";
import { FaMedal } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import axios from "axios";

const Leaderboard = () => {
  const [topUsers, setTopUsers] = useState([]); // Top 10 users
  const [loggedInUserRank, setLoggedInUserRank] = useState(null); // Logged-in user details
  const [loggedInUserId, setLoggedInUserId] = useState(null); // logged-in user's id
  const [userInRanked, setUserInRanked] = useState(false); // Check if user is in top 10
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/auth");
      return;
    }

    const decodedUser = jwtDecode(token);
    const userId = decodedUser.id || decodedUser._id;
    setLoggedInUserId(userId);

    const fetchLeaderboardData = async () => {
      try {
        const leaderboardResponse = await axios.get("http://localhost:7000/leaderboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const verifiedUsers = leaderboardResponse.data.filter((user) => user.verified === true);

        const badgeToLevel = (badge = "Level 0") => parseInt(String(badge).replace(/[^0-9]/g, ""), 10) || 0;

        const sortedUsers = verifiedUsers.sort((a, b) => badgeToLevel(b.badge) - badgeToLevel(a.badge));

        setTopUsers(sortedUsers.slice(0, 10));

        const userInTop10 = sortedUsers.slice(0, 10).some((user) => user.id === userId || user._id === userId);
        setUserInRanked(userInTop10);

        if (!userInTop10) {
          const userResponse = await axios.get(`http://localhost:7000/profile/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setLoggedInUserRank({
            rank: userResponse.data.user.rank,
            user: userResponse.data.user,
          });
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchLeaderboardData();
  }, [navigate]);

  // Small UI helpers
  const rankAccent = (i) => (i === 0 ? "text-red-400" : i === 1 ? "text-red-300" : i === 2 ? "text-yellow-400" : "text-gray-400");

  return (
    <div className="min-h-screen bg-black/90 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h2 className="text-4xl font-extrabold text-white">Leaderboard</h2>
          <div className="mt-2 h-1 w-32 rounded-full bg-gradient-to-r from-red-400 to-red-600" />
          <p className="mt-3 text-sm text-gray-400">Top travelers — sorted by badge level and achievements.</p>
        </header>

        {/* Top 3 featured */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {topUsers.slice(0, 3).map((user, idx) => {
            const isActiveTop = loggedInUserId && (user.id === loggedInUserId || user._id === loggedInUserId);
            return (
              <div
                key={user.id || user._id}
                className={`relative rounded-2xl p-6 bg-gradient-to-b from-gray-900 to-black border ${isActiveTop ? 'border-red-400 shadow-[0_10px_30px_rgba(255,69,58,0.14)]' : 'border-gray-800'} shadow-xl flex flex-col items-center gap-4 transform transition hover:-translate-y-1`}
              >
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-20 h-20 rounded-full ring-4 ${idx === 0 ? "ring-red-400" : idx === 1 ? "ring-red-400" : "ring-red-400"} overflow-hidden`}> 
                  <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className={`text-3xl font-bold text-white ${rankAccent(idx)}`}>{idx + 1}</span>
                  <FaMedal className={`text-2xl ${rankAccent(idx)}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mt-2">{user.name}</h3>
                <p className="text-sm text-gray-400">{user.badge}</p>
              </div>
            </div>
            );
          })}
        </div>

        {/* Remaining list (4-10) */}
        <div className="space-y-3">
          {topUsers.slice(3).map((user, idx) => {
            const displayIndex = idx + 4;
            const isActive = (loggedInUserId && (user.id === loggedInUserId || user._id === loggedInUserId)) || (loggedInUserRank?.user && (loggedInUserRank.user.id === user.id || loggedInUserRank.user._id === user.id || loggedInUserRank.user._id === user._id));
            return (
              <div
                key={user.id || user._id}
                className={`flex items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-900 to-black border ${isActive ? "border-red-400 shadow-[0_6px_18px_rgba(255,69,58,0.12)]" : "border-gray-800 hover:border-gray-700"}`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-xl font-bold text-gray-300 w-8 text-center">{displayIndex}</div>
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-red-300">
                    <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">{user.name}</div>
                    <div className="text-sm text-gray-400">{user.badge}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 min-w-[160px] justify-end">
                  <div className="text-sm text-gray-400">{user.points ?? "—"} pts</div>
                  <div className="w-32 bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div className="h-2 bg-red-400" style={{ width: `${Math.min(100, (user.progress ?? 0))}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Logged-in user's rank if not in top 10 */}
        {!userInRanked && loggedInUserRank && (
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-gray-900 to-black border border-red-400 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Your Rank</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-red-400">{loggedInUserRank.rank}</div>
                <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-800">
                  <img src={loggedInUserRank.user.photo} alt={loggedInUserRank.user.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-white font-semibold">{loggedInUserRank.user.name}</div>
                  <div className="text-sm text-gray-400">{loggedInUserRank.user.badge}</div>
                </div>
              </div>
              <div className="text-sm text-gray-400">Keep pushing — move up the ranks!</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
