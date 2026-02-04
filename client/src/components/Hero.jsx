import React, { useState, useEffect } from "react";
import { FaHeart, FaPlane, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Hero = ({user}) => {
  const navigate = useNavigate();

  const MoveToLeaderBoard = () => {
    navigate("/leaderboard");

}
const MoveToFaqs = () => {
    navigate("/faqs");

}

  return (
    <div>
      {/* Navbar */}
      <Navbar user={user} />

      {/* Hero Section */}
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-b from-black via-lightDark2 to-black px-4">
        <div className="flex items-center gap-3 mb-6">
          <FaPlane className="text-white text-3xl" />
          <FaHeart className="text-red-500 text-3xl" />
        </div>
        <h1 className="text-6xl font-bold text-center">
          {/* <span className="text-white">Mystery </span> */}
          <span className="text-white">Blind </span>
          <span className="text-primary">Date Adventures</span>
        </h1>
        <p className="mt-4 text-gray-400 text-lg text-center max-w-lg">
          Embark on a romantic journey to unknown destinations. Let destiny guide
          your next adventure.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-white text-dark font-semibold rounded-lg shadow-md hover:bg-gray-200" onClick={MoveToLeaderBoard}>
            View Leaderboard
          </button>
          <button className="px-6 py-3 bg-black border border-gray-500 rounded-lg hover:bg-lightDark" onClick={MoveToFaqs}>
            How It Works
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;


