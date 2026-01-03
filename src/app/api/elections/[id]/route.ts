import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Election from '@/models/Election';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

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

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        if (!(await isAdmin(req))) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        const { id } = await params;
        await dbConnect();
        const data = await req.json();

        const election = await Election.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });

        if (!election) {
            return NextResponse.json({ error: 'Election not found' }, { status: 404 });
        }

        return NextResponse.json(election);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        if (!(await isAdmin(req))) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        const { id } = await params;
        await dbConnect();
        const election = await Election.findByIdAndDelete(id);

        if (!election) {
            return NextResponse.json({ error: 'Election not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Election deleted' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
