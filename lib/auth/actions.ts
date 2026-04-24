'use server';

import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { users } from '@/lib/auth/schema';
import { auth } from '@/lib/auth';
import { signIn } from '@/lib/auth';

type RegisterResult = { error: string } | { success: true };

export async function register(formData: FormData): Promise<RegisterResult> {
  const email = (formData.get('email') as string)?.toLowerCase().trim();
  const password = formData.get('password') as string;
  const name = (formData.get('name') as string)?.trim();

  if (!email || !password || !name) {
    return { error: 'All fields are required.' };
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' };
  }

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    return { error: 'An account with this email already exists.' };
  }

  const hashed = await bcrypt.hash(password, 12);

  await db.insert(users).values({ email, name, password: hashed });

  return { success: true };
}

type SetRoleResult = { error: string } | { success: true };

export async function setUserRole(
  role: 'CLIENT' | 'ARTISAN'
): Promise<SetRoleResult> {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Not authenticated.' };

  await db
    .update(users)
    .set({ role, onboardingDone: true })
    .where(eq(users.id, session.user.id));

  return { success: true };
}
