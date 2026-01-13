import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

function AdminUnverifiedUsers() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
//   console.log('Token:', token);
  const decodeduser = jwtDecode(token); 
//   console.log('Decoded user:', decodeduser.id);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/profile/${decodeduser.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const user = response.data.user;
        // console.log('Current user:', user);
        setCurrentUser(user);

        // Redirect if the user is not an admin
        if (!user.isAdmin) {
            toast.error('Unauthorized access!');
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching current user:', error.message);
        toast.error('Failed to fetch current user details.');
        setError('Failed to fetch current user details.');
        navigate('/');
      }
    };

    const fetchUnverifiedUsers = async () => {
      try {
        const response = await axios.get('http://localhost:7000/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const unverifiedUsers = response.data.filter((user) => !user.verified);
        setUsers(unverifiedUsers);
        // toast.success('Users fetched successfully.');
        setLoading(false);
      } catch (error) {
        // console.error('Error fetching users:', error.message);
        toast.error('Failed to fetch users.');
        setError('Failed to fetch users.');
        setLoading(false);
      }
    };

    fetchCurrentUser();
    fetchUnverifiedUsers();
  }, [decodeduser, navigate, token]);
  const handleVerify = async (userId) => {
    // if (!currentUser?.isAdmin) {
    //   console.error('Unauthorized action');
    //   return;
    // }
  
    try {
      await axios.put(
        `http://localhost:7000/users/verify/${userId}`,
        null, // No body needed as we're modifying verified in the backend
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Error verifying user:', error.response?.data?.message || error.message);
      toast.error('Failed to verify user.');
    }
  };
  

  const handleCopyAadhaar = (aadhaar) => {
    navigator.clipboard.writeText(aadhaar);
    toast.success('Aadhaar number copied to clipboard.');
  };

  if (!currentUser) return null; // Prevent rendering until the current user is loaded

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4 bg-gradient-to-b from-black via-dark to-lightDark2 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center">Unverified Users</h1>
      {users.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-dark border-1 border-gray-600 hover:border-gray-500 rounded-lg shadow p-4 flex flex-col items-center"
            >
              <img
                src={user.photo}
                alt={user.name}
                className="w-20 h-20 rounded-full mb-4 "
              />
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p>{user.email}</p>
              <p>{user.gender}</p>
              <p className="">
                <strong>Aadhaar:</strong> {user.aadhaarNo}
              </p> 
              <button
                onClick={() => handleCopyAadhaar(user.aadhaarNo)}
                className="bg-gray-500 text-white px-3 py-1 rounded mt-2"
              >
                Copy Aadhaar
              </button>
              <div className="flex mt-4 space-x-2">
                <a
                  href="https://myaadhaar.uidai.gov.in/check-aadhaar-validity/en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-3 py-2 rounded"
                >
                  Aadhaar Verification
                </a> 
                {/* {console.log(user._id)} */}
                <button
                  onClick={() => handleVerify(user._id)}
                  className="bg-green-500 text-white px-3 py-2 rounded"
                >
                  Mark as Verified
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No unverified users found.</p>
      )}
    </div>
  );
}

export default AdminUnverifiedUsers;
