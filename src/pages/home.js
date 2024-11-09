import React from "react";
import BottomNavigation from "../components/navButtom";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-center min-h-[4vh] bg-gray-100 overflow-hidden relative">
        <div className="flex items-center space-x-2 animate-scroll text-gray-900 whitespace-nowrap">
          <span className="text-pretty font-bold">
            <Link to={"/"}>News 📢: Matrix will list on Binance on 18th Nov. </Link> 
          </span>
        </div>
      </nav>
      <div className="pb-16">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default Hero;
