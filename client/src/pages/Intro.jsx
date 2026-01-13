import React, {useEffect} from 'react';
import logo from "../assets/logo.png";
import { useNavigate } from 'react-router-dom';
const HomePage = () => {
 
  return (
    <div className="relative h-screen bg-gradient-to-r from-blue-500 to-indigo-700 flex flex-col justify-center items-center">
        {/* <img src="" alt="" > */}
      {/* Logo on the top-left */}
      <div className="absolute top-2 left-2 text-white text-2xl font-bold">
        <img
          src={logo} // replace with your logo path
          alt="Logo"
          className="h-14"
        />
      </div>

      {/* Get Started Button on the top-right */}
      <div className="absolute top-7 right-5">
        <a
          href="/auth" // replace with the actual path to your start page
          className="bg-white text-blue-600 font-semibold py-3 px-5 rounded-full shadow-lg hover:bg-blue-50 transition-all duration-300"
        >
          Get Started
        </a>
      </div>

      {/* Centered content */}
      <div className="flex flex-col justify-center items-center text-white space-y-4">
        <h1 className="text-5xl font-extrabold drop-shadow-lg">
          Welcome to Our Website
        </h1>
        <p className="text-lg text-center max-w-lg mx-auto mb-12">
          We help you achieve the best in the digital world. Join us and explore the amazing features we offer.
        </p>
        <a
          href="/profile"
          className="mt-12 bg-white text-blue-600 font-semibold py-3 px-6 rounded-full shadow-md hover:bg-blue-50 transition-all duration-300"
        >
          Explore More
        </a>
      </div>
      {/* </img> */}
    </div>
  );
};

export default HomePage;
