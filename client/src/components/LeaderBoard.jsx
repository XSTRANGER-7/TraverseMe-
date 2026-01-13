
// import React, { useState, useEffect } from "react";
// import { FaMedal } from "react-icons/fa";
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Leaderboard = () => {
//   const [allUsers, setAllUsers] = useState([]);
//   const [loggedInUser, setLoggedInUser] = useState(null); // Store logged-in user data
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//         navigate('/auth');
//         return;
//     }

//     const fetchUsers = async () => {
//         try {
//             const response = await axios.get('http://localhost:7000/leaderboard', {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             const verifiedUsers = response.data.filter(user => user.verified === true);

//             // Sort the users by badge level
//             const sortedUsers = verifiedUsers.sort((a, b) => {
//               const badgeToLevel = (badge) => parseInt(badge.replace("Level ", ""), 10);
//               return badgeToLevel(b.badge) - badgeToLevel(a.badge);
//             });

//             // Get the logged-in user and set them to state
//             const loggedInUser = sortedUsers.find(user => user.id === parseInt(localStorage.getItem('userId')));
//             setLoggedInUser(loggedInUser);

//             // Show only top 15 users
//             setAllUsers(sortedUsers.slice(0, 10));
//         } catch (error) {
//             console.error('Error fetching users:', error);
//         }
//     };

//     fetchUsers();
//   }, [navigate]);

//   return (
//     <div className="bg-gradient-to-br from-black via-lightDark to-black py-16 px-6">
//       <h2 className="text-4xl text-white font-bold text-center mb-12">Leaderboard</h2>

//       {/* Logged-In User's Rank Card */}
//       {loggedInUser && (
//         <div className="max-w-4xl mx-auto flex flex-col gap-6 mb-8">
//           <div
//             key={loggedInUser.id}
//             className="flex items-center justify-between p-6 rounded-xl shadow-lg bg-gradient-to-r backdrop-blur-10 border-1 hover:border-gray-400 border-gray-700"
//           >
//             <div className="flex items-center gap-4">
//               <span className="text-3xl font-bold text-white">Your Rank</span>
//               <FaMedal
//                 className={`text-4xl mr-4 ${
//                   loggedInUser.badge === "Level 1"
//                     ? "text-gray-500"
//                     : loggedInUser.badge === "Level 2"
//                     ? "text-gray-400"
//                     : loggedInUser.badge === "Level 3"
//                     ? "text-orange-400"
//                     : "text-yellow-500"
//                 }`}
//               />
//               <div
//                 className={`relative w-16 h-16 rounded-full border-2 ${
//                   loggedInUser.gender === "male"
//                     ? "border-blue-500"
//                     : loggedInUser.gender === "female"
//                     ? "border-pink-500"
//                     : "border-gray-400"
//                 }`}
//               >
//                 <img
//                   src={loggedInUser.photo}
//                   alt={loggedInUser.name}
//                   className="w-full h-full rounded-full object-cover"
//                 />
//               </div>
//               <h3 className="text-xl font-bold text-white">{loggedInUser.name}</h3>
//             </div>
//             <div className="flex items-center gap-4">
//               <div>
//                 <p className="text-md text-gray-300">{loggedInUser.badge}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Top 15 Users */}
//       <div className="max-w-4xl mx-auto flex flex-col gap-6">
//         {allUsers.map((user, index) => (
//           <div
//             key={user.id}
//             className={`flex items-center justify-between p-6 rounded-xl shadow-lg bg-gradient-to-r backdrop-blur-10 border-1 hover:border-gray-400 border-gray-700 ${
//               index === 0
//                 ? "from-transparent via-lightDark2 to-transparent"
//                 : index === 1
//                 ? "from-transparent via-lightDark2 to-transparent"
//                 : index === 2
//                 ? "from-transparent via-lightDark2 to-transparent"
//                 : "from-transparent via-lightDark2 to-transparent"
//             } hover:scale-105 transform transition-transform duration-300`}
//           >
//             <div className="flex items-center gap-4">
//               <span className="text-3xl font-bold text-white">{index + 1}</span>
//               <FaMedal
//                 className={`text-4xl mr-4 ${
//                   index === 0
//                     ? "text-yellow-500"
//                     : index === 1
//                     ? "text-gray-400"
//                     : index === 2
//                     ? "text-orange-400"
//                     : "text-gray-500"
//                 }`}
//               />
//               <div
//                 className={`relative w-16 h-16 rounded-full border-2 ${
//                   user.gender === "male"
//                     ? "border-blue-500"
//                     : user.gender === "female"
//                     ? "border-pink-500"
//                     : "border-gray-400"
//                 }`}
//               >
//                 <img
//                   src={user.photo}
//                   alt={user.name}
//                   className="w-full h-full rounded-full object-cover"
//                 />
//               </div>
//               <h3 className="text-xl font-bold text-white">{user.name}</h3>
//             </div>
//             <div className="flex items-center gap-4">
//               <div>
//                 <p className="text-md text-gray-300">{user.badge}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Leaderboard;














// import React, { useState, useEffect } from "react";
// import { FaMedal } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const Leaderboard = () => {
//   const [allUsers, setAllUsers] = useState([]);
//   const [loggedInUser, setLoggedInUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/auth");
//       return;
//     }

//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get("http://localhost:7000/leaderboard", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const verifiedUsers = response.data.filter((user) => user.verified === true);

//         // Sort the users by badge level
//         const sortedUsers = verifiedUsers.sort((a, b) => {
//           const badgeToLevel = (badge) => parseInt(badge.replace("Level ", ""), 10);
//           return badgeToLevel(b.badge) - badgeToLevel(a.badge);
//         });

//         // Get the logged-in user and set them to state
//         const loggedInUser = sortedUsers.find(
//           (user) => user.id === parseInt(localStorage.getItem("userId"))
//         );
//         setLoggedInUser(loggedInUser);

//         // Show only top 10 users
//         setAllUsers(sortedUsers.slice(0, 10));
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     fetchUsers();
//   }, [navigate]);

//   return (
//     <div className="bg-gradient-to-br from-black via-lightDark to-black py-16 px-6">
//       <h2 className="text-4xl text-white font-bold text-center mb-12">Leaderboard</h2>

//       {/* Top 10 Users */}
//       <div className="max-w-4xl mx-auto flex flex-col gap-6">
//         {allUsers.map((user, index) => (
//           <div
//             key={user.id}
//             className={`flex items-center justify-between p-6 rounded-xl shadow-lg bg-gradient-to-r backdrop-blur-10 border-2 ${
//               loggedInUser?.id === user.id
//                 ? "border-yellow-500" // Highlight for logged-in user
//                 : "hover:border-gray-400 border-gray-700"
//             } transform transition-transform duration-300`}
//           >
//             <div className="flex items-center gap-4">
//               <span className="text-3xl font-bold text-white">{index + 1}</span>
//               <FaMedal
//                 className={`text-4xl mr-4 ${
//                   index === 0
//                     ? "text-yellow-500"
//                     : index === 1
//                     ? "text-gray-400"
//                     : index === 2
//                     ? "text-orange-400"
//                     : "text-gray-500"
//                 }`}
//               />
//               <div
//                 className={`relative w-16 h-16 rounded-full border-2 ${
//                   user.gender === "male"
//                     ? "border-blue-500"
//                     : user.gender === "female"
//                     ? "border-pink-500"
//                     : "border-gray-400"
//                 }`}
//               >
//                 <img
//                   src={user.photo}
//                   alt={user.name}
//                   className="w-full h-full rounded-full object-cover"
//                 />
//               </div>
//               <h3 className="text-xl font-bold text-white">{user.name}</h3>
//             </div>
//             <div className="flex items-center gap-4">
//               <div>
//                 <p className="text-md text-gray-300">{user.badge}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Logged-In User's Card (if not in Top 10) */}
//       {loggedInUser && !allUsers.some((user) => user.id === loggedInUser.id) && (
//         <div className="max-w-4xl mx-auto flex flex-col gap-6 mt-8">
//           <div
//             key={loggedInUser.id}
//             className="flex items-center justify-between p-6 rounded-xl shadow-lg bg-gradient-to-r backdrop-blur-10 border-2 border-yellow-500 transform transition-transform duration-300"
//           >
//             <div className="flex items-center gap-4">
//               <span className="text-3xl font-bold text-white">Your Rank</span>
//               <FaMedal
//                 className={`text-4xl mr-4 ${
//                   loggedInUser.badge === "Level 1"
//                     ? "text-gray-500"
//                     : loggedInUser.badge === "Level 2"
//                     ? "text-gray-400"
//                     : loggedInUser.badge === "Level 3"
//                     ? "text-orange-400"
//                     : "text-yellow-500"
//                 }`}
//               />
//               <div
//                 className={`relative w-16 h-16 rounded-full border-2 ${
//                   loggedInUser.gender === "male"
//                     ? "border-blue-500"
//                     : loggedInUser.gender === "female"
//                     ? "border-pink-500"
//                     : "border-gray-400"
//                 }`}
//               >
//                 <img
//                   src={loggedInUser.photo}
//                   alt={loggedInUser.name}
//                   className="w-full h-full rounded-full object-cover"
//                 />
//               </div>
//               <h3 className="text-xl font-bold text-white">{loggedInUser.name}</h3>
//             </div>
//             <div className="flex items-center gap-4">
//               <div>
//                 <p className="text-md text-gray-300">{loggedInUser.badge}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Leaderboard;















// import React, { useState, useEffect } from "react";
// import { FaMedal } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import axios from "axios";

// const Leaderboard = () => {
//   const [allUsers, setAllUsers] = useState([]);
//   const [loggedInUser, setLoggedInUser] = useState(null); // Store logged-in user data
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const loggedInUser = jwtDecode(token);
//     // console.log("decodeduser", decodeduser);

//     if (!token) {
//       navigate("/auth");
//       return;
//     }

//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get("http://localhost:7000/leaderboard", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const verifiedUsers = response.data.filter((user) => user.verified === true);

//         // Sort the users by badge level
//         const sortedUsers = verifiedUsers.sort((a, b) => {
//           const badgeToLevel = (badge) => parseInt(badge.replace("Level ", ""), 10);
//           return badgeToLevel(b.badge) - badgeToLevel(a.badge);
//         });

//         // Get the logged-in user and set them to state
//         // const loggedInUser = sortedUsers.find(
//         //   (user) => user.id === parseInt(localStorage.getItem("userId"))
//         // );
//         console.log("loggedInUser", loggedInUser);
//         setLoggedInUser(loggedInUser);

//         // Show only top 10 users
//         setAllUsers(sortedUsers.slice(0, 10));
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     fetchUsers();
//   }, [navigate]);

//   return (
//     <div className="bg-gradient-to-br from-black via-lightDark to-black py-16 px-6">
//       <h2 className="text-4xl text-white font-bold text-center mb-12">Leaderboard</h2>

//       {/* Logged-In User's Rank Card */}
//       {loggedInUser && (
//         <div className="max-w-4xl mx-auto flex flex-col gap-6 mb-8">
//           <div
//             key={loggedInUser.id}
//             className="flex items-center justify-between p-6 rounded-xl shadow-lg bg-gradient-to-r backdrop-blur-10 border-2 hover:border-gray-400 border-gray-700"
//           >
//             <div className="flex items-center gap-4">
//               <span className="text-3xl font-bold text-white">Your Rank</span>
//               <FaMedal
//                 className={`text-4xl mr-4 ${
//                   loggedInUser.badge === "Level 1"
//                     ? "text-gray-500"
//                     : loggedInUser.badge === "Level 2"
//                     ? "text-gray-400"
//                     : loggedInUser.badge === "Level 3"
//                     ? "text-orange-400"
//                     : "text-yellow-500"
//                 }`}
//               />
//               <div
//                 className={`relative w-16 h-16 rounded-full border-2 ${
//                   loggedInUser.gender === "male"
//                     ? "border-blue-500"
//                     : loggedInUser.gender === "female"
//                     ? "border-pink-500"
//                     : "border-gray-400"
//                 }`}
//               >
//                 <img
//                   src={loggedInUser.photo}
//                   alt={loggedInUser.name}
//                   className="w-full h-full rounded-full object-cover"
//                 />
//               </div>
//               <h3 className="text-xl font-bold text-white">{loggedInUser.name}</h3>
//             </div>
//             <div className="flex items-center gap-4">
//               <div>
//                 <p className="text-md text-gray-300">{loggedInUser.badge}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Top 10 Users */}
//       <div className="max-w-4xl mx-auto flex flex-col gap-6">
//         {allUsers.map((user, index) => (
//           <div
//             key={user.id}
//             className={`flex items-center justify-between p-6 rounded-xl shadow-lg bg-gradient-to-r backdrop-blur-10 border-2 ${
//               loggedInUser?.id === user.id
//                 ? "border-yellow-500" // Highlight logged-in user
//                 : "hover:border-gray-400 border-gray-700"
//             } transform transition-transform duration-300`}
//           >
//             {console.log(loggedInUser)}
//             <div className="flex items-center gap-4">
//               <span className="text-3xl font-bold text-white">{index + 1}</span>
//               <FaMedal
//                 className={`text-4xl mr-4 ${
//                   index === 0
//                     ? "text-yellow-500"
//                     : index === 1
//                     ? "text-gray-400"
//                     : index === 2
//                     ? "text-orange-400"
//                     : "text-gray-500"
//                 }`}
//               />
//               <div
//                 className={`relative w-16 h-16 rounded-full border-2 ${
//                   user.gender === "male"
//                     ? "border-blue-500"
//                     : user.gender === "female"
//                     ? "border-pink-500"
//                     : "border-gray-400"
//                 }`}
//               >
//                 <img
//                   src={user.photo}
//                   alt={user.name}
//                   className="w-full h-full rounded-full object-cover"
//                 />
//               </div>
//               <h3 className="text-xl font-bold text-white">{user.name}</h3>
//             </div>
//             <div className="flex items-center gap-4">
//               <div>
//                 <p className="text-md text-gray-300">{user.badge}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* If Logged-in User is not in the Top 10, show them below the leaderboard */}
//       {loggedInUser && !allUsers.some((user) => user.id === loggedInUser.id) && (
//         <div className="max-w-4xl mx-auto flex flex-col gap-6 mt-8">
//           <h3 className="text-2xl text-white font-bold mb-4">Your Rank</h3>
//           <div
//             className="flex items-center justify-between p-6 rounded-xl shadow-lg bg-gradient-to-r backdrop-blur-10 border-2 hover:border-gray-400 border-gray-700"
//           >
//             <div className="flex items-center gap-4">
//               <span className="text-3xl font-bold text-white">Out of Top 10</span>
//               <FaMedal
//                 className={`text-4xl mr-4 ${
//                   loggedInUser.badge === "Level 1"
//                     ? "text-gray-500"
//                     : loggedInUser.badge === "Level 2"
//                     ? "text-gray-400"
//                     : loggedInUser.badge === "Level 3"
//                     ? "text-orange-400"
//                     : "text-yellow-500"
//                 }`}
//               />
//               <div
//                 className={`relative w-16 h-16 rounded-full border-2 ${
//                   loggedInUser.gender === "male"
//                     ? "border-blue-500"
//                     : loggedInUser.gender === "female"
//                     ? "border-pink-500"
//                     : "border-gray-400"
//                 }`}
//               >
//                 <img
//                   src={loggedInUser.photo}
//                   alt={loggedInUser.name}
//                   className="w-full h-full rounded-full object-cover"
//                 />
//               </div>
//               <h3 className="text-xl font-bold text-white">{loggedInUser.name}</h3>
//             </div>
//             <div className="flex items-center gap-4">
//               <div>
//                 <p className="text-md text-gray-300">{loggedInUser.badge}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Leaderboard;




















// import React, { useState, useEffect } from "react";
// import { FaMedal } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import {jwtDecode} from "jwt-decode";
// import axios from "axios";

// const Leaderboard = () => {
//   const [allUsers, setAllUsers] = useState([]);
//   const [loggedInUser, setLoggedInUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       navigate("/auth");
//       return;
//     }

//     const decodedUser = jwtDecode(token);
//     setLoggedInUser(decodedUser);

//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get("http://localhost:7000/leaderboard", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const verifiedUsers = response.data.filter((user) => user.verified === true);

//         // Sort the users by badge level
//         const sortedUsers = verifiedUsers.sort((a, b) => {
//           const badgeToLevel = (badge) => parseInt(badge.replace("Level ", ""), 10);
//           return badgeToLevel(b.badge) - badgeToLevel(a.badge);
//         });

//         setAllUsers(sortedUsers.slice(0, 10));
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     fetchUsers();
//   }, [navigate]);

//   const isLoggedInUserInTop10 = loggedInUser && allUsers.some((user) => user.id === loggedInUser.id);

//   return (
//     <div className="bg-gradient-to-br from-black via-lightDark to-black py-16 px-6">
//       <h2 className="text-4xl text-white font-bold text-center mb-12">Leaderboard</h2>

//       {/* Top 10 Users */}
//       <div className="max-w-4xl mx-auto flex flex-col gap-6">
//         {allUsers.map((user, index) => (
//           <div
//           key={user.id}
//           className={`flex items-center justify-between p-6 rounded-xl shadow-lg bg-gradient-to-r backdrop-blur-10 border-2 ${
//             loggedInUser?.id === user.id
//             ? "border-yellow-500" // Highlight logged-in user
//             : "hover:border-gray-400 border-gray-700"
//             } transform transition-transform duration-300`}
//             > 
//             {console.log("gg",user.id)}

//             <div className="flex items-center gap-4">
//               <span className="text-3xl font-bold text-white">{index + 1}</span>
//               <FaMedal
//                 className={`text-4xl mr-4 ${
//                   index === 0
//                     ? "text-yellow-500"
//                     : index === 1
//                     ? "text-gray-400"
//                     : index === 2
//                     ? "text-orange-400"
//                     : "text-gray-500"
//                 }`}
//               />
//               <div
//                 className={`relative w-16 h-16 rounded-full border-2 ${
//                   user.gender === "male"
//                     ? "border-blue-500"
//                     : user.gender === "female"
//                     ? "border-pink-500"
//                     : "border-gray-400"
//                 }`}
//               >
//                 <img
//                   src={user.photo}
//                   alt={user.name}
//                   className="w-full h-full rounded-full object-cover"
//                 />
//               </div>
//               <h3 className="text-xl font-bold text-white">{user.name}</h3>
//             </div>
//             <div className="flex items-center gap-4">
//               <div>
//                 <p className="text-md text-gray-300">{user.badge}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* If Logged-in User is not in the Top 10, show their card below */}
//       {!isLoggedInUserInTop10 && loggedInUser && (
//         <div className="max-w-4xl mx-auto flex flex-col gap-6 mt-8">
//           <h3 className="text-2xl text-white font-bold mb-4">Your Rank</h3>
//           <div
//             className="flex items-center justify-between p-6 rounded-xl shadow-lg bg-gradient-to-r backdrop-blur-10 border-2 border-yellow-500"
//           >
//             <div className="flex items-center gap-4">
//               <span className="text-3xl font-bold text-white">Out of Top 10</span>
//               <FaMedal
//                 className={`text-4xl mr-4 ${
//                   loggedInUser.badge === "Level 1"
//                     ? "text-gray-500"
//                     : loggedInUser.badge === "Level 2"
//                     ? "text-gray-400"
//                     : loggedInUser.badge === "Level 3"
//                     ? "text-orange-400"
//                     : "text-yellow-500"
//                 }`}
//               />
//               <div
//                 className={`relative w-16 h-16 rounded-full border-2 ${
//                   loggedInUser.gender === "male"
//                     ? "border-blue-500"
//                     : loggedInUser.gender === "female"
//                     ? "border-pink-500"
//                     : "border-gray-400"
//                 }`}
//               >
//                 <img
//                   src={loggedInUser.photo}
//                   alt={loggedInUser.name}
//                   className="w-full h-full rounded-full object-cover"
//                 />
//               </div>
//               <h3 className="text-xl font-bold text-white">{loggedInUser.name}</h3>
//             </div>
//             <div className="flex items-center gap-4">
//               <div>
//                 <p className="text-md text-gray-300">{loggedInUser.badge}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Leaderboard;










// import React, { useState, useEffect } from "react";
// import { FaMedal } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import {jwtDecode} from "jwt-decode";
// import axios from "axios";

// const Leaderboard = () => {
//   const [allUsers, setAllUsers] = useState([]);
//   const [loggedInUser, setLoggedInUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       navigate("/auth");
//       return;
//     }

//     const decodedUser = jwtDecode(token);
//     setLoggedInUser(decodedUser);

//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get("http://localhost:7000/leaderboard", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const verifiedUsers = response.data.filter((user) => user.verified === true);

//         // Sort the users by badge level
//         const sortedUsers = verifiedUsers.sort((a, b) => {
//           const badgeToLevel = (badge) => parseInt(badge.replace("Level ", ""), 10);
//           return badgeToLevel(b.badge) - badgeToLevel(a.badge);
//         });

//         setAllUsers(sortedUsers.slice(0, 10));
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     fetchUsers();
//   }, [navigate]);

//   const isLoggedInUserInTop10 =
//     loggedInUser && allUsers.some((user) => user.id === loggedInUser.id);

//   return (
//     <div className="bg-gradient-to-br from-black via-lightDark to-black py-16 px-6">
//       <h2 className="text-4xl text-white font-bold text-center mb-12">Leaderboard</h2>

//       {/* Top 10 Users */}
//       <div className="max-w-4xl mx-auto flex flex-col gap-6">
//         {allUsers.map((user, index) => (
//           <div
//             key={user.id}
//             className={`flex items-center justify-between p-6 rounded-xl shadow-lg bg-gradient-to-r backdrop-blur-10 border-2 ${
//               loggedInUser?.id === user.id
//                 ? "border-yellow-500" // Highlight logged-in user
//                 : "hover:border-gray-400 border-gray-700"
//             } transform transition-transform duration-300`}
//           >
//             <div className="flex items-center gap-4">
//               <span className="text-3xl font-bold text-white">{index + 1}</span>
//               <FaMedal
//                 className={`text-4xl mr-4 ${
//                   index === 0
//                     ? "text-yellow-500"
//                     : index === 1
//                     ? "text-gray-400"
//                     : index === 2
//                     ? "text-orange-400"
//                     : "text-gray-500"
//                 }`}
//               />
//               <div
//                 className={`relative w-16 h-16 rounded-full border-2 ${
//                   user.gender === "male"
//                     ? "border-blue-500"
//                     : user.gender === "female"
//                     ? "border-pink-500"
//                     : "border-gray-400"
//                 }`}
//               >
//                 <img
//                   src={user.photo}
//                   alt={user.name}
//                   className="w-full h-full rounded-full object-cover"
//                 />
//               </div>
//               <h3 className="text-xl font-bold text-white">{user.name}</h3>
//             </div>
//             <div className="flex items-center gap-4">
//               <div>
//                 <p className="text-md text-gray-300">{user.badge}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* If Logged-in User is not in the Top 10, show their card below */}
//       {!isLoggedInUserInTop10 && loggedInUser && (
//         <div className="max-w-4xl mx-auto flex flex-col gap-6 mt-8">
//           <h3 className="text-2xl text-white font-bold mb-4">Your Rank</h3>
//           <div className="flex items-center justify-between p-6 rounded-xl shadow-lg bg-gradient-to-r backdrop-blur-10 border-2 border-yellow-500">
//             <div className="flex items-center gap-4">
//               <span className="text-3xl font-bold text-white">Out of Top 10</span>
//               <FaMedal
//                 className={`text-4xl mr-4 ${
//                   loggedInUser.badge === "Level 1"
//                     ? "text-gray-500"
//                     : loggedInUser.badge === "Level 2"
//                     ? "text-gray-400"
//                     : loggedInUser.badge === "Level 3"
//                     ? "text-orange-400"
//                     : "text-yellow-500"
//                 }`}
//               />
//               <div
//                 className={`relative w-16 h-16 rounded-full border-2 ${
//                   loggedInUser.gender === "male"
//                     ? "border-blue-500"
//                     : loggedInUser.gender === "female"
//                     ? "border-pink-500"
//                     : "border-gray-400"
//                 }`}
//               >
//                 <img
//                   src={loggedInUser.photo}
//                   alt={loggedInUser.name}
//                   className="w-full h-full rounded-full object-cover"
//                 />
//               </div>
//               <h3 className="text-xl font-bold text-white">{loggedInUser.name}</h3>
//             </div>
//             <div className="flex items-center gap-4">
//               <div>
//                 <p className="text-md text-gray-300">{loggedInUser.badge}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Leaderboard;












// import React, { useState, useEffect } from "react";
// import { FaMedal } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import {jwtDecode} from "jwt-decode";
// import axios from "axios";

// const Leaderboard = () => {
//   const [topUsers, setTopUsers] = useState([]); // For top 10 users
//   const [loggedInUser, setLoggedInUser] = useState(null); // For logged-in user details
//   const [loggedInUserRank, setLoggedInUserRank] = useState(null); // For logged-in user rank if not in top 10
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       navigate("/auth");
//       return;
//     }

//     const decodedUser = jwtDecode(token);
//     setLoggedInUser(decodedUser.id);
//     // console.log("decodedUssssser", decodedUser);

//     const fetchLeaderboardData = async () => {
//       try {
//         const response = await axios.get("http://localhost:7000/leaderboard", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const verifiedUsers = response.data.filter((user) => user.verified === true);

//         // Sort the users by badge level
//         const sortedUsers = verifiedUsers.sort((a, b) => {
//           const badgeToLevel = (badge) => parseInt(badge.replace("Level ", ""), 10);
//           return badgeToLevel(b.badge) - badgeToLevel(a.badge);
//         });

        
//         // Set top 10 users
//         // console.log("sortedUsers", sortedUsers.slice(0, 10));
//         setTopUsers(sortedUsers.slice(0, 10));
        
//         // Check if logged-in user is in the leaderboard
//         // console.log("decodedUser", decodedUser.id); 
        
//         // const userRank = sortedUsers.findIndex((user) => user.id === decodedUser.id) +1;
//         // console.log("userRssank", userRank);
        
//         // if (userRank > 10) {
//           //   setLoggedInUserRank({ rank: userRank, user: sortedUsers[userRank - 1] });
//           // }
          
//         } catch (error) {
//           console.error("Error fetching users:", error);
//         }
//       };

//       const loggedinuserrankdata = async () => {
  
//        try{
//         const loggedinuserdata = await axios.get(`http://localhost:7000/profile/${decodedUser.id}`,{
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         // console.log("loggedinuserdataaa",loggedinuserdata.data.user); 
//         console.log("loggedinuserdataaa",loggedInUser);
//         setLoggedInUserRank({ rank: loggedinuserdata.data.user.rank, user: loggedinuserdata.data.user });
//         console.log("loggedInUserRankkkkk",loggedInUserRank);

//         // if(loggedinuserrankdata<=10){
//         //   // setLoggedInUser(loggedinuserdata.data.user);
//         // }
//         // console.log("llllllloggedInUser",loggedInUser);

//        }
//         catch (error) {
//           console.error("Error fetching users:", error);
//         }
//         }  



//       fetchLeaderboardData();
//       loggedinuserrankdata();
//     }, [navigate]);
    
//     // console.log("fff",loggedInUserRank);

//   return (
//     <div className="bg-gradient-to-br from-black via-lightDark to-black py-16 px-6">
//       <h2 className="text-4xl text-white font-bold text-center mb-12">Leaderboard</h2>

//       {/* Top 10 Users */}
//       {/* <div className="max-w-4xl mx-auto flex flex-col gap-6">
//         {topUsers.map((user, index) => (
//           <div
//             key={user.id}
//             className={`flex items-center justify-between p-6 rounded-xl shadow-lg bg-gradient-to-r backdrop-blur-10 border-2 ${
//               loggedInUser?.id === user.id
//                 ? "border-yellow-500" // Highlight logged-in user
//                 : "hover:border-gray-400 border-gray-700"
//             } transform transition-transform duration-300`}
//           >
//             <div className="flex items-center gap-4">
//               <span className="text-3xl font-bold text-white">{index + 1}</span>
//               <FaMedal
//                 className={`text-4xl mr-4 ${
//                   index === 0
//                     ? "text-yellow-500"
//                     : index === 1
//                     ? "text-gray-400"
//                     : index === 2
//                     ? "text-orange-400"
//                     : "text-gray-500"
//                 }`}
//               />
//               <div
//                 className={`relative w-16 h-16 rounded-full border-2 ${
//                   user.gender === "male"
//                     ? "border-blue-500"
//                     : user.gender === "female"
//                     ? "border-pink-500"
//                     : "border-gray-400"
//                 }`}
//               >
//                 <img
//                   src={user.photo}
//                   alt={user.name}
//                   className="w-full h-full rounded-full object-cover"
//                 />
//               </div>
//               <h3 className="text-xl font-bold text-white">{user.name}</h3>
//             </div>
//             <div className="flex items-center gap-4">
//               <div>
//                 <p className="text-md text-gray-300">{user.badge}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div> */}

//       {loggedInUser}

//       {/* If Logged-in User is not in the Top 10, show their card below */}
//       {loggedInUserRank && (
//         <div className="max-w-4xl mx-auto flex flex-col gap-6 mt-8">
//           <h3 className="text-2xl text-white font-bold mb-4">Your Rank</h3>
//           <div className="flex items-center justify-between p-6 rounded-xl shadow-lg bg-gradient-to-r backdrop-blur-10 border-2 border-yellow-500">
//             <div className="flex items-center gap-4">
//               <span className="text-3xl font-bold text-white">{loggedInUserRank.rank}</span>
//               <FaMedal
//                 className={`text-4xl mr-4 ${
//                   loggedInUserRank.user.badge === "Level 1"
//                     ? "text-gray-500"
//                     : loggedInUserRank.user.badge === "Level 2"
//                     ? "text-gray-400"
//                     : loggedInUserRank.user.badge === "Level 3"
//                     ? "text-orange-400"
//                     : "text-yellow-500"
//                 }`}
//               />
//               <div
//                 className={`relative w-16 h-16 rounded-full border-2 ${
//                   loggedInUserRank.user.gender === "male"
//                     ? "border-blue-500"
//                     : loggedInUserRank.user.gender === "female"
//                     ? "border-pink-500"
//                     : "border-gray-400"
//                 }`}
//               >
//                 <img
//                   src={loggedInUserRank.user.photo}
//                   alt={loggedInUserRank.user.name}
//                   className="w-full h-full rounded-full object-cover"
//                 />
//               </div>
//               <h3 className="text-xl font-bold text-white">{loggedInUserRank.user.name}</h3>
//             </div>
//             <div className="flex items-center gap-4">
//               <div>
//                 <p className="text-md text-gray-300">{loggedInUserRank.user.badge}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Leaderboard;








// import React, { useState, useEffect } from "react";
// import { FaMedal } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import {jwtDecode} from "jwt-decode";
// import axios from "axios";

// const Leaderboard = () => {
//   const [topUsers, setTopUsers] = useState([]); // For top 10 users
//   const [loggedInUser, setLoggedInUser] = useState(null); // For logged-in user details
//   const [loggedInUserRank, setLoggedInUserRank] = useState(null); // For logged-in user rank if not in top 10
//   const [userInRanked, setUserInRanked] = useState(false); // To check if user is in top 10
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       navigate("/auth");
//       return;
//     }

//     const decodedUser = jwtDecode(token);
//     setLoggedInUser(decodedUser.id);

//     const fetchLeaderboardData = async () => {
//       try {
//         const response = await axios.get("http://localhost:7000/leaderboard", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const verifiedUsers = response.data.filter((user) => user.verified === true);

//         // Sort the users by badge level
//         const sortedUsers = verifiedUsers.sort((a, b) => {
//           const badgeToLevel = (badge) => parseInt(badge.replace("Level ", ""), 10);
//           return badgeToLevel(b.badge) - badgeToLevel(a.badge);
//         });

//         // Set top 10 users
//         setTopUsers(sortedUsers.slice(0, 10));

//         // Check if logged-in user is in the leaderboard
//         // const userRank = sortedUsers.findIndex((user) => user.id === decodedUser.id);
//         const loggedInUserDetails = await axios.get(
//           `http://localhost:7000/profile/${decodedUser.id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setLoggedInUserRank({
//           rank: loggedInUserDetails.data.user.rank,
//           user: loggedInUserDetails.data.user,
//         });
//         console.log("loggedInUserRank", loggedInUserRank);
//         const userRank = loggedInUserRank.rank;

//         console.log("userRank", userRank);
//         if (userRank > 0 && userRank <= 10) {
//           setUserInRanked(true);
//         } else {
//           setUserInRanked(false);
//         } 
//         console.log("userInRanked", userInRanked);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     fetchLeaderboardData();
//   }, [navigate]);

//   return (
//     <div className="bg-gradient-to-br from-black via-lightDark to-black py-16 px-6">
//       <h2 className="text-4xl text-white font-bold text-center mb-12">Leaderboard</h2>

//       {/* {userInRanked ? ( */}
//         <div className="max-w-4xl mx-auto flex flex-col gap-6">
//         {topUsers.map((user, index) => (
//           <div
//             key={user.id}
//             className={`flex items-center justify-between p-6 rounded-xl shadow-lg bg-gradient-to-r backdrop-blur-10 border-2 ${
//               loggedInUser === user.id
//                 ? "border-yellow-500" // Highlight logged-in user in top 10
//                 : "hover:border-gray-400 border-gray-700"
//             } transform transition-transform duration-300`}
//           >
//             <div className="flex items-center gap-4">
//               <span className="text-3xl font-bold text-white">{index + 1}</span>
//               <FaMedal
//                 className={`text-4xl mr-4 ${
//                   index === 0
//                     ? "text-yellow-500"
//                     : index === 1
//                     ? "text-gray-400"
//                     : index === 2
//                     ? "text-orange-400"
//                     : "text-gray-500"
//                 }`}
//               />
//               <div
//                 className={`relative w-16 h-16 rounded-full border-2 ${
//                   user.gender === "male"
//                     ? "border-blue-500"
//                     : user.gender === "female"
//                     ? "border-pink-500"
//                     : "border-gray-400"
//                 }`}
//               >
//                 <img
//                   src={user.photo}
//                   alt={user.name}
//                   className="w-full h-full rounded-full object-cover"
//                 />
//               </div>
//               <h3 className="text-xl font-bold text-white">{user.name}</h3>
//             </div>
//             <div className="flex items-center gap-4">
//               <div>
//                 <p className="text-md text-gray-300">{user.badge}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//       {/* ) : ( */}
//         <div>
//             {/* {!userInRanked && loggedInUserRank && (
//         <div className="max-w-4xl mx-auto flex flex-col gap-6 mt-8">
//           <h3 className="text-2xl text-white font-bold mb-4">Your Rank</h3>
//           <div className="flex items-center justify-between p-6 rounded-xl shadow-lg bg-gradient-to-r backdrop-blur-10 border-2 border-yellow-500">
//             <div className="flex items-center gap-4">
//               <span className="text-3xl font-bold text-white">{loggedInUserRank}</span>
//               <FaMedal
//                 className={`text-4xl mr-4 text-gray-500`}
//               />
//               <div
//                 className={`relative w-16 h-16 rounded-full border-2 ${
//                   loggedInUserRank.user.gender === "male"
//                     ? "border-blue-500"
//                     : loggedInUserRank.user.gender === "female"
//                     ? "border-pink-500"
//                     : "border-gray-400"
//                 }`}
//               >
//                 <img
//                   src={loggedInUserRank.user.photo}
//                   alt={loggedInUserRank.user.name}
//                   className="w-full h-full rounded-full object-cover"
//                 />
//               </div>
//               <h3 className="text-xl font-bold text-white">{loggedInUserRank.user.name}</h3>
//             </div>
//             <div className="flex items-center gap-4">
//               <div>
//                 <p className="text-md text-gray-300">{loggedInUserRank.user.badge}</p>
//               </div>
//             </div>
//           </div>
//         </div> */}

// {/* <div className="max-w-4xl mx-auto flex flex-col gap-6">
//         {topUsers.map((user, index) => (
//           <div
//             key={user.id}
//             className={`flex items-center justify-between p-6 rounded-xl shadow-lg bg-gradient-to-r backdrop-blur-10 border-2 ${
//               loggedInUser === user.id
//                 ? "border-yellow-500" // Highlight logged-in user in top 10
//                 : "hover:border-gray-400 border-gray-700"
//             } transform transition-transform duration-300`}
//           >
//             <div className="flex items-center gap-4">
//               <span className="text-3xl font-bold text-white">{index + 1}</span>
//               <FaMedal
//                 className={`text-4xl mr-4 ${
//                   index === 0
//                     ? "text-yellow-500"
//                     : index === 1
//                     ? "text-gray-400"
//                     : index === 2
//                     ? "text-orange-400"
//                     : "text-gray-500"
//                 }`}
//               />
//               <div
//                 className={`relative w-16 h-16 rounded-full border-2 ${
//                   user.gender === "male"
//                     ? "border-blue-500"
//                     : user.gender === "female"
//                     ? "border-pink-500"
//                     : "border-gray-400"
//                 }`}
//               >
//                 <img
//                   src={user.photo}
//                   alt={user.name}
//                   className="w-full h-full rounded-full object-cover"
//                 />
//               </div>
//               <h3 className="text-xl font-bold text-white">{user.name}</h3>
//             </div>
//             <div className="flex items-center gap-4">
//               <div>
//                 <p className="text-md text-gray-300">{user.badge}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div> */}
//       {console.log("looooooooo", !userInRanked)}

// {/* {!userInRanked && loggedInUserRank && loggedInUserRank.user && ( */}
// {!userInRanked ? (
//   <div className="max-w-4xl mx-auto flex flex-col gap-6 mt-8">
//     <h3 className="text-2xl text-white font-bold mb-4">Your Rank</h3>
//     <div className="flex items-center justify-between p-6 rounded-xl shadow-lg bg-gradient-to-r backdrop-blur-10 border-2 border-yellow-500">
//       <div className="flex items-center gap-4">
//         <span className="text-3xl font-bold text-white">{loggedInUserRank.rank}</span>
//         <FaMedal className={`text-4xl mr-4 text-gray-500`} />
//         <div
//           className={`relative w-16 h-16 rounded-full border-2 ${
//             loggedInUserRank.user.gender === "male"
//               ? "border-blue-500"
//               : loggedInUserRank.user.gender === "female"
//               ? "border-pink-500"
//               : "border-gray-400"
//           }`}
//         >
//           <img
//             src={loggedInUserRank.user.photo}
//             alt={loggedInUserRank.user.name}
//             className="w-full h-full rounded-full object-cover"
//           />
//         </div>
//         <h3 className="text-xl font-bold text-white">{loggedInUserRank.user.name}</h3>
//       </div>
//       <div className="flex items-center gap-4">
//         <div>
//           <p className="text-md text-gray-300">{loggedInUserRank.user.badge}</p>
//         </div>
//       </div>
//     </div>
//   </div>
// ) : (
//   <div>
//     <h1>d</h1>
//   </div>
// )}
 
//         </div>
//       {/* )}  */}
    
//     </div>
//   );
// };

// export default Leaderboard;


// import React, { useState, useEffect } from "react";
// import { FaMedal } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import {jwtDecode} from "jwt-decode";
// import axios from "axios";

// const Leaderboard = () => {
//   const [topUsers, setTopUsers] = useState([]); // For top 10 users
//   const [loggedInUser, setLoggedInUser] = useState(null); // For logged-in user details
//   const [loggedInUserRank, setLoggedInUserRank] = useState(null); // For logged-in user rank if not in top 10
//   const [userInRanked, setUserInRanked] = useState(false); // To check if user is in top 10
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       navigate("/auth");
//       return;
//     }

//     const decodedUser = jwtDecode(token);
//     setLoggedInUser(decodedUser.id);

//     const fetchLeaderboardData = async () => {
//       try {
//         const response = await axios.get("http://localhost:7000/leaderboard", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const verifiedUsers = response.data.filter((user) => user.verified === true);

//         // Sort the users by badge level
//         const sortedUsers = verifiedUsers.sort((a, b) => {
//           const badgeToLevel = (badge) => parseInt(badge.replace("Level ", ""), 10);
//           return badgeToLevel(b.badge) - badgeToLevel(a.badge);
//         });

//         // Set top 10 users
//         setTopUsers(sortedUsers.slice(0, 10)); 
//         const loggedInUserDetails = await axios.get(
//           `http://localhost:7000/profile/${decodedUser.id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setLoggedInUserRank({
//           rank: loggedInUserDetails.data.user.rank,
//           user: loggedInUserDetails.data.user,
//         });
//         console.log("loggedInUserRank", loggedInUserRank);
//         const userRank = loggedInUserRank.rank;

//         console.log("userRank", userRank);
//         if (userRank > 0 && userRank <= 10) {
//           setUserInRanked(true);
//         } else {
//           setUserInRanked(false);
//         } 
//         console.log("userInRanked", userInRanked);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     fetchLeaderboardData();
//   }, [navigate]);

//   return (
//     <div className="bg-gradient-to-br from-black via-lightDark to-black py-16 px-6">
//       <h2 className="text-4xl text-white font-bold text-center mb-12">Leaderboard</h2>

//       {/* {userInRanked ? ( */}
//         <div className="max-w-4xl mx-auto flex flex-col gap-6">
//         {topUsers.map((user, index) => (
//           <div
//             key={user.id}
//             className={`flex items-center justify-between p-6 rounded-xl shadow-lg bg-gradient-to-r backdrop-blur-10 border-2 ${
//               loggedInUser === user.id
//                 ? "border-yellow-500" // Highlight logged-in user in top 10
//                 : "hover:border-gray-400 border-gray-700"
//             } transform transition-transform duration-300`}
//           >
//             <div className="flex items-center gap-4">
//               <span className="text-3xl font-bold text-white">{index + 1}</span>
//               <FaMedal
//                 className={`text-4xl mr-4 ${
//                   index === 0
//                     ? "text-yellow-500"
//                     : index === 1
//                     ? "text-gray-400"
//                     : index === 2
//                     ? "text-orange-400"
//                     : "text-gray-500"
//                 }`}
//               />
//               <div
//                 className={`relative w-16 h-16 rounded-full border-2 ${
//                   user.gender === "male"
//                     ? "border-blue-500"
//                     : user.gender === "female"
//                     ? "border-pink-500"
//                     : "border-gray-400"
//                 }`}
//               >
//                 <img
//                   src={user.photo}
//                   alt={user.name}
//                   className="w-full h-full rounded-full object-cover"
//                 />
//               </div>
//               <h3 className="text-xl font-bold text-white">{user.name}</h3>
//             </div>
//             <div className="flex items-center gap-4">
//               <div>
//                 <p className="text-md text-gray-300">{user.badge}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div> 
//         <div> 

//         {!userInRanked ? (
//   <div className="max-w-4xl mx-auto flex flex-col gap-6 mt-8">
//     <h3 className="text-2xl text-white font-bold mb-4">Your Rank</h3>
//     {loggedInUserRank ? (
//       <div className="flex items-center justify-between p-6 rounded-xl shadow-lg bg-gradient-to-r backdrop-blur-10 border-2 border-yellow-500">
//         <div className="flex items-center gap-4">
//           <span className="text-3xl font-bold text-white">{loggedInUserRank.rank}</span>
//           <FaMedal className={`text-4xl mr-4 text-gray-500`} />
//           <div
//             className={`relative w-16 h-16 rounded-full border-2 ${
//               loggedInUserRank.user.gender === "male"
//                 ? "border-blue-500"
//                 : loggedInUserRank.user.gender === "female"
//                 ? "border-pink-500"
//                 : "border-gray-400"
//             }`}
//           >
//             <img
//               src={loggedInUserRank.user.photo}
//               alt={loggedInUserRank.user.name}
//               className="w-full h-full rounded-full object-cover"
//             />
//           </div>
//           <h3 className="text-xl font-bold text-white">{loggedInUserRank.user.name}</h3>
//         </div>
//         <div className="flex items-center gap-4">
//           <div>
//             <p className="text-md text-gray-300">{loggedInUserRank.user.badge}</p>
//           </div>
//         </div>
//       </div>
//     ) : (
//       <p className="text-gray-300">Fetching your rank...</p>
//     )}
//   </div>
// ) : (
//   <div>
//     <h1>d</h1>
//   </div>
// )}

//         </div> 
//     </div>
//   );
// };

// export default Leaderboard;















import React, { useState, useEffect } from "react";
import { FaMedal } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import axios from "axios";

const Leaderboard = () => {
  const [topUsers, setTopUsers] = useState([]); // Top 10 users
  const [loggedInUserRank, setLoggedInUserRank] = useState(null); // Logged-in user details
  const [userInRanked, setUserInRanked] = useState(false); // Check if user is in top 10
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/auth");
      return;
    }

    const decodedUser = jwtDecode(token);
    const userId = decodedUser.id;

    const fetchLeaderboardData = async () => {
      try {
        // Fetch leaderboard data
        const leaderboardResponse = await axios.get("http://localhost:7000/leaderboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const verifiedUsers = leaderboardResponse.data.filter((user) => user.verified === true);

        // Sort users by badge level
        const sortedUsers = verifiedUsers.sort((a, b) => {
          const badgeToLevel = (badge) => parseInt(badge.replace("Level ", ""), 10);
          return badgeToLevel(b.badge) - badgeToLevel(a.badge);
        });

        setTopUsers(sortedUsers.slice(0, 10));

        // Check if logged-in user is in the top 10
        const userInTop10 = sortedUsers.some((user) => user.id === userId);
        setUserInRanked(userInTop10);

        // Fetch logged-in user's rank if not in top 10
        if (!userInTop10) {
          const userResponse = await axios.get(`http://localhost:7000/profile/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setLoggedInUserRank({
            rank: userResponse.data.user.rank,
            user: userResponse.data.user,
          });
        }
        console.log("loggedInUserRank", loggedInUserRank.user._id);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchLeaderboardData();
  }, [navigate]);

  return (
    <div className="bg-gradient-to-br from-black via-lightDark to-black py-16 px-6">
      <h2 className="text-4xl text-white font-bold text-center mb-12">Leaderboard</h2>

      {/* Display Top 10 Users */}
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {topUsers.map((user, index) => (
          <div
            key={user.id}
            className={`flex items-center justify-between p-6 rounded-xl shadow-lg bg-gradient-to-r backdrop-blur-10 border-2 ${
              loggedInUserRank?.user?._id === user.id
                ? "border-yellow-500"
                : "hover:border-gray-400 border-gray-700"
            } transform transition-transform duration-300`}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-white">{index + 1}</span>
              <FaMedal
                className={`text-4xl mr-4 ${
                  index === 0
                    ? "text-yellow-500"
                    : index === 1
                    ? "text-gray-400"
                    : index === 2
                    ? "text-orange-400"
                    : "text-gray-500"
                }`}
              />
              <div
                className={`relative w-16 h-16 rounded-full border-2 ${
                  user.gender === "male"
                    ? "border-blue-500"
                    : user.gender === "female"
                    ? "border-pink-500"
                    : "border-gray-400"
                }`}
              >
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white">{user.name}</h3>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-md text-gray-300">{user.badge}</p>
            </div>
          </div>
        ))}
       
      </div>

      {/* Display Logged-in User's Rank if Not in Top 10 */}
      {!userInRanked && loggedInUserRank && (
        <div className="max-w-4xl mx-auto flex flex-col gap-6 mt-8">
          <h3 className="text-2xl text-white font-bold mb-4">Your Rank</h3>
          <div className="flex items-center justify-between p-6 rounded-xl shadow-lg bg-gradient-to-r backdrop-blur-10 border-2 border-yellow-500">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-white">{loggedInUserRank.rank}</span>
              <FaMedal className="text-4xl mr-4 text-gray-500" />
              <div
                className={`relative w-16 h-16 rounded-full border-2 ${
                  loggedInUserRank.user.gender === "male"
                    ? "border-blue-500"
                    : loggedInUserRank.user.gender === "female"
                    ? "border-pink-500"
                    : "border-gray-400"
                }`}
              >
                <img
                  src={loggedInUserRank.user.photo}
                  alt={loggedInUserRank.user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white">{loggedInUserRank.user.name}</h3>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-md text-gray-300">{loggedInUserRank.user.badge}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
