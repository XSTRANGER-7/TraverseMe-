import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import dotenv from 'dotenv';
import User from './models/User.js'; 
import Plan from './models/Plan.js';
import multer from 'multer';
import ChatMessage from './models/Message.js';
import http from 'http';
import { Server } from 'socket.io';
// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");

// import multer from 'multer';

dotenv.config();  // Load environment variables from .env

const app = express(); 
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true
    }
});

// Add security headers middleware
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
    next();
});
  
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed methods
    credentials: true, // Allow cookies if needed
})); // Ensure cross-origin requests are handled properly
        
        
app.use(express.json()); 

const JWT_SECRET = process.env.JWT_SECRET || 'K2qNFsd9mBa/6HqPjL+rtYnPsc6RNuqOxepQcaRIgCI=';

// Socket.IO Logic
io.on("connection", (socket) => {
    console.log("A user connected");
  
    // Join a group room
    socket.on("joinGroup", (groupId) => {
      socket.join(groupId);
      console.log(`User joined group: ${groupId}`);
    });
  
  // Handle group message
    socket.on("sendGroupMessage", (message) => {
        const { groupId } = message;
        io.to(groupId).emit("receiveGroupMessage", message); // Broadcast message to group
      });
    
    // Send one-on-one message
    socket.on("sendPrivateMessage", ({ toUserId, message }) => {
      io.to(toUserId).emit("receivePrivateMessage", message);
    });
  
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  server.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
  });


// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files to an 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    
    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user; // Add user info to request
        // console.log('User:', user);
        next();
    });
};


app.post('/register', async (req, res) => {
    try {
        const { name, email, password, age, gender} = req.body;

        // Ensure all required fields are present
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required.' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Hash the password before saving the user
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            gender: gender || 'other',
            age: age || 18,
            verified: true, // Auto-verify users for now
        });

        // Save the new user to the database
        await newUser.save();

        // Send a success response
        res.status(201).json({
            message: 'Registration successful! You can now log in.',
        });
    } catch (error) {
        console.error('Error during registration:', error.message);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});


