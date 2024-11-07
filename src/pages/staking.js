import React, { useState, useEffect } from "react";
import TonConnect from "@tonconnect/sdk";

import {
  Wallet,
  CoinsIcon,
  Clock,
  ArrowUpRight,
  ChevronDown,
  Info,
  X,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Alert, AlertDescription } from "../ui/alert";

// TON Connect configuration
const tonConnectOptions = {
  manifestUrl: "https://res.cloudinary.com/vendstore/raw/upload/v1730815296/tonconnect-manifest_dnkk4y.json",
  buttonRootId: "ton-connect-button",
};

const StakingPool = () => {
  // State management
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");
  const [stakingDays, setStakingDays] = useState(7);
  const [isStakingModalOpen, setIsStakingModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  // Fetch wallet balance (mock function, replace with actual API call if available)
const fetchWalletBalance = async (address) => {
  try {
    // Simulate an API call to fetch balance
    // Replace with actual logic if needed, e.g., an API call to TON blockchain or your backend
    const response = await fetch(`https://your-api.com/wallets/${address}/balance`);
    const data = await response.json();
    return data.balance; // Assuming the API returns balance in this field
  } catch (error) {
    console.error("Failed to fetch wallet balance:", error);
    return 0; // Default to 0 if there’s an error
  }
};


  // Pool information with state
  const [poolInfo, setPoolInfo] = useState({
    totalStaked: 2450000,
    apr: 12.5,
    minStake: 50,
    yourStake: 0,
    walletBalance: 0,
    estimatedRewards: 0,
  });

  // Calculate APR based on staking days
  const calculateAPR = (days) => {
    // Example APR calculation - replace with your actual formula
    const baseAPR = 12.5;
    const modifier = days / 30;
    return baseAPR * (1 + modifier * 0.1);
  };

  // Calculate estimated rewards
  const calculateEstimatedRewards = (amount, days) => {
    const apr = calculateAPR(days);
    return (amount * apr * days) / (365 * 100);
  };

  // Connect wallet handler
  const handleConnect = async () => {
    setIsLoading(true);
    setError("");
  
    try {
      const TonConnectOR = window.TonConnect || TonConnect;
      if (!TonConnectOR) {
        throw new Error("TonConnect is not loaded. Please check your script import.");
      }
  
      const connector = new TonConnectOR(tonConnectOptions);
  
      const walletConnectionSource = await connector.connect();
  
      if (walletConnectionSource) {
        const address = walletConnectionSource.address;
        setWalletAddress(address);
        setIsConnected(true);
  
        const balance = await fetchWalletBalance(address);
        setPoolInfo((prev) => ({
          ...prev,
          walletBalance: balance,
        }));
      }
    } catch (error) {
      console.error("Connection failed:", error);
      setError("Failed to connect wallet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  // Staking handler
  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) < poolInfo.minStake) {
      setError(`Minimum stake amount is ${poolInfo.minStake} TON`);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Create staking transaction
      const transaction = {
        to: "STAKING_CONTRACT_ADDRESS",
        value: stakeAmount,
        data: {
          stakingPeriod: stakingDays,
          method: "stake",
        },
      };

      // Send transaction using TON Connect
      const TonConnect = window.TonConnect;
      const connector = new TonConnect(tonConnectOptions);

      const result = await connector.sendTransaction(transaction);

      if (result.success) {
        // Update pool information
        setPoolInfo((prev) => ({
          ...prev,
          yourStake: prev.yourStake + parseFloat(stakeAmount),
          totalStaked: prev.totalStaked + parseFloat(stakeAmount),
          walletBalance: prev.walletBalance - parseFloat(stakeAmount),
        }));

        // Clear input
        setStakeAmount("");
      }
    } catch (error) {
      console.error("Staking failed:", error);
      setError("Failed to stake TON. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update estimated rewards when stake amount or days change
  useEffect(() => {
    if (stakeAmount && stakingDays) {
      const estimated = calculateEstimatedRewards(
        parseFloat(stakeAmount),
        stakingDays
      );
      setPoolInfo((prev) => ({
        ...prev,
        estimatedRewards: estimated,
      }));
    }
  }, [stakeAmount, stakingDays]);

  // Staking guide modal content
  const StakingGuide = () => {
    const steps = [
      {
        title: "Connect Your Wallet",
        description:
          "Start by connecting your TON wallet to access staking features.",
      },
      {
        title: "Choose Staking Amount",
        description: `Enter the amount you want to stake (minimum ${poolInfo.minStake} TON).`,
      },
      {
        title: "Select Staking Period",
        description:
          "Choose how long you want to stake your TON. Longer periods may offer better rewards.",
      },
      {
        title: "Confirm & Stake",
        description: "Review the details and confirm your staking transaction.",
      },
    ];

    return (
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              currentStep === index + 1 ? "bg-black text-white" : "bg-gray-50"
            }`}
          >
            <h3 className="font-bold mb-2">
              Step {index + 1}: {step.title}
            </h3>
            <p className="text-sm">{step.description}</p>
          </div>
        ))}

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => {
              if (currentStep === steps.length) {
                setIsStakingModalOpen(false);
                setCurrentStep(1);
              } else {
                setCurrentStep((prev) => prev + 1);
              }
            }}
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            {currentStep === steps.length ? "Got it!" : "Next"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-black p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">TON Staking Pool</h1>
        <p className="text-lg">Stake TON and Earn Rewards</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Pool Stats */}
      <div className="mb-8">
        <div className="border-2 border-black p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-gray-600">Total Staked</div>
              <div className="text-2xl font-bold">
                {poolInfo.totalStaked.toLocaleString()} TON
              </div>
            </div>
            <div>
              <div className="text-gray-600">Current APR</div>
              <div className="text-2xl font-bold text-green-600">
                {calculateAPR(stakingDays).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Staking Form */}
      <div className="border-2 border-black p-6 mb-8">
        {!isConnected ? (
          <div className="text-center">
            <button
              onClick={handleConnect}
              disabled={isLoading}
              className="bg-black text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center w-full space-x-2 disabled:opacity-50"
            >
              <Wallet className="w-5 h-5" />
              <span>{isLoading ? "Connecting..." : "Connect Wallet"}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="text-gray-600">Your Stake</div>
              <div className="font-bold">{poolInfo.yourStake} TON</div>
            </div>

            <div className="space-y-2">
              <label className="text-gray-600">Amount to Stake</label>
              <div className="relative">
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full border-2 border-black p-3 rounded-lg"
                  min={poolInfo.minStake}
                />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm bg-gray-100 px-2 py-1 rounded"
                  onClick={() =>
                    setStakeAmount(poolInfo.walletBalance.toString())
                  }
                >
                  MAX
                </button>
              </div>
              <div className="text-sm text-gray-600">
                Balance: {poolInfo.walletBalance} TON
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-gray-600">Staking Period (Days)</label>
              <input
                type="number"
                value={stakingDays}
                onChange={(e) =>
                  setStakingDays(Math.max(1, parseInt(e.target.value)))
                }
                className="w-full border-2 border-black p-3 rounded-lg"
                min="1"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Lock Period</span>
                </div>
                <div className="font-bold">{stakingDays} days</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CoinsIcon className="w-5 h-5" />
                  <span>Estimated Rewards</span>
                </div>
                <div className="font-bold">
                  {poolInfo.estimatedRewards.toFixed(2)} TON
                </div>
              </div>
            </div>

            <button
              onClick={handleStake}
              disabled={
                isLoading ||
                !stakeAmount ||
                parseFloat(stakeAmount) < poolInfo.minStake
              }
              className={`w-full py-3 rounded-lg font-bold flex items-center justify-center space-x-2
                ${
                  isLoading ||
                  !stakeAmount ||
                  parseFloat(stakeAmount) < poolInfo.minStake
                    ? "bg-gray-200 text-gray-500"
                    : "bg-black text-white"
                }`}
            >
              <span>{isLoading ? "Staking..." : "Stake TON"}</span>
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="space-y-4">
        <button
          onClick={() => setIsStakingModalOpen(true)}
          className="w-full flex items-center justify-between border-2 border-black p-4 hover:bg-gray-50"
        >
          <div className="flex items-center space-x-2">
            <Info className="w-5 h-5" />
            <span>How Staking Works</span>
          </div>
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Staking Guide Modal */}
      <Dialog open={isStakingModalOpen} onOpenChange={setIsStakingModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How TON Staking Works</DialogTitle>
            <DialogDescription>
              Learn how to stake your TON and earn rewards
            </DialogDescription>
          </DialogHeader>
          <StakingGuide />
        </DialogContent>
      </Dialog>

      <div className="mt-6 text-center text-gray-600">
        <p>APR updates based on staking period</p>
      </div>
    </div>
  );
};

export default StakingPool;
