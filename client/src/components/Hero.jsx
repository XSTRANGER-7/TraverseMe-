
import React, { useState, useEffect } from "react";
import { FaHeart, FaPlane, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Hero = ({user}) => {
  // console.log("user",user);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
}, []);

// console.log("f",user);

const MoveToLeaderBoard = () => {
    navigate("/leaderboard");

}
const MoveToFaqs = () => {
    navigate("/faqs");

}

const logout = () => {
  // Clear the authentication token (e.g., from localStorage or sessionStorage)
  localStorage.removeItem('token'); 
};
  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <div>
      {/* Navbar */}
      <nav
        className={`fixed top-0 w-full transition-all duration-300 z-50 ${isScrolled ? "bg-black shadow-lg py-4" : "py-6"}`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FaPlane className="text-white text-2xl" />
            <h1 className="text-white text-xl font-semibold">TraverseMe</h1>
          </div>

          <div className="relative flex justify-center items-center gap-6">
            <h2 className="text-xl font-semibold md:block hidden">Welcome <span className="text-red-400">{`${user?.name}`}</span></h2>
            <div
              className="flex items-center justify-center gap-4 cursor-pointer"
              onClick={toggleProfileMenu}
            >
              <FaUserCircle className="text-white text-4xl mr-4" />
            </div>

            {isProfileOpen && (
              <div className="absolute top-0 right-16 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
                <div className="px-4 py-2 text-gray-800 font-semibold">Welcome back <span className="text-red-400">{`${user?.name}`}</span></div>
                <a
                  href="/profile"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Your Profile
                </a>
                <a
                  href="/"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  onClick={logout}
                >
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </nav>

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


