import React, { useState } from "react";
import {
  Copy,
  CheckCircle,
  Users,
  Share2,
  Link as LinkIcon,
} from "lucide-react";

const FriendsInvite = () => {
  const [isCopied, setIsCopied] = useState(false);
  const inviteLink = "https://tonyield.com/invite/TYFE54DVCV";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setIsCopied(true);

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 10000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Failed to copy invite link");
    }
  };

  const shareOptions = [
    {
      icon: Users,
      name: "Contacts",
      color: "text-green-500",
      action: () => {
        // Placeholder for contacts sharing
        alert("Share via Contacts");
      },
    },
    {
      icon: Share2,
      name: "Social Media",
      color: "text-blue-500",
      action: () => {
        // Placeholder for social media sharing
        alert("Share on Social Media");
      },
    },
    {
      icon: LinkIcon,
      name: "Copy Link",
      color: "text-purple-500",
      action: handleCopyLink,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Invite Friends
          </h1>
          <p className="text-gray-600">
            Earn rewards by inviting your friends to join!
          </p>
        </div>

        {/* Invite Link Section */}
        <div className="bg-white shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">
              Your Unique Invite Link
            </span>
            <div
              className={`
                flex items-center space-x-2 
                px-3 py-1 rounded-full 
                ${
                  isCopied
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }
                cursor-pointer hover:bg-gray-200 transition-colors
              `}
              onClick={handleCopyLink}
            >
              {isCopied ? <CheckCircle size={16} /> : <Copy size={16} />}
              <span className="text-xs font-semibold">
                {isCopied ? "Copied!" : "Copy"}
              </span>
            </div>
          </div>

          <div className="bg-gray-100 rounded-md p-3 flex items-center justify-between">
            <span className="text-sm text-gray-700 truncate mr-2">
              {inviteLink}
            </span>
          </div>
        </div>

        {/* Share Options */}
        <div className="bg-white shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Share Invite
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {shareOptions.map((option) => (
              <button
                key={option.name}
                onClick={option.action}
                className="
                  flex flex-col items-center justify-center
                  p-4 rounded-lg
                  hover:bg-gray-100 transition-colors
                  focus:outline-none focus:ring-2 focus:ring-blue-300
                "
              >
                <option.icon className={`w-8 h-8 mb-2 ${option.color}`} />
                <span className="text-xs text-gray-700">{option.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Rewards Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            You'll earn{" "}
            <span className="font-bold text-green-600">50 coins</span> for each
            friend who joins!
          </p>
        </div>
      </div>
    </div>
  );
};

export default FriendsInvite;

// import React, { useState } from "react";
// import {
//   Copy,
//   CheckCircle,
//   Users,
//   Share2,
//   Link as LinkIcon,
// } from "lucide-react";

// const FriendsInvite = () => {
//   const [isCopied, setIsCopied] = useState(false);
//   const inviteLink = "https://yourapp.com/invite/ffsfsdf";

//   const handleCopyLink = async () => {
//     try {
//       await navigator.clipboard.writeText(inviteLink);
//       setIsCopied(true);

//       setTimeout(() => {
//         setIsCopied(false);
//       }, 2000);
//     } catch (err) {
//       console.error("Failed to copy: ", err);
//       alert("Failed to copy invite link");
//     }
//   };

//   const shareOptions = [
//     {
//       icon: Users,
//       name: "Contacts",
//       action: () => {
//         alert("Share via Contacts");
//       },
//     },
//     {
//       icon: Share2,
//       name: "Social Media",
//       action: () => {
//         alert("Share on Social Media");
//       },
//     },
//     {
//       icon: LinkIcon,
//       name: "Copy Link",
//       action: handleCopyLink,
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-white p-6">
//       <div className="max-w-md mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-black mb-4">INVITE FRIENDS</h1>
//           <p className="text-lg text-black">SHARE AND EARN REWARDS</p>
//         </div>

//         {/* Invite Link Section */}
//         <div className="border-2 border-black p-6 mb-6">
//           <div className="flex items-center justify-between mb-4">
//             <span className="font-bold text-black">
//               Your Unique Invite Link
//             </span>
//             <button
//               className={`
//                 flex items-center space-x-2
//                 px-4 py-2
//                 border-2 border-black
//                 font-bold
//                 transition-colors
//                 ${
//                   isCopied
//                     ? "bg-black text-white"
//                     : "bg-white text-black hover:bg-gray-100"
//                 }
//               `}
//               onClick={handleCopyLink}
//             >
//               {isCopied ? <CheckCircle size={16} /> : <Copy size={16} />}
//               <span className="ml-2">
//                 {isCopied ? "COPIED!" : "COPY"}
//               </span>
//             </button>
//           </div>

//           <div className="border-2 border-black p-3">
//             <span className="text-black font-medium">
//               {inviteLink}
//             </span>
//           </div>
//         </div>

//         {/* Share Options */}
//         <div className="border-2 border-black p-6">
//           <h2 className="text-xl font-bold text-black mb-6">
//             SHARE INVITE
//           </h2>

//           <div className="grid grid-cols-3 gap-4">
//             {shareOptions.map((option) => (
//               <button
//                 key={option.name}
//                 onClick={option.action}
//                 className="
//                   flex flex-col items-center justify-center
//                   p-4 border-2 border-black
//                   hover:bg-gray-100 transition-colors
//                   focus:outline-none
//                 "
//               >
//                 <option.icon className="w-8 h-8 mb-2 text-black" />
//                 <span className="font-bold text-black">{option.name}</span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Rewards Section */}
//         <div className="mt-8 text-center border-2 border-black p-4">
//           <p className="text-black font-bold text-lg">
//             EARN <span className="text-black">50 COINS</span> FOR EACH FRIEND WHO JOINS!
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FriendsInvite;
