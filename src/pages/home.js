import React from "react";
import { Link } from "react-router-dom";
import BottomNavigation from "../components/navButtom";

const Hero = () => {
  return (
    <div className="min-h-screen bg-white relative">
      {/* Scrolling Notification Bar */}
      <nav className="flex items-center justify-center min-h-[4vh] bg-gray-100 overflow-hidden relative">
        <div className="flex items-center space-x-2 animate-scroll text-gray-900 whitespace-nowrap">
          <Link to={"/map"}>
            <span className="text-pretty font-bold">
              Check the footprint map
            </span>
          </Link>
        </div>
      </nav>
      <div className="py-8">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default Hero;
