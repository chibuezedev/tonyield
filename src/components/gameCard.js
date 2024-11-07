import React from "react";
import { motion } from "framer-motion";
import { Star, Sparkles } from "lucide-react";

const GameCard = ({
  rotation,
  handleManualShake,
  level = 1,
  experience = 0,
}) => {
  const ringVariants = {
    idle: {
      rotate: 0,
      scale: 1,
    },
    spin: {
      rotate: rotation,
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  const particleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="relative w-80 h-80 mx-auto"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Level indicator */}
      <motion.div
        className="absolute -top-4 -right-4 bg-yellow-400 rounded-full p-2 z-20"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring" }}
      >
        <Star className="w-6 h-6 text-white" />
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold">
          {level}
        </span>
      </motion.div>

      {/* Main card */}
      <motion.div
        className="w-full h-full rounded-2xl bg-gradient-to-br from-purple-600 to-blue-700 p-1"
        variants={ringVariants}
        animate={rotation > 0 ? "spin" : "idle"}
        onClick={handleManualShake}
      >
        <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center overflow-hidden">
          {/* Animated particles */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              variants={particleVariants}
              initial="hidden"
              animate="visible"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            >
              <Sparkles className="w-4 h-4 text-yellow-400 opacity-75" />
            </motion.div>
          ))}

          {/* Experience ring */}
          <svg className="absolute w-full h-full">
            <motion.circle
              cx="50%"
              cy="50%"
              r="48%"
              stroke="url(#gradient)"
              strokeWidth="4"
              fill="none"
              strokeDasharray="0 1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: experience / 100 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center content */}
          <motion.div
            className="relative z-10 w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span className="text-6xl">🎮</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Experience indicator */}
      <motion.div
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white/10 rounded-full px-4 py-1 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-sm font-medium">EXP: {experience}/100</span>
      </motion.div>
    </motion.div>
  );
};

export default GameCard;
