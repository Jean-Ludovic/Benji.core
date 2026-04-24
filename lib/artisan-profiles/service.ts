import 'server-only';

import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { artisanProfiles } from './schema';
import { users } from '@/lib/auth/schema';
import { Errors } from '@/lib/errors';
import type { ArtisanProfile, NewArtisanProfile } from './types';

export async function getArtisanByUserId(
  userId: string
): Promise<ArtisanProfile | null> {
  const [profile] = await db
    .select()
    .from(artisanProfiles)
    .where(eq(artisanProfiles.userId, userId))
    .limit(1);
  return profile ?? null;
}

export async function getArtisanById(id: string): Promise<ArtisanProfile> {
  const [profile] = await db
    .select()
    .from(artisanProfiles)
    .where(eq(artisanProfiles.id, id))
    .limit(1);
  if (!profile) throw Errors.notFound('Artisan');
  return profile;
}

export type ArtisanWithUser = ArtisanProfile & {
  user: { name: string | null; email: string | null; image: string | null };
};

export async function listArtisans(opts?: {
  limit?: number;
}): Promise<ArtisanWithUser[]> {
  const limit = opts?.limit ?? 20;
  const rows = await db
    .select({
      profile: artisanProfiles,
      user: {
        name: users.name,
        email: users.email,
        image: users.image
      }
    })
    .from(artisanProfiles)
    .innerJoin(users, eq(artisanProfiles.userId, users.id))
    .where(eq(artisanProfiles.isActive, true))
    .limit(limit);

  return rows.map((r) => ({ ...r.profile, user: r.user }));
}

export async function upsertArtisanProfile(
  userId: string,
  data: Partial<NewArtisanProfile>
): Promise<ArtisanProfile> {
  const existing = await getArtisanByUserId(userId);

  if (existing) {
    const [updated] = await db
      .update(artisanProfiles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(artisanProfiles.userId, userId))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(artisanProfiles)
    .values({ ...data, userId })
    .returning();
  return created;
}
