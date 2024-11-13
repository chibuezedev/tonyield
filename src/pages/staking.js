/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CoinsIcon,
  Clock,
  ArrowUpRight,
  Shield,
  Check,
  Users,
  Bell,
  Settings,
  Wallet,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import Button from "../ui/button";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const SuccessAnimation = () => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0, opacity: 0 }}
    className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
  >
    <div className="bg-white rounded-2xl p-6 flex flex-col items-center space-y-4">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360, 360],
        }}
        transition={{ duration: 0.5 }}
        className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center"
      >
        <Check className="w-8 h-8 text-white" />
      </motion.div>
      <h3 className="text-xl font-bold">Success!</h3>
      <p className="text-gray-500 text-center">Your TON has been staked</p>
    </div>
  </motion.div>
);

const StatCard = ({ label, value, icon: Icon, trend, className = "" }) => (
  <motion.div
    variants={fadeInUp}
    className={`bg-white/10 rounded-xl p-4 ${className}`}
  >
    <div className="flex items-center space-x-2 text-sm opacity-60">
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </div>
    <div className="text-xl font-bold mt-2">{value}</div>
    {trend && (
      <div
        className={`text-sm ${
          trend.includes("+") ? "text-green-500" : "text-red-500"
        }`}
      >
        {trend}
      </div>
    )}
  </motion.div>
);

