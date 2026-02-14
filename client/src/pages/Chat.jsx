

import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { openDB } from "idb";
import { FiSend, FiArrowLeft, FiMoreVertical } from "react-icons/fi";
import { BiCheck, BiCheckDouble } from "react-icons/bi";
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
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black border-b border-gray-800 p-4 flex items-center shadow-lg backdrop-blur-sm">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-900 transition-colors mr-3"
        >
          <FiArrowLeft size={20} className="text-red-400" />
        </button>
        <div className="relative">
          <img 
            src={ouser?.photo || "https://via.placeholder.com/40"} 
            alt={ouser?.name} 
            className="w-12 h-12 rounded-full border-2 border-red-400 shadow-lg object-cover" 
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
        </div>
        <div className="ml-4 flex-grow">
          <h2 className="text-lg font-semibold text-white">
            {ouser?.name}
          </h2>
          <p className="text-xs text-gray-400">Active now</p>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-900 transition-colors">
          <FiMoreVertical size={20} className="text-gray-400" />
        </button>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto px-4 py-6 space-y-4"
        style={{
          maxHeight: "calc(100vh - 140px)",
          scrollbarWidth: "thin",
          scrollbarColor: "#dc2626 #1f1f1f",
        }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center mb-4">
              <FiSend size={32} className="text-red-400" />
            </div>
            <p className="text-lg font-medium">Start a conversation</p>
            <p className="text-sm text-gray-600">Send a message to begin chatting</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isCurrentUser = msg.senderId === loggedInUser;
            const showAvatar = index === 0 || messages[index - 1].senderId !== msg.senderId;
            
            return (
              <div
                key={index}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} items-end space-x-2`}
              >
                {!isCurrentUser && showAvatar && (
                  <img
                    src={ouser?.photo || "https://via.placeholder.com/32"}
                    alt={ouser?.name}
                    className="w-8 h-8 rounded-full border border-gray-700 object-cover"
                  />
                )}
                {!isCurrentUser && !showAvatar && <div className="w-8"></div>}
                
                <div
                  className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl shadow-lg ${
                    isCurrentUser
                      ? "bg-red-400 text-white rounded-br-sm"
                      : "bg-gray-900 text-gray-100 border border-gray-800 rounded-bl-sm"
                  }`}
                  style={{ wordBreak: "break-word" }}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <div className={`flex items-center justify-end mt-2 space-x-1 ${isCurrentUser ? "text-gray-200" : "text-gray-500"}`}>
                    <span className="text-xs">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {isCurrentUser && (
                      <BiCheckDouble size={14} className="text-gray-300" />
                    )}
                  </div>
                </div>
                
                {isCurrentUser && showAvatar && (
                  <img
                    src={loggedInUser?.photo || "https://via.placeholder.com/32"}
                    alt="You"
                    className="w-8 h-8 rounded-full border border-red-400 object-cover"
                  />
                )}
                {isCurrentUser && !showAvatar && <div className="w-8"></div>}
              </div>
            );
          })
        )}
      </div>

      {/* Message Input */}
      <div className="bg-black border-t border-gray-800 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-grow relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="w-full bg-gray-900 text-white px-6 py-4 rounded-full border border-gray-700 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/20 transition-all placeholder-gray-500"
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
              newMessage.trim()
                ? "bg-red-400 hover:bg-red-500 text-white transform hover:scale-105 shadow-red-400/25"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
          >
            <FiSend size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
