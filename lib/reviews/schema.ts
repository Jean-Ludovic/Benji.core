import { pgTable, text, timestamp, integer, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from '@/lib/auth/schema';
import { artisanProfiles } from '@/lib/artisan-profiles/schema';
import { projects } from '@/lib/projects/schema';

export const reviews = pgTable('reviews', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  projectId: uuid('project_id')
    .unique()
    .references(() => projects.id),
  reviewerId: text('reviewer_id')
    .notNull()
    .references(() => users.id),
  artisanId: uuid('artisan_id')
    .notNull()
    .references(() => artisanProfiles.id),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});
