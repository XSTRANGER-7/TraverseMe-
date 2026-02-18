import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { openDB } from "idb";
import { FiSend, FiArrowLeft, FiMoreVertical } from "react-icons/fi";
import { BiCheckDouble } from "react-icons/bi";
import axios from "axios";

const Chat = ({ loggedInUser }) => {
  const location = useLocation();
  const otherUserId = location.state?.otherUserId;
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [ouser, setoUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
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

  // Load messages from IndexedDB and build conversations list
  const loadMessagesFromDB = async () => {
    const db = await initializeDB();
    const allMessages = await db.getAll("chats");

    // Build conversations map for sidebar (all chats involving loggedInUser)
    const userMessages = allMessages.filter(
      (m) => m.senderId === loggedInUser || m.recipientId === loggedInUser
    );

    const convMap = {};
    userMessages.forEach((m) => {
      const otherId = m.senderId === loggedInUser ? m.recipientId : m.senderId;
      const ts = new Date(m.timestamp).getTime();
      if (!convMap[otherId] || convMap[otherId].timestamp < ts) {
        convMap[otherId] = { lastMessage: m.text, timestamp: ts };
      }
    });

    const convArray = Object.keys(convMap)
      .map((id) => ({ userId: id, lastMessage: convMap[id].lastMessage, timestamp: convMap[id].timestamp }))
      .sort((a, b) => b.timestamp - a.timestamp);

    // fetch profiles for conversation users
    const convsWithProfile = await Promise.all(
      convArray.map(async (c) => {
        try {
          const res = await axios.get(`http://localhost:7000/profile/${c.userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return { ...c, user: res.data.user };
        } catch (err) {
          return { ...c, user: { name: "Unknown", photo: null } };
        }
      })
    );

    setConversations(convsWithProfile);

    // If an otherUserId is selected, load messages for that conversation
    if (otherUserId) {
      const filteredMessages = allMessages.filter(
        (msg) =>
          (msg.senderId === loggedInUser && msg.recipientId === otherUserId) ||
          (msg.senderId === otherUserId && msg.recipientId === loggedInUser)
      );
      const sorted = filteredMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setMessages(sorted);
    }
  };

  // Scroll to the bottom of the chat container
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Helpers for date grouping and labels
  const isSameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isYesterday = (d) => {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return isSameDay(d, y);
  };

  const formatDateHeader = (isoString) => {
    const d = new Date(isoString);
    if (isSameDay(d, new Date())) return "Today";
    if (isYesterday(d)) return "Yesterday";
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
    setMessages((prev) => {
      const merged = [...prev, newChatMessage];
      return merged.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }); // Update UI (keeps chronological order)
    setNewMessage(""); // Clear input
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
      {/* Sidebar: Conversations list */}
      <aside className={`fixed md:static inset-0 w-full md:w-96 border-b md:border-b-0 md:border-r border-gray-800 bg-gradient-to-b from-black to-gray-900 flex flex-col md:h-screen z-40 transition-all duration-300 ${showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                navigate("/userlist");
                setShowSidebar(false);
              }}
              className="p-2 rounded-full hover:bg-gray-900 transition-colors"
              aria-label="Go back"
              type="button"
            >
              <FiArrowLeft size={20} className="text-red-400" />
            </button>
            <div>
              <h3 className="text-xl font-bold text-white">Messages</h3>
              <p className="text-xs text-gray-500 mt-1">Your conversations</p>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-grow min-h-0 overflow-y-auto"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}
        >
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 px-4">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                <FiSend size={24} className="text-red-400/50" />
              </div>
              <p className="text-sm text-gray-400 text-center">No conversations yet</p>
              <p className="text-xs text-gray-600 text-center mt-2">Start chatting with users to see messages here</p>
            </div>
          ) : (
            conversations.map((c) => (
              <button
                key={c.userId}
                onClick={() => {
                  navigate(location.pathname, { state: { otherUserId: c.userId } });
                  setShowSidebar(false);
                }}
                className={`w-full text-left flex items-center gap-2 px-3 py-3.5 mx-1 my-1 rounded-lg transition-all duration-200 ${
                  c.userId === otherUserId
                    ? "bg-gradient-to-r from-red-400/20 to-red-400/10 border border-red-400/30 shadow-lg shadow-red-400/10"
                    : "hover:bg-gray-800/40 border border-transparent"
                }`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0 relative">
                  <img
                    src={c.user?.photo || "https://via.placeholder.com/48"}
                    alt={c.user?.name}
                    className={`w-12 h-12 rounded-full object-cover transition-all ${
                      c.userId === otherUserId ? "border-2 border-red-400 ring-2 ring-red-400/30" : "border border-gray-700"
                    }`}
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black shadow-sm"></div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <h4 className="text-sm font-semibold text-white truncate">
                      {c.user?.name || c.userId}
                    </h4>
                    <span className="text-xs text-gray-500 flex-shrink-0 whitespace-nowrap">
                      {isSameDay(new Date(c.timestamp), new Date())
                        ? new Date(c.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : formatDateHeader(new Date(c.timestamp).toISOString())}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {c.lastMessage || "No messages yet"}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setShowSidebar(false)}
        ></div>
      )}

      {/* Main chat area */}
      <main className="flex flex-col flex-grow min-h-0 w-full">
        {/* Header */}
        <div className="bg-black border-b border-gray-800 p-4 flex items-center shadow-lg backdrop-blur-sm gap-3">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="md:hidden p-2 rounded-full hover:bg-gray-900 transition-colors"
            aria-label="Toggle conversations"
            type="button"
          >
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
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
            <h2 className="text-lg font-semibold text-white">{ouser?.name}</h2>
            <p className="text-xs text-gray-400">Active now</p>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-900 transition-colors">
            <FiMoreVertical size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Chat Messages */}
        <div
          ref={chatContainerRef}
          className="flex-grow min-h-0 overflow-y-auto px-4 py-6 space-y-4"
          style={{
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
              const prevMsg = messages[index - 1];
              const showAvatar = index === 0 || prevMsg?.senderId !== msg.senderId;
              const showDateHeader = index === 0 || !isSameDay(new Date(msg.timestamp), new Date(prevMsg.timestamp));

              return (
                <div key={msg.id || index}>
                  {showDateHeader && (
                    <div className="flex justify-center mb-4">
                      <div className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs">
                        {formatDateHeader(msg.timestamp)}
                      </div>
                    </div>
                  )}

                  <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} items-end space-x-2`}>
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
                  </div>
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
      </main>
    </div>
  );

};

export default Chat;
