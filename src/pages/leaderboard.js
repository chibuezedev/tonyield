import React from "react";
import { Trophy, User, Medal, Crown } from "lucide-react";

const Leaderboard = () => {
  const currentUser = {
    username: "Monchen",
    coins: 1250,
    rank: 7,
    avatar:
      "https://res.cloudinary.com/vendstore/image/upload/v1730395044/pfp_aqpkkj.webp",
  };

  const leaderboardData = [
    { id: 1, username: "CryptoKing", coins: 5430, rank: 1 },
    { id: 2, username: "BlockMaster", coins: 4850, rank: 2 },
    { id: 3, username: "TokenQueen", coins: 4200, rank: 3 },
    { id: 4, username: "CoinHunter", coins: 3800, rank: 4 },
    { id: 5, username: "BitLord", coins: 3500, rank: 5 },
    { id: 6, username: "ChainMaster", coins: 2800, rank: 6 },
    { id: 7, username: "JohnDoe", coins: 1250, rank: 7 },
    { id: 8, username: "CryptoNinja", coins: 1100, rank: 8 },
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-black" />;
      case 2:
        return <Medal className="w-6 h-6 text-black" />;
      case 3:
        return <Trophy className="w-6 h-6 text-black" />;
      case 4:
        return <Trophy className="w-6 h-6 text-black" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
        <p className="text-lg">Compete With Other Players</p>
      </div>
      <div className="mb-8">
        <div className="border-2 border-black p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt="User avatar"
                  className="w-16 h-16 rounded-full border-2 border-black"
                />
                <span className="absolute -bottom-2 -right-2 bg-black text-white text-sm px-2 py-1 rounded-full">
                  #{currentUser.rank}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{currentUser.username}</h2>
                <p className="text-gray-600">Your Current Ranking</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{currentUser.coins}</div>
              <div className="text-gray-600">Total Coins</div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {leaderboardData.map((user) => (
          <div
            key={user.id}
            className={`
              flex items-center justify-between 
              border-2 ${
                user.username === currentUser.username
                  ? "border-black bg-gray-50"
                  : "border-black"
              } 
              p-4 transition-colors
              ${
                user.username === currentUser.username ? "" : "hover:bg-gray-50"
              }
            `}
          >
            <div className="flex items-center space-x-4">
              <div className="w-8 text-center font-bold text-lg">
                #{user.rank}
              </div>
              <div className="w-8">{getRankIcon(user.rank)}</div>
              <div className="flex items-center">
                <User className="w-8 h-8 mr-3" />
                <div>
                  <h3 className="font-bold text-lg">{user.username}</h3>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="font-bold text-lg">
                  {user.coins.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Coins</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center text-gray-600">
        <p>Rankings update every hour</p>
      </div>
    </div>
  );
};

export default Leaderboard;
