import React, { useState, useEffect } from "react";
import Button from "../ui/buttonComponent";
import { Card, CardContent } from "../ui/card";
import { Trophy, Coins, Gamepad, Target } from "lucide-react";
import TonConnect from "@tonconnect/sdk";

const TelegramGame = () => {
  // Initialize Telegram WebApp
  const WebApp = window.Telegram?.WebApp;

  const [gameState, setGameState] = useState({
    score: 0,
    rewards: 0,
    highScore: 0,
    lives: 3,
    combo: 0,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 });
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    if (WebApp) {
      WebApp.ready();
      WebApp.expand();

      // Set Telegram theme variables
      document.documentElement.style.setProperty(
        "--tg-theme-bg-color",
        WebApp.backgroundColor
      );
      document.documentElement.style.setProperty(
        "--tg-theme-text-color",
        WebApp.textColor
      );
      document.documentElement.style.setProperty(
        "--tg-theme-button-color",
        WebApp.buttonColor
      );
      document.documentElement.style.setProperty(
        "--tg-theme-button-text-color",
        WebApp.buttonTextColor
      );
    }

    fetchLeaderboard();
  }, []);

  useEffect(() => {
    let gameLoop;
    if (isPlaying) {
      gameLoop = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
        moveTarget();
      }, 1000);
    }
    return () => clearInterval(gameLoop);
  }, [isPlaying]);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("YOUR_API_ENDPOINT/leaderboard");
      const data = await response.json();
      setLeaderboard(data.slice(0, 10)); // Top 10 scores
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setGameState((prev) => ({
      ...prev,
      score: 0,
      lives: 3,
      combo: 0,
    }));
    setTimeLeft(30);
    WebApp?.HapticFeedback.impactOccurred("light");
  };

  const moveTarget = () => {
    setTargetPosition({
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
    });
  };

  const clickTarget = () => {
    if (!isPlaying) return;

    WebApp?.HapticFeedback.impactOccurred("medium");

    const distance = Math.sqrt(
      Math.pow(targetPosition.x - 50, 2) + Math.pow(targetPosition.y - 50, 2)
    );

    const points = Math.max(10, Math.round(100 - distance));

    setGameState((prev) => ({
      ...prev,
      score: prev.score + points,
      combo: prev.combo + 1,
    }));

    moveTarget();
  };

  const missClick = () => {
    if (!isPlaying) return;

    WebApp?.HapticFeedback.impactOccurred("error");

    setGameState((prev) => ({
      ...prev,
      lives: prev.lives - 1,
      combo: 0,
    }));

    if (gameState.lives <= 1) {
      endGame();
    }
  };

  const endGame = async () => {
    setIsPlaying(false);
    const finalScore = gameState.score;

    try {
      // Send score to backend
      const response = await fetch("YOUR_API_ENDPOINT/submit-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: WebApp?.initDataUnsafe?.user?.id,
          score: finalScore,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Show claim rewards button in Telegram UI
        WebApp?.MainButton.setText("Claim Rewards");
        WebApp?.MainButton.show();
        WebApp?.MainButton.onClick(() => claimRewards(finalScore));
      }
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  };

  const claimRewards = async (score) => {
    try {
      // Initialize TON Connect
      const tonConnector = new TonConnect({
        manifestUrl: "YOUR_MANIFEST_URL",
      });

      // Connect wallet
      await tonConnector.connect({
        universalLink: "https://app.tonkeeper.com/ton-connect",
        bridgeUrl: "https://bridge.tonapi.io/bridge",
      });

      // Prepare transaction
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [
          {
            address: "YOUR_CONTRACT_ADDRESS",
            amount: "10000000", // 0.01 TON
            payload: `claim:${score}`,
          },
        ],
      };

      // Send transaction
      const result = await tonConnector.sendTransaction(transaction);

      if (result.success) {
        WebApp?.showAlert("Rewards claimed successfully!");
        setGameState((prev) => ({
          ...prev,
          rewards: prev.rewards + Math.floor(score / 10),
        }));
      }
    } catch (error) {
      WebApp?.showAlert("Error claiming rewards. Please try again.");
      console.error("Error claiming rewards:", error);
    }
  };

  return (
    <div
      className="max-w-lg mx-auto p-4 space-y-4"
      style={{
        backgroundColor: "var(--tg-theme-bg-color)",
        color: "var(--tg-theme-text-color)",
      }}
    >
      <Card className="bg-opacity-50">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6" />
              <div className="text-xl">{gameState.score}</div>
            </div>
            <div className="flex items-center gap-2">
              <Gamepad className="h-6 w-6" />
              <div className="text-xl">♥".repeat(gameState.lives)</div>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="h-6 w-6" />
              <div className="text-xl">{gameState.rewards}</div>
            </div>
          </div>

          {isPlaying ? (
            <div className="relative h-64 bg-opacity-50 bg-gray-100 rounded-lg overflow-hidden mb-4">
              <div
                className="absolute w-12 h-12 cursor-pointer transition-all duration-300"
                style={{
                  left: `${targetPosition.x}%`,
                  top: `${targetPosition.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onClick={clickTarget}
              >
                <Target className="w-full h-full animate-pulse text-red-500" />
              </div>
              <div className="absolute inset-0" onClick={missClick} />
              <div className="absolute top-2 right-2 text-xl">{timeLeft}s</div>
            </div>
          ) : (
            <Button
              onClick={startGame}
              className="w-full mb-4"
              style={{
                backgroundColor: "var(--tg-theme-button-color)",
                color: "var(--tg-theme-button-text-color)",
              }}
            >
              Start Game
            </Button>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-2">Top Scores</h3>
            <div className="space-y-2">
              {leaderboard.map((entry, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 bg-opacity-50 bg-gray-100 rounded"
                >
                  <div className="flex items-center gap-2">
                    {index + 1}.<span>{entry.username || "Player"}</span>
                  </div>
                  <span>{entry.score}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramGame;
