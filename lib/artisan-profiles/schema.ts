import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  uuid,
  decimal
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from '@/lib/auth/schema';

export const artisanProfiles = pgTable('artisan_profiles', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  companyName: text('company_name'),
  siret: text('siret'),
  bio: text('bio'),
  yearsExperience: integer('years_experience'),
  location: text('location'),
  radiusKm: integer('radius_km').default(30),
  isVerified: boolean('is_verified').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  phone: text('phone'),
  website: text('website'),
  avgRating: decimal('avg_rating', { precision: 3, scale: 2 }),
  reviewCount: integer('review_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});
