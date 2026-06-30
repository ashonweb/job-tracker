import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

const PRODUCT_PERMALINK = 'gpvho';

export async function POST(req) {
  const body = await req.formData();
  const email = body.get('email');
  const permalink = body.get('product_permalink');

  if (!email || permalink !== PRODUCT_PERMALINK) {
    return NextResponse.json({ error: 'Invalid webhook' }, { status: 400 });
  }

  await connectDB();
  await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { plan: 'pro' }
  );

  return NextResponse.json({ ok: true });
}
