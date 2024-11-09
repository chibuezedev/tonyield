import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gamepad,
  HandshakeIcon,
  ShieldCheck,
  Target,
  Trophy,
  ChevronRight,
  Clock,
  Gift,
} from "lucide-react";

const TelegramTasks = () => {
  const [activeTab, setActiveTab] = useState("IN_GAME");
  const [taskStatuses, setTaskStatuses] = useState({});
  const [expandedTask, setExpandedTask] = useState(null);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [totalCoins, setTotalCoins] = useState(0);

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
          progress: 0,
          total: 1,
          timeLimit: "2 hours",
        },
        {
          id: "reach_level_5",
          title: "Reach Level 5",
          icon: Target,
          reward: 100,
          description: "Progress through game levels",
          progress: 0,
          total: 5,
          timeLimit: "24 hours",
        },
        {
          id: "win_3_matches",
          title: "Win 3 Matches",
          icon: Trophy,
          reward: 150,
          description: "Prove your skills in competitive play",
          progress: 0,
          total: 3,
          timeLimit: "12 hours",
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
          progress: 0,
          total: 1,
          timeLimit: "1 hour",
        },
        {
          id: "download_app",
          title: "Download Partner App",
          icon: Target,
          reward: 125,
          description: "Try out a recommended app",
          progress: 0,
          total: 1,
          timeLimit: "4 hours",
        },
      ],
    },
  ];

  const handleTaskAction = (taskId, task) => {
    if (taskStatuses[taskId] === "IN_PROGRESS") {
      // Simulate task completion
      setTaskStatuses((prev) => ({
        ...prev,
        [taskId]: "COMPLETED",
      }));
      setTotalCoins((prev) => prev + task.reward);
      setShowRewardAnimation(true);
      setTimeout(() => setShowRewardAnimation(false), 2000);
    } else if (!taskStatuses[taskId]) {
      setTaskStatuses((prev) => ({
        ...prev,
        [taskId]: "IN_PROGRESS",
      }));
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen relative overflow-hidden">
      {/* Header with coins */}
      <motion.div
        className="sticky top-0 bg-white shadow-sm z-10 p-4"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Daily Tasks</h1>
          <motion.div
            className="flex items-center bg-yellow-100 px-3 py-1 rounded-full"
            whileHover={{ scale: 1.05 }}
          >
            <Gift className="w-4 h-4 mr-2 text-yellow-600" />
            <span className="font-bold text-yellow-600">{totalCoins}</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Tab Selector */}
      <div className="flex p-2 gap-2">
        {taskTypes.map((type) => (
          <motion.button
            key={type.name}
            onClick={() => setActiveTab(type.name)}
            className={`
              flex-1 flex items-center justify-center p-3 rounded-xl
              ${
                activeTab === type.name
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <type.icon className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">
              {type.name.replace("_", " ")}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="p-4 space-y-3">
        <AnimatePresence mode="wait">
          {taskTypes
            .find((type) => type.name === activeTab)
            ?.tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`
                  bg-white rounded-xl p-4 shadow-sm
                  ${expandedTask === task.id ? "border-2 border-blue-500" : ""}
                `}
                onClick={() =>
                  setExpandedTask(expandedTask === task.id ? null : task.id)
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className={`
                        p-2 rounded-lg
                        ${
                          taskStatuses[task.id] === "COMPLETED"
                            ? "bg-green-100"
                            : "bg-blue-100"
                        }
                      `}
                    >
                      <task.icon
                        className={`w-6 h-6 ${
                          taskStatuses[task.id] === "COMPLETED"
                            ? "text-green-600"
                            : "text-blue-600"
                        }`}
                      />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold">{task.title}</h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {task.timeLimit}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.div
                      className="flex items-center bg-yellow-50 px-2 py-1 rounded-full"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Gift className="w-4 h-4 mr-1 text-yellow-600" />
                      <span className="text-sm font-semibold text-yellow-600">
                        {task.reward}
                      </span>
                    </motion.div>
                    <ChevronRight
                      className={`w-5 h-5 text-gray-400 transform transition-transform ${
                        expandedTask === task.id ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {expandedTask === task.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 space-y-3"
                    >
                      <p className="text-sm text-gray-600">
                        {task.description}
                      </p>

                      {/* Progress bar */}
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <motion.div
                          className="bg-blue-500 h-2 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{
                            width: `${(task.progress / task.total) * 100}%`,
                            backgroundColor:
                              taskStatuses[task.id] === "COMPLETED"
                                ? "#10B981"
                                : "#3B82F6",
                          }}
                        />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          w-full py-2 rounded-lg font-medium
                          ${
                            taskStatuses[task.id] === "COMPLETED"
                              ? "bg-green-500 text-white"
                              : taskStatuses[task.id] === "IN_PROGRESS"
                              ? "bg-blue-500 text-white"
                              : "bg-blue-100 text-blue-500"
                          }
                        `}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskAction(task.id, task);
                        }}
                      >
                        {taskStatuses[task.id] === "COMPLETED"
                          ? "Completed"
                          : taskStatuses[task.id] === "IN_PROGRESS"
                          ? "Claim Reward"
                          : "Start Task"}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {/* Reward Animation */}
      <AnimatePresence>
        {showRewardAnimation && (
          <motion.div
            initial={{ scale: 0, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: -100 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-yellow-500 text-white px-6 py-3 rounded-full flex items-center shadow-lg">
              <Gift className="w-6 h-6 mr-2" />
              <span className="font-bold">Reward Claimed!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TelegramTasks;
