import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import bgImage from '../assets/bgg.png';
import backIcon from '../assets/back.png';
import { jwtDecode } from "jwt-decode";
import Follow from "../components/Follow";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [allPlans, setAllPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams();
  const [currentUpcomingPage, setCurrentUpcomingPage] = useState(1);
  const [currentPastPage, setCurrentPastPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [viewMore, setViewMore] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const meriid = jwtDecode(token).id;

  useEffect(() => {
    if (!token) {
      navigate("/auth");
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
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to fetch user data. Please try again.");
      navigate("/auth");
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
      setAllPlans(response.data.plans);

      const requestStatusResponse = await axios.get(
        "http://localhost:7000/requeststatus2",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        requestStatusResponse.data &&
        typeof requestStatusResponse.data === "object"
      ) {
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

  const handleViewMore = () => {
    setItemsPerPage(6);
    setViewMore(true);
    setCurrentUpcomingPage(1);
    setCurrentPastPage(1);
  };

  const handleJoinRequest = async (planId) => {
    try {
      const response = await axios.post(
        `http://localhost:7000/joinplan/${planId}`,
        { meriid }
      );
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
        checkRequestStatus(plan._id);
      });
    }
  }, [allPlans]);

  const handlePlanClick = (planId) => {
    if (requestStatus[planId] === "approved") {
      navigate(`/showplans/${planId}`);
    } else {
      alert("You must wait for the plan creator to approve your request.");
    }
  };

  const pastplansinfo = (planId) => {
    const plan = pastPlans.find((plan) => plan._id === planId);

    if (!plan) {
      console.error("Plan not found!");
      alert("Plan not found!");
      return;
    }

    const userRequest = plan.requests?.find(
      (request) => request.userId === meriid
    );
    if (userRequest && userRequest.status === "approved") {
      navigate(`/showplans/${planId}`);
    } else {
      alert("You don't have access to this plan!");
    }

    console.log("clicked");
  };

  const movetomsg = () => {
    navigate(`/chat`, { state: { otherUserId: user._id } });
  }

  const getBorderColor = (gender) => {
    if (gender === 'male') return 'border-blue-500';
    if (gender === 'female') return 'border-red-400';
    return 'border-gray-300';
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-red-400 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-red-300 border-t-transparent rounded-full animate-spin animation-delay-1000"></div>
          </div>
        </div>
      ) : error ? (
        <p className="text-red-400 text-center text-lg font-semibold">{error}</p>
      ) : user ? (
        <div className="flex flex-col items-center relative z-10">
          <div className="relative w-full h-56 overflow-hidden bg-black">
            <button
              onClick={() => navigate(-1)}
              className="absolute top-12 left-6 z-10 flex items-center gap-2 px-5 py-3 hover:from-red-600/30 hover:to-red-600/30 border border-red-700/60 hover:border-red-600/40 backdrop-blur-sm rounded-full text-white font-semibold shadow-lg hover:shadow-red-500/30 transform hover:scale-101 transition-all duration-300 group"
            >
              <img 
                src={backIcon} 
                alt="Back" 
                className="w-7 h-7 group-hover:scale-102 transition-transform duration-300"
                style={{
                  filter: 'brightness(0) saturate(100%) invert(65%) sepia(56%) saturate(2500%) hue-rotate(310deg) brightness(100%) contrast(95%)'
                }}
              />
              <span className="text-base font-semibold">Back</span>
            </button>

            <div className="absolute -top-20 right-0 w-[410px] h-[410px] opacity-50">
              <img 
                src={bgImage} 
                alt="" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black"></div>
          </div>
          <div className="absolute top-28 w-11/12 md:w-9/12 bg-gradient-to-br from-gray-900 to-black border border-red-400/20 shadow-2xl rounded-3xl mt-16 p-8 flex flex-col md:flex-row justify-between items-center md:items-start hover:border-red-400/35 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400/5 via-red-400/5 to-red-400/5 rounded-3xl blur-xl -z-10"></div>
            
            <div className="relative md:absolute md:left-8 md:-top-16 group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-500 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
              <img
                src={user.photo || "/default-profile.jpg"}
                alt={`${user.name}'s profile`}
                className={`relative ${getBorderColor(user.gender)} w-32 h-32 rounded-full border-4 shadow-2xl transform group-hover:scale-105 transition-all duration-300`}
              />
            </div>

            <div className="md:w-1/2 flex flex-col mt-20 md:mt-16 md:ml-4 space-y-2">
              <h1 className="text-4xl font-bold text-white">{user.name}</h1>
              <p className="text-gray-400 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {user.location || "Unknown"}
              </p>
            </div>

            <div className="w-11/12 md:w-1/2 flex flex-col items-center mt-8 md:mt-0">
              <div className="flex justify-around w-full mb-6 gap-4">
                <div className="text-center bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-red-400/20 hover:border-red-400/40 transition-all duration-300 flex-1">
                  <p className="text-3xl font-bold text-red-400">
                    {allPlans.length}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">Plans</p>
                </div>
                <div className="text-center bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-red-400/20 hover:border-red-400/40 transition-all duration-300 flex-1">
                  <p className="text-3xl font-bold text-red-400">
                    {user.followers.length || 0}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">Followers</p>
                </div>
                <div className="text-center bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-red-400/20 hover:border-red-400/40 transition-all duration-300 flex-1">
                  <p className="text-3xl font-bold text-red-400">
                    {user.badge || "Level 1"}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">Badge</p>
                </div>
              </div>
              
              <div className="w-full flex justify-around gap-4 px-4"> 
                <div className="text-center w-1/2">
                  <Follow onFollowChange={handleFollowChange} /> 
                </div>
                <button 
                  onClick={movetomsg}
                  className="w-1/2 bg-gradient-to-r from-red-500 to-red-500 hover:from-red-400 hover:to-red-400 text-white px-4 py-3 rounded-full font-semibold shadow-lg hover:shadow-red-500/50 transform hover:scale-105 transition-all duration-300"
                >
                  Message
                </button>
              </div>
            </div>
          </div>

          <div className="w-11/12 md:w-9/12 mt-[420px] md:mt-56 bg-gradient-to-br from-gray-900 to-black border border-red-400/20 shadow-2xl rounded-3xl p-8 hover:border-red-400/30 transition-all duration-500 mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Plans</h2>
            
            <div className="grid grid-cols-1 gap-8">
              <div>
                <h3 className="text-2xl font-semibold text-red-400 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                  Upcoming Plans
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedUpcomingPlans.length > 0 ? (
                    paginatedUpcomingPlans.map((plan, index) => (
                      <div
                        key={index}
                        className="group bg-gray-900/50 border border-red-400/20 shadow-xl rounded-2xl overflow-hidden hover:border-red-400/50 hover:shadow-2xl hover:shadow-red-400/20 transform hover:scale-105 transition-all duration-300"
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={plan.photo || "/default-plan.jpg"}
                            alt={plan.title}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        </div>
                        <div className="p-5">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors duration-300">
                            {plan.title}
                          </h3>
                          <p className="text-gray-400 flex items-center gap-2 mb-4">
                            <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            {new Date(plan.date).toLocaleDateString()}
                          </p>
                          <div className="flex justify-center">
                            {requestStatus && requestStatus[plan._id] !== undefined ? (
                              requestStatus[plan._id] === "approved" ? (
                                <button
                                  className="w-full bg-gradient-to-r from-red-600 to-red-600 hover:from-red-700 hover:to-red-700 text-white rounded-full py-3 font-semibold shadow-lg hover:shadow-red-400/50 transform hover:scale-105 transition-all duration-300"
                                  onClick={() => handlePlanClick(plan._id)}
                                > 
                                  View Plan
                                </button>
                              ) : requestStatus[plan._id] === "pending" ? (
                                <button className="w-full bg-gray-700 text-white rounded-full py-3 font-semibold cursor-not-allowed opacity-75"> 
                                  Requested
                                </button>
                              ) : (
                                <button
                                  className="w-full bg-gradient-to-r from-red-600 to-red-600 hover:from-red-700 hover:to-red-700 text-white rounded-full py-3 font-semibold shadow-lg hover:shadow-red-400/50 transform hover:scale-105 transition-all duration-300"
                                  onClick={() => handleJoinRequest(plan._id)}
                                > 
                                  Join Plan
                                </button>
                              )
                            ) : (
                              <button
                                className="w-full bg-gradient-to-r from-red-600 to-red-600 hover:from-red-700 hover:to-red-700 text-white rounded-full py-3 font-semibold shadow-lg hover:shadow-red-400/50 transform hover:scale-105 transition-all duration-300"
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
                      className={`px-6 py-3 bg-gradient-to-r from-red-600 to-red-600 text-white rounded-full font-semibold shadow-lg transform transition-all duration-300 ${
                        currentUpcomingPage === 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:from-red-700 hover:to-red-700 hover:scale-105 hover:shadow-red-400/50"
                      }`}
                      disabled={currentUpcomingPage === 1}
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNextUpcomingPage}
                      className={`px-6 py-3 bg-gradient-to-r from-red-600 to-red-600 text-white rounded-full font-semibold shadow-lg transform transition-all duration-300 ${
                        currentUpcomingPage === totalPagesUpcoming
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:from-red-700 hover:to-red-700 hover:scale-105 hover:shadow-red-400/50"
                      }`}
                      disabled={currentUpcomingPage === totalPagesUpcoming}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <h3 className="text-2xl font-semibold text-gray-400 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                  Past Plans
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedPastPlans.length > 0 ? (
                    paginatedPastPlans.map((plan, index) => (
                      <div
                        key={index}
                        onClick={() => pastplansinfo(plan._id)}
                        className="group bg-gray-900/30 border border-gray-700/50 shadow-xl rounded-2xl overflow-hidden cursor-pointer hover:border-gray-600/50 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={plan.photo || "/default-plan.jpg"}
                            alt={plan.title}
                            className="w-full h-48 object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
                        </div>
                        <div className="p-5">
                          <h3 className="text-xl font-bold text-gray-300 mb-2 group-hover:text-white transition-colors duration-300">
                            {plan.title}
                          </h3>
                          <p className="text-gray-500 flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
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
                      className={`px-6 py-3 bg-gray-700 text-white rounded-full font-semibold shadow-lg transform transition-all duration-300 ${
                        currentPastPage === 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-600 hover:scale-105 hover:shadow-xl"
                      }`}
                      disabled={currentPastPage === 1}
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNextPastPage}
                      className={`px-6 py-3 bg-gray-700 text-white rounded-full font-semibold shadow-lg transform transition-all duration-300 ${
                        currentPastPage === totalPagesPast
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-600 hover:scale-105 hover:shadow-xl"
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
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-600 hover:from-red-700 hover:to-red-700 text-white rounded-full font-semibold shadow-lg hover:shadow-red-400/50 transform hover:scale-105 transition-all duration-300"
                >
                  View More
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-400 text-center text-lg">No user data available.</p>
      )}
    </div>
  );
}

export default ProfilePage;
