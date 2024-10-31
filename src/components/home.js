import React, { useState, useEffect } from "react";
import { Wallet, Users, Gift } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import GameCard from "./gameCard";
import { Button } from "../ui/homeButton";

const Home = () => {
  const [rotation, setRotation] = useState(0);
  const [rewards, setRewards] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [minedReward, setMinedReward] = useState(0);
  const [lastShakeTime, setLastShakeTime] = useState(0);
  const shakeThreshold = 15;

  useEffect(() => {
    let timer;
    // Show reward modal after 3 minutes
    timer = setTimeout(() => {
      setMinedReward(Math.floor(Math.random() * 1000) + 500);
      setShowModal(true);
    }, 180000); // 3 minutes

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let lastZ = 0;

    const handleShake = (event) => {
      const { accelerationIncludingGravity } = event;
      if (!accelerationIncludingGravity) return;

      const { x, y, z } = accelerationIncludingGravity;
      const movement = Math.abs(x + y + z - lastX - lastY - lastZ);

      if (movement > shakeThreshold) {
        const currentTime = new Date().getTime();
        if (currentTime - lastShakeTime > 100) {
          // Throttle updates
          setRotation((prev) => prev + 45);
          setRewards((prev) => prev + Math.floor(Math.random() * 10) + 1);
          setLastShakeTime(currentTime);
        }
      }

      lastX = x;
      lastY = y;
      lastZ = z;
    };

    // Add device motion listener
    if (window.DeviceMotionEvent) {
      window.addEventListener("devicemotion", handleShake);
    }

    return () => {
      if (window.DeviceMotionEvent) {
        window.removeEventListener("devicemotion", handleShake);
      }
    };
  }, [lastShakeTime]);

  const handleManualShake = () => {
    // For desktop testing
    setRotation((prev) => prev + 45);
    setRewards((prev) => prev + Math.floor(Math.random() * 10) + 1);
  };

  const handleClaimReward = () => {
    setRewards((prev) => prev + minedReward);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col items-center">
      <Button className="w-full max-w-md mb-8 h-12 bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2">
        <Wallet className="w-5 h-5" />
        Connect Wallet
      </Button>

      {/* Game Card */}
      <GameCard rotation={rotation} handleManualShake={handleManualShake} />

      {/* Rewards Counter */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">{rewards}</h2>
        <p className="text-gray-600">Total Rewards</p>
        <p className="text-sm text-gray-500 mt-2">Shake device to earn more!</p>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-md space-y-4">
        <Button className="w-full h-12 bg-black-600 hover:bg-black-700 text-white flex items-center justify-center gap-2">
          <Users className="w-5 h-5" />
          Join Community
        </Button>
        <Button className="w-full h-12 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2">
          <Gift className="w-5 h-5" />
          Check Rewards
        </Button>
      </div>

      {/* Reward Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Reward Mined! 🎉</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center p-6">
            <div className="text-4xl font-bold mb-4">{minedReward}</div>
            <p className="text-gray-600 mb-6">Tokens awaiting claim</p>
            <Button
              onClick={handleClaimReward}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Claim Reward
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
