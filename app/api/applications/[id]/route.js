import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Application from '@/models/Application';

async function getApp(id, userId) {
  await connectDB();
  const app = await Application.findOne({ _id: id, userId });
  return app;
}

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const app = await getApp(params.id, session.user.id);
  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(app);
}

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  await connectDB();
  const app = await Application.findOneAndUpdate(
    { _id: params.id, userId: session.user.id },
    body,
    { new: true }
  );
  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(app);
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  await Application.findOneAndDelete({ _id: params.id, userId: session.user.id });
  return NextResponse.json({ ok: true });
}
