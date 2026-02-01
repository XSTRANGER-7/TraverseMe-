
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Intro from "./pages/Intro";
import Profile from "./pages/Profile";
import CreatePlan from './pages/CreatePlan';
import UsersList from './pages/UsersList';
import AllPlans from './pages/AllPlans';
import PlanDetail from './pages/PlanDetail';
import ProfilePage from "./pages/ProfilePage";
import LeaderBoard from "./components/LeaderBoard";
import Faqs from "./components/Faqs";
import Admin from "./pages/Admin";
import Chat from "./pages/Chat";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {jwtDecode} from 'jwt-decode';

function App() {
  let token = localStorage.getItem('token'); // Get token from localStorage
  let loggedInUserId = null;

  // Validate and decode token
  try {
    if (token) {
      const decodedToken = jwtDecode(token); // Decode token
      loggedInUserId = decodedToken.id; // Extract user ID
    } else {
      token = null; // Set token to null if it doesn't exist
    }
  } catch (error) {
    console.error("Invalid token:", error.message);
    token = null; // Set token to null if decoding fails
    localStorage.removeItem('token'); // Remove invalid token
  }

  return (
    <>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes>
          {/* <Route path="/intro" element={token ? <Home /> : <Intro />} /> */}
          <Route path="/" element={token ? <Home /> : <Auth />} />
          <Route path="/auth" element={token ? <Home /> : <Auth />} />
          <Route path="/profile" element={token ? <Profile /> : <Auth />} />
          <Route path="/createplan" element={token ? <CreatePlan /> : <Auth />} />
          <Route path="/userlist" element={token ? <UsersList /> : <Auth />} />
          <Route path="/userprofile/:userId" element={token ? <ProfilePage /> : <Auth />} />
          <Route path="/showplans" element={token ? <AllPlans /> : <Auth />} />
          <Route path="/showplans/:planId" element={token ? <PlanDetail /> : <Auth />} />
          <Route path="/leaderboard" element={token ? <LeaderBoard /> : <Auth />} />
          <Route path="/faqs" element={token ? <Faqs /> : <Auth />} />
          <Route
            path="/chat"
            element={
              token ? (
                <Chat loggedInUser={loggedInUserId} />
              ) : (
                <Auth />
              )
            }
          />
          <Route path="/admin-dashy" element={<Admin />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
