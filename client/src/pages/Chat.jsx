






// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { openDB } from "idb";
// import { FiSend } from "react-icons/fi";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Chat = ({ loggedInUser }) => {
//   const location = useLocation();
//   const otherUserId = location.state?.otherUserId;
//   const navigate = useNavigate();

//   const token = localStorage.getItem("token");

//   const [ouser, setoUser] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");

//   // Initialize IndexedDB
//   const initializeDB = async () => {
//     return await openDB("ChatDB", 1, {
//       upgrade(db) {
//         if (!db.objectStoreNames.contains("chats")) {
//           db.createObjectStore("chats", { keyPath: "id", autoIncrement: true });
//         }
//       },
//     });
//   };

//   // Save message to IndexedDB
//   const saveMessageToDB = async (message) => {
//     const db = await initializeDB();
//     await db.put("chats", message);
//   };

//   // Load messages from IndexedDB
//   const loadMessagesFromDB = async () => {
//     const db = await initializeDB();
//     const allMessages = await db.getAll("chats");
//     const filteredMessages = allMessages.filter(
//       (msg) =>
//         (msg.senderId === loggedInUser && msg.recipientId === otherUserId) ||
//         (msg.senderId === otherUserId && msg.recipientId === loggedInUser)
//     );
//     setMessages(filteredMessages);
//   };

//   // Load messages and handle chat initialization
//   useEffect(() => {
//     if (!otherUserId) {
//       console.error("No otherUserId passed to Chat component!");
//       return;
//     }

//     const fetchotherUserData = async () => {
//         try {
//             const response = await axios.get(`http://localhost:7000/profile/${otherUserId}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             // console.log(response.data);
//             setoUser(response.data.user);
//             console.log("ouser", ouser);
//             // setLoading(false);
//         } catch (error) {
//             console.error('Error fetching user data:', error);
//             // setError('Failed to fetch user data. Please try again.');
//             // setLoading(false);
//             navigate('/auth');
//         }
//     };


//     fetchotherUserData();

//     console.log("Chat with user:", otherUserId);

//     // Load messages from IndexedDB
//     loadMessagesFromDB();
//   }, [otherUserId]);

//   // Send a new message
//   const sendMessage = async () => {
//     if (!newMessage.trim()) return;

//     const newChatMessage = {
//       id: Date.now(),
//       senderId: loggedInUser,
//       recipientId: otherUserId,
//       text: newMessage,
//       timestamp: new Date().toISOString(),
//     };

//     await saveMessageToDB(newChatMessage); // Save to IndexedDB
//     setMessages((prev) => [...prev, newChatMessage]); // Update UI
//     setNewMessage(""); // Clear input
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-900 text-white">
//       {/* Header */}
//       <div className="bg-gray-800 p-4 flex items-center shadow-md">
//         <img src={ouser?.photo} alt="" className="w-10 h-10 rounded-full border-2 mr-4" />
//         <h2 className="text-lg font-bold">
//           <span className="text-blue-400">{ouser?.name}</span>
//         </h2>
//       </div>

//       {/* Chat Messages */}
//       <div className="flex-grow overflow-y-auto p-4">
//         {messages.map((msg, index) => (
//             <div
//             key={index}
//             className={`mb-4 p-3 rounded-lg ${
//               msg.senderId === loggedInUser
//                 ? "bg-blue-600 text-white self-end ml-auto"
//                 : "bg-gray-700 text-gray-200 self-start mr-auto"
//             }`}
//             style={{
//                 maxWidth: "70%",
//                 wordBreak: "break-word",
//             }}
//             >
//               <div className="">
//             <p className="text-sm">{msg.text}</p>
//           </div>
//           <div className="text-right">
//             <small className="text-xs text-gray-400 text-right">
//               {new Date(msg.timestamp).toLocaleTimeString()}
//             </small>
//           </div>
//             </div>
//         ))}
//       </div>

//       {/* Message Input */}
//       <div className="flex items-center p-4 bg-gray-800 shadow-md">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Type a message..."
//           className="flex-grow bg-gray-700 text-white p-2 rounded-l-lg focus:outline-none"
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-blue-600 text-white p-3 rounded-r-lg hover:bg-blue-700 flex items-center"
//         >
//           <FiSend size={16} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chat;








import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { openDB } from "idb";
import { FiSend } from "react-icons/fi";
import axios from "axios";

const Chat = ({ loggedInUser }) => {
  const location = useLocation();
  const otherUserId = location.state?.otherUserId;
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [ouser, setoUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef(null); // Ref for chat container to handle scrolling

  // Initialize IndexedDB
  const initializeDB = async () => {
    return await openDB("ChatDB", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("chats")) {
          db.createObjectStore("chats", { keyPath: "id", autoIncrement: true });
        }
      },
    });
  };

  // Save message to IndexedDB
  const saveMessageToDB = async (message) => {
    const db = await initializeDB();
    await db.put("chats", message);
  };

  // Load messages from IndexedDB
  const loadMessagesFromDB = async () => {
    const db = await initializeDB();
    const allMessages = await db.getAll("chats");
    const filteredMessages = allMessages.filter(
      (msg) =>
        (msg.senderId === loggedInUser && msg.recipientId === otherUserId) ||
        (msg.senderId === otherUserId && msg.recipientId === loggedInUser)
    );
    setMessages(filteredMessages);
  };

  // Scroll to the bottom of the chat container
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Load messages and handle chat initialization
  useEffect(() => {
    if (!otherUserId) {
      console.error("No otherUserId passed to Chat component!");
      return;
    }

    const fetchOtherUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/profile/${otherUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setoUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/auth");
      }
    };

    fetchOtherUserData();

    // Load messages from IndexedDB
    loadMessagesFromDB();
  }, [otherUserId]);

  useEffect(() => {
    scrollToBottom(); // Auto-scroll to the bottom whenever messages change
  }, [messages]);

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const newChatMessage = {
      id: Date.now(),
      senderId: loggedInUser,
      recipientId: otherUserId,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    await saveMessageToDB(newChatMessage); // Save to IndexedDB
    setMessages((prev) => [...prev, newChatMessage]); // Update UI
    setNewMessage(""); // Clear input
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center shadow-md">
        <img src={ouser?.photo} alt="" className="w-10 h-10 rounded-full border-2 mr-4" />
        <h2 className="text-lg font-bold">
          <span className="text-blue-400">{ouser?.name}</span>
        </h2>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef} // Attach ref to the chat container
        className="flex-grow overflow-y-auto p-4"
        style={{
          maxHeight: "85vh", // Fixed height for the chat messages container
          scrollbarWidth: "thin", // Firefox-specific scrollbar styling
          overflowY: "scroll", // Enable scrolling when content exceeds the height
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 p-3 rounded-lg shadow ${
              msg.senderId === loggedInUser
                ? "bg-blue-600 text-white self-end ml-auto"
                : "bg-gray-700 text-gray-200 self-start mr-auto"
            }`}
            style={{
              maxWidth: "70%",
              wordBreak: "break-word",
            }}
          >
            <div>
              <p className="text-sm">{msg.text}</p>
            </div>
            <div className="text-right">
              <small className="text-xs text-gray-400 text-right">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </small>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="flex items-center p-4 bg-gray-800 shadow-md">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress} // Handle Enter key press
          placeholder="Type a message..."
          className="flex-grow bg-gray-700 text-white p-2 rounded-l-lg focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white p-3 rounded-r-lg hover:bg-blue-700 flex items-center"
        >
          <FiSend size={16} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
