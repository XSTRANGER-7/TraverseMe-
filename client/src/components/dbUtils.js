import { openDB } from "idb";

// Open (or create) the IndexedDB
export const initDB = async () => {
  return openDB("ChatAppDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("chats")) {
        db.createObjectStore("chats", { keyPath: "id", autoIncrement: true });
      }
    },
  });
};

// Add a message to the database
export const saveMessage = async (message) => {
  const db = await initDB();
  return db.put("chats", message);
};

// Retrieve all messages from the database
export const getAllMessages = async () => {
  const db = await initDB();
  return db.getAll("chats");
};
