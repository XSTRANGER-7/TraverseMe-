import React, { useState, useEffect, useRef } from "react";
import { FaPlane, FaUserCircle, FaSignOutAlt, FaUser, FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = ({ user }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const profileWrapperRef = useRef(null);

  // Close profile popup when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isProfileOpen && profileWrapperRef.current && !profileWrapperRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsProfileOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isProfileOpen]);

  return (
    <nav
      className={`fixed top-0 w-full transition-all duration-300 z-50 ${
        isScrolled ? "bg-black shadow-lg py-4" : "py-6"
      } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FaPlane className="text-white text-2xl" />
          <h1 className="text-white text-xl font-semibold">TraverseMe</h1>
        </div>

        <div ref={profileWrapperRef} className="relative flex justify-center items-center gap-6">
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
            <>
              {/* <div className="absolute top-8 right-6 w-3 h-3 bg-gradient-to-br from-gray-900 to-black border-t border-l border-pink-600/20 transform rotate-45 z-50" /> */}
              <div className={`absolute top-full right-0 mt-2 w-64 bg-gradient-to-br from-gray-900 to-black border border-pink-600/20 rounded-2xl shadow-2xl text-white overflow-hidden origin-top-right transform transition-all duration-150 z-50`}>
              <div className="flex items-center gap-3 px-4 py-3 border-b border-pink-600/10">
                <img src={user?.photo || '/default-profile.jpg'} alt={user?.name || 'User'} className="w-12 h-12 rounded-full object-cover border-2 border-red-400" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{user?.name || 'Guest'}</div>
                  <div className="text-xs text-gray-400 truncate">{user?.email || ''}</div>
                </div>
                <button onClick={() => navigate('/profile')} className="text-red-400 hover:text-red-300">
                  <FaUser />
                </button>
              </div>

              <div className="flex flex-col py-2">
                <button onClick={() => navigate('/profile')} className="flex items-center gap-3 px-4 py-2 hover:bg-red-600/10 transition-colors">
                  <FaUser className="text-red-400" />
                  <span className="text-sm">Your Profile</span>
                </button>

                <button onClick={() => navigate('/settings')} className="flex items-center gap-3 px-4 py-2 hover:bg-red-600/10 transition-colors">
                  <FaCog className="text-red-400" />
                  <span className="text-sm">Settings</span>
                </button>

                <button onClick={logout} className="flex items-center gap-3 px-4 py-2 hover:bg-red-600/10 text-red-400 transition-colors">
                  <FaSignOutAlt className="text-red-400" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
