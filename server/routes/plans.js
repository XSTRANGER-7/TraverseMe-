const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const multer = require('multer');
const path = require('path');
const { verifyToken } = require('../middleware/auth');



// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});
const upload = multer({ storage });

// Create a new plan
router.post('/create', verifyToken, upload.single('photo'), async (req, res) => {
    try {
        const { title, details, location } = req.body;
        console.log(req.body);
        const photo = req.file ? `/uploads/${req.file.filename}` : '';

        const newPlan = new Plan({
            title,
            details,
            location,
            photo,
            createdBy: req.user._id,
        });
        console.log(newPlan);
        await newPlan.save();
        res.status(201).json({ message: 'Plan created successfully!', plan: newPlan });
    } catch (error) {
        console.error('Error creating plan:', error);
        res.status(500).json({ error: 'Failed to create plan' });
    }
});

module.exports = router;
