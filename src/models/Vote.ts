import mongoose from 'mongoose';

const VoteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    election: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Election',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create a compound index to ensure one vote per user per election
VoteSchema.index({ user: 1, election: 1 }, { unique: true });

export default mongoose.models.Vote || mongoose.model('Vote', VoteSchema);
