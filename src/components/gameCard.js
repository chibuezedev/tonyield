import React from 'react';

const GameCard = ({ rotation, handleManualShake }) => {
    return (
      <div
        className="w-72 h-72 relative cursor-pointer mb-8 group"
        onClick={handleManualShake}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: "transform 0.3s ease-out",
        }}
      >
        {/* Main circular container */}
        <div className="absolute inset-0 rounded-full border-4 border-black bg-white shadow-lg overflow-hidden">
          {/* Inner rotating ring */}
          <div className="absolute inset-2 rounded-full border-2 border-blue-500 animate-spin-slow">
            {/* Geometric patterns */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-16 bg-black/10"
                style={{
                  top: "50%",
                  left: "50%",
                  transformOrigin: "50% 0",
                  transform: `rotate(${i * 30}deg) translateX(-50%)`,
                }}
              />
            ))}
          </div>
  
          {/* Center piece */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-white border-4 border-black flex items-center justify-center shadow-inner">
              <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <span className="text-4xl">🎲</span>
              </div>
            </div>
          </div>
  
          {/* Decorative dots */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-black rounded-full"
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${i * 45}deg) translate(120px, -50%)`,
              }}
            />
          ))}
  
          {/* Outer ring segments */}
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="absolute w-8 h-2 bg-blue-500"
              style={{
                top: "50%",
                left: "50%",
                transformOrigin: "140px 50%",
                transform: `rotate(${i * 22.5}deg) translateY(-50%)`,
              }}
            />
          ))}
        </div>
  
        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 animate-pulse" />
  
        {/* Hover ring */}
        <div className="absolute inset-[-8px] rounded-full border-2 border-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    );
};
  
export default GameCard;