const WalletConnection = () => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const [showErrorToast, setShowErrorToast] = useState(false);

  // Clear error toast after 5 seconds
  useEffect(() => {
    if (showErrorToast) {
      const timer = setTimeout(() => {
        setShowErrorToast(false);
        setConnectionError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showErrorToast]);

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionError("");

    try {
      await tonConnectUI.connectWallet();
    } catch (error) {
      let errorMessage = "Failed to connect wallet";

      // Handle specific error cases
      if (error.message?.includes("User rejected")) {
        errorMessage = "Connection rejected by user";
      } else if (error.message?.includes("Wallet not found")) {
        errorMessage = "No compatible wallet found";
      } else if (error.message?.includes("timeout")) {
        errorMessage = "Connection timed out";
      }

      setConnectionError(errorMessage);
      setShowErrorToast(true);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await tonConnectUI.disconnect();
    } catch (error) {
      console.log("Disconnect error:", error);
      setConnectionError("Failed to disconnect wallet");
      setShowErrorToast(true);
    }
  };

  // Connection status check
  const isConnected = !!wallet;

  return (
    <div className="relative">
      {!isConnected ? (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
          style={{
            backgroundColor: "var(--tg-theme-button-color)",
            color: "var(--tg-theme-button-text-color)",
            opacity: isConnecting ? 0.7 : 1,
          }}
        >
          <Wallet className="w-5 h-5" />
          <span>
            {isConnecting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
                <span>Connecting...</span>
              </div>
            ) : (
              "Connect Wallet"
            )}
          </span>
        </motion.button>
      ) : (
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/10">
          <div className="flex items-center space-x-2">
            <Wallet className="w-5 h-5" />
            <span className="text-sm truncate">
              {wallet.account.address.slice(0, 6)}...
              {wallet.account.address.slice(-4)}
            </span>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleDisconnect}
            className="text-sm opacity-70 hover:opacity-100 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition duration-200 ease-in-out shadow-md"
          >
            Disconnect
          </motion.button>
        </div>
      )}

      {/* Error Toast */}
      <AnimatePresence>
        {showErrorToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-full left-0 right-0 mb-4 p-3 bg-red-500 text-white rounded-lg shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span>{connectionError}</span>
              <button
                onClick={() => setShowErrorToast(false)}
                className="ml-2 hover:opacity-80"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StakingPool = () => {
  const wallet = useTonWallet();
  const isConnected = !!wallet;

  // State management
  const [tg] = useState(() => {
    const webApp = window.Telegram?.WebApp || {
      backgroundColor: "#ffffff",
      textColor: "#000000",
      buttonColor: "#3390ec",
      buttonTextColor: "#ffffff",
    };

    document.documentElement.style.setProperty(
      "--tg-theme-bg-color",
      webApp.backgroundColor
    );
    document.documentElement.style.setProperty(
      "--tg-theme-text-color",
      webApp.textColor
    );
    document.documentElement.style.setProperty(
      "--tg-theme-button-color",
      webApp.buttonColor
    );
    document.documentElement.style.setProperty(
      "--tg-theme-button-text-color",
      webApp.buttonTextColor
    );

    return webApp;
  });

  const [stakeAmount, setStakeAmount] = useState("");
  const [stakingDays, setStakingDays] = useState(7);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [poolInfo, setPoolInfo] = useState({
    totalStaked: 2450000,
    apr: 12.5,
    minStake: 50,
    yourStake: 0,
    walletBalance: 0,
    estimatedRewards: 0,
    activeStakers: 1250,
  });

  // Fetch wallet balance when connected
  useEffect(() => {
    const fetchBalance = async () => {
      if (isConnected && wallet?.account.address) {
        try {
          const response = await fetch(
            `https://api.ton.sh/v1/account/${wallet.account.address}/balance`
          );
          const data = await response.json();
          setPoolInfo((prev) => ({
            ...prev,
            walletBalance: parseFloat(data.balance) / 1e9,
          }));
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };

    fetchBalance();
  }, [isConnected, wallet]);

  // Calculate APR based on staking days
  const calculateAPR = (days) => {
    const baseAPR = 12.5;
    const modifier = days / 30;
    return baseAPR * (1 + modifier * 0.1);
  };

  // Calculate estimated rewards
  const calculateEstimatedRewards = (amount, days) => {
    const apr = calculateAPR(days);
    return (amount * apr * days) / (365 * 100);
  };

  // Check if staking is possible
  const canStake = () => {
    if (!stakeAmount || !isConnected) return false;
    const amount = parseFloat(stakeAmount);
    return (
      amount >= poolInfo.minStake &&
      amount <= poolInfo.walletBalance &&
      !isLoading
    );
  };

  // Staking Form Component
  const StakingForm = () => {
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!isConnected) {
        if (tg.showAlert) {
          tg.showAlert("Please connect your wallet first.");
        }
        return;
      }

      setIsLoading(true);

      try {
        // Create transaction
        const stakingAmount = parseFloat(stakeAmount) * 1e9; //to nanoTON

        const transaction = {
          validUntil: Math.floor(Date.now() / 1000) + 600,
          messages: [
            {
              address: "my_Staking_Contract_Address",
              amount: stakingAmount.toString(),
              payload:
                "te6ccgEBAQEAKgAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP_",
            },
          ],
        };

        // Handle success
        setShowSuccessAnimation(true);
        setPoolInfo((prev) => ({
          ...prev,
          yourStake: prev.yourStake + parseFloat(stakeAmount),
          totalStaked: prev.totalStaked + parseFloat(stakeAmount),
          walletBalance: prev.walletBalance - parseFloat(stakeAmount),
        }));

        setStakeAmount("");
        setTimeout(() => setShowSuccessAnimation(false), 2000);
      } catch (error) {
        console.error("Staking error:", error);
        setError("Transaction failed. Please try again.");
        if (tg.showAlert) {
          tg.showAlert("Transaction failed. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const handleAmountChange = (e) => {
      const value = e.target.value;
      if (/^\d*\.?\d*$/.test(value)) {
        setStakeAmount(value);
        if (value) {
          const estimatedRewards = calculateEstimatedRewards(
            parseFloat(value),
            stakingDays
          );
          setPoolInfo((prev) => ({ ...prev, estimatedRewards }));
        }
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Amount Input */}
          <div>
            <label className="text-sm opacity-60 mb-1 block">
              Amount to Stake
            </label>
            <div className="relative">
              <input
                type="text"
                value={stakeAmount}
                onChange={handleAmountChange}
                placeholder="Enter TON amount"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border focus:outline-none focus:ring-2"
              />
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setStakeAmount(poolInfo.walletBalance.toString())
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-md text-sm bg-blue-500"
                disabled={!isConnected}
              >
                MAX
              </motion.button>
            </div>
            <div className="text-sm mt-1 opacity-60">
              Balance: {poolInfo.walletBalance.toFixed(2)} TON
            </div>
          </div>

          {/* Duration Selector */}
          <div>
            <label className="text-sm opacity-60 mb-1 block">
              Staking Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[7, 30, 90].map((days) => (
                <motion.button
                  key={days}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setStakingDays(days);
                    if (stakeAmount) {
                      const estimatedRewards = calculateEstimatedRewards(
                        parseFloat(stakeAmount),
                        days
                      );
                      setPoolInfo((prev) => ({ ...prev, estimatedRewards }));
                    }
                  }}
                  className={`py-2 rounded-lg ${
                    stakingDays === days ? "ring-2" : ""
                  }`}
                  style={{
                    backgroundColor:
                      stakingDays === days
                        ? "var(--tg-theme-button-color)"
                        : "var(--tg-theme-bg-color)",
                    color:
                      stakingDays === days
                        ? "var(--tg-theme-button-text-color)"
                        : "var(--tg-theme-text-color)",
                  }}
                >
                  {days} days
                </motion.button>
              ))}
            </div>
          </div>

          {/* Stats Display */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <StatCard
              label="Lock Period"
              value={`${stakingDays} days`}
              icon={Clock}
            />
            <StatCard
              label="Est. Rewards"
              value={`${poolInfo.estimatedRewards.toFixed(2)} TON`}
              icon={CoinsIcon}
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!canStake()}
          className="w-full py-4 rounded-xl font-medium relative overflow-hidden"
          style={{
            backgroundColor: "var(--tg-theme-button-color)",
            color: "var(--tg-theme-button-text-color)",
            opacity: canStake() ? 1 : 0.5,
          }}
        >
          <AnimatePresence>
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" />
              </motion.div>
            ) : (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center space-x-2"
              >
                <span>Stake TON</span>
                <ArrowUpRight className="w-5 h-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </form>
    );
  };

  return (
    <div className="min-h-screen pb-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-lg mx-auto p-4 space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">TON Staking</h1>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-full hover:bg-white/10"
          >
            <Settings className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Pool Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            label="Total Value Locked"
            value={`${poolInfo.totalStaked.toLocaleString()} TON`}
            icon={CoinsIcon}
            trend="+5.2%"
          />
          <StatCard
            label="Active Stakers"
            value={poolInfo.activeStakers.toLocaleString()}
            icon={Users}
            trend="+12.3%"
          />
        </div>

        {/* Staking Form */}
        <WalletConnection />

        {/* Only show staking form if wallet is connected */}
        {wallet && <StakingForm />}

        {/* Success Animation */}
        <AnimatePresence>
          {showSuccessAnimation && <SuccessAnimation />}
        </AnimatePresence>

        {/* Settings Dialog */}
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {[
                { label: "Notification Preferences", icon: Bell },
                { label: "Security Settings", icon: Shield },
              ].map((setting, index) => (
                <motion.button
                  key={index}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center space-x-3 p-4 rounded-lg hover:bg-white/10"
                >
                  <setting.icon className="w-5 h-5" />
                  <span>{setting.label}</span>
                </motion.button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <span>{error}</span>
              <button
                onClick={() => setError("")}
                className="ml-2 hover:opacity-80"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StakingPool;
