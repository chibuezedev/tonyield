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
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [telegramUser, setTelegramUser] = useState(null);

  const shakeThreshold = 15;
  const { addToast } = useToast();

  const stats = [
    { icon: Trophy, label: "Level", value: level },
    { icon: Activity, label: "Experience", value: `${experience}/100` },
    { icon: Gift, label: "Rewards", value: rewards },
  ];


  useEffect(() => {
    const initTelegram = async () => {
      try {
        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-web-app.js"
        script.async = true;

        script.onload = async () => {
          window.Telegram.WebApp.ready();

          const initDataRaw = window.Telegram.WebApp.initData;
          if (!initDataRaw) {
            throw new Error("No init data available");
          }

          // Verify user
          try {
            const userData = await verifyUser(initDataRaw);
            setUser(userData);
            addToast({
              title: "Welcome! 👋",
              description: `Successfully authenticated as ${userData.username}`,
              duration: 3000,
            });
          } catch (verifyError) {
            console.error("Error verifying user:", verifyError);
            addToast({
              title: "Authentication Error",
              description: "Failed to verify user with backend",
              duration: 5000,
              variant: "destructive",
            });
          }
        };

        document.body.appendChild(script);
      } catch (error) {
        console.error("Telegram WebApp initialization error:", error);
        addToast({
          title: "Authentication Error",
          description: "Failed to initialize Telegram WebApp",
          duration: 5000,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initTelegram();

    // Cleanup
    return () => {
      const script = document.querySelector(
        'script[src="https://telegram.org/js/telegram-web-app.js"]'
      );
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [addToast]);


  useEffect(() => {
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
      }, 1800000);
    };

    if (user) {
      startMiningTimer();
    }
    return () => clearTimeout(miningTimer);
  }, [addToast, showModal, user]);

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
      if (!user) return; // Only handle shakes if user is authenticated

      const { accelerationIncludingGravity } = event;
      if (!accelerationIncludingGravity) return;

      const { x, y, z } = accelerationIncludingGravity;
      const movement = Math.abs(x + y + z - lastX - lastY - lastZ);

      if (movement > shakeThreshold) {
        const currentTime = new Date().getTime();
        if (currentTime - lastShakeTime > 100) {
          setIsShaking(true);
          setRotation((prev) => prev + 45);
          setRewards((prev) => prev + Math.floor(Math.random() * 10) + 1);
          setExperience((prev) => Math.min(prev + 5, 100));
          setLastShakeTime(currentTime);

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
  }, [lastShakeTime, user]);

  const handleManualShake = () => {
    if (!user) return; // Only allow shakes if authenticated

    const currentTime = new Date().getTime();
    if (currentTime - lastShakeTime > 100) {
      setIsShaking(true);
      setRotation((prev) => prev + 45);
      setRewards((prev) => prev + Math.floor(Math.random() * 10) + 1);
      setExperience((prev) => Math.min(prev + 10, 100));
      setLastShakeTime(currentTime);

      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleConnectWallet = async () => {
    if (!user) {
      addToast({
        title: "Authentication Required",
        description: "Please authenticate with Telegram first",
        duration: 3000,
        variant: "destructive",
      });
      return;
    }
    console.log("Connecting wallet...");
  };

  const handleJoinCommunity = () => {
    if (!user) return;
    console.log("Joining community...");
  };

  const handleCheckRewards = () => {
    if (!user) return;
    console.log("Checking rewards...");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <motion.div
        className="min-h-screen p-6 flex flex-col items-center"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      >
        {/* Header with Authentication Status */}
        <motion.div
          className="w-full max-w-md mb-8 relative"
          variants={fadeInVariants}
        >
          {user ? (
            <div className="mb-4 text-center">
              <p className="text-sm text-gray-400">Welcome back</p>
              <p className="text-lg font-bold">{user.username}</p>
            </div>
          ) : (
            <div className="mb-4 text-center">
              <p className="text-sm text-red-400">
                Please authenticate with Telegram
              </p>
            </div>
          )}

          <Button
            variant="ghost"
            size="lg"
            onClick={handleConnectWallet}
            className="w-full flex items-center justify-center gap-2 border border-white/20"
            disabled={!user}
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

        {/* Rest of the component remains the same */}
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

        <GameCard
          rotation={rotation}
          handleManualShake={handleManualShake}
          level={level}
          experience={experience}
          isShaking={isShaking}
          disabled={!user}
        />

        <motion.div
          className="w-full max-w-md space-y-4 mt-8"
          variants={fadeInVariants}
        >
          <Button
            variant="ghost"
            size="lg"
            onClick={handleJoinCommunity}
            className="w-full flex items-center justify-center gap-2 bg-white/10"
            disabled={!user}
          >
            <Users className="w-5 h-5" />
            Join Community
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={handleCheckRewards}
            className="w-full flex items-center justify-center gap-2"
            disabled={!user}
          >
            <Gift className="w-5 h-5" />
            Check Rewards
          </Button>
        </motion.div>

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
