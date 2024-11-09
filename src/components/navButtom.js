import React, { useState } from "react";
import { Home, Trophy, Users, Coins, BuildingIcon } from "lucide-react";
import FriendsInvite from "../pages/invite";
import EarnTasks from "../pages/task";
import Leaderboard from "../pages/leaderboard";
import HomePage from "./home";
import StakingPools from "../pages/staking";

const BottomNavigation = () => {
  const [activeTab, setActiveTab] = useState("home");

  const navItems = [
    {
      icon: Home,
      name: "home",
      label: "Home",
      content: <HomePage />,
    },
    {
      icon: Coins,
      name: "earn",
      label: "Earn",
      content: <EarnTasks />,
    },
    {
      icon: BuildingIcon,
      name: "stake",
      label: "Farming/Pool",
      content: <StakingPools />,
    },
    {
      icon: Trophy,
      name: "leaderboard",
      label: "Leaderboard",
      content: <Leaderboard />,
    },
    {
      icon: Users,
      name: "friends",
      label: "Friends",
      content: <FriendsInvite />,
    },
  ];

  const handleTabClick = (name) => {
    setActiveTab(name);
  };

  const ActiveContent = navItems.find(
    (item) => item.name === activeTab
  )?.content;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow">{ActiveContent}</div>
      <div className="fixed bottom-0 left-0 right-0 shadow-lg flex justify-around py-2">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleTabClick(item.name)}
            className={`
              flex flex-col items-center justify-center
              transition-all duration-300 ease-in-out
              p-2 rounded-full
              ${
                activeTab === item.name
                  ? "text-gray-600"
                  : "text-gray-500 hover:text-gray-400"
              }
            `}
          >
            <item.icon className="w-6 h-6" />
            {activeTab === item.name && (
              <span className="text-xs mt-1">{item.label}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
