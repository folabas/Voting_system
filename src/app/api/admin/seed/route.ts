import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Election from '@/models/Election';
import User from '@/models/User';

export async function POST() {
    try {
        await dbConnect();

        // Check if elections already exist to avoid double seeding
        const electionCount = await Election.countDocuments();
        if (electionCount > 0) {
            return NextResponse.json({ message: 'Database already seeded' });
        }

        const initialElections = [
            {
                title: 'Student Council Presidential Election 2026',
                description: 'Vote for your next Student Council President',
                category: 'President',
                department: 'Student Affairs',
                isOpen: true,
                candidates: [
                    {
                        name: 'Sarah Johnson',
                        position: 'President',
                        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
                        votes: 245
                    },
                    {
                        name: 'Michael Chen',
                        position: 'President',
                        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
                        votes: 198
                    },
                    {
                        name: 'Emily Rodriguez',
                        position: 'President',
                        photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
                        votes: 312
                    }
                ]
            },
            {
                title: 'Computer Science Course Representative',
                description: 'Vote for your CS Course Representative',
                category: 'Course Rep',
                department: 'Computer Science',
                isOpen: true,
                candidates: [
                    {
                        name: 'Alex Thompson',
                        position: 'Course Rep',
                        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
                        votes: 89
                    },
                    {
                        name: 'Priya Patel',
                        position: 'Course Rep',
                        photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
                        votes: 134
                    }
                ]
            }
        ];

        await Election.insertMany(initialElections);

        return NextResponse.json({ message: 'Database seeded successfully with initial elections' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
