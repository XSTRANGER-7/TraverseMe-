// models/Plan.js
import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    photo: {
        type: String, // You can also use Buffer if you want to store images in binary format
        // required: true,
    },
    location: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    timing: {
        type: String,
        required: true,
    },
    createdBy: {
        type: String, // Assuming this is a string, you can change it to ObjectId if it references a User model
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    requests: [
        {
            userId: { type: String, required: true },
            status: { type: String, default: 'pending' } // pending, approved, rejected
        }
    ]
}, { timestamps: true }); 

const Plan = mongoose.model('Plan', planSchema);

export default Plan;
