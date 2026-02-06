const mongoose = require('mongoose');
const User = require('../models/User');

async function addBioField() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'your-mongodb-uri');
        
        // Add bio field to all existing users
        await User.updateMany(
            { bio: { $exists: false } },
            { $set: { bio: [] } }
        );
        
        console.log('Bio field added to all users');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

addBioField();
