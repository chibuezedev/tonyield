import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { useToast } from "./toastProvider";
import { claimRewards } from "../apis";

const GAME_MODES = {
  CLASSIC: "classic",
  TIME_ATTACK: "timeAttack",
  CHALLENGE: "challenge",
};

const MatrixGameCard = ({
  level = 1,
  experience = 0,
  handleManualShake,
  rotation = 0,
  isShaking = false,
}) => {
  const [gameMode, setGameMode] = useState(GAME_MODES.CLASSIC);
  const [dots, setDots] = useState([]);
  const [selectedDots, setSelectedDots] = useState([]);
  const [connections, setConnections] = useState([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [rewardAnimations, setRewardAnimations] = useState([]);
  const [gridSize, setGridSize] = useState(4);
  const [pendingRewards, setPendingRewards] = useState(0);
  const [isProcessingReward, setIsProcessingReward] = useState(false);

  const { addToast } = useToast();

  // Initialize dots with different patterns based on game mode
  const initializeDots = useCallback(() => {
    const newDots = [];
    const size = gameMode === GAME_MODES.CHALLENGE ? gridSize + 1 : gridSize;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let value;
        if (gameMode === GAME_MODES.CHALLENGE) {
          value = Math.floor(Math.random() * 4) + 1;
        } else if (gameMode === GAME_MODES.TIME_ATTACK) {
          value = Math.floor(Math.random() * 3) + 1;
        } else {
          value = Math.floor(Math.random() * 2) + 1;
        }

        newDots.push({
          id: `${y}-${x}`,
          x: x,
          y: y,
          value,
          active: true,
        });
      }
    }
    setDots(newDots);
  }, [gameMode, gridSize]);
  useEffect(() => {
    initializeDots();
  }, [initializeDots, level, gameMode]);

  // Time Attack mode timer
  useEffect(() => {
    let timer;
    if (gameMode === GAME_MODES.TIME_ATTACK && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameMode, timeLeft]);

  // Check for game completion
  useEffect(() => {
    const activeDots = dots.filter((dot) => dot.active);
    if (activeDots.length === 0) {
      handleManualShake();
      setTimeout(() => {
        initializeDots();
        setScore((prev) => prev + 100); // Bonus for completing board
        addRewardAnimation("", 200);
      }, 1000);
    }
  }, [dots, initializeDots, handleManualShake]);

  const addRewardAnimation = (text, points) => {
    const id = Math.random();
    const animation = {
      id,
      text,
      points,
      position: {
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
      },
    };
    setRewardAnimations((prev) => [...prev, animation]);
    setTimeout(() => {
      setRewardAnimations((prev) => prev.filter((a) => a.id !== id));
    }, 1000);
  };

  const handleDotClick = (dot) => {
    if (!dot.active) return;

    const newSelectedDots = [...selectedDots];

    if (selectedDots.includes(dot)) {
      setSelectedDots(newSelectedDots.filter((d) => d !== dot));
    } else {
      if (newSelectedDots.length < 2) {
        newSelectedDots.push(dot);
        setSelectedDots(newSelectedDots);

        if (newSelectedDots.length === 2) {
          const [dot1, dot2] = newSelectedDots;
          const xDiff = Math.abs(dot1.x - dot2.x);
          const yDiff = Math.abs(dot1.y - dot2.y);

          if (xDiff <= 1 && yDiff <= 1 && dot1.value === dot2.value) {
            // Calculate score based on game mode and combo
            const baseScore = dot1.value * 10;
            const comboMultiplier = Math.max(1, combo * 0.5);
            const modeMultiplier = gameMode === GAME_MODES.CHALLENGE ? 2 : 1;
            const finalScore = Math.floor(
              baseScore * comboMultiplier * modeMultiplier
            );

            setConnections([...connections, [dot1, dot2]]);
            setDots(
              dots.map((d) =>
                d === dot1 || d === dot2 ? { ...d, active: false } : d
              )
            );
            setScore(score + finalScore);
            setCombo((prev) => prev + 1);

            // Add reward animation
            addRewardAnimation(`+${finalScore}`, finalScore);

            handleManualShake();
          } else {
            setCombo(0);
          }
          setSelectedDots([]);
        }
      }
    }
  };

  const switchGameMode = (mode) => {
    setGameMode(mode);
    setTimeLeft(60);
    setScore(0);
    setCombo(0);
    initializeDots();
  };

  useEffect(() => {
    const activeDots = dots.filter((dot) => dot.active);
    if (activeDots.length === 0) {
      const gameCompletionBonus = calculateGameBonus();
      setPendingRewards((prev) => prev + gameCompletionBonus);
      handleGameReward(gameCompletionBonus);
    }
  }, [dots]);

  const calculateGameBonus = () => {
    const modeMultiplier = {
      [GAME_MODES.CLASSIC]: 1,
      [GAME_MODES.TIME_ATTACK]: timeLeft > 30 ? 2 : 1.5,
      [GAME_MODES.CHALLENGE]: 2.5,
    };

    return Math.floor(score * modeMultiplier[gameMode] * (combo > 5 ? 1.5 : 1));
  };

  const handleGameReward = async (reward) => {
    if (isProcessingReward) return;

    setIsProcessingReward(true);
    try {
      const initDataObj = {
        query_id: window.Telegram.WebApp.initDataUnsafe.query_id,
        user: window.Telegram.WebApp.initDataUnsafe.user,
        auth_date: window.Telegram.WebApp.initDataUnsafe.auth_date,
        hash: window.Telegram.WebApp.initDataUnsafe.hash,
      };

      await claimRewards(level, reward, initDataObj);
      setPendingRewards(0);
      addToast({
        title: "Game Rewards Claimed! 🎮",
        description: `${reward} tokens earned from your gameplay!`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Failed to process game reward:", error);
      // Keep the rewards pending for next attempt
      addToast({
        title: "Reward Processing Failed",
        description: "Your rewards are saved and will be claimed later",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsProcessingReward(false);
    }
  };

  return (
    <motion.div
      className="relative w-80 h-80 mx-auto"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Game mode selector */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex gap-2">
        {Object.values(GAME_MODES).map((mode) => (
          <motion.button
            key={mode}
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              gameMode === mode
                ? "bg-white text-black"
                : "bg-gray-800 text-white"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => switchGameMode(mode)}
          >
            {mode.replace(/([A-Z])/g, " $1").trim()}
          </motion.button>
        ))}
      </div>

      {/* Level indicator */}
      <motion.div
        className="absolute -top-4 -right-4 bg-white rounded-full p-2 z-20 shadow-lg"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring" }}
      >
        <Star className="w-6 h-6 text-black" />
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-black">
          {level}
        </span>
      </motion.div>

      {/* Main card */}
      <motion.div
        className="w-full h-full rounded-2xl bg-gradient-to-br from-white to-gray-200 p-1 shadow-xl"
        animate={{
          rotate: rotation,
          scale: isShaking ? 1.05 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
        <div className="relative w-full h-full rounded-xl bg-black flex items-center justify-center overflow-hidden">
          {/* Matrix background effect */}
          <div className="absolute inset-0 opacity-10">
            <div className="matrix-rain" />
          </div>

          {/* Experience ring */}
          <svg className="absolute w-full h-full">
            <motion.circle
              cx="50%"
              cy="50%"
              r="48%"
              stroke="white"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: experience / 100 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </svg>

          {/* Game grid */}
          <div
            className="relative z-10 grid gap-4 p-8"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
            }}
          >
            {dots.map((dot) => {
              const gridColumn = dot.x + 1;
              const gridRow = dot.y + 1;

              return (
                <motion.div
                  key={dot.id}
                  className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${
                    dot.active
                      ? selectedDots.includes(dot)
                        ? "bg-white text-black"
                        : "bg-gray-800 text-white"
                      : "bg-gray-900 text-gray-600"
                  }`}
                  style={{
                    gridColumn,
                    gridRow,
                  }}
                  whileHover={dot.active ? { scale: 1.2 } : {}}
                  onClick={() => handleDotClick(dot)}
                >
                  {dot.value}
                </motion.div>
              );
            })}

            {/* Connection lines */}
            <svg className="absolute inset-0 pointer-events-none">
              {connections.map(([dot1, dot2], index) => (
                <motion.line
                  key={index}
                  x1={`${(dot1.x * 100) / (gridSize - 1)}%`}
                  y1={`${(dot1.y * 100) / (gridSize - 1)}%`}
                  x2={`${(dot2.x * 100) / (gridSize - 1)}%`}
                  y2={`${(dot2.y * 100) / (gridSize - 1)}%`}
                  stroke="white"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                />
              ))}
            </svg>
          </div>

          {/* Reward animations */}
          <AnimatePresence>
            {rewardAnimations.map((animation) => (
              <motion.div
                key={animation.id}
                className="absolute text-white font-bold text-lg pointer-events-none"
                initial={{
                  scale: 0,
                  x: animation.position.x,
                  y: animation.position.y,
                  opacity: 0,
                }}
                animate={{
                  scale: 1.5,
                  y: animation.position.y - 50,
                  opacity: 1,
                }}
                exit={{
                  scale: 0,
                  opacity: 0,
                }}
                transition={{ duration: 0.5 }}
              >
                {animation.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Game info */}
      <motion.div
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-4 py-1 flex items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-sm font-medium text-black">Score: {score}</span>
        {gameMode === GAME_MODES.TIME_ATTACK && (
          <span className="text-sm font-medium text-black">
            | Time: {timeLeft}s
          </span>
        )}
        <span className="text-sm font-medium text-black">
          | Combo: x{combo}
        </span>
      </motion.div>
    </motion.div>
  );
};

export default MatrixGameCard;
