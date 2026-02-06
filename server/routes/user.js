const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/auth');

// Update profile with middleware
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        console.log('Received profile update request:', req.body);
        console.log('Authenticated user:', req.user);
        
        const { name, location, photo, bio } = req.body;
        const userId = req.user.id || req.user.userId;

        // Validate bio
        if (bio !== undefined) {
            if (!Array.isArray(bio)) {
                return res.status(400).json({ message: 'Bio must be an array' });
            }
            if (bio.length > 6) {
                return res.status(400).json({ message: 'Maximum 6 bio keywords allowed' });
            }
            if (bio.some(keyword => !keyword || keyword.length > 10)) {
                return res.status(400).json({ message: 'Each bio keyword must be 1-10 characters' });
            }
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                $set: {
                    name,
                    location,
                    photo,
                    bio: Array.isArray(bio) ? bio : []
                }
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User updated in database:', {
            id: updatedUser._id,
            name: updatedUser.name,
            bio: updatedUser.bio
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get user profile route
router.get('/user/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const userId = decoded.id || decoded.userId;

        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure bio is always an array
        if (!user.bio) {
            user.bio = [];
        }









module.exports = router;});    }        res.status(500).json({ message: 'Server error', error: error.message });        console.error('Error fetching user profile:', error);    } catch (error) {        res.json(user);            user.bio = [];
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;