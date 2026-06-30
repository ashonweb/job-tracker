import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import Application from '@/models/Application';
import User from '@/models/User';
import KanbanBoard from '@/components/KanbanBoard';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  await connectDB();
  const [apps, user] = await Promise.all([
    Application.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean(),
    User.findById(session.user.id).select('plan').lean(),
  ]);

  const serialized = apps.map(a => ({ ...a, _id: a._id.toString(), userId: a.userId.toString() }));

  return <KanbanBoard initialApps={serialized} userName={session.user.name} plan={user?.plan || 'free'} />;
}
