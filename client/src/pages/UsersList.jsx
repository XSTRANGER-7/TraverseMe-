import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import '../assets/UserList.css';

function UsersList() {
    const [allUsers, setAllUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const swiperRef = React.useRef(null);

    // Fetch all users
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/auth');
            return;
        }

        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:7000/users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const verifiedUsers = response.data.filter(user => user.verified === true);

                console.log('Verified Users:', verifiedUsers); 
                setAllUsers(verifiedUsers); 
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [navigate]);

    // Handle search query change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter users based on search query
    const filteredUsers = allUsers.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle profile card click
    const handleProfileClick = (userId) => {
        navigate(`/userprofile/${userId}`);
    };

    const movetomsg = (otheruserid) => {
        console.log("movetomsg",otheruserid);
        navigate(`/chat`, { state: { otherUserId: otheruserid } });
    }

    // Function to determine border color based on gender
    const getBorderColor = (gender) => {
        if (gender === 'male') return 'border-blue-500';
        if (gender === 'female') return 'border-pink-500';
        return 'border-gray-300'; // Default border color
    };

    return (
        <div className="container mx-auto px-0 py-12 bg-black min-h-screen">
            <h2 className="text-4xl text-center mb-8 text-gray-100 font-bold">Meet Other Users</h2>

            {/* Search input */}
            <div className="mb-8 flex justify-center">
                <input
                    type="text"
                    placeholder="Search for a friend..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                />
            </div>

            {/* Show cards normally when searched */}
            {searchQuery ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((otherUser) => (
                            <div
                                key={otherUser._id}
                                className="profileCard bg-gradient-to-b from-gray-900 to-black border-1 border-gray-800 hover:border-pink-500 rounded-lg px-20 py-16 shadow-lg text-center flex flex-col items-center cursor-pointer transition-all transform hover:scale-105 hover:shadow-[0_8px_20px_rgba(236,72,153,0.4)]"
                                onClick={() => handleProfileClick(otherUser._id)}
                            >
                                <img
                                    src={
                                        otherUser.photo ||
                                        'https://example.com/default-avatar.png'
                                    }
                                    alt={`${otherUser.name}'s profile`}
                                    className={`w-32 h-32 rounded-full mb-4 ${getBorderColor(otherUser.gender)} border-2 shadow-lg`}
                                />
                                <h3 className="text-xl font-bold text-gray-100">{otherUser.name}</h3>
                                <p className="text-sm text-gray-400">
                                    Location: {otherUser.location || 'Unknown'}
                                </p>
                                <p className="text-sm text-gray-300 my-2">
                                    {otherUser.bio || 'No bio available'}
                                </p>
                                <p className="text-md font-bold text-pink-400">
                                    Followers: {otherUser?.followers?.length || '0'}
                                </p>
                                <div className="flex flex-col mt-4">
                                    <button className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white font-semibold rounded-full px-6 py-3 my-4 shadow-lg shadow-pink-500/50 transition-all"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        movetomsg(otherUser._id);
                                        }}
                                        >
                                        Message
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center col-span-full py-10 text-xl text-gray-400">
                            No users found.
                        </div>
                    )}
                </div>
            ) : (
                // Show Swiper when no search query
                <Swiper
                    slidesPerView={1}
                    spaceBetween={-50}
                    navigation={true}
                    modules={[Navigation]}
                    loop={true}
                    centeredSlides={true}
                    speed={600}
                    breakpoints={{
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: -50,
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 0,
                        },
                        480: {
                            slidesPerView: 3,
                            spaceBetween: 0,
                        },
                    }}
                    className="mySwiper"
                    ref={swiperRef}
                    onSlideChange={(swiper) => {
                        const slides = swiper.slides;
                        slides.forEach((slide) => slide.classList.remove('swiper-slide-prev-prev', 'swiper-slide-next-next'));
                    
                        const activeIndex = swiper.activeIndex;
                        const prevIndex = activeIndex - 2 >= 0 ? activeIndex - 2 : slides.length - 2;
                        const nextIndex = activeIndex + 2 < slides.length ? activeIndex + 2 : 1;
                    
                        slides[prevIndex]?.classList.add('swiper-slide-prev-prev');
                        slides[nextIndex]?.classList.add('swiper-slide-next-next');
                    }}
                >
                    {allUsers.map((otherUser) => (
                        <SwiperSlide key={otherUser._id}>
                            <div
                                className="profileCard bg-gradient-to-b from-gray-900 to-black border-1 border-gray-800 hover:border-pink-500 rounded-lg px-20 py-16 shadow-lg text-center flex flex-col items-center cursor-pointer transition-all transform hover:scale-105 hover:shadow-[0_8px_20px_rgba(236,72,153,0.4)]"
                                onClick={() => handleProfileClick(otherUser._id)}
                            >
                                <img
                                    src={
                                        otherUser.photo ||
                                        'https://example.com/default-avatar.png'
                                    }
                                    alt={`${otherUser.name}'s profile`}
                                    className={`w-32 h-32 rounded-full mb-4 ${getBorderColor(otherUser.gender)} border-4 shadow-lg`}
                                />
                                <h3 className="text-xl font-bold text-gray-100">{otherUser.name}</h3>
                                <p className="text-sm text-gray-400">
                                    Location: {otherUser.location || 'Unknown'}
                                </p>
                                <p className="text-sm text-gray-300 my-2">
                                    {otherUser.bio || 'No bio available'}
                                </p>
                                <p className="text-md font-bold text-pink-400">
                                    Followers: {otherUser?.followers?.length || '0'}
                                </p>
                                <div className="flex flex-col mt-4">
                                    <button className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white font-semibold rounded-full px-6 py-3 my-4 shadow-lg shadow-pink-500/50 transition-all" 
                                    onClick={(event) => {
                                    event.stopPropagation();
                                    movetomsg(otherUser._id);
                                    }}>
                                        Message
                                    </button>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
}

export default UsersList;
