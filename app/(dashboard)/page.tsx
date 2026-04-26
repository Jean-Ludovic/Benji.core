import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function DashboardRootPage() {
  const session = await auth();
  const role = session?.user?.role ?? 'CLIENT';

  if (role === 'ARTISAN') redirect('/artisan');
  if (role === 'ADMIN') redirect('/admin');
  redirect('/client');
}
