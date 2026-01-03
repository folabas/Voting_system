import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Election from '@/models/Election';
import Vote from '@/models/Vote';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Helper to check for admin role
async function isAdmin(req: Request) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false;

    try {
        const token = authHeader.split(' ')[1];
        const decoded: any = jwt.verify(token, JWT_SECRET);
        return decoded.role === 'admin';
    } catch (error) {
        return false;
    }
}

export async function GET(req: Request) {
    try {
        await dbConnect();
        const elections = await Election.find({}).sort({ createdAt: -1 });

        // Check if user is logged in to return their voting status
        const authHeader = req.headers.get('authorization');
        let userId = null;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.split(' ')[1];
                const decoded: any = jwt.verify(token, JWT_SECRET);
                userId = decoded.id;
            } catch (err) {
                // Ignore invalid tokens for guests
            }
        }

        if (userId) {
            const userVotes = await Vote.find({ user: userId });
            const votedElectionIds = userVotes.map(v => v.election.toString());

            const electionsWithStatus = elections.map(election => {
                const electionObj = election.toObject();
                // Ensure ID comparison is robust
                const currentId = election._id.toString();
                return {
                    ...electionObj,
                    _id: currentId,
                    id: currentId,
                    hasVoted: votedElectionIds.includes(currentId)
                };
            });
            return NextResponse.json(electionsWithStatus);
        }

        return NextResponse.json(elections);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        if (!(await isAdmin(req))) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        await dbConnect();
        const data = await req.json();
        const election = await Election.create(data);
        return NextResponse.json(election, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
