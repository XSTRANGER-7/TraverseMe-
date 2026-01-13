import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function AllPlans() {
  const [allPlans, setAllPlans] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Decode token and extract user ID
  let meriid;
  try {
    const decodedToken = jwtDecode(token);
    meriid = decodedToken.id;
  } catch (error) {
    console.error("Invalid or expired token");
    navigate("/login"); // Redirect to login if token is invalid
  }

  const fetchPlans = async () => {
    try {
      const response = await axios.get("http://localhost:7000/showplans", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Filter out plans created by the current user
      const filteredPlans = response.data.filter(
        (plan) => plan.createdBy !== meriid
      );
      setAllPlans(filteredPlans);

      // Fetch user details for plan creators
      const creatorIds = [
        ...new Set(filteredPlans.map((plan) => plan.createdBy)),
      ];
      const userDetailsPromises = creatorIds.map((id) =>
        axios.get(`http://localhost:7000/profile/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      ); 
      // console.log("userDetailsPromises", userDetailsPromises);
      // const usersData = await Promise.all(userDetailsPromises);
      const usersData = await Promise.all(
        userDetailsPromises.map((promise) => promise.catch((error) => error))
      );
      // console.log("usersData", usersData);
      // const usersMap = usersData.reduce((acc, user) => {
      //   acc[user.data.user._id] = user.data.user;
      //   return acc;
      // }, {});
      const usersMap = usersData.reduce((acc, user) => {
        if (user instanceof Error) {
          console.error("Error fetching user:", user);
          return acc; // Skip this user
        }
        acc[user.data.user._id] = user.data.user;
        return acc;
      }, {});
      console.log("usersMap", usersMap);
      setUserDetails(usersMap);

      try {
        const requestStatusResponse = await axios.get(
          `http://localhost:7000/requeststatus/${meriid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRequestStatus(requestStatusResponse.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.error("No data found for the user");
          setRequestStatus({});
        } else {
          console.error("Error fetching request statuses:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      setError("Failed to fetch plans. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRequest = async (planId) => {
    try {
      const response = await axios.post(
        `http://localhost:7000/joinplan/${planId}`,
        { meriid },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

  // Check join request status
  const checkRequestStatus = async (planId) => {
    try {
      const response = await axios.get(
        `http://localhost:7000/checkstatus/${planId}/${meriid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRequestStatus((prev) => ({ ...prev, [planId]: response.data.status }));
    } catch (error) {
      console.error("Error checking status:", error);
    }
  };

  useEffect(() => {
    if (allPlans.length) {
      allPlans.forEach((plan) => {
        checkRequestStatus(plan._id);
      });
    }
  }, [allPlans]);

  useEffect(() => {
    fetchPlans();
  }, []);

  const handlePlanClick = (planId) => {
    if (requestStatus[planId] === "approved") {
      navigate(`/showplans/${planId}`);
    } else {
      alert("You must wait for the plan creator to approve your request.");
    }
  };

  if (loading) return <p>Loading plans...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 mt-4 text-center">Available Plans</h1>
      {allPlans.length === 0 ? (
        <p>No plans available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {allPlans.map((plan) => (
            <div
              key={plan._id}
              className="m-2 bg-lightDark2 outline-2 border-1 rounded-lg shadow-lg p-0 hover:border-gray-500 border-gray-800 cursor-pointer "
            // >
  //           <div
  // key={plan._id}
  // className="m-2 bg-lightDark2 bg-opacity-60 backdrop-blur-md border border-gray-300 border-opacity-30 rounded-lg shadow-lg p-0 hover:border-gray-500 cursor-pointer transition-transform transform hover:scale-105"
  // style={{
  //   boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)',
  //   background: 'rgba(255, 255, 255, 0.1)', // Adds the glass effect
  //   backdropFilter: 'blur(10px)', // Blur effect for the glassy look
  // }}
>
              {plan.photo && (
                <img
                  src={plan.photo}
                  alt={plan.title}
                  className="w-full h-48 object-cover rounded"
                />
              )}
              <div className="px-4">
                <h2 className="text-2xl font-semibold my-4">{plan.title}</h2> 
                <p className="text-gray-700 mb-1">{plan.description}</p>
                <p className="text-gray-500 mb-1">Location: {plan.location}</p>
                <p className="text-gray-500 mb-1">Timing: {plan.timing}</p>
                <p className="text-gray-500 mb-1 flex items-center">
                  Created By:{" "}
                  {userDetails[plan.createdBy] ? (
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => navigate(`/userprofile/${plan.createdBy}`)}
                    >
                      {/* {console.log("userDetails", userDetails[plan.createdBy])} */}
                      <img
                        src={userDetails[plan.createdBy].photo}
                        alt="Creator Avatar"
                        className="w-8 h-8 rounded-full ml-2 border-2"
                      />
                      <span className="ml-2 text-blue-600 hover:underline">
                        {userDetails[plan.createdBy].name || "View Profile"}
                      </span>
                    </div>
                  ) : (
                    "Loading..."
                  )}
                </p>

                <div className="flex justify-end m-4">
                  {/* {console.log("requestStatus",requestStatus)} */}
                  {/* {requestStatus && requestStatus[plan._id] ? (
                    requestStatus[plan._id] === "approved" ? (
                      <button
                        className="mt-2 w-2/3 bg-green-500 text-white rounded-full py-3"
                        onClick={() => handlePlanClick(plan._id)}
                      >
                        <h4 className="text-black">{plan._id}</h4>
                        View Plan
                      </button>
                    ) : requestStatus[plan._id] === "pending" ? (
                      <button className="my-6 w-2/3 bg-gray-600 text-white rounded-full py-3">
                        <h4 className="text-black">{plan._id}</h4>
                        Requested
                      </button>
                    ) : null // Fallback if unexpected status
                  ) : (
                    <button
                      className="my-6 w-2/3 bg-blue-500 text-white rounded-full py-3"
                      onClick={() => handleJoinRequest(plan._id)}
                    >
                      <h4 className="text-black">{plan._id}</h4>
                      Join Plan
                    </button>
                  )} */}

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
          ))}
        </div>
      )}
    </div>
  );
}

export default AllPlans;
