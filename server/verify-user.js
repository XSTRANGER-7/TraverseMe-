import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const verifyUser = async (email) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        const result = await User.updateOne({ email }, { verified: true });
        
        if (result.matchedCount === 0) {
            console.log(`No user found with email: ${email}`);
        } else {
            console.log(`✅ User ${email} has been verified!`);
        }
        
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

// Get email from command line or use default
const email = process.argv[2] || 'test@gmail.com';
verifyUser(email);
