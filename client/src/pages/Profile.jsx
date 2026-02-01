

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import header from '../assets/img2.jpg';
import EditProfile from "./EditProfile";

function ProfilePage() {
    const [user, setUser] = useState(null);
    const [allPlans, setAllPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUpcomingPage, setCurrentUpcomingPage] = useState(1); // Separate state for upcoming page
    const [currentPastPage, setCurrentPastPage] = useState(1); // Separate state for past page
    const [itemsPerPage, setItemsPerPage] = useState(3); // Initially show 3 items per page
    const [viewMore, setViewMore] = useState(false); // View More toggle
    const [editing, setEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [followersDetails, setFollowersDetails] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setIsAuthenticated(false);
            navigate('/auth', { replace: true });
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:7000/user/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to fetch user data. Please try again.');
                setIsAuthenticated(false);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/auth', { replace: true });
            }
        };

        const initializeData = async () => {
            setLoading(true);
            await fetchUserData();
        };

        initializeData();
    }, [navigate]);

    // Monitor authentication state
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // const fetchFollowersDetails = async () => {
    //     try {
    //         const followersData = await Promise.all(
    //             user.followers.map(async (followerId) => {
    //                 const response = await axios.get(`/profile/${followerId}`);
    //                 return response.data.user; // Get user details from response
    //             })
    //         );
    //         setFollowersDetails(followersData); // Store fetched data
    //         setLoading(false);
    //     } catch (error) {
    //         console.error('Error fetching followers:', error);
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     fetchFollowersDetails();
    // }, [user.followers]); // Fetch data whenever followers change

    const fetchUserPlans = async (userId) => {
        try {
            const response = await axios.get('http://localhost:7000/showplans');
            const userPlans = response.data.filter(plan => plan.createdBy === userId); // Filter by user's ID
            setAllPlans(userPlans);
        } catch (error) {
            console.error('Error fetching user plans:', error);
            setError('Failed to fetch user plans. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUserPlans(user._id);
        }
    }, [user]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth';
        setUser(null);
        setIsAuthenticated(false);
        // Use window.location for a full page redirect
    };

    const handleEditProfile = () => {
        setEditing(true);
    }

    const handlecreateplan = () => {
        navigate("/createplan");
    }
 
    const handleSaveProfile = async (updatedUser) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('http://localhost:7000/profile', updatedUser, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(response.data); // Update user state with new data
            setEditing(false); // Exit editing mode
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Failed to update profile. Please try again.');
        }
    };
    
    const categorizePlans = () => {
        const currentDate = new Date();
        const upcomingPlans = [];
        const pastPlans = [];

        allPlans.forEach(plan => {
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

    // Pagination logic
    const paginatePlans = (plans, page) => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return plans.slice(startIndex, endIndex);
    };

    const paginatedUpcomingPlans = paginatePlans(upcomingPlans, currentUpcomingPage);
    const paginatedPastPlans = paginatePlans(pastPlans, currentPastPage);

    const totalPagesUpcoming = Math.ceil(upcomingPlans.length / itemsPerPage);
    const totalPagesPast = Math.ceil(pastPlans.length / itemsPerPage);

    const handleNextUpcomingPage = () => {
        if (currentUpcomingPage < totalPagesUpcoming) {
            setCurrentUpcomingPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousUpcomingPage = () => {
        if (currentUpcomingPage > 1) {
            setCurrentUpcomingPage(prevPage => prevPage - 1);
        }
    };

    const handleNextPastPage = () => {
        if (currentPastPage < totalPagesPast) {
            setCurrentPastPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPastPage = () => {
        if (currentPastPage > 1) {
            setCurrentPastPage(prevPage => prevPage - 1);
        }
    };

    const getBorderColor = (gender) => {
        if (gender === 'male') return 'border-blue-500';
        if (gender === 'female') return 'border-pink-500';
        return 'border-gray-300'; // Default border color
    };

    // View More functionality
    const handleViewMore = () => {
        setItemsPerPage(6); // Change to 6 items per page
        setViewMore(true); // Show pagination buttons
        setCurrentUpcomingPage(1); // Reset to page 1
        setCurrentPastPage(1); // Reset to page 1
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-lightDark via-gray-900 to-lightDark">
            {loading ? (
                <p>Loading user data...</p>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : user ? ( 
                <div className="flex flex-col items-center">
                    {/* Header image */}
                    <img src={header} alt="" className="absolute w-full h-48 bg-cover bg-center" />
                    <div className="relative w-full bg-gradient-to-r from-indigo-500 to-purple-700 h-48 bg-cover bg-center text-right">
                        <button onClick={handleLogout} className='text-white bg-red-600 px-6 py-3 rounded-full my-2 mx-6'>Logout</button>
                    </div>

                    {/* Profile Details */}
                    <div className={"absolute top-20 w-11/12 md:w-9/12 bg-black shadow-lg rounded-lg mt-16 p-6 flex flex-col md:flex-row justify-between items-center md:items-start text-white"}>
                        <div className="relative md:absolute md:bottom-[100px] ">
                            <img
                                src={user.photo || "/default-profile.jpg"}
                                alt={`${user.name}'s profile`}
                                className={`${getBorderColor(user.gender)} w-36 h-36 rounded-full border-4 shadow-lg `}
                            />
                            {console.log("User Photo:", user.gender)}
                        </div> 
                        <div className="md:w-1/2 flex flex-col mt-14 ml-4">
                            <h1 className="text-3xl font-bold text-gray-100">{user.name}</h1>
                            <p className="text-gray-200">Location: {user.location || "Unknown"}</p>
                        </div>
                        <div className="w-11/12 md:w-1/2 flex flex-col items-center">
                            <div className="flex justify-around w-full mb-8 md:mb-4">
                                <div className="text-center">
                                    <p className="text-xl font-semibold text-gray-100">{allPlans.length}</p>
                                    <p className="text-gray-200">Plans</p>
                                </div>
                                <div className="text-center" onClick={openModal}>
                                    <p className="text-xl font-semibold text-gray-100">{user.followers.length || 0}</p>
                                    <p className="text-gray-200">Followers</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-semibold text-gray-100">{user.badge || "Level 1"}</p>
                                    <p className="text-gray-200">Badge</p>
                                </div>
                            </div>
                            <div className="w-full flex justify-around "> 
                                    <button onClick={handleEditProfile} className=" text-sm md:text-md font-semibold bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 md:px-4 md:py-4 rounded-full w-5/12">
                                    Edit Profile
                                </button> 
                                
                                <button onClick={handlecreateplan} className="text-sm md:text-md font-semibold bg-green-500 hover:bg-green-600 text-white px-2 py-3 sm:py-4 md:px-4 md:py-4 rounded-full w-5/12">
                                    Make a Plan
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Follower Modal */}
                    {console.log(isModalOpen)}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-dark p-6 rounded-lg w-96 shadow-lg relative">
                        <h2 className="text-xl font-bold mb-4">Followers</h2>
                        
                        {/* List Followers */}
                        {/* <ul className="max-h-60 overflow-y-auto">
                            {console.log("g",user.followers)}
                            {user.followers.length > 0 ? (
                                user.followers.map((follower, index) => (
                                    <li key={index} className="p-2 border-b border-gray-200">
                                        {follower.name || "Unknown"}
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500">No Followers</p>
                            )}
                        </ul> */}

<ul className="max-h-60 overflow-y-auto">
    {console.log("Followers List:", user.followers)}
    {user.followers.length > 0 ? (
        user.followers.map((follower, index) => (
            <li key={index} className="p-4 border-b border-gray-200 flex items-center gap-4">
                {/* Profile Picture */}
                <img
                    src={follower.photo || "/default-profile.jpg"} // Default image if no photo
                    alt={`${follower.name}'s profile`}
                    className="w-12 h-12 rounded-full border-2 border-gray-300 shadow-sm"
                />
                <div>
                    {/* Follower Name */}
                    <p className="text-lg font-semibold text-gray-800">{follower.name || "Unknown"}</p>

                    {/* Follower Location */}
                    <p className="text-sm text-gray-500">
                        {follower.location || "Location: Unknown"}
                    </p>
                </div>
            </li>
        ))
    ) : (
        <p className="text-gray-500">No Followers</p>
    )}
</ul>



                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full"
                        >
                            X
                        </button>
                    </div>
                </div>
            )}
                  

                    {editing && (
                        <div className="fixed inset-0 bg-black opacity-50 z-10" />
                    )}
                    
                    {/* EditProfile Component */}
                    {editing && (
                        <div className="z-20">
                            <EditProfile user={user} onSave={handleSaveProfile} onCancel={() => setEditing(false)} />
                        </div>
                    )}

                
                    {/* Plans Section */}
                    <div className="w-11/12 md:w-9/12 mt-96 md:mt-36 bg-black shadow-lg rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-100 mb-4">Plans</h2>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-200 mb-2">Upcoming Plans</h3>
                                <div className="grid sm:grid-cols-2 md:grid-cols-3 grid-row gap-6">
                                    {paginatedUpcomingPlans.length > 0 ? (
                                        paginatedUpcomingPlans.map((plan, index) => (
                                            <div key={index} onClick={() => navigate(`/showplans/${plan._id}`)} className="bg-lightDark2 shadow-lg rounded-lg overflow-hidden mb-4 flex flex-col cursor-pointer hover:border-gray-400 border-1 border-gray-600">
                                                <img src={plan.photo || '/default-plan.jpg'} alt={plan.title} className="w-full h-32 object-cover"/>
                                                <div className="p-4">
                                                    <h3 className="text-lg font-bold text-gray-100">{plan.title}</h3>
                                                    <p className="text-gray-200">{new Date(plan.date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-100">No upcoming plans.</p>
                                    )}
                                </div>

                                {/* Show pagination only if viewMore is true */}
                                {viewMore && totalPagesUpcoming > 1 && (
                                    <div className="flex justify-center mt-4">
                                        <button
                                            onClick={handlePreviousUpcomingPage}
                                            className={`px-4 py-2 mx-2 bg-gray-700 text-gray-200 rounded-md ${
                                                currentUpcomingPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'
                                            }`}
                                            disabled={currentUpcomingPage === 1}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={handleNextUpcomingPage}
                                            className={`px-4 py-2 mx-2 bg-gray-700 text-gray-200 rounded-md ${
                                                currentUpcomingPage === totalPagesUpcoming ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'
                                            }`}
                                            disabled={currentUpcomingPage === totalPagesUpcoming}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6">
                                <h3 className="text-xl font-semibold text-gray-200 mb-2">Past Plans</h3>
                                <div className="grid sm:grid-cols-2 md:grid-cols-3 grid-row gap-6">
                                    {paginatedPastPlans.length > 0 ? (
                                        paginatedPastPlans.map((plan, index) => (
                                            <div key={index} onClick={() => navigate(`/showplans/${plan._id}`)} className="bg-lightDark2 shadow-lg rounded-lg overflow-hidden mb-4 flex flex-col cursor-pointer hover:border-gray-400 border-1 border-gray-600">
                                                <img src={plan.photo || '/default-plan.jpg'} alt={plan.title} className="w-full h-32 object-cover"/>
                                                <div className="p-4">
                                                    <h3 className="text-lg font-bold text-gray-100">{plan.title}</h3>
                                                    <p className="text-gray-200">{new Date(plan.date).toLocaleDateString()}</p>
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
                                            className={`px-4 py-2 mx-2 bg-gray-700 text-gray-100 rounded-md ${
                                                currentPastPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'
                                            }`}
                                            disabled={currentPastPage === 1}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={handleNextPastPage}
                                            className={`px-4 py-2 mx-2 bg-gray-700 text-gray-800 rounded-md ${
                                                currentPastPage === totalPagesPast ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'
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
                <p>No user data available.</p>
            )}

        </div>












// <div className="min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white">
//   {loading ? (
//     <div className="flex items-center justify-center min-h-screen">
//       <p className="text-xl font-semibold">Loading user data...</p>
//     </div>
//   ) : error ? (
//     <div className="flex items-center justify-center min-h-screen">
//       <p className="text-red-500 text-xl text-center">{error}</p>
//     </div>
//   ) : user ? (
//     <div className="relative">
//       {/* Header Section */}
//       <header className="relative w-full h-48 bg-gradient-to-r from-indigo-600 to-purple-700">
//         <button
//           onClick={handleLogout}
//           className="absolute top-4 right-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-lg transition duration-200"
//         >
//           Logout
//         </button>
//         <img
//           src={header}
//           alt=""
//           className="absolute inset-0 w-full h-full object-cover opacity-50"
//         />
//       </header>

//       {/* Profile Section */}
//       <section className="relative flex flex-col items-center mt-[-50px]">
//         <div className="relative">
//           <img
//             src={user.photo || "/default-profile.jpg"}
//             alt={`${user.name}'s profile`}
//             className="w-36 h-36 rounded-full border-4 border-white shadow-lg"
//           />
//         </div>
//         <div className="mt-6 text-center">
//           <h1 className="text-3xl font-bold">{user.name}</h1>
//           <p className="text-gray-300">Location: {user.location || "Unknown"}</p>
//         </div>
//         <div className="flex space-x-8 mt-6">
//           <div className="text-center">
//             <p className="text-xl font-bold">{allPlans.length}</p>
//             <p className="text-sm text-gray-400">Plans</p>
//           </div>
//           <div className="text-center cursor-pointer" onClick={openModal}>
//             <p className="text-xl font-bold">{user.followers.length || 0}</p>
//             <p className="text-sm text-gray-400">Followers</p>
//           </div>
//           <div className="text-center">
//             <p className="text-xl font-bold">{user.badge || "Level 1"}</p>
//             <p className="text-sm text-gray-400">Badge</p>
//           </div>
//         </div>
//         <div className="flex space-x-4 mt-8">
//           <button
//             onClick={handleEditProfile}
//             className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full shadow-md transition duration-200"
//           >
//             Edit Profile
//           </button>
//           <button
//             onClick={handlecreateplan}
//             className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full shadow-md transition duration-200"
//           >
//             Make a Plan
//           </button>
//         </div>
//       </section>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white text-black rounded-lg shadow-lg w-96 p-6 relative">
//             <button
//               onClick={closeModal}
//               className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full shadow-md"
//             >
//               X
//             </button>
//             <h2 className="text-2xl font-bold mb-4">Followers</h2>
//             <ul className="max-h-60 overflow-y-auto divide-y divide-gray-200">
//               {user.followers.length > 0 ? (
//                 user.followers.map((follower, index) => (
//                   <li
//                     key={index}
//                     className="p-4 flex items-center space-x-4 hover:bg-gray-100"
//                   >
//                     <img
//                       src={follower.photo || "/default-profile.jpg"}
//                       alt={`${follower.name}'s profile`}
//                       className="w-12 h-12 rounded-full"
//                     />
//                     <div>
//                       <p className="text-lg font-bold">{follower.name || "Unknown"}</p>
//                       <p className="text-sm text-gray-500">
//                         {follower.location || "Location: Unknown"}
//                       </p>
//                     </div>
//                   </li>
//                 ))
//               ) : (
//                 <p className="text-gray-500 text-center">No Followers</p>
//               )}
//             </ul>
//           </div>
//         </div>
//       )}

//       {/* Plans Section */}
//       <section className="w-11/12 md:w-9/12 mx-auto mt-16 bg-gray-800 rounded-lg shadow-lg p-6">
//         <h2 className="text-2xl font-bold mb-4">Plans</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {paginatedUpcomingPlans.map((plan, index) => (
//             <div
//               key={index}
//               className="bg-white rounded-lg shadow-lg p-4 hover:scale-105 transition-transform cursor-pointer"
//               onClick={() => navigate(`/showplans/${plan._id}`)}
//             >
//               <img
//                 src={plan.photo || "/default-plan.jpg"}
//                 alt={plan.title}
//                 className="w-full h-32 object-cover rounded-t-lg"
//               />
//               <h3 className="text-lg font-bold mt-4">{plan.title}</h3>
//               <p className="text-gray-500">{new Date(plan.date).toLocaleDateString()}</p>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   ) : null}
// </div>

        
    );
}

export default ProfilePage;
