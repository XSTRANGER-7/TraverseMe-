// import mongoose from "mongoose";
// const Schema = mongoose.Schema;

// const chatMessageSchema = new Schema({
//     planId: {
//         type: String,
//         // required: true,
//     },
//     user : {
//         name: String,
//         profilePic: String, 
//     },
//     message : {
//         type: String,
//         // required: true,
//     },
//     timestamp : {
//         type: Date,
//         default: Date.now,
//     }
// });

// // module.exports = mongoose.model('Message', messageSchema);
// const Message = mongoose.model('Message', chatMessageSchema);
// export default Message;









import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const chatMessageSchema = new Schema({
  planId: {
    type: String,
    required: true,
  },
  user: {
    name: String,
    profilePic: String, 
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
export default ChatMessage;
