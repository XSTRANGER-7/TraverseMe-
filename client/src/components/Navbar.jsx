import React, { useState, useEffect } from "react";
import { FaPlane, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = ({ user }) => {
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

  const logout = () => {
    localStorage.removeItem('token');
  };

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <nav
      className={`fixed top-0 w-full transition-all duration-300 z-50 ${isScrolled ? "bg-black shadow-lg py-4" : "py-6"}`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FaPlane className="text-white text-2xl" />
          <h1 className="text-white text-xl font-semibold">TraverseMe</h1>
        </div>

        <div className="relative flex justify-center items-center gap-6">
          <h2 className="text-xl font-semibold md:block hidden">
            Welcome <span className="text-red-400">{`${user?.name}`}</span>
          </h2>
          <div
            className="flex items-center justify-center gap-4 cursor-pointer"
            onClick={toggleProfileMenu}
          >
            <FaUserCircle className="text-white text-4xl mr-4" />
          </div>

          {isProfileOpen && (
            <div className="absolute top-0 right-16 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
              <div className="px-4 py-2 text-gray-800 font-semibold">
                Welcome back <span className="text-red-400">{`${user?.name}`}</span>
              </div>
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
  );
};

export default Navbar;
