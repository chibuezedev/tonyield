import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  // Wallet,
  CoinsIcon,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  // ChevronDown,
  // Info,
  // AlertCircle,
  Shield,
  Check,
  Users,
  TrendingUp,
  Bell,
  Settings,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  // DialogDescription,
} from "../ui/dialog";
import { useSpring, animated } from "react-spring";

// Initialize Telegram WebApp with fallback
const initTelegramWebApp = () => {
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    
    // Set theme variables
    document.documentElement.style.setProperty(
      "--tg-theme-bg-color",
      tg.backgroundColor || "#ffffff"
    );
    document.documentElement.style.setProperty(
      "--tg-theme-text-color",
      tg.textColor || "#000000"
    );
    document.documentElement.style.setProperty(
      "--tg-theme-button-color",
      tg.buttonColor || "#3390ec"
    );
    document.documentElement.style.setProperty(
      "--tg-theme-button-text-color",
      tg.buttonTextColor || "#ffffff"
    );
    
    return tg;
  }
  
  // Fallback object for development/testing
  return {
    ready: () => {},
    expand: () => {},
    sendData: async () => ({ success: true }),
    showAlert: (msg) => alert(msg),
    showConfirm: (msg) => window.confirm(msg),
    backgroundColor: "#ffffff",
    textColor: "#000000",
    buttonColor: "#3390ec",
    buttonTextColor: "#ffffff"
  };
};


// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const StakingPool = () => {
  const [tg] = useState(initTelegramWebApp());

  useEffect(() => {
    tg.ready();
    tg.expand();

    // Set Telegram theme variables
    document.documentElement.style.setProperty(
      "--tg-theme-bg-color",
      tg.backgroundColor
    );
    document.documentElement.style.setProperty(
      "--tg-theme-text-color",
      tg.textColor
    );
    document.documentElement.style.setProperty(
      "--tg-theme-button-color",
      tg.buttonColor
    );
    document.documentElement.style.setProperty(
      "--tg-theme-button-text-color",
      tg.buttonTextColor
    );
  }, []);

  // State management
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");
  const [stakingDays, setStakingDays] = useState(7);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Pool information with state
  const [poolInfo, setPoolInfo] = useState({
    totalStaked: 2450000,
    apr: 12.5,
    minStake: 50,
    yourStake: 0,
    walletBalance: 0,
    estimatedRewards: 0,
  });

  // Animation for numbers
  const animatedTotalStaked = useSpring({
    number: poolInfo.totalStaked,
    from: { number: 0 },
    config: { duration: 1000 },
  });

  // Calculate APR based on staking days with animation
  const calculateAPR = (days) => {
    const baseAPR = 12.5;
    const modifier = days / 30;
    return baseAPR * (1 + modifier * 0.1);
  };

  const animatedAPR = useSpring({
    number: calculateAPR(stakingDays),
    from: { number: 0 },
    config: { duration: 500 },
  });

  // TON Connect integration
  const connectWallet = async () => {
    try {
      // Use Telegram's built-in TON wallet connection
      const result = await tg.sendData({
        method: "connect_wallet",
      });

      if (result) {
        setIsConnected(true);
        setWalletAddress(result.address);
        await fetchWalletBalance(result.address);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setError("Could not connect to TON wallet");
    }
  };

  // Fetch wallet balance using TON API
  const fetchWalletBalance = async (address) => {
    try {
      const response = await fetch(
        `https://toncenter.com/api/v2/getAddressBalance?address=${address}`
      );
      const data = await response.json();

      if (data.ok) {
        const balance = parseInt(data.result) / 1e9; // Convert from nanotons to tons
        setPoolInfo((prev) => ({
          ...prev,
          walletBalance: balance,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      setError("Could not fetch wallet balance");
    }
  };

  // Calculate estimated rewards with animation
  const calculateEstimatedRewards = (amount, days) => {
    const apr = calculateAPR(days);
    return (amount * apr * days) / (365 * 100);
  };

  const animatedEstimatedRewards = useSpring({
    number: poolInfo.estimatedRewards,
    from: { number: 0 },
    config: { duration: 500 },
  });
  // Continuing from previous part...

  // Card component with animation
  const StakingCard = ({ children, className = "" }) => (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`bg-white rounded-xl shadow-sm p-4 ${className}`}
      style={{
        backgroundColor: "var(--tg-theme-bg-color)",
        color: "var(--tg-theme-text-color)",
      }}
    >
      {children}
    </motion.div>
  );

  // Animated stat display
  const StatDisplay = ({ label, value, icon: Icon, suffix = "" }) => (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      className="flex flex-col space-y-1"
    >
      <div className="text-sm opacity-60 flex items-center space-x-1">
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </div>
      <animated.div className="text-xl font-bold">
        {typeof value === "number" ? value.toLocaleString() : value}
        {suffix}
      </animated.div>
    </motion.div>
  );

  // Custom input with animation
  const AnimatedInput = ({
    value,
    onChange,
    placeholder,
    type = "text",
    min,
    max,
  }) => (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative"
    >
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full px-4 py-3 rounded-lg bg-opacity-50 border focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{
          backgroundColor: "var(--tg-theme-bg-color)",
          color: "var(--tg-theme-text-color)",
          borderColor: "var(--tg-theme-button-color)",
        }}
      />
    </motion.div>
  );

  // Staking form section
  const StakingForm = () => {
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        // Prepare transaction data
        const transactionData = {
          to: poolInfo.stakingContract,
          value: stakeAmount,
          data: {
            op: "stake",
            days: stakingDays,
          },
        };

        // Send transaction through Telegram's TON wallet
        const result = await tg.sendData({
          method: "ton_sendTransaction",
          params: transactionData,
        });

        if (result.success) {
          setShowSuccessAnimation(true);
          setTimeout(() => setShowSuccessAnimation(false), 2000);

          // Update pool info
          setPoolInfo((prev) => ({
            ...prev,
            yourStake: prev.yourStake + parseFloat(stakeAmount),
            totalStaked: prev.totalStaked + parseFloat(stakeAmount),
          }));
        }
      } catch (error) {
        setError("Transaction failed. Please try again.");
      } finally {
        setIsLoading(false);
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
              <AnimatedInput
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="Enter TON amount"
                min={poolInfo.minStake}
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setStakeAmount(poolInfo.walletBalance.toString())
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-md text-sm"
                style={{
                  backgroundColor: "var(--tg-theme-button-color)",
                  color: "var(--tg-theme-button-text-color)",
                }}
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
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStakingDays(days)}
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
            <StatDisplay
              label="Lock Period"
              value={stakingDays}
              icon={Clock}
              suffix=" days"
            />
            <StatDisplay
              label="Est. Rewards"
              value={poolInfo.estimatedRewards.toFixed(2)}
              icon={CoinsIcon}
              suffix=" TON"
            />
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={
            isLoading ||
            !stakeAmount ||
            parseFloat(stakeAmount) < poolInfo.minStake
          }
          className="w-full py-4 rounded-xl font-medium relative overflow-hidden"
          style={{
            backgroundColor: "var(--tg-theme-button-color)",
            color: "var(--tg-theme-button-text-color)",
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
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
        </motion.button>
      </form>
    );
  };

  // Success Animation Component
  const SuccessAnimation = () => (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
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
        <h3 className="text-xl font-bold">Staking Successful!</h3>
        <p className="text-gray-500 text-center">
          Your TON has been successfully staked
        </p>
      </div>
    </motion.div>
  );
  // Pool Statistics Component with animations
  const PoolStatistics = ({ poolInfo }) => {
    const stats = [
      {
        label: "Total Value Locked",
        value: poolInfo.totalStaked,
        format: (val) => `${val.toLocaleString()} TON`,
        icon: CoinsIcon,
        trend: "+5.2%",
        trendUp: true,
      },
      {
        label: "Active Stakers",
        value: poolInfo.activeStakers || 1250,
        format: (val) => val.toLocaleString(),
        icon: Users,
        trend: "+12.3%",
        trendUp: true,
      },
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-4"
      >
        {stats.map((stat, index) => (
          <StakingCard key={index} className="relative overflow-hidden">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2 text-sm opacity-60">
                <stat.icon className="w-4 h-4" />
                <span>{stat.label}</span>
              </div>
              <div className="text-xl font-bold">{stat.format(stat.value)}</div>
              <div
                className={`text-sm ${
                  stat.trendUp ? "text-green-500" : "text-red-500"
                }`}
              >
                {stat.trend}
              </div>
            </motion.div>
          </StakingCard>
        ))}
      </motion.div>
    );
  };

  // Transaction History Component
  const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      fetchTransactionHistory();
    }, []);

    const fetchTransactionHistory = async () => {
      try {
        // Fetch from TON API
        const response = await fetch(
          `https://toncenter.com/api/v2/getTransactions?address=${walletAddress}&limit=10`
        );
        const data = await response.json();

        if (data.ok) {
          setTransactions(data.result);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-6"
      >
        <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-t-transparent rounded-full"
              />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-4 opacity-60">
              No transactions yet
            </div>
          ) : (
            transactions.map((tx, index) => (
              <motion.div
                key={tx.hash}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-opacity-5"
                style={{
                  backgroundColor: "var(--tg-theme-bg-color)",
                  borderBottom: "1px solid var(--tg-theme-hint-color)",
                }}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.type === "stake" ? "bg-green-500" : "bg-blue-500"
                    }`}
                  >
                    {tx.type === "stake" ? (
                      <ArrowUpRight />
                    ) : (
                      <ArrowDownRight />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">
                      {tx.type === "stake" ? "Staked" : "Reward"}
                    </div>
                    <div className="text-sm opacity-60">
                      {new Date(tx.timestamp * 1000).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{tx.amount.toFixed(2)} TON</div>
                  <div className="text-sm opacity-60">
                    {tx.status === "confirmed" ? "Confirmed" : "Pending"}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    );
  };

  // Rewards Tracking Component
  const RewardsTracker = () => {
    const [rewardsData, setRewardsData] = useState({
      total: 0,
      pending: 0,
      history: [],
    });

    const rewardsStats = [
      {
        label: "Total Earned",
        value: rewardsData.total,
        icon: TrendingUp,
      },
      {
        label: "Pending Rewards",
        value: rewardsData.pending,
        icon: Clock,
      },
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6"
      >
        <h3 className="text-lg font-bold mb-4">Your Rewards</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {rewardsStats.map((stat, index) => (
            <StakingCard key={index}>
              <div className="flex items-center space-x-2 mb-2">
                <stat.icon className="w-4 h-4 opacity-60" />
                <span className="text-sm opacity-60">{stat.label}</span>
              </div>
              <div className="text-xl font-bold">
                {stat.value.toFixed(2)} TON
              </div>
            </StakingCard>
          ))}
        </div>
      </motion.div>
    );
  };

  // Settings Modal
  const SettingsModal = ({ isOpen, onClose }) => {
    const settings = [
      {
        label: "Notification Preferences",
        icon: Bell,
        onClick: () => {
          // Handle notification settings
          tg.showAlert("Notification settings updated");
        },
      },
      {
        label: "Transaction Confirmations",
        icon: Shield,
        onClick: () => {
          // Handle security settings
          tg.showConfirm("Enable additional security?");
        },
      },
    ];

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {settings.map((setting, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.98 }}
                onClick={setting.onClick}
                className="w-full flex items-center space-x-3 p-4 rounded-lg"
                style={{
                  backgroundColor: "var(--tg-theme-bg-color)",
                  color: "var(--tg-theme-text-color)",
                }}
              >
                <setting.icon className="w-5 h-5" />
                <span>{setting.label}</span>
              </motion.button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Add this component definition before the main return statement
  const ConnectWallet = ({ onConnect }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onConnect}
          className="px-6 py-3 rounded-xl font-medium"
          style={{
            backgroundColor: "var(--tg-theme-button-color)",
            color: "var(--tg-theme-button-text-color)",
          }}
        >
          Connect TON Wallet
        </motion.button>
      </motion.div>
    );
  };

  // Main return statement updates
  return (
    <div className="min-h-screen pb-safe-area">
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
            className="p-2 rounded-full"
            style={{
              backgroundColor: "var(--tg-theme-bg-color)",
            }}
          >
            <Settings className="w-6 h-6" />
          </motion.button>
        </div>

        <PoolStatistics poolInfo={poolInfo} />

        {isConnected ? (
          <>
            <StakingForm />
            <RewardsTracker />
            <TransactionHistory />
          </>
        ) : (
          <ConnectWallet onConnect={connectWallet} />
        )}

        {/* Modals */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />

        {/* Success Animation */}
        <AnimatePresence>
          {showSuccessAnimation && <SuccessAnimation />}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default StakingPool;
