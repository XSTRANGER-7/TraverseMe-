import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import header from '../assets/img2.jpg';
import bgImage from '../assets/bgg.png';
import backIcon from '../assets/back.png';

function ProfilePage() {
    const [user, setUser] = useState(null);
    const [allPlans, setAllPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUpcomingPage, setCurrentUpcomingPage] = useState(1);
    const [currentPastPage, setCurrentPastPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(3);
    const [viewMore, setViewMore] = useState(false);
    const [editing, setEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [followersDetails, setFollowersDetails] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [photoSelectorOpen, setPhotoSelectorOpen] = useState(false);
    
    // Edit form states
    const [editedLocation, setEditedLocation] = useState('');
    const [editedPhoto, setEditedPhoto] = useState('');
    const [editedBio, setEditedBio] = useState([]);
    const [bioInput, setBioInput] = useState('');
    const [bioError, setBioError] = useState('');
    
    // Predefined profile photo options
    const profilePhotoOptions = [
        'https://i.pravatar.cc/300?img=1',
        'https://i.pravatar.cc/300?img=3',
        'https://i.pravatar.cc/300?img=5',
        'https://i.pravatar.cc/300?img=8',
        'https://i.pravatar.cc/300?img=12',
        'https://i.pravatar.cc/300?img=15'
    ];
    
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

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const fetchUserPlans = async (userId) => {
        try {
            const response = await axios.get('http://localhost:7000/showplans');
            const userPlans = response.data.filter(plan => plan.createdBy === userId);
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

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth';
        setUser(null);
        setIsAuthenticated(false);
    };

    const handleEditProfile = () => {
        setEditing(true);
        setEditedLocation(user.location || '');
        setEditedPhoto(user.photo || '');
        setEditedBio(Array.isArray(user.bio) ? [...user.bio] : []);
    }

    const handleCancelEdit = () => {
        setEditing(false);
        setBioInput('');
        setBioError('');
        setPhotoSelectorOpen(false);
    }

    const handlecreateplan = () => {
        navigate("/createplan");
    }

    const handleSelectPhoto = (photoUrl) => {
        setEditedPhoto(photoUrl);
        setPhotoSelectorOpen(false);
    };

    const handleBioInputChange = (e) => {
        const value = e.target.value;
        if (value.length <= 15) {
            setBioInput(value);
            setBioError('');
        } else {
            setBioError('Max 15 characters per keyword');
        }
    };

    const handleAddBioKeyword = (e) => {
        e.preventDefault();
        const trimmedInput = bioInput.trim();
        
        if (!trimmedInput) {
            setBioError('Please enter a keyword');
            return;
        }

        if (editedBio.length >= 6) {
            setBioError('Maximum 6 keywords allowed');
            return;
        }

        if (trimmedInput.length > 15) {
            setBioError('Max 15 characters per keyword');
            return;
        }

        if (editedBio.includes(trimmedInput)) {
            setBioError('Keyword already added');
            return;
        }

        setEditedBio([...editedBio, trimmedInput]);
        setBioInput('');
        setBioError('');
    };

    const handleRemoveBioKeyword = (indexToRemove) => {
        setEditedBio(editedBio.filter((_, index) => index !== indexToRemove));
    };
 
    const handleSaveProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError('No authentication token found');
                return;
            }
            
            const profileData = {
                name: user.name,
                location: editedLocation,
                photo: editedPhoto,
                bio: editedBio
            };
            
            console.log('Sending profile update:', profileData);
            
            const response = await axios.put(
                'http://localhost:7000/profile', 
                profileData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            console.log('Profile update response:', response.data);
            
            if (response.data) {
                setUser(response.data);
                setEditing(false);
                setBioInput('');
                setBioError('');
            }
        } catch (error) {
            console.error('Error updating profile:', error.response?.data || error.message);
            setError(error.response?.data?.message || 'Failed to update profile. Please try again.');
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
        return 'border-gray-300';
    };

    const handleViewMore = () => {
        setItemsPerPage(6);
        setViewMore(true);
        setCurrentUpcomingPage(1);
        setCurrentPastPage(1);
    };

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {loading ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-20 h-20 border-4 border-rose-400 border-t-transparent rounded-full animate-spin animation-delay-1000"></div>
                    </div>
                </div>
            ) : error ? (
                <p className="text-red-400 text-center text-lg font-semibold">{error}</p>
            ) : user ? ( 
                <div className="flex flex-col items-center relative z-10">
                    <div className="relative w-full h-56 overflow-hidden bg-black">
                        <button
                            onClick={() => navigate(-1)}
                            className="absolute top-12 left-6 z-10 flex items-center gap-2 px-5 py-3 hover:from-pink-600/30 hover:to-rose-600/30 border border-pink-700/60 hover:border-pink-600/40 backdrop-blur-sm rounded-full text-white font-semibold shadow-lg hover:shadow-pink-500/30 transform hover:scale-101 transition-all duration-300 group"
                        >
                            <img 
                                src={backIcon} 
                                alt="Back" 
                                className="w-7 h-7 group-hover:scale-102 transition-transform duration-300"
                                style={{
                                    filter: 'brightness(0) saturate(100%) invert(65%) sepia(56%) saturate(2500%) hue-rotate(310deg) brightness(80%) contrast(95%)'
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

                    <div className="absolute top-20 w-11/12 md:w-9/12 bg-gradient-to-br from-gray-900 to-black border border-pink-400/20 shadow-2xl rounded-3xl mt-16 p-8 flex flex-col md:flex-row justify-between items-center md:items-start hover:border-pink-400/35 transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-400/5 via-rose-400/5 to-pink-400/5 rounded-3xl blur-xl -z-10"></div>
                        
                        <div className="relative md:absolute md:left-8 md:-top-16 group">
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <img
                                src={editing ? editedPhoto : (user.photo || "/default-profile.jpg")}
                                alt={`${user.name}'s profile`}
                                className={`relative ${getBorderColor(user.gender)} w-32 h-32 rounded-full border-4 shadow-2xl transform group-hover:scale-105 transition-all duration-300`}
                            />
                            {editing && (
                                <button
                                    type="button"
                                    onClick={() => setPhotoSelectorOpen(true)}
                                    className="absolute -bottom-2 -right-2 bg-gradient-to-r from-pink-600 to-rose-600 p-3 rounded-full shadow-lg border-2 border-black cursor-pointer hover:scale-110 hover:from-pink-700 hover:to-rose-700 transition-all duration-300 group/camera"
                                >
                                    <svg className="w-5 h-5 text-white group-hover/camera:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        <div className="md:w-1/2 flex flex-col mt-20 md:mt-16 md:ml-4 space-y-2">
                            <h1 className="text-4xl font-bold text-white">{user.name}</h1>
                            
                            <div className="relative group/location">
                                {editing ? (
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        <input
                                            type="text"
                                            value={editedLocation}
                                            onChange={(e) => setEditedLocation(e.target.value)}
                                            placeholder="Enter location"
                                            className="flex-1 px-3 py-2 bg-gray-900/50 border border-pink-500/30 rounded-lg text-white focus:outline-none focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-gray-400 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        {user.location || "Unknown"}
                                    </p>
                                )}
                            </div>

                            <div className="mt-3">
                                {editing ? (
                                    <div className="space-y-3">
                                        <label className="block text-gray-300 font-semibold">
                                            Bio Keywords ({editedBio.length}/6)
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={bioInput}
                                                onChange={handleBioInputChange}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleAddBioKeyword(e);
                                                    }
                                                }}
                                                placeholder="Add keyword (max 15 chars)"
                                                className="flex-1 px-3 py-2 bg-gray-900/50 border border-pink-500/30 rounded-lg text-white focus:outline-none focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
                                                maxLength={15}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddBioKeyword}
                                                disabled={editedBio.length >= 6}
                                                className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold shadow-lg transform hover:scale-105 disabled:transform-none transition-all duration-300"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        
                                        {bioError && (
                                            <p className="text-red-400 text-sm">{bioError}</p>
                                        )}
                                        
                                        {editedBio.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {editedBio.map((keyword, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/40 text-pink-300 text-sm font-medium rounded-full backdrop-blur-sm group hover:from-pink-500/30 hover:to-rose-500/30 transition-all duration-300"
                                                    >
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                                        </svg>
                                                        {keyword}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveBioKeyword(index)}
                                                            className="ml-1 text-pink-400 hover:text-pink-200 transition-colors duration-200"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    user.bio && user.bio.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {user.bio.map((keyword, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/40 text-pink-300 text-sm font-medium rounded-full backdrop-blur-sm hover:from-pink-500/30 hover:to-rose-500/30 hover:border-pink-500/60 transition-all duration-300"
                                                >
                                                    <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                                    </svg>
                                                    {keyword}
                                                </span>
                                            ))}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="w-11/12 md:w-1/2 flex flex-col items-center mt-12 md:mt-0">
                            <div className="flex justify-around w-full mb-6 gap-4">
                                <div className="text-center bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 flex-1">
                                    <p className="text-3xl font-bold text-pink-500">
                                        {allPlans.length}
                                    </p>
                                    <p className="text-gray-400 text-sm mt-1">Plans</p>
                                </div>
                                <div 
                                    onClick={openModal}
                                    className="text-center bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 flex-1 cursor-pointer"
                                >
                                    <p className="text-3xl font-bold text-pink-500">
                                        {user.followers.length || 0}
                                    </p>
                                    <p className="text-gray-400 text-sm mt-1">Followers</p>
                                </div>
                                <div className="text-center bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 flex-1">
                                    <p className="text-3xl font-bold text-pink-500">
                                        {user.badge || "Level 1"}
                                    </p>
                                    <p className="text-gray-400 text-sm mt-1">Badge</p>
                                </div>
                            </div>
                            
                            <div className="w-full flex justify-around gap-4 px-4"> 
                                {editing ? (
                                    <>
                                        <button 
                                            onClick={handleSaveProfile} 
                                            className="w-1/2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-3 rounded-full font-semibold shadow-lg hover:shadow-green-500/50 transform hover:scale-105 transition-all duration-300"
                                        >
                                            Save Changes
                                        </button>
                                        <button 
                                            onClick={handleCancelEdit} 
                                            className="w-1/2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button 
                                            onClick={handleEditProfile} 
                                            className="w-1/2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-4 py-3 rounded-full font-semibold shadow-lg hover:shadow-pink-500/50 transform hover:scale-105 transition-all duration-300"
                                        >
                                            Edit Profile
                                        </button>
                                        <button 
                                            onClick={handlecreateplan} 
                                            className="w-1/2 bg-white text-gray-900 hover:bg-gray-100 px-4 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                        >
                                            Make a Plan
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
                            <div className="bg-gradient-to-br from-gray-900 to-black border border-pink-500/30 p-8 rounded-3xl w-11/12 md:w-[500px] shadow-2xl relative">
                                <h2 className="text-3xl font-bold text-white mb-6">Followers</h2>
                                
                                <ul className="max-h-96 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-gray-800">
                                    {user.followers.length > 0 ? (
                                        user.followers.map((follower, index) => (
                                            <li 
                                                key={index} 
                                                className="p-4 bg-gray-900/50 border border-pink-500/20 rounded-2xl flex items-center gap-4 hover:border-pink-500/40 hover:bg-gray-900/70 transition-all duration-300 group"
                                            >
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                                    <img
                                                        src={follower.photo || "/default-profile.jpg"}
                                                        alt={`${follower.name}'s profile`}
                                                        className="relative w-14 h-14 rounded-full border-2 border-pink-400 shadow-lg"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-lg font-semibold text-white">{follower.name || "Unknown"}</p>
                                                    <p className="text-sm text-gray-400 flex items-center gap-1">
                                                        <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                        </svg>
                                                        {follower.location || "Location: Unknown"}
                                                    </p>
                                                </div>
                                            </li>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-center py-8">No Followers</p>
                                    )}
                                </ul>

                                <button
                                    onClick={closeModal}
                                    className="absolute top-4 right-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white w-10 h-10 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {photoSelectorOpen && (
                        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
                            <div className="bg-gradient-to-br from-gray-900 to-black border border-pink-500/30 p-8 rounded-3xl w-11/12 md:w-[600px] shadow-2xl relative">
                                <h2 className="text-3xl font-bold text-white mb-6 text-center">Choose Profile Photo</h2>
                                
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    {profilePhotoOptions.map((photoUrl, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSelectPhoto(photoUrl)}
                                            className={`relative group/photo overflow-hidden rounded-2xl border-4 ${
                                                editedPhoto === photoUrl 
                                                    ? 'border-pink-500 shadow-lg shadow-pink-500/50' 
                                                    : 'border-transparent hover:border-pink-400/50'
                                            } transition-all duration-300 transform hover:scale-105`}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-pink-500/30 to-transparent opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300"></div>
                                            <img
                                                src={photoUrl}
                                                alt={`Profile option ${index + 1}`}
                                                className="w-full h-32 object-cover"
                                            />
                                            {editedPhoto === photoUrl && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-pink-500/30">
                                                    <svg className="w-12 h-12 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setPhotoSelectorOpen(false)}
                                        className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-pink-500/50 transform hover:scale-105 transition-all duration-300"
                                    >
                                        Done
                                    </button>
                                </div>

                                <button
                                    onClick={() => setPhotoSelectorOpen(false)}
                                    className="absolute top-4 right-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white w-10 h-10 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="w-11/12 md:w-9/12 mt-[420px] md:mt-56 bg-gradient-to-br from-gray-900 to-black border border-pink-500/20 shadow-2xl rounded-3xl p-8 hover:border-pink-500/30 transition-all duration-500 mb-12">
                        <h2 className="text-3xl font-bold text-white mb-6">Plans</h2>
                        
                        <div className="grid grid-cols-1 gap-8">
                            <div>
                                <h3 className="text-2xl font-semibold text-pink-400 mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
                                    Upcoming Plans
                                </h3>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {paginatedUpcomingPlans.length > 0 ? (
                                        paginatedUpcomingPlans.map((plan, index) => (
                                            <div 
                                                key={index} 
                                                onClick={() => navigate(`/showplans/${plan._id}`)} 
                                                className="group bg-gray-900/50 border border-pink-500/20 shadow-xl rounded-2xl overflow-hidden cursor-pointer hover:border-pink-500/50 hover:shadow-2xl hover:shadow-pink-500/20 transform hover:scale-105 transition-all duration-300"
                                            >
                                                <div className="relative overflow-hidden">
                                                    <img 
                                                        src={plan.photo || '/default-plan.jpg'} 
                                                        alt={plan.title} 
                                                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                                </div>
                                                <div className="p-5">
                                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors duration-300">{plan.title}</h3>
                                                    <p className="text-gray-400 flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                        </svg>
                                                        {new Date(plan.date).toLocaleDateString()}
                                                    </p>
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
                                            className={`px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-full font-semibold shadow-lg transform transition-all duration-300 ${
                                                currentUpcomingPage === 1
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : "hover:from-pink-700 hover:to-rose-700 hover:scale-105 hover:shadow-pink-500/50"
                                            }`}
                                            disabled={currentUpcomingPage === 1}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={handleNextUpcomingPage}
                                            className={`px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-full font-semibold shadow-lg transform transition-all duration-300 ${
                                                currentUpcomingPage === totalPagesUpcoming
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : "hover:from-pink-700 hover:to-rose-700 hover:scale-105 hover:shadow-pink-500/50"
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
                                                onClick={() => navigate(`/showplans/${plan._id}`)} 
                                                className="group bg-gray-900/30 border border-gray-700/50 shadow-xl rounded-2xl overflow-hidden cursor-pointer hover:border-gray-600/50 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                                            >
                                                <div className="relative overflow-hidden">
                                                    <img 
                                                        src={plan.photo || '/default-plan.jpg'} 
                                                        alt={plan.title} 
                                                        className="w-full h-48 object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
                                                </div>
                                                <div className="p-5">
                                                    <h3 className="text-xl font-bold text-gray-300 mb-2 group-hover:text-white transition-colors duration-300">{plan.title}</h3>
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
                                    className="px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-full font-semibold shadow-lg hover:shadow-pink-500/50 transform hover:scale-105 transition-all duration-300"
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
