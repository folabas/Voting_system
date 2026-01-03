import mongoose from 'mongoose';

const CandidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        default: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    },
    votes: {
        type: Number,
        default: 0,
    },
});

const ElectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide an election title'],
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    department: {
        type: String,
    },
    faculty: {
        type: String,
    },
    isOpen: {
        type: Boolean,
        default: true,
    },
    candidates: [CandidateSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Election || mongoose.model('Election', ElectionSchema);
