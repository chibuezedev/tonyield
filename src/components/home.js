import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Users, Gift, Trophy, Activity, Bell } from "lucide-react";
import GameCard from "./gameCard";
import ThemeProvider, { fadeInVariants } from "./themeProvider";
import Button from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useToast } from "./toastProvider";
import { verifyUser } from "../apis";

const Home = () => {
  const [rotation, setRotation] = useState(0);
  const [rewards, setRewards] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [minedReward, setMinedReward] = useState(0);
  const [lastShakeTime, setLastShakeTime] = useState(0);
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [user, setUser] = useState();

  const shakeThreshold = 15;
  const { addToast } = useToast();
  const initData = window.Telegram.WebApp.initData;

  const stats = [
    { icon: Trophy, label: "Level", value: level },
    { icon: Activity, label: "Experience", value: `${experience}/100` },
    { icon: Gift, label: "Rewards", value: rewards },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const telegramUser = await verifyUser(initData);
        console.log(telegramUser)
        setUser(telegramUser);
      } catch (error) {
        addToast('User verification failed', { appearance: 'error' });
        console.error('Error verifying user:', error);
      }
    };
  
    fetchUser();
  }, [initData, addToast]);

  useEffect(() => {
    // Auto-mining reward timer
    let miningTimer;
    const startMiningTimer = () => {
      miningTimer = setTimeout(() => {
        const newReward = Math.floor(Math.random() * 1000) + 500;
        setMinedReward(newReward);
        setShowModal(true);
        addToast({
          title: "New Reward Available! 🎉",
          description: `${newReward} tokens are ready to be claimed!`,
          duration: 5000,
        });
      }, 1800000); // 180000 == 3 minutes
    };

    startMiningTimer();
    return () => clearTimeout(miningTimer);
  }, [addToast, showModal]); // Restart timer when modal is closed

  useEffect(() => {
    if (experience >= 1000) {
      setLevel((prev) => prev + 1);
      setExperience(0);
      addToast({
        title: "Level Up! 🎮",
        description: `Congratulations! You've reached level ${level + 1}!`,
        duration: 5000,
      });
    }
  }, [addToast, experience, level]);

  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let lastZ = 0;
    let shakeTimeout;

    const handleShake = (event) => {
      const { accelerationIncludingGravity } = event;
      if (!accelerationIncludingGravity) return;

      const { x, y, z } = accelerationIncludingGravity;
      const movement = Math.abs(x + y + z - lastX - lastY - lastZ);

      if (movement > shakeThreshold) {
        const currentTime = new Date().getTime();
        if (currentTime - lastShakeTime > 100) {
          // Throttle updates
          setIsShaking(true);
          setRotation((prev) => prev + 45);
          setRewards((prev) => prev + Math.floor(Math.random() * 10) + 1);
          setExperience((prev) => Math.min(prev + 5, 100));
          setLastShakeTime(currentTime);

          // Reset shaking state after a delay
          clearTimeout(shakeTimeout);
          shakeTimeout = setTimeout(() => setIsShaking(false), 500);
        }
      }

      lastX = x;
      lastY = y;
      lastZ = z;
    };

    if (window.DeviceMotionEvent) {
      window.addEventListener("devicemotion", handleShake);
    }

    return () => {
      if (window.DeviceMotionEvent) {
        window.removeEventListener("devicemotion", handleShake);
      }
      clearTimeout(shakeTimeout);
    };
  }, [lastShakeTime]);

  const handleManualShake = () => {
    const currentTime = new Date().getTime();
    if (currentTime - lastShakeTime > 100) {
      // Apply same throttle as device shake
      setIsShaking(true);
      setRotation((prev) => prev + 45);
      setRewards((prev) => prev + Math.floor(Math.random() * 10) + 1);
      setExperience((prev) => Math.min(prev + 10, 100));
      setLastShakeTime(currentTime);

      // Reset shaking state
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleConnectWallet = () => {
    console.log("Connecting wallet...");
  };

  const handleJoinCommunity = () => {
    console.log("Joining community...");
  };

  const handleCheckRewards = () => {
    console.log("Checking rewards...");
  };

  return (
    <ThemeProvider>
      <motion.div
        className="min-h-screen p-6 flex flex-col items-center"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      >
        {/* Header with Shake Indicator */}
        <motion.div
          className="w-full max-w-md mb-8 relative"
          variants={fadeInVariants}
        >
          <Button
            variant="ghost"
            size="lg"
            onClick={handleConnectWallet}
            className="w-full flex items-center justify-center gap-2 border border-white/20"
          >
            <Wallet className="w-5 h-5" />
            Connect Wallet
          </Button>
          {isShaking && (
            <motion.div
              className="absolute -right-2 -top-2 bg-yellow-400 rounded-full p-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Bell className="w-4 h-4 text-black animate-shake" />
            </motion.div>
          )}
        </motion.div>

        {/* Game Stats */}
        <motion.div
          className="w-full max-w-md grid grid-cols-3 gap-4 mb-8"
          variants={fadeInVariants}
        >
          {stats.map(({ icon: Icon, label, value }) => (
            <motion.div
              key={label}
              className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center ${
                isShaking ? "animate-shake" : ""
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <p className="text-sm text-gray-400">{label}</p>
              <p className="text-xl font-bold">{value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Game Card */}
        <GameCard
          rotation={rotation}
          handleManualShake={handleManualShake}
          level={level}
          experience={experience}
          isShaking={isShaking}
        />

        {/* Action Buttons */}
        <motion.div
          className="w-full max-w-md space-y-4 mt-8"
          variants={fadeInVariants}
        >
          <Button
            variant="ghost"
            size="lg"
            onClick={handleJoinCommunity}
            className="w-full flex items-center justify-center gap-2 bg-white/10"
          >
            <Users className="w-5 h-5" />
            Join Community
          </Button>

          {/* Check Rewards Button */}
          <Button
            variant="secondary"
            size="lg"
            onClick={handleCheckRewards}
            className="w-full flex items-center justify-center gap-2"
          >
            <Gift className="w-5 h-5" />
            Check Rewards
          </Button>
        </motion.div>

        {/* Reward Modal */}
        <AnimatePresence>
          {showModal && (
            <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogContent className="sm:max-w-md bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    New Reward Mined! 🎉
                  </DialogTitle>
                </DialogHeader>
                <motion.div
                  className="flex flex-col items-center p-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <motion.div
                    className="text-4xl font-bold mb-4 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    {minedReward}
                  </motion.div>
                  <p className="text-gray-400 mb-6">Tokens awaiting claim</p>
                  <Button
                    onClick={() => {
                      setRewards((prev) => prev + minedReward);
                      setShowModal(false);
                      addToast({
                        title: "Rewards Claimed! 💎",
                        description: `${minedReward} tokens have been added to your balance!`,
                        duration: 3000,
                      });
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    Claim Reward
                  </Button>
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </motion.div>
    </ThemeProvider>
  );
};

export default Home;
