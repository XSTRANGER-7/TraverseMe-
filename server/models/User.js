

// models/User.js
// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String },  // Required only for email/password users
//     photo: { type: String, default: null },  // Optional field for user profile photo
//     location: { type: String, default: null }, // User location
//     meets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meet' }], // Array of meet IDs created by the user
//     followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of follower IDs
//     following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of follower IDs
//     badge: { type: String, default: 'Level 1' }, // Badge level
//     reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }], // Array of review IDs added by other users
// });

// const User = mongoose.model('User', userSchema);
// export default User;




import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },  // Required only for email/password users
    isAdmin: { type: Boolean, default: false },
    bio: { type: String, default: null }, // Optional field for user bio
    photo: { type: String, default: null },  // Optional field for user profile photo
    location: { type: String, default: null }, // User location
    meets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meet' }], // Array of meet IDs created by the user
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of users following this user
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of users this user is following
    badge: { type: String, default: 'Level 1' }, // Badge level
    score: { type: Number, default: 0 }, // User score
    rank: { type: Number, default: 0 }, // User score
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }], // Array of review IDs added by other users
    age: { type: Number, min: 14, max: 90, required: true },  // Age field, with validation
    aadhaarNo: { 
        type: String, 
        required: true, 
        match: /^[0-9]{12}$/,  // Regex to ensure Aadhaar number is 12 digits
    }, 
    gender: { 
        type: String, 
        enum: ['male', 'female', 'other'], 
        default: 'female', 
    },
    verified: { type: Boolean, default: false },
});

// Pre-save hook to avoid following oneself
userSchema.pre('save', function (next) {
    if (this.followers.includes(this._id) || this.following.includes(this._id)) {
        return next(new Error('A user cannot follow themselves.'));
    }
    next();
});

const User = mongoose.model('User', userSchema);
export default User;
