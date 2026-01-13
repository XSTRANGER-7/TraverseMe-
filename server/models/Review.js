// models/Review.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who wrote the review
    reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who is being reviewed
    comment: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 }, // Rating between 1 and 5
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
