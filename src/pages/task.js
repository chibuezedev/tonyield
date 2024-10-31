import React, { useState } from "react";
import {
  Gamepad,
  HandshakeIcon,
  ShieldCheck,
  Target,
  Trophy,
} from "lucide-react";

const EarnTasks = () => {
  const [activeTab, setActiveTab] = useState("IN_GAME");
  const [taskStatuses, setTaskStatuses] = useState({});

  const taskTypes = [
    {
      name: "IN_GAME",
      icon: Gamepad,
      tasks: [
        {
          id: "complete_tutorial",
          title: "Complete Tutorial",
          icon: ShieldCheck,
          reward: 50,
          description: "Learn game basics and earn rewards",
        },
        {
          id: "reach_level_5",
          title: "Reach Level 5",
          icon: Target,
          reward: 100,
          description: "Progress through game levels",
        },
        {
          id: "win_3_matches",
          title: "Win 3 Matches",
          icon: Trophy,
          reward: 150,
          description: "Prove your skills in competitive play",
          },
          {
            id: "complete_tutorial",
            title: "Complete Tutorial",
            icon: ShieldCheck,
            reward: 50,
            description: "Learn game basics and earn rewards",
          },
          {
            id: "reach_level_5",
            title: "Reach Level 5",
            icon: Target,
            reward: 100,
            description: "Progress through game levels",
          },
          {
            id: "win_3_matches",
            title: "Win 3 Matches",
            icon: Trophy,
            reward: 150,
            description: "Prove your skills in competitive play",
          },
      ],
    },
    {
      name: "PARTNERS",
      icon: HandshakeIcon,
      tasks: [
        {
          id: "survey_complete",
          title: "Complete Survey",
          icon: ShieldCheck,
          reward: 75,
          description: "Share your feedback and earn coins",
        },
        {
          id: "download_app",
          title: "Download Partner App",
          icon: Target,
          reward: 125,
          description: "Try out a recommended app",
        },
      ],
    },
  ];

  const handleTaskAction = (taskId) => {
    setTaskStatuses((prev) => ({
      ...prev,
      [taskId]: prev[taskId] === "START" ? "CLAIM" : "START",
    }));
  };

  return (
    <div className="min-h-screen bg-white text-black p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Tasks</h1>
        <p className="text-lg">Get Rewards By Completing a Quest</p>
      </div>

      {/* Task Type Tabs */}
      <div className="flex justify-center mb-6">
        {taskTypes.map((type) => (
          <button
            key={type.name}
            onClick={() => setActiveTab(type.name)}
            className={`
              flex items-center px-6 py-3 mx-2 
              border-2 border-black 
              font-bold transition-colors
              ${
                activeTab === type.name
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }
            `}
          >
            <type.icon className="mr-2" size={20} />
            {type.name.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {taskTypes
          .find((type) => type.name === activeTab)
          ?.tasks.map((task) => (
            <div
              key={task.id}
              className="
                flex items-center justify-between 
                border-2 border-black 
                p-4 
                hover:bg-gray-50 
                transition-colors
              "
            >
              <div className="flex items-center space-x-4">
                <task.icon size={40} strokeWidth={1.5} />
                <div>
                  <h3 className="font-bold text-lg">{task.title}</h3>
                  <p className="text-sm text-gray-700">{task.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-bold text-lg">{task.reward} Coins</div>
                </div>
                <button
                  onClick={() => handleTaskAction(task.id)}
                  className={`
                    px-4 py-2 
                    border-2 border-black 
                    font-bold 
                    transition-colors
                    ${
                      taskStatuses[task.id] === "CLAIM"
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-gray-100"
                    }
                  `}
                >
                  {taskStatuses[task.id] === "CLAIM" ? "CLAIM" : "START"}
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default EarnTasks;
