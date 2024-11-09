import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  User,
  Medal,
  Crown,
  ChevronUp,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Clock,
} from "lucide-react";

const Leaderboard = () => {
  const [timeFrame, setTimeFrame] = useState("daily");
  const [showUserDetails, setShowUserDetails] = useState(false);

  const currentUser = {
    username: "Monchen",
    coins: 1250,
    rank: 7,
    previousRank: 9,
    avatar: "https://res.cloudinary.com/vendstore/image/upload/v1730395044/pfp_aqpkkj.webp",
    dailyGain: 250,
    streak: 5,
  };

  const leaderboardData = [
    {
      id: 1,
      username: "CryptoKing",
      coins: 5430,
      rank: 1,
      previousRank: 1,
      dailyGain: 830,
      streak: 12,
    },
    {
      id: 2,
      username: "BlockMaster",
      coins: 4850,
      rank: 2,
      previousRank: 3,
      dailyGain: 720,
      streak: 8,
    },
    {
      id: 3,
      username: "TokenQueen",
      coins: 4200,
      rank: 3,
      previousRank: 2,
      dailyGain: 650,
      streak: 15,
    },
    {
      id: 4,
      username: "CoinHunter",
      coins: 3800,
      rank: 4,
      previousRank: 5,
      dailyGain: 580,
      streak: 6,
    },
    {
      id: 5,
      username: "BitLord",
      coins: 3500,
      rank: 5,
      previousRank: 4,
      dailyGain: 450,
      streak: 9,
    },
    {
      id: 6,
      username: "ChainMaster",
      coins: 2800,
      rank: 6,
      previousRank: 7,
      dailyGain: 380,
      streak: 4,
    },
    {
      id: 7,
      username: "Monchen",
      coins: 1250,
      rank: 7,
      previousRank: 9,
      dailyGain: 250,
      streak: 5,
    },
    {
      id: 8,
      username: "CryptoNinja",
      coins: 1100,
      rank: 8,
      previousRank: 6,
      dailyGain: 200,
      streak: 3,
    },
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Trophy className="w-6 h-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankChange = (current, previous) => {
    const change = previous - current;
    if (change > 0) {
      return { icon: ChevronUp, color: "text-green-500", value: change };
    } else if (change < 0) {
      return {
        icon: ChevronDown,
        color: "text-red-500",
        value: Math.abs(change),
      };
    }
    return null;
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-6">
      {/* Sticky Header */}
      <motion.div
        className="sticky top-0 bg-white shadow-sm z-20 p-4"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Leaderboard</h1>
          <div className="flex gap-2">
            {["daily", "weekly", "all-time"].map((period) => (
              <motion.button
                key={period}
                onClick={() => setTimeFrame(period)}
                className={`
                  px-3 py-1 rounded-full text-xs font-medium
                  ${
                    timeFrame === period
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Current User Card */}
      <motion.div
        className="mx-4 mb-6"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <motion.div
          className="bg-white rounded-xl p-4 shadow-sm"
          whileHover={{ scale: 1.02 }}
          onClick={() => setShowUserDetails(!showUserDetails)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <motion.img
                  src={currentUser.avatar}
                  alt="User avatar"
                  className="w-16 h-16 rounded-full border-2 border-blue-500"
                  whileHover={{ scale: 1.1 }}
                />
                <motion.div
                  className="absolute -bottom-2 -right-2 bg-blue-500 text-white text-sm px-2 py-1 rounded-full flex items-center gap-1"
                  whileHover={{ scale: 1.1 }}
                >
                  #{currentUser.rank}
                  {getRankChange(currentUser.rank, currentUser.previousRank)
                    ?.icon && (
                    <motion.span
                      className={
                        getRankChange(
                          currentUser.rank,
                          currentUser.previousRank
                        )?.color
                      }
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {React.createElement(
                        getRankChange(
                          currentUser.rank,
                          currentUser.previousRank
                        ).icon,
                        { size: 14 }
                      )}
                    </motion.span>
                  )}
                </motion.div>
              </div>
              <div>
                <h2 className="text-lg font-bold">{currentUser.username}</h2>
                <div className="flex items-center text-sm text-gray-600">
                  <Sparkles className="w-4 h-4 mr-1" />
                  <span>{currentUser.streak} Day Streak</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {currentUser.coins.toLocaleString()}
              </div>
              <div className="flex items-center justify-end text-sm text-green-500">
                <TrendingUp className="w-4 h-4 mr-1" />+{currentUser.dailyGain}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showUserDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t border-gray-100"
              >
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-gray-600 text-sm">Daily Gain</div>
                    <div className="font-bold text-green-500">
                      +{currentUser.dailyGain}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 text-sm">Streak</div>
                    <div className="font-bold">{currentUser.streak} Days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 text-sm">Rank Change</div>
                    <div className="font-bold text-blue-500">
                      {getRankChange(currentUser.rank, currentUser.previousRank)
                        ?.value
                        ? `+${
                            getRankChange(
                              currentUser.rank,
                              currentUser.previousRank
                            ).value
                          }`
                        : "−"}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Leaderboard List */}
      <div className="px-4 space-y-2">
        <AnimatePresence>
          {leaderboardData.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className={`
                bg-white rounded-lg p-3
                ${
                  user.username === currentUser.username
                    ? "border-2 border-blue-500"
                    : "border border-gray-100"
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    {getRankIcon(user.rank) || (
                      <span className="font-bold text-gray-500">
                        #{user.rank}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    {user.username === currentUser.username ? (
                      <motion.img
                        src={currentUser.avatar}
                        alt="User avatar"
                        className="w-8 h-8 rounded-full mr-2"
                        whileHover={{ scale: 1.1 }}
                      />
                    ) : (
                      <User className="w-8 h-8 mr-2 text-gray-400" />
                    )}
                    <div>
                      <h3 className="font-medium">{user.username}</h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <Sparkles className="w-3 h-3 mr-1" />
                        <span>{user.streak} Day Streak</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold">{user.coins.toLocaleString()}</div>
                  <div className="flex items-center justify-end text-xs text-green-500">
                    <TrendingUp className="w-3 h-3 mr-1" />+{user.dailyGain}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.div
        className="mt-6 flex items-center justify-center text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Clock className="w-4 h-4 mr-1" />
        <span>Updates every hour</span>
      </motion.div>
    </div>
  );
};

export default Leaderboard;
