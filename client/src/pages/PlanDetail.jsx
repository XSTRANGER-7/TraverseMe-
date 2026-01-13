



import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import GroupChat from '../pages/GroupChat';

function PlanDetail() {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [creatorDetails, setCreatorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [ouser, setouser] = useState(false);
  const [usersDetails, setUsersDetails] = useState({}); // Store details of users wanting to join

  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const userId = jwtDecode(token).id;

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/showplans/${planId}`);
        setPlan(response.data);

        // Fetch the creator's details
        const creatorResponse = await axios.get(
          `http://localhost:7000/profile/${response.data.createdBy}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCreatorDetails(creatorResponse.data);

        // Fetch details of all users in the requests
        const userDetailsPromises = response.data.requests.map((request) =>
          axios.get(`http://localhost:7000/profile/${request.userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        );
        const usersDetailsResponses = await Promise.all(userDetailsPromises);
        const usersDetailsMap = {};
        usersDetailsResponses.forEach((res) => {
          usersDetailsMap[res.data.user._id] = res.data.user;
        });
        setUsersDetails(usersDetailsMap);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching plan details:', error);
        setError('Failed to fetch plan details. Please try again later.');
        setLoading(false);
      }
    };

    fetchPlanDetails();
  }, [planId]);

  useEffect(() => {
    if (plan && plan.createdBy === userId) {
      setouser(true);
    }
  }, [plan, userId]);

  const handleApprove = async (requserId) => {
    try {
      await axios.post(`http://localhost:7000/approve/${planId}`, {
        requserId,
        userId,
      });

      setPlan((prevPlan) => ({
        ...prevPlan,
        requests: prevPlan.requests.map((request) =>
          request.userId === requserId ? { ...request, status: 'approved' } : request
        ),
      }));
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const getBorderColor = (gender) => {
    if (gender === 'male') return 'border-blue-500';
    if (gender === 'female') return 'border-pink-500';
    return 'border-gray-300'; // Default border color
};

  if (loading) return <p>Loading plan details...</p>;
  if (error) return <p>{error}</p>;

  const pendingRequests = plan.requests.filter((request) => request.status === 'pending');
  const approvedRequests = plan.requests.filter((request) => request.status === 'approved');

  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row p-6 bg-black">
        <div className="md:w-1/2 bg-dark rounded-lg shadow-lg p-4">
          <img src={plan.photo} alt={plan.title} className="w-full h-48 object-cover rounded" />
          <h1 className="text-3xl font-bold mt-4">{plan.title}</h1>
          <p className="text-gray-200 mt-2">{plan.description}</p>
          <p className="text-gray-200">Location: {plan.location}</p>
          <p className="text-gray-200">Date: {plan.date}</p>
          <p className="text-gray-200">Timing: {plan.timing}</p>
          {creatorDetails ? (
            <div className="flex items-center mt-4">
              <img
                src={creatorDetails.user.photo}
                alt={creatorDetails.user.name}
                className={`${getBorderColor(creatorDetails.user?.gender)} w-10 h-10 border-2 rounded-full mr-2 cursor-pointer`}
                onClick={() => navigate(`/userprofile/${creatorDetails.user._id}`)}
              />
              <p className="text-gray-300">{creatorDetails.user.name}</p>
            </div>
          ) : (
            <p className="text-gray-500">Loading creator details...</p>
          )}
        </div>
        <div className='border-1 w-1/2'>
        {/* {console.log('Plan:', plan._id)} */}
        {/* {console.log('User:', userId)} */}
          <GroupChat 
          groupId = {plan._id} loggedInUserId = {userId}
          />
        </div>
      </div>
{/* <div className={`flex`}> */}

      {ouser ? (
        <div className="m-4 bg-lightDark2 p-4">
          <h1 className="text-2xl font-bold mb-4">Users Wanting to Join</h1>
          {pendingRequests.length > 0 ? (
            pendingRequests.map((request) => {
              const user = usersDetails[request.userId];
              return (
                <div key={request.userId} className="bg-dark border-1 hover:border-gray-400 border-gray-700 shadow-lg rounded-lg p-4 mb-4 flex items-center justify-between px-10" >
                 <div className='flex items-center justify-center'>
                  <img
                    src={user?.photo}
                    alt={user?.name}
                    className={`${getBorderColor(user.gender)} w-14 h-14 rounded-full mr-5 cursor-pointer border-2`}
                    onClick={() => navigate(`/userprofile/${request.userId}`)}
                  />
                  <div className='flex flex-col'>
                    <h3 className="text-2xl font-bold text-gray-100">{user?.name}</h3>
                    <p className="text-gray-200">Status: {request.status}</p>
                  </div>
                 </div>
                  <div className='flex items-center justify-center'>
                    <button
                      onClick={() => handleApprove(request.userId)}
                      className="bg-green-500 hover:bg-green-600 border-1 hover:border-gray-300 border-gray-800 text-white px-5 py-3 rounded-full mt-2"
                      >
                      Approve
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-600">No pending requests!</p>
          )}
        </div>
      ) : ( <></>
      )}
        <div className="m-4 bg-lightDark2 rounded outline-2 p-4">
          <h2 className="text-2xl font-bold mb-4">Users Who Have Joined</h2>
          {approvedRequests.map((request) => {
            const user = usersDetails[request.userId];
            return (
              <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 px-10 gap-6'> 

              <div key={request.userId} className="flex flex-col items-center mb-4 border-1 cursor-pointer rounded-lg py-4 justify-center"
              onClick={() => navigate(`/userprofile/${request.userId}`)}>
                {console.log('User:', user?.gender)}
                <img src={user?.photo} alt={user?.name} className={`${getBorderColor(user?.gender)} w-16 h-16 border-2 rounded-full mb-2`} />
                <h3 className="text-2xl font-bold text-gray-100">{user?.name}</h3>

              </div>
                </div>
            );
          })}
          </div>
        </div>
    // </div>
  );
}

export default PlanDetail;















// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';

// function PlanDetail() {
//   const { planId } = useParams();
//   const [plan, setPlan] = useState(null);
//   const [creatorDetails, setCreatorDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState('');
//   const [ouser, setouser] = useState(false);
//   const [usersDetails, setUsersDetails] = useState({});

//   const token = localStorage.getItem('token');
//   const navigate = useNavigate();
//   const userId = jwtDecode(token).id;

//   useEffect(() => {
//     const fetchPlanDetails = async () => {
//       try {
//         const response = await axios.get(`http://localhost:7000/showplans/${planId}`);
//         setPlan(response.data);

//         // Fetch the creator's details
//         const creatorResponse = await axios.get(
//           `http://localhost:7000/profile/${response.data.createdBy}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setCreatorDetails(creatorResponse.data);

//         // Fetch details of all users in the requests
//         const userDetailsPromises = response.data.requests.map((request) =>
//           axios.get(`http://localhost:7000/profile/${request.userId}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           })
//         );
//         const usersDetailsResponses = await Promise.all(userDetailsPromises);
//         const usersDetailsMap = {};
//         usersDetailsResponses.forEach((res) => {
//           usersDetailsMap[res.data.user._id] = res.data.user;
//         });
//         setUsersDetails(usersDetailsMap);

//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching plan details:', error);
//         setError('Failed to fetch plan details. Please try again later.');
//         setLoading(false);
//       }
//     };

//     fetchPlanDetails();
//   }, [planId]);

//   useEffect(() => {
//     if (plan && plan.createdBy === userId) {
//       setouser(true);
//     }
//   }, [plan, userId]);

//   const handleApprove = async (requserId) => {
//     try {
//       await axios.post(`http://localhost:7000/approve/${planId}`, {
//         requserId,
//         userId,
//       });

//       setPlan((prevPlan) => ({
//         ...prevPlan,
//         requests: prevPlan.requests.map((request) =>
//           request.userId === requserId ? { ...request, status: 'approved' } : request
//         ),
//       }));
//     } catch (error) {
//       console.error('Error approving request:', error);
//     }
//   };

//   const getBorderColor = (gender) => {
//     if (gender === 'male') return 'border-blue-500';
//     if (gender === 'female') return 'border-pink-500';
//     return 'border-gray-300';
//   };

//   if (loading) return <p>Loading plan details...</p>;
//   if (error) return <p>{error}</p>;

//   const pendingRequests = plan.requests.filter((request) => request.status === 'pending');
//   const approvedRequests = plan.requests.filter((request) => request.status === 'approved');

//   return (
//     <div className="flex flex-col">
//       <div className="flex flex-col md:flex-row p-6 bg-black">
//         <div className="md:w-1/2 bg-dark rounded-lg shadow-lg p-4">
//           <img src={plan.photo} alt={plan.title} className="w-full h-48 object-cover rounded" />
//           <h1 className="text-3xl font-bold mt-4">{plan.title}</h1>
//           <p className="text-gray-200 mt-2">{plan.description}</p>
//           <p className="text-gray-200">Location: {plan.location}</p>
//           <p className="text-gray-200">Date: {plan.date}</p>
//           <p className="text-gray-200">Timing: {plan.timing}</p>
//           {creatorDetails ? (
//             <div className="flex items-center mt-4">
//               <img
//                 src={creatorDetails.user.photo}
//                 alt={creatorDetails.user.name}
//                 className={`${getBorderColor(creatorDetails.user?.gender)} w-10 h-10 border-2 rounded-full mr-2 cursor-pointer`}
//                 onClick={() => navigate(`/userprofile/${creatorDetails.user._id}`)}
//               />
//               <p className="text-gray-300">{creatorDetails.user.name}</p>
//             </div>
//           ) : (
//             <p className="text-gray-500">Loading creator details...</p>
//           )}
//         </div>
//       </div>

//       {ouser && (
//         <div className="m-4 bg-lightDark2 p-4">
//           <h1 className="text-2xl font-bold mb-4">Users Wanting to Join</h1>
//           {pendingRequests.length > 0 ? (
//             pendingRequests.map((request) => {
//               const user = usersDetails[request.userId];
//               return (
//                 <div key={request.userId} className="bg-dark border-1 hover:border-gray-400 border-gray-700 shadow-lg rounded-lg p-4 mb-4 flex items-center justify-between px-10">
//                   <div className="flex items-center">
//                     <img
//                       src={user?.photo}
//                       alt={user?.name}
//                       className={`${getBorderColor(user.gender)} w-14 h-14 rounded-full mr-5 cursor-pointer border-2`}
//                       onClick={() => navigate(`/userprofile/${request.userId}`)}
//                     />
//                     <div className="flex flex-col">
//                       <h3 className="text-2xl font-bold text-gray-100">{user?.name}</h3>
//                       <p className="text-gray-200">Status: {request.status}</p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => handleApprove(request.userId)}
//                     className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-full mt-2"
//                   >
//                     Approve
//                   </button>
//                 </div>
//               );
//             })
//           ) : (
//             <p className="text-center text-gray-600">No pending requests!</p>
//           )}
//         </div>
//       )}

//       <div className="m-4 bg-lightDark2 rounded p-4">
//         <h2 className="text-2xl font-bold mb-4">Users Who Have Joined</h2>
//         {approvedRequests.map((request) => {
//           const user = usersDetails[request.userId];
//           return (
//             <div key={request.userId} className="flex items-center mb-4 border-1 cursor-pointer rounded-lg py-4 justify-center"
//               onClick={() => navigate(`/userprofile/${request.userId}`)}>
//               <img src={user?.photo} alt={user?.name} className={`${getBorderColor(user?.gender)} w-16 h-16 border-2 rounded-full mb-2`} />
//               <h3 className="text-2xl font-bold text-gray-100">{user?.name}</h3>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default PlanDetail;
