import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Application from '@/models/Application';
import User from '@/models/User';

const FREE_LIMIT = 10;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const apps = await Application.find({ userId: session.user.id }).sort({ createdAt: -1 });
  const user = await User.findById(session.user.id).select('plan');
  return NextResponse.json({ apps, plan: user?.plan || 'free' });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const user = await User.findById(session.user.id).select('plan');
  if (!user || user.plan !== 'pro') {
    const count = await Application.countDocuments({ userId: session.user.id });
    if (count >= FREE_LIMIT) {
      return NextResponse.json({ error: 'limit_reached' }, { status: 403 });
    }
  }
  const body = await req.json();
  const app = await Application.create({ ...body, userId: session.user.id });
  return NextResponse.json(app, { status: 201 });
}
