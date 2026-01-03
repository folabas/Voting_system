import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Election from '@/models/Election';
import Vote from '@/models/Vote';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded: any = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        await dbConnect();
        const { electionId, candidateId } = await req.json();

        // Check if user already voted
        const existingVote = await Vote.findOne({ user: userId, election: electionId });
        if (existingVote) {
            return NextResponse.json({ error: 'You have already voted in this election' }, { status: 400 });
        }

        // Update election votes
        const election = await Election.findOneAndUpdate(
            { _id: electionId, 'candidates._id': candidateId },
            { $inc: { 'candidates.$.votes': 1 } },
            { new: true }
        );

        if (!election) {
            return NextResponse.json({ error: 'Election or candidate not found' }, { status: 404 });
        }

        // Record the vote
        await Vote.create({
            user: userId,
            election: electionId,
        });

        return NextResponse.json({ success: true, message: 'Vote recorded successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
