
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useParams } from 'react-router-dom'; // To get the profile user ID from the URL

function Follow({ onFollowChange }) {
  const [isFollowing, setIsFollowing] = useState(false); // Default: not following
  const { userId } = useParams(); // Assuming profileUserId is passed via the URL
  const token = localStorage.getItem('token'); // Retrieve token from local storage

  // Decode token to get the logged-in user ID
  const loggedInUserId = jwtDecode(token).id;
  console.log('Logged-in user ID:', loggedInUserId);
  console.log('Profile user ID:', userId);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        console.log('Checking follow status...');
        const response = await axios.get(
          `http://localhost:7000/user/follow-status/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log('Follow status response:', response.data);
        setIsFollowing(response.data.isFollowing); // Update follow status
      } catch (error) {
        console.error('Error fetching follow status:', error);
      }
    };

    fetchFollowStatus();
  }, [userId, token]);

  const handleFollowToggle = async () => {
    try {
      if (!token) {
        console.error('Token is missing');
        return;
      }

      console.log('Toggling follow status...');
      const url = isFollowing
        ? `http://localhost:7000/user/unfollow/${userId}`
        : `http://localhost:7000/user/follow/${userId}`;

      const response = await axios.post(
        url,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Toggle response:', response.data.message);
      setIsFollowing(!isFollowing); // Toggle follow status
      
      // Call the callback to update parent component
      if (onFollowChange) {
        onFollowChange();
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };

  return (
    <button
      onClick={handleFollowToggle}
      className={`text-sm md:text-md font-semibold text-white px-4 py-5 rounded-full w-full ${
        isFollowing ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
      }`}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}

export default Follow;