app.post("/check-email", async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user) {
        return res.status(200).json({ exists: true });
      }
      res.status(200).json({ exists: false });
    } catch (error) {
      res.status(500).json({ message: "Server error. Please try again." });
    }
  });
  

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        console.log('User:', user.verified);

        if (!user.verified) {
            return res.status(204).json({ message: 'Your profile is under verification. Please try again later.' });
        }

 
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
 
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '72h' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Google Login
app.post('/auth/google', async (req, res) => {
    const { name, email, photo, googleId } = req.body;

    try {
        // Check if the user exists by email
        let user = await User.findOne({ email });

        // If user doesn't exist, create a new one
        if (!user) {
            user = new User({ name, email, photo, verified: true });
            await user.save();
        }

        // Generate JWT for the session
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '6h' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, photo: user.photo } });
    } catch (error) {
        console.error('Error during Google login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
 
app.get('/user/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password field
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


app.get('/users', authenticateToken, async (req, res) => {
    try {
        // Find all users excluding the current user by ID
        const users = await User.find({ _id: { $ne: req.user.id } }).select('name email photo bio followers meets location badge gender age verified aadhaarNo'); // Select the fields you want to return
        // console.log('Users:', users);
        // If no users found
        if (!users) {
            return res.status(404).json({ message: 'No users found' });
        }
        
        // Send the response with the list of users
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/leaderboard', authenticateToken, async (req, res) => {
    try {
        // Fetch all users, including the logged-in user, and sort by score in descending order
        const users = await User.find().sort({ score: -1 }).select('name email photo bio followers meets location badge gender age verified aadhaarNo score');

        // If no users found
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        // Assign rank to each user based on their score
        let rank = 1; // Start rank from 1
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            
            // Update the rank in the database if the rank has changed
            if (user.rank !== rank) {
                await User.findByIdAndUpdate(user._id, { rank: rank });
                console.log(`Updated rank for user ${user.name} to ${rank}`);
            }

            // Increment rank for the next user
            rank++;
        }

        // Send the response with the sorted list of users
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});


app.put('/users/verify/:id', authenticateToken, async (req, res) => {
    console.log('User:', req.user);
    // console.log('Received userId from URL:', req.params.id);
    // if (!req.user.isAdmin) {
    //   return res.status(403).json({ message: 'Access denied.' });
    // }

    try {
      const userId = req.params.id;
      const user = await User.findByIdAndUpdate(userId, { verified: true }, { new: true });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User verified successfully', user });
    } catch (error) {
      console.error('Error verifying user:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
});



app.post('/user/follow/:userId', authenticateToken, async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        const targetUserId = req.params.userId;

        if (loggedInUserId === targetUserId) {
            return res.status(400).json({ error: 'Users cannot follow themselves' });
        }

        const loggedInUser = await User.findById(loggedInUserId);
        const targetUser = await User.findById(targetUserId);

        if (!targetUser || !loggedInUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Add logged-in user to target user's followers
        if (!targetUser.followers.includes(loggedInUserId)) {
            targetUser.followers.push(loggedInUserId);
        }

        // Add target user to logged-in user's following
        if (!loggedInUser.following.includes(targetUserId)) {
            loggedInUser.following.push(targetUserId);
        }

        await targetUser.save();
        await loggedInUser.save();

        res.status(200).json({ message: 'Followed successfully' });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Unfollow a user
app.post('/user/unfollow/:userId', authenticateToken, async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        // console.log('Logged-in user ID:', loggedInUserId);
        const targetUserId = req.params.userId;
        // console.log('Target user ID:', targetUserId);

        const loggedInUser = await User.findById(loggedInUserId);
        const targetUser = await User.findById(targetUserId);

        if (!targetUser || !loggedInUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Remove logged-in user from target user's followers
        targetUser.followers = targetUser.followers.filter(
            (followerId) => followerId.toString() !== loggedInUserId
        );

        // Remove target user from logged-in user's following
        loggedInUser.following = loggedInUser.following.filter(
            (followingId) => followingId.toString() !== targetUserId
        );

        await targetUser.save();
        await loggedInUser.save();

        res.status(200).json({ message: 'Unfollowed successfully' });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.get('/user/follow-status/:userId', authenticateToken, async (req, res) => {
    try {
        const loggedInUserId = req.user.id; // Logged-in user ID from token
        // console.log('mmmm ID:', req.params);
        const profileUserId = req.params.userId; // Profile being viewed


        // Find logged-in user
        const loggedInUser = await User.findById(loggedInUserId);
        if (!loggedInUser) {
            return res.status(404).json({ error: 'Logged-in user not found' });
        }

        // Check if logged-in user follows the profile user
        const isFollowing = loggedInUser.following.includes(profileUserId);
        // console.log('Is following:', isFollowing);
        res.status(200).json({ isFollowing });
    } catch (error) {
        console.error('Error checking follow status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.post('/plan', upload.single('photo'), async (req, res) => {

    try {
        const { title, description, location, timing, date, createdBy } = req.body;
        console.log('Creating plan:', title, description, location, timing, date, createdBy);
        const photoUrl = `/uploads/${req.file.filename}`; // Save file path

        const newPlan = new Plan({
            title,
            description,
            location,
            timing,
            date,
            createdBy,
            photo: photoUrl, // Save photo URL
        });
        console.log('New plan:', newPlan);

        await newPlan.save();
        res.status(201).json({ message: 'Plan created successfully', plan: newPlan });
    } catch (error) {
        console.error('Error creating plan:', error);
        res.status(500).json({ message: 'Server error' });
    }

  });

 

app.get('/userplans', async (req, res) => {
    const { createdBy } = req.query;
    // console.log(createdBy); 

    if (!createdBy) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    
    
    try {
        // Find plans where the userId matches the provided userId
        const plans = await Plan.find({ createdBy });
        
        if (plans.length === 0) {
            // return res.status(404).json({ message: 'No plans found for this user' }); 
            console.log('No plans found for this user');
            return res.json({ plans: [] }); // Send empty array if no plans 
        }
        
        res.json({ plans });
    } catch (error) {
        console.error('Error fetching user plans:', error);
        res.status(500).json({ message: 'Failed to fetch user plans' });
    }
});


app.get("/showplans", async (req,res) => {
    try{
        const allPlans = await Plan.find(); 
        // console.log('Fetched plans:', allPlans);
        res.json(allPlans);
    }
    catch(error){
        console.error('Error fetching plans:', error);
        res.status(500).json({ message: 'Server error' });
    }
})

app.post('/joinplan/:planId', async (req, res) => {
    const { planId } = req.params;
    const { meriid } = req.body;

    if (!meriid) {
        return res.status(400).json({ error: 'User ID (meriid) is required' });
    }

    // console.log('Joining plan:', planId, 'User ID:', meriid);

    try {
        const plan = await Plan.findById(planId);
        if (!plan) {
            return res.status(404).json({ error: 'Plan not found' });
        }

        const existingRequest = plan.requests.find(req => req.userId.toString() === meriid);
        if (existingRequest) {
            return res.status(400).json({ error: 'Join request already exists' });
        }

        plan.requests.push({ userId: meriid, status: 'pending' });
        await plan.save();

        res.json({ success: true, message: 'Join request sent' });
    } catch (error) {
        console.error('Error in /joinplan/:planId:', error);  // Log the error
        res.status(500).json({ error: 'Failed to send join request' });
    }
});


// Check the join request status for a user
app.get('/checkstatus/:planId/:userId', async (req, res) => {
    const { planId, userId } = req.params;

    try {
        const plan = await Plan.findById(planId);
        if (!plan) return res.status(404).json({ error: 'Plan not found' });

        // Check if a request from this user exists
        const request = plan.requests.find(req => req.userId === userId);
        if (!request) return res.json({ status: 'none' });

        res.json({ status: request.status });
    } catch (error) {
        res.status(500).json({ error: 'Failed to check status' });
    }
});

app.post('/approve/:planId', async (req, res) => {
    const { planId } = req.params;
    const { requserId, userId } = req.body;
 
    try {
        const plan = await Plan.findById(planId);
        if (!plan) return res.status(404).json({ error: 'Plan not found' }); 

        if (plan.createdBy !== userId) {
            return res.status(401).json({ error: 'Unauthorized: Only the plan creator can approve requests' });
        }
        const request = plan.requests.find(req => req.userId === requserId);
        if (!request) return res.status(404).json({ error: 'Join request not found' });
        // console.log('Request:', request); 
        
        // Approve the request
        request.status = 'approved';
        await plan.save();
        // console.log('Request:', request); 

        res.json({ success: true, message: 'Join request approved' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to approve join request' });
    }
});

app.get('/profile/:userId', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).send('User not found');
        res.json({ user });
    } catch (err) {
        res.status(500).send('Error fetching user profile');
    }
});

app.get("/showplans/:planId", async (req,res) => {
    const { planId } = req.params;
    try{
        const plan = await Plan.findById(planId).populate('createdBy', 'name email photo');
        // console.log('Fetched plan:', plan);
        res.json(plan);
    }
    catch(error){
        console.error('Error fetching plan:', error);
        res.status(500).json({ message: 'Server error' });
    }
})


app.get('/requeststatus/:userId', async (req, res) => { 
    const { userId } = req.params; // Extract userId from route parameters
    // console.log("Received userId:", userId); // Debugging

    try {
        // Fetch all plans where the user has a request
        const plans = await Plan.find({ "requests.userId": userId });
        // console.log("Plans:", plans); // Debugging log

        if (!plans.length) {
            return res.status(404).json({ message: "No plans found for this user." });
        }

        // Prepare a mapping of plan IDs to the request status of the user
        const requestStatuses = plans.reduce((acc, plan) => {
            const userRequest = plan.requests.find(request => request.userId === userId);
            // console.log("User request:", userRequest); // Debugging log
            if (userRequest) {
                acc[plan._id] = userRequest.status; // Add status to the accumulator by plan ID
                // console.log("Accumulator:", acc); // Debugging log
            }
            return acc;
        }, {});

        // console.log("Request statuses:", requestStatuses); // Debugging log
        res.json(requestStatuses); // Send the mapping as the response
    } catch (err) {
        console.error("Error fetching request statuses:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});



app.get('/requeststatus2', authenticateToken, async (req, res) => {
    const { user } = req; // Get userId from JWT middleware
    // console.log("User:", user); // Debugging

    try {
        // Find all plans where the user has made a request
        const plans = await Plan.find({ "requests.userId": user.id });
        // console.log("Plans:", plans); // Debugging

        if (!plans || plans.length === 0) {
            // return res.status(401).json({ message: "No plans found for this user." });
            console.log("No plans found for this user.");
        }

        // Map the request statuses by plan ID for the logged-in user
        const requestStatuses = plans.reduce((acc, plan) => {
            const userRequest = plan.requests.find(request => request.userId === user.id);

            if (userRequest) {
                acc[plan._id] = userRequest.status; // Map plan ID to the request status
            }
            return acc;
        }, {});
        // console.log("Request statuses:", requestStatuses); 
        res.json(requestStatuses); // Send the mapping as the response
    } catch (err) {
        console.error("Error fetching request statuses:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});



app.put('/profile', authenticateToken , async (req, res) => {
    const { name, location } = req.body; // Destructure the data from the request body
    // console.log('Name:', name, 'Location:', location);
    // console.log('User:', req.body);
        try {
        const user = await User.findById(req.user.id); // Fetch the user from the database

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user details
        user.name = name;
        user.location = location;
        // user.bio = bio;

        await user.save(); // Save the updated user object
        res.status(200).json(user); // Respond with the updated user
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


const calculateBadge = (meetsCount, followersCount) => {
    const score = meetsCount * 5 + followersCount * 10; // Custom score formula
    console.log('Score:', score);

    let badge = ''; // Define the badge
    if (score >= 1000) badge = 'Expert';
    else if (score >= 500) badge = 'Level 9';
    else if (score >= 250) badge = 'Level 8';
    else if (score >= 150) badge = 'Level 7';
    else if (score >= 100) badge = 'Level 6';
    else if (score >= 60) badge = 'Level 5';
    else if (score >= 30) badge = 'Level 4';
    else if (score >= 20) badge = 'Level 3';
    else if (score >= 4) badge = 'Level 2';
    else badge = 'Level 1'; // Beginner Level

    return { badge, score }; // Return both badge and score
};

// Function to update badges and scores for all users
const updateBadges = async () => {
    try {
        const users = await User.find(); // Fetch all users

        for (let user of users) {
            const meetsCount = user.meets.length || 0; // Count meets
            const followersCount = user.followers.length || 0; // Count followers

            const { badge, score } = calculateBadge(meetsCount, followersCount); // Get badge and score

            // Update badge and score in MongoDB only if they change
            if (user.badge !== badge || user.score !== score) {
                // Separate the updates for badge and score
                await User.findByIdAndUpdate(user._id, { 
                    badge: badge,  // Update badge with a string value
                    score: score   // Update score with a number value
                }); 
                console.log(`Updated badge for user ${user.name} to ${badge} and score to ${score}`);
            }
        }

        console.log('Badge and score updates completed.');
    } catch (error) {
        console.error('Error updating badges and scores:', error);
    }
};


const watchUserChanges = async () => {
    try {
        mongoose.connection.once('open', async () => {
            console.log('Database connected. Watching user changes...');

            // Watch for changes in the User collection
            const changeStream = mongoose.connection.collection('users').watch();

            changeStream.on('change', async (change) => {
                console.log('Change detected:', change);

                // If a document is updated, recalculate and update the badge and score
                if (change.operationType === 'update') {
                    const updatedFields = change.updateDescription.updatedFields;

                    // Fetch the updated user regardless of the change type to ensure consistency
                    const userId = change.documentKey._id;

                    try {
                        const user = await User.findById(userId);

                        if (!user) {
                            console.log(`User with ID ${userId} not found.`);
                            return;
                        }

                        const meetsCount = user.meets.length || 0;
                        const followersCount = user.followers.length || 0;

                        // Calculate the new badge and score
                        const { badge, score } = calculateBadge(meetsCount, followersCount);

                        // Update badge and score in the database if necessary
                        if (user.badge !== badge || user.score !== score) {
                            await User.findByIdAndUpdate(userId, { 
                                badge: badge, 
                                score: score 
                            });
                            console.log(`Dynamic update: Badge and score updated for user ${user.name} to ${badge} and score to ${score}`);
                        }
                    } catch (err) {
                        console.error(`Error processing change for user ID ${userId}:`, err);
                    }
                }
            });

            console.log('Watching users for changes...');
        });
    } catch (error) {
        console.error('Error watching user collection:', error);
    }
};

const watchUserScoreChanges = async () => {
    try {
        mongoose.connection.once('open', async () => {
            console.log('Database connected. Watching for score changes...');

            // Watch for changes in the User collection
            const changeStream = mongoose.connection.collection('users').watch();

            changeStream.on('change', async (change) => {
                console.log('Change detected:', change);

                // Check if the operation is an update and if 'score' is among the updated fields
                if (change.operationType === 'update' && change.updateDescription.updatedFields.hasOwnProperty('score')) {
                    const userId = change.documentKey._id;

                    try {
                        // Fetch all users sorted by score in descending order
                        const allUsers = await User.find().sort({ score: -1 });

                        // Update ranks for all users based on the new score order
                        for (let i = 0; i < allUsers.length; i++) {
                            const user = allUsers[i];
                            const newRank = i + 1; // Rank starts at 1

                            // Only update the rank if it has changed
                            if (user.rank !== newRank) {
                                await User.findByIdAndUpdate(user._id, { rank: newRank });
                                console.log(`Rank updated for user ${user.name} to ${newRank}`);
                            }
                        }

                        console.log('Ranks updated successfully based on the new score changes.');
                    } catch (err) {
                        console.error(`Error updating ranks after score change for user ID ${userId}:`, err);
                    }
                }
            });

            console.log('Watching for user score changes...');
        });
    } catch (error) {
        console.error('Error watching user collection:', error);
    }
};

// Run badge updates initially
updateBadges();

// Watch for dynamic updates in the user collection
watchUserChanges();

watchUserScoreChanges();


// Function to update plan IDs for all users
const updatePlanIds = async () => {
    try {
        // Fetch all users
        const users = await User.find();

        for (let user of users) {
            // Fetch all plans created by the user and get their IDs
            const plans = await Plan.find({ createdBy: user._id }).select('_id');
            const planIds = plans.map(plan => plan._id); // Extract plan IDs

            // Update user's meets field with plan IDs in the database
            if (JSON.stringify(user.meets) !== JSON.stringify(planIds)) {
                await User.findByIdAndUpdate(user._id, { meets: planIds });
                console.log(`Updated meets for user ${user.name} to ${planIds.length} plans.`);
            }
        }

        console.log('Plan ID updates completed.');
    } catch (error) {
        console.error('Error updating plan IDs:', error);
    }
};

// Run the script initially
updatePlanIds();

const watchPlans = async () => {
    try {
        // Wait for the database connection to be ready
        mongoose.connection.once('open', async () => {
            console.log('Database connection is ready for change streams.');

            // Watch the plans collection for changes
            const changeStream = mongoose.connection.collection('plans').watch();

            changeStream.on('change', async (change) => {
                console.log('Change detected:', change);

                if (change.operationType === 'insert' || change.operationType === 'delete') {
                    await updatePlanIds(); // Update plan IDs
                }
            });

            console.log('Watching Plans collection for changes...');
        });
    } catch (error) {
        console.error('Error watching plans collection:', error);
    }
};


// Start watching for changes
watchPlans();
 

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(7000, () => { // Ensure your server is running on the correct port
            console.log('Server is running on http://localhost:7000');
        });
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB', error.message);
    });
