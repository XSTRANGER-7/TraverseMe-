# TraverseMe 🌍

A social travel planning platform that connects travelers, enables collaborative trip planning, and builds a community of verified adventurers.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Face Validation (Optional)](#face-validation-optional)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

TraverseMe is a full-stack web application that revolutionizes how people plan and join travel experiences. Users can create travel plans, connect with fellow travelers, join trips, and build their reputation through a gamified scoring system. The platform includes admin verification to ensure user authenticity and safety.

## ✨ Features

### Core Features
- **User Authentication & Verification**
  - Email/password registration with JWT authentication
  - Admin verification system for new users
  - Secure password hashing with bcrypt

- **Travel Plan Management**
  - Create detailed travel plans with photos, locations, dates, and timings
  - Browse all available travel plans
  - Join requests with approval system
  - Track plan participation and status

- **Social Networking**
  - Follow/unfollow other travelers
  - User profiles with bio, location, and statistics
  - View followers and following lists

- **Gamification & Leaderboard**
  - Dynamic scoring system based on meets and followers
  - Badge levels (Level 1 - Level 9, Expert)
  - Real-time rank updates
  - Global leaderboard

- **Real-time Communication**
  - Group chat for travel plans
  - Private messaging between users
  - Socket.IO powered instant messaging

- **Admin Dashboard**
  - User verification management
  - Platform overview and statistics

### Advanced Features (Optional)
- **Face Validation** (Flask/Python)
  - Face detection using OpenCV
  - Gender analysis using DeepFace
  - Movement validation for user verification

## 🛠️ Tech Stack

### Frontend
- **React** 18.3.1 - UI framework
- **React Router** - Navigation
- **Redux Toolkit** - State management
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **React Toastify** - Notifications
- **Face-api.js / TensorFlow.js** - Face detection (frontend)

### Backend
- **Node.js** with **Express** - REST API server
- **MongoDB** with **Mongoose** - Database
- **Socket.IO** - WebSocket server
- **JWT** - Authentication
- **Multer** - File uploads
- **Bcrypt.js** - Password hashing

### Optional Python Service
- **Flask** - Face validation API
- **OpenCV** - Computer vision
- **DeepFace** - Facial analysis
- **NumPy** - Numerical operations

## 📁 Project Structure

```
traverseme/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── assets/        # Images and media
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Auth & other middleware
│   ├── models/           # MongoDB models
│   │   ├── User.js
│   │   ├── Plan.js
│   │   ├── Message.js
│   │   └── Review.js
│   ├── routes/           # API routes
│   ├── uploads/          # User uploaded files
│   ├── server.js         # Main server file
│   └── package.json
│
└── app.py                # Optional Flask face validation service
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)
- **Python 3.8+** (optional, for face validation)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/traverseme.git
cd traverseme
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../client
npm install
```

### 4. (Optional) Install Python Dependencies
```bash
cd ..
pip install flask opencv-python deepface numpy
```

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the `server` directory:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/traverseme
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/traverseme

# JWT Secret (Generate a secure random string)
JWT_SECRET=your_secret_key_here

# Server Port (optional)
PORT=7000

# Socket.IO Port (optional)
SOCKET_PORT=4000
```

### Frontend Configuration

If needed, update API endpoints in your frontend code. The default configuration points to:
- REST API: `http://localhost:7000`
- Socket.IO: `http://localhost:4000`

## 🏃 Running the Application

### Method 1: Run All Services Separately

#### 1. Start MongoDB
```bash
# If using local MongoDB
mongod
```

#### 2. Start Backend Server
```bash
cd server
npm start
# Server runs on http://localhost:7000
# Socket.IO runs on http://localhost:4000
```

#### 3. Start Frontend
```bash
cd client
npm start
# Opens browser at http://localhost:3000
```

#### 4. (Optional) Start Flask Face Validation Service
```bash
python app.py
# Runs on http://localhost:5000
```

### Method 2: Using Concurrently (Recommended)

You can add a script to run both frontend and backend together. Add this to the root `package.json`:

```json
{
  "scripts": {
    "server": "cd server && npm start",
    "client": "cd client && npm start",
    "dev": "concurrently \"npm run server\" \"npm run client\""
  }
}
```

Then run:
```bash
npm run dev
```

## 🌐 API Endpoints

### Authentication
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /auth/google` - Google OAuth login
- `POST /check-email` - Check if email exists

### User Management
- `GET /user/profile` - Get logged-in user profile
- `GET /users` - Get all users (excluding current user)
- `GET /profile/:userId` - Get specific user profile
- `PUT /profile` - Update user profile
- `PUT /users/verify/:id` - Verify user (admin)

### Social Features
- `POST /user/follow/:userId` - Follow a user
- `POST /user/unfollow/:userId` - Unfollow a user
- `GET /user/follow-status/:userId` - Check follow status

### Travel Plans
- `POST /plan` - Create new travel plan (with photo upload)
- `GET /showplans` - Get all plans
- `GET /showplans/:planId` - Get specific plan details
- `GET /userplans?createdBy=:userId` - Get user's plans
- `POST /joinplan/:planId` - Send join request
- `POST /approve/:planId` - Approve join request
- `GET /checkstatus/:planId/:userId` - Check join request status
- `GET /requeststatus/:userId` - Get all request statuses
- `GET /requeststatus2` - Get logged-in user's request statuses

### Leaderboard
- `GET /leaderboard` - Get ranked users by score

### Socket.IO Events
- `joinGroup(groupId)` - Join a group chat
- `sendGroupMessage(message)` - Send message to group
- `sendPrivateMessage({toUserId, message})` - Send private message
- `receiveGroupMessage(message)` - Receive group message
- `receivePrivateMessage(message)` - Receive private message

## 📊 Database Models

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  age: Number (14-90),
  gender: String (male/female/other),
  aadhaarNo: String (12 digits),
  verified: Boolean,
  isAdmin: Boolean,
  bio: String,
  photo: String,
  location: String,
  meets: [ObjectId],
  followers: [ObjectId],
  following: [ObjectId],
  badge: String,
  score: Number,
  rank: Number,
  reviews: [ObjectId]
}
```

### Plan Schema
```javascript
{
  title: String,
  description: String,
  photo: String,
  location: String,
  date: Date,
  timing: String,
  createdBy: String,
  requests: [{
    userId: String,
    status: String (pending/approved/rejected)
  }],
  timestamps: true
}
```

### Message Schema
```javascript
{
  sender: ObjectId,
  content: String,
  groupId: String,
  timestamp: Date
}
```

## 🎭 Face Validation (Optional)

The `app.py` file contains a Flask-based face validation service with the following features:

### Features
- **Real-time Face Detection** - Using OpenCV's Haar Cascade
- **Gender Analysis** - Using DeepFace library
- **Movement Validation** - Verify user liveness
- **Blurriness Detection** - Ensure image quality

### Endpoints
- `POST /validate_frame` - Validate single frame for face detection
- `POST /analyze_gender` - Analyze gender from image

### Usage
Uncomment the code in `app.py` and integrate with frontend authentication flow.

## 🏆 Scoring System

The platform uses a dynamic scoring system to rank users:

**Score Calculation:**
```
Score = (Number of Meets × 5) + (Number of Followers × 10)
```

**Badge Levels:**
- **Level 1**: 0-3 points (Beginner)
- **Level 2**: 4-19 points
- **Level 3**: 20-29 points
- **Level 4**: 30-59 points
- **Level 5**: 60-99 points
- **Level 6**: 100-149 points
- **Level 7**: 150-249 points
- **Level 8**: 250-499 points
- **Level 9**: 500-999 points
- **Expert**: 1000+ points

Scores and badges are automatically updated when users create plans or gain followers.

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes requiring authentication
- Admin verification for new users
- Aadhaar number validation (12 digits)
- Age restriction (14-90 years)
- CORS configuration for frontend-backend communication

## 🎨 Frontend Features

- Responsive design with TailwindCSS
- Smooth animations with Framer Motion
- Real-time updates with Socket.IO
- Toast notifications for user feedback
- Protected routes based on authentication
- Image carousels with React Slick
- Modern UI components with Lucide icons

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access if using MongoDB Atlas

### CORS Errors
- Verify frontend URL in server CORS configuration
- Default is `http://localhost:3000`

### Port Conflicts
- Backend runs on port 7000 (HTTP) and 4000 (Socket.IO)
- Frontend runs on port 3000
- Change ports if conflicts occur

### File Upload Issues
- Ensure `uploads/` directory exists in server folder
- Check Multer configuration
- Verify file size limits

## 📝 Future Enhancements

- [ ] Email verification on registration
- [ ] Password reset functionality
- [ ] Advanced search and filters for plans
- [ ] Review and rating system for users
- [ ] Push notifications
- [ ] Mobile app (React Native)
- [ ] Payment integration for paid trips
- [ ] Map integration for locations
- [ ] Trip itinerary builder
- [ ] Weather information integration

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Created with ❤️ by the TraverseMe Team

---

**Happy Traveling! 🌍✈️**

