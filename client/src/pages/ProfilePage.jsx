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
    <div className="min-h-screen bg-gradient-to-b from-lightDark via-gray-900 to-lightDark">
      {loading ? (
        <p>Loading user data...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : user ? (
        <div className="flex flex-col items-center">
          {/* {console.log("User:", user)} */}
          <img
            src={header}
            alt=""
            className="absolute w-full h-48 bg-cover bg-center"
          />
          <div className="relative w-full bg-gradient-to-r from-indigo-500 to-purple-700 h-48 bg-cover bg-center text-right">
            <button
              onClick={() => navigate("/")}
              className="text-white bg-red-600 px-6 py-3 rounded-full my-2 mx-6"
            >
              Go Back
            </button>
          </div>

          <div
            className={
              "absolute top-20 w-11/12 md:w-9/12 bg-black shadow-lg rounded-lg mt-16 p-6 flex flex-col md:flex-row justify-between items-center md:items-start"
            }
          >
            <div className="relative md:absolute md:bottom-[130px] ">
              <img
                src={user.photo || "/default-profile.jpg"}
                alt={`${user.name}'s profile`}
                className={`${getBorderColor(user.gender)} w-36 h-36 rounded-full border-4 shadow-lg`}
              />
            </div>
            <div className="md:w-1/2 flex flex-col mt-16 ml-4">
              <h1 className="text-3xl font-bold text-gray-100">{user.name}</h1>
              <p className="text-gray-200">
                Location: {user.location || "Unknown"}
              </p>
            </div>
            <div className="w-11/12 md:w-1/2 flex flex-col items-center">
              <div className="flex justify-around w-full mb-4">
                <div className="text-center">
                  <p className="text-xl font-semibold text-gray-100">
                    {allPlans.length}
                  </p>
                  <p className="text-gray-200">Plans</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-semibold text-gray-100">
                    {user.followers.length || 0}
                  </p>
                  <p className="text-gray-200">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-semibold text-gray-100">
                    {user.badge || "Leveeeel 1"}
                  </p>
                  <p className="text-gray-200">Badge</p>
                </div>
              </div>
              <div className="w-full flex justify-around gap-4 p-4"> 
                <div className="text-center w-1/2">
                <Follow onFollowChange={handleFollowChange} /> 
                </div>
                <div className="text-center bg-green-500 hover:bg-green-600 text-white px-2 py-3 sm:py-4 md:px-4 md:py-4 rounded-full w-1/2 cursor-pointer" onClick={movetomsg}>
                <button className="text-sm md:text-md font-semibold" >
                  Message
                </button> 
                </div>
              </div>
            </div>
          </div>

          {/* User Plans */}
          <div className="w-11/12 md:w-9/12 mt-96 md:mt-36 bg-black shadow-lg rounded-lg p-6 pt-10">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-200 mb-2">
                  Upcoming Plans
                </h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 grid-row gap-6">
                  {paginatedUpcomingPlans.length > 0 ? (
                    paginatedUpcomingPlans.map((plan, index) => (
                      <div
                        key={index}
                        className="bg-lightDark2 shadow-lg rounded-lg overflow-hidden mb-4 flex flex-col  cursor-pointer  border-gray-600 border-1 hover:border-gray-400"
                      >
                        <img
                          src={plan.photo || "/default-plan.jpg"}
                          alt={plan.title}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-gray-100">
                            {plan.title}
                          </h3>
                          <p className="text-gray-200">
                            {new Date(plan.date).toLocaleDateString()}
                          </p>
                          <div className="flex justify-center">
                            {/* {console.log("Request Status plan:", requestStatus)} */}
                            {requestStatus &&
                            requestStatus[plan._id] !== undefined ? (
                              requestStatus[plan._id] === "approved" ? (
                                <button
                                  className="mt-2 w-2/3 bg-green-500 text-white rounded-full py-3"
                                  onClick={() => handlePlanClick(plan._id)}
                                > 
                                  View Plan
                                </button>
                              ) : requestStatus[plan._id] === "pending" ? (
                                <button className="my-6 w-2/3 bg-gray-600 text-white rounded-full py-3"> 
                                  Requested
                                </button>
                              ) : (
                                <button
                                  className="my-6 w-2/3 bg-blue-500 text-white rounded-full py-3"
                                  onClick={() => handleJoinRequest(plan._id)}
                                > 
                                  Join Plan
                                </button>
                              )
                            ) : (
                              <button
                                className="my-6 w-2/3 bg-blue-500 text-white rounded-full py-3"
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
                    <p className="text-gray-200">No upcoming plans.</p>
                  )}
                </div>

                {/* Show pagination only if viewMore is true */}
                {viewMore && totalPagesUpcoming > 1 && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={handlePreviousUpcomingPage}
                      className={`px-4 py-2 mx-2 bg-gray-800 text-gray-100 rounded-md ${
                        currentUpcomingPage === 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-400"
                      }`}
                      disabled={currentUpcomingPage === 1}
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNextUpcomingPage}
                      className={`px-4 py-2 mx-2 bg-gray-800 text-gray-100 rounded-md ${
                        currentUpcomingPage === totalPagesUpcoming
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-400"
                      }`}
                      disabled={currentUpcomingPage === totalPagesUpcoming}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-200 mb-2">
                  Past Plans
                </h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 grid-row gap-6">
                  {paginatedPastPlans.length > 0 ? (
                    paginatedPastPlans.map((plan, index) => (
                      <div
                        key={index}
                        onClick={() => pastplansinfo(plan._id)}
                        className="bg-lightDark2 shadow-lg rounded-lg overflow-hidden mb-4 flex flex-col cursor-pointer border-1 hover:border-gray-400 border-gray-600"
                      >
                        <img
                          src={plan.photo || "/default-plan.jpg"}
                          alt={plan.title}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-gray-100">
                            {plan.title}
                          </h3>
                          <p className="text-gray-200">
                            {new Date(plan.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-200">No past plans.</p>
                  )}
                </div>

                {/* Show pagination only if viewMore is true */}
                {viewMore && totalPagesPast > 1 && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={handlePreviousPastPage}
                      className={`px-4 py-2 mx-2 bg-gray-800 text-gray-100 rounded-md ${
                        currentPastPage === 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-400"
                      }`}
                      disabled={currentPastPage === 1}
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNextPastPage}
                      className={`px-4 py-2 mx-2 bg-gray-800 text-gray-100 rounded-md ${
                        currentPastPage === totalPagesPast
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-400"
                      }`}
                      disabled={currentPastPage === totalPagesPast}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* View More Button */}
            {!viewMore && upcomingPlans.length > 3 && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleViewMore}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  View More
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>No user data found</p>
      )}
    </div>
  );
}

export default ProfilePage;
