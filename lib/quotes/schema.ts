import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  uuid,
  decimal,
  date
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { artisanProfiles } from '@/lib/artisan-profiles/schema';
import { serviceRequests } from '@/lib/service-requests/schema';

export const quoteStatusEnum = pgEnum('quote_status', [
  'pending',
  'accepted',
  'rejected',
  'expired'
]);

export const quotes = pgTable('quotes', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  requestId: uuid('request_id')
    .notNull()
    .references(() => serviceRequests.id),
  artisanId: uuid('artisan_id')
    .notNull()
    .references(() => artisanProfiles.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  description: text('description'),
  validUntil: date('valid_until'),
  status: quoteStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});
