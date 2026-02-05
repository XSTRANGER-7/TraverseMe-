import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";
import { openDB } from "idb";
import axios from "axios";
import { FiSend } from "react-icons/fi";

const GroupChat = ({ groupId }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [usernames, setUsernames] = useState({});
  const navigate = useNavigate();
  const chatContainerRef = useRef(null); // Reference for the chat container

  // Initialize IndexedDB
  const initializeDB = async () => {
    return await openDB("GroupChatDB", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("messages")) {
          db.createObjectStore("messages", { keyPath: "id", autoIncrement: true });
        }
      },
    });
  };

  // Save message to IndexedDB
  const saveMessageToDB = async (message) => {
    const db = await initializeDB();
    await db.put("messages", { groupId, ...message });
  };

  // Load messages from IndexedDB
  const loadMessagesFromDB = async () => {
    const db = await initializeDB();
    const allMessages = await db.getAll("messages");
    const groupMessages = allMessages.filter((msg) => msg.groupId === groupId);
    setMessages(groupMessages);
  };

  // Fetch usernames for messages
  const fetchUsernames = async (userIds) => {
    try {
      const responses = await Promise.all(
        userIds.map((userId) =>
          axios.get(`http://localhost:7000/profile/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
        )
      );

      const namesMap = responses.reduce((acc, res) => {
        acc[res.data.user._id] = res.data.user.name; // Map userId to name
        return acc;
      }, {});

      setUsernames((prev) => ({ ...prev, ...namesMap }));
    } catch (error) {
      console.error("Error fetching usernames:", error);
    }
  };

  // Scroll to the bottom of the chat container
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Handle user authentication and socket initialization
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/auth");
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
      setLoggedInUser(decoded);
    } catch (error) {
      console.error("Invalid token:", error.message);
      localStorage.removeItem("token");
      navigate("/auth");
      return;
    }

    // Connect to Socket.IO
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);

    // Join the group room
    newSocket.emit("joinGroup", groupId);

    // Receive messages
    newSocket.on("receiveGroupMessage", (newMessage) => {
      saveMessageToDB(newMessage);
      setMessages((prev) => [...prev, newMessage]);

      // Fetch username if not already fetched
      setUsernames((prevUsernames) => {
        if (!prevUsernames[newMessage.userId]) {
          fetchUsernames([newMessage.userId]);
        }
        return prevUsernames;
      });
    });

    // Load messages from IndexedDB
    loadMessagesFromDB();

    // Cleanup function
    return () => {
      console.log('Disconnecting socket...');
      newSocket.disconnect();
    };
  }, [groupId]); // Only depend on groupId

  // Fetch usernames for all messages when messages change
  useEffect(() => {
    if (messages.length === 0) return;
    
    const userIds = messages.map((msg) => msg.userId).filter(Boolean);
    const uniqueUserIds = [...new Set(userIds)];
    const missingUserIds = uniqueUserIds.filter((id) => !usernames[id]);
    
    if (missingUserIds.length > 0) {
      fetchUsernames(missingUserIds);
    }
  }, [messages.length]); // Only re-run when message count changes

  // Send message
  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      userId: loggedInUser?.id,
      text: message,
      timestamp: new Date().toISOString(),
    };

    socket.emit("sendGroupMessage", newMessage); // Send to server
    saveMessageToDB(newMessage); // Save in IndexedDB
    setMessages((prev) => [...prev, newMessage]); // Update UI

    // Scroll to bottom after sending message
    setTimeout(scrollToBottom, 100);
    setMessage(""); // Clear input
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Chat Header */}
      <div className="bg-gray-800 p-4 shadow-md flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Group Chat</h2>
      </div>

      {/* Chat Messages */}
      <div
        className="flex-grow overflow-y-auto p-4"
        style={{
          maxHeight: "80vh", // Fixed height for the chat messages container
          overflowY: "auto", // Scroll when content exceeds height
        }}
        ref={chatContainerRef} // Attach ref to the chat container
      >
        {messages.length === 0 ? (
          <p className="text-center text-gray-400">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`p-3 mb-4 rounded-lg shadow ${
                msg.userId === loggedInUser?.id
                  ? "bg-blue-600 text-white self-end ml-auto"
                  : "bg-gray-700 text-gray-200 self-start mr-auto"
              }`}
              style={{
                maxWidth: "75%",
                wordBreak: "break-word",
              }}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-sm font-bold">
                  {msg.userId === loggedInUser?.id
                    ? "You"
                    : usernames[msg.userId] || `User ${msg.userId}`}
                </span>
              </div>
              <p className="text-sm">{msg.text}</p>
              <small className="text-xs text-gray-400">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </small>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="flex items-center p-4 bg-gray-800 shadow-md">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress} // Handle Enter key press
          placeholder="Type your message..."
          className="flex-grow bg-gray-700 text-white p-3 rounded-l-lg focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white p-3 rounded-r-lg hover:bg-blue-700 flex items-center"
        >
          <FiSend size={24} />
        </button>
      </div>
    </div>
  );
};

export default GroupChat;
