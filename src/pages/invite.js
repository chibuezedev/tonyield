import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  CheckCircle,
  Users,
  MessageCircle,
  QrCode,
} from "lucide-react";

const TelegramTaskShare = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const inviteLink = "https://t.me/taskmanager/invite/TM54DVCV";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const shareOptions = [
    {
      icon: MessageCircle,
      name: "Send Message",
      color: "text-blue-500",
      action: () => alert("Send via Telegram Message"),
    },
    {
      icon: Users,
      name: "Share to Group",
      color: "text-green-500",
      action: () => alert("Share to Telegram Group"),
    },
    {
      icon: QrCode,
      name: "Show QR",
      color: "text-purple-500",
      action: () => setShowQR(!showQR),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white"
    >
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4">
        <div className="flex items-center max-w-lg mx-auto">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            {/* <ArrowLeft size={24} className="text-gray-700" /> */}
          </motion.button>
          <h1 className="text-xl font-semibold text-gray-800 ml-3">
            Invite and Earn
          </h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">
        {/* Invite Link Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">
              Share via Link
            </span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyLink}
              className={`
                flex items-center space-x-2 px-3 py-1.5 rounded-full
                ${
                  isCopied
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }
                transition-colors duration-200
              `}
            >
              <motion.div
                initial={false}
                animate={{ scale: isCopied ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.2 }}
              >
                {isCopied ? <CheckCircle size={16} /> : <Copy size={16} />}
              </motion.div>
              <span className="text-xs font-semibold">
                {isCopied ? "Copied!" : "Copy Link"}
              </span>
            </motion.button>
          </div>

          <div className="bg-gray-50 rounded-xl p-3.5 flex items-center justify-between">
            <span className="text-sm text-gray-700 truncate mr-2">
              {inviteLink}
            </span>
          </div>
        </motion.div>

        {/* Share Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
        >
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Share Options
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {shareOptions.map((option, index) => (
              <motion.button
                key={option.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                whileTap={{ scale: 0.95 }}
                onClick={option.action}
                className="
                  flex flex-col items-center justify-center
                  p-4 rounded-xl bg-gray-50
                  hover:bg-gray-100 transition-colors
                  focus:outline-none focus:ring-2 focus:ring-blue-300
                "
              >
                <option.icon className={`w-6 h-6 mb-2 ${option.color}`} />
                <span className="text-xs text-gray-700 text-center">
                  {option.name}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* QR Code Section */}
        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
            >
              <div className="text-center">
                <h3 className="text-base font-semibold text-gray-800 mb-4">
                  QR Code
                </h3>
                <div className="w-48 h-48 mx-auto bg-gray-100 rounded-xl flex items-center justify-center">
                  <span className="text-sm text-gray-500">
                    TonYield
                  </span>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Scan to join the task
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center bg-blue-50 rounded-2xl p-4"
        >
          <p className="text-sm text-blue-800">
            <span className="font-semibold">12 people</span> have joined via
            your invites
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TelegramTaskShare;
