import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import header from "../assets/img2.jpg";
import { jwtDecode } from "jwt-decode";
import Follow from "../components/Follow";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [allPlans, setAllPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams(); // Get userId from route
  const [currentUpcomingPage, setCurrentUpcomingPage] = useState(1); // Separate state for upcoming page
  const [currentPastPage, setCurrentPastPage] = useState(1); // Separate state for past page
  const [itemsPerPage, setItemsPerPage] = useState(3); // Initially show 3 items per page
  const [viewMore, setViewMore] = useState(false); // View More toggle
  const [requestStatus, setRequestStatus] = useState(null);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const meriid = jwtDecode(token).id;

  useEffect(() => {
    if (!token) {
      navigate("/auth"); // Redirect to auth if token is not present
      return;
    }

    fetchUserData();
    fetchUserPlans();
  }, [userId, token, navigate]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7000/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log('User data:', response.data);
      setUser(response.data.user); // Assuming the user data is returned under 'user'
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to fetch user data. Please try again.");
      navigate("/auth"); // Redirect to auth if error occurs
    }
  };

  const fetchUserPlans = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7000/userplans?createdBy=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("User plans:", response.data.plans);
      setAllPlans(response.data.plans); // Assuming plans data is under 'plans'

      const requestStatusResponse = await axios.get(
        "http://localhost:7000/requeststatus2",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log('Request Status Response:', requestStatusResponse.data);

      // Ensure the response is valid and map statuses to plan IDs
      if (
        requestStatusResponse.data &&
        typeof requestStatusResponse.data === "object"
      ) {
        // console.log("Request Status Response:", requestStatusResponse.data);
        setRequestStatus(requestStatusResponse.data);
      } else {
        console.error(
          "Invalid request status response format:",
          requestStatusResponse.data
        );
        setRequestStatus({});
      }
    } catch (error) {
      console.error("Error fetching user plans:", error);
      setError("Failed to fetch user plans. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowChange = () => {
    // Refetch user data to update followers count
    fetchUserData();
  };

  const categorizePlans = () => {
    const currentDate = new Date();
    const upcomingPlans = [];
    const pastPlans = [];

    allPlans.forEach((plan) => {
      const planDate = new Date(plan.date);
      if (planDate >= currentDate) {
        upcomingPlans.push(plan);
      } else {
        pastPlans.push(plan);
      }
    });

    return { upcomingPlans, pastPlans };
  };

  const { upcomingPlans, pastPlans } = categorizePlans();

  const paginatePlans = (plans, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return plans.slice(startIndex, endIndex);
  };

  const paginatedUpcomingPlans = paginatePlans(
    upcomingPlans,
    currentUpcomingPage
  );
  const paginatedPastPlans = paginatePlans(pastPlans, currentPastPage);

  const totalPagesUpcoming = Math.ceil(upcomingPlans.length / itemsPerPage);
  const totalPagesPast = Math.ceil(pastPlans.length / itemsPerPage);

  const handleNextUpcomingPage = () => {
    if (currentUpcomingPage < totalPagesUpcoming) {
      setCurrentUpcomingPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousUpcomingPage = () => {
    if (currentUpcomingPage > 1) {
      setCurrentUpcomingPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPastPage = () => {
    if (currentPastPage < totalPagesPast) {
      setCurrentPastPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPastPage = () => {
    if (currentPastPage > 1) {
      setCurrentPastPage((prevPage) => prevPage - 1);
    }
  };

  // View More functionality
  const handleViewMore = () => {
    setItemsPerPage(6); // Change to 6 items per page
    setViewMore(true); // Show pagination buttons
    setCurrentUpcomingPage(1); // Reset to page 1
    setCurrentPastPage(1); // Reset to page 1
  };

  const handleJoinRequest = async (planId) => {
    try {
    //   console.log("Joining plan:", planId);
    //   console.log("Login ID:", meriid);
      // console.log('User ID:', userId);
      const response = await axios.post(
        `http://localhost:7000/joinplan/${planId}`,
        { meriid }
      );
    //   console.log("Join request response:", response.data);
      if (response.data.success) {
        setRequestStatus((prev) => ({ ...prev, [planId]: "pending" }));
        alert("Join request sent. Waiting for approval.");
      } else {
        alert("Error sending join request.");
      }
    } catch (error) {
      console.error("Error joining plan:", error);
      alert("Failed to send join request. Please try again later.");
    }
  };

  const checkRequestStatus = async (planId) => {
    try {
      const response = await axios.get(
        `http://localhost:7000/checkstatus/${planId}/${meriid}`
      );
      setRequestStatus((prev) => ({ ...prev, [planId]: response.data.status }));
    } catch (error) {
      console.error("Error checking status:", error);
    }
  };

  useEffect(() => {
    if (allPlans.length > 0) {
      allPlans.forEach((plan) => {
        checkRequestStatus(plan._id); // Check status for each plan
      });
    }
  }, [allPlans]);

  const handlePlanClick = (planId) => {
    // console.log('Request status:', requestStatus[planId]);
    if (requestStatus[planId] === "approved") {
      navigate(`/showplans/${planId}`); // Navigate to plan detail page if approved
    } else {
      alert("You must wait for the plan creator to approve your request.");
    }
  };

  const pastplansinfo = (planId) => {
    // console.log("user",meriid);

    const plan = pastPlans.find((plan) => plan._id === planId);
    // console.log("plann",plan);

    if (!plan) {
      console.error("Plan not found!");
      alert("Plan not found!");
      return;
    }
    // console.log("plan",plan.requests[0]);

    const userRequest = plan.requests?.find(
      (request) => request.userId === meriid
    );
    // console.log(userRequest);
    if (userRequest && userRequest.status === "approved") {
      // console.log('User is approved, navigating to plan details...');
      navigate(`/showplans/${planId}`);
    } else {
      // If user request is not present or not approved, show alert
      alert("You don't have access to this plan!");
    }

    console.log("clicked");
  };

  const movetomsg = () => {
    // navigate("/chat");
    navigate(`/chat`, { state: { otherUserId: user._id } });
  }

  const getBorderColor = (gender) => {
    if (gender === 'male') return 'border-blue-500';
    if (gender === 'female') return 'border-pink-500';
    return 'border-gray-300'; // Default border color
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-pink-500 border-t-transparent rounded-full animate-spin animation-delay-1000"></div>
          </div>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center text-lg font-semibold">{error}</p>
      ) : user ? (
        <div className="flex flex-col items-center relative z-10">
          {/* Header with gradient overlay */}
          <div className="relative w-full h-64 overflow-hidden">
            <img
              src={header}
              alt=""
              className="absolute w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-pink-900/30 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/40 to-purple-700/40 backdrop-blur-sm"></div>
            <button
              onClick={() => navigate("/")}
              className="absolute top-6 left-6 text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 p-3 rounded-full shadow-lg transition-all duration-300 group"
            >
              <svg 
                className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          </div>

          {/* Profile Card with glass morphism */}
          <div className="absolute top-32 w-11/12 md:w-9/12 bg-black/40 backdrop-blur-xl border border-purple-500/30 shadow-2xl rounded-3xl mt-16 p-8 flex flex-col md:flex-row justify-between items-center md:items-start hover:border-purple-500/50 transition-all duration-500">
            {/* Animated gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20 rounded-3xl blur-xl -z-10"></div>
            
            <div className="relative md:absolute md:left-8 md:-top-16 group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <img
                src={user.photo || "/default-profile.jpg"}
                alt={`${user.name}'s profile`}
                className={`relative ${getBorderColor(user.gender)} w-32 h-32 rounded-full border-4 shadow-2xl transition-all duration-300`}
              />
            </div>

            <div className="md:w-1/2 flex flex-col mt-20 md:mt-16 md:ml-4 space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent animate-gradient">{user.name}</h1>
              <p className="text-gray-300 flex items-center gap-2">
                <svg className="w-5 h-5 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {user.location || "Unknown"}
              </p>
            </div>

            <div className="w-11/12 md:w-1/2 flex flex-col items-center mt-8 md:mt-0">
              <div className="flex justify-around w-full mb-6 gap-4 max-w-2xl">
                <div className="text-center bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 flex-1">
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {allPlans.length}
                  </p>
                  <p className="text-gray-300 text-sm mt-1">Plans</p>
                </div>
                <div className="text-center bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 flex-1">
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {user.followers.length || 0}
                  </p>
                  <p className="text-gray-300 text-sm mt-1">Followers</p>
                </div>
                <div className="text-center bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 flex-1">
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {user.badge || "Level 1"}
                  </p>
                  <p className="text-gray-300 text-sm mt-1">Badge</p>
                </div>
              </div>
              
              <div className="w-full flex justify-around gap-4 px-4"> 
                <div className="text-center w-1/2">
                  <Follow onFollowChange={handleFollowChange} /> 
                </div>
                <button 
                  onClick={movetomsg}
                  className="w-1/2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Message
                </button>
              </div>
            </div>
          </div>

          {/* User Plans Section */}
          <div className="w-11/12 md:w-9/12 mt-[420px] md:mt-48 bg-black/40 backdrop-blur-xl border border-purple-500/30 shadow-2xl rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-500">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">Plans</h2>
            
            <div className="grid grid-cols-1 gap-8">
              <div>
                <h3 className="text-2xl font-semibold text-purple-300 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                  Upcoming Plans
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedUpcomingPlans.length > 0 ? (
                    paginatedUpcomingPlans.map((plan, index) => (
                      <div
                        key={index}
                        className="group bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/30 shadow-xl rounded-2xl overflow-hidden hover:border-purple-500/60 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={plan.photo || "/default-plan.jpg"}
                            alt={plan.title}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>
                        <div className="p-5">
                          <h3 className="text-xl font-bold text-gray-100 mb-2 group-hover:text-purple-300 transition-colors duration-300">
                            {plan.title}
                          </h3>
                          <p className="text-gray-300 flex items-center gap-2 mb-4">
                            <svg className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            {new Date(plan.date).toLocaleDateString()}
                          </p>
                          <div className="flex justify-center">
                            {requestStatus && requestStatus[plan._id] !== undefined ? (
                              requestStatus[plan._id] === "approved" ? (
                                <button
                                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full py-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                  onClick={() => handlePlanClick(plan._id)}
                                > 
                                  View Plan
                                </button>
                              ) : requestStatus[plan._id] === "pending" ? (
                                <button className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full py-3 font-semibold cursor-not-allowed opacity-75"> 
                                  Requested
                                </button>
                              ) : (
                                <button
                                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full py-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                  onClick={() => handleJoinRequest(plan._id)}
                                > 
                                  Join Plan
                                </button>
                              )
                            ) : (
                              <button
                                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full py-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                onClick={() => handleJoinRequest(plan._id)}
                              > 
                                Join Plan
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 col-span-full text-center py-8">No upcoming plans.</p>
                  )}
                </div>

                {viewMore && totalPagesUpcoming > 1 && (
                  <div className="flex justify-center mt-6 gap-4">
                    <button
                      onClick={handlePreviousUpcomingPage}
                      className={`px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-lg transform transition-all duration-300 ${
                        currentUpcomingPage === 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:from-purple-700 hover:to-pink-700 hover:scale-105 hover:shadow-xl"
                      }`}
                      disabled={currentUpcomingPage === 1}
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNextUpcomingPage}
                      className={`px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-lg transform transition-all duration-300 ${
                        currentUpcomingPage === totalPagesUpcoming
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:from-purple-700 hover:to-pink-700 hover:scale-105 hover:shadow-xl"
                      }`}
                      disabled={currentUpcomingPage === totalPagesUpcoming}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <h3 className="text-2xl font-semibold text-pink-300 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
                  Past Plans
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedPastPlans.length > 0 ? (
                    paginatedPastPlans.map((plan, index) => (
                      <div
                        key={index}
                        onClick={() => pastplansinfo(plan._id)}
                        className="group bg-gradient-to-br from-gray-900/50 to-purple-900/30 backdrop-blur-sm border border-gray-700/50 shadow-xl rounded-2xl overflow-hidden cursor-pointer hover:border-pink-500/60 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={plan.photo || "/default-plan.jpg"}
                            alt={plan.title}
                            className="w-full h-48 object-cover opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        </div>
                        <div className="p-5">
                          <h3 className="text-xl font-bold text-gray-100 mb-2 group-hover:text-pink-300 transition-colors duration-300">
                            {plan.title}
                          </h3>
                          <p className="text-gray-400 flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            {new Date(plan.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 col-span-full text-center py-8">No past plans.</p>
                  )}
                </div>

                {viewMore && totalPagesPast > 1 && (
                  <div className="flex justify-center mt-6 gap-4">
                    <button
                      onClick={handlePreviousPastPage}
                      className={`px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-lg transform transition-all duration-300 ${
                        currentPastPage === 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:from-purple-700 hover:to-pink-700 hover:scale-105 hover:shadow-xl"
                      }`}
                      disabled={currentPastPage === 1}
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNextPastPage}
                      className={`px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-lg transform transition-all duration-300 ${
                        currentPastPage === totalPagesPast
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:from-purple-700 hover:to-pink-700 hover:scale-105 hover:shadow-xl"
                      }`}
                      disabled={currentPastPage === totalPagesPast}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>

            {!viewMore && upcomingPlans.length > 3 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleViewMore}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  View More
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-400 text-center text-lg">No user data found</p>
      )}
    </div>
  );
}

export default ProfilePage;
