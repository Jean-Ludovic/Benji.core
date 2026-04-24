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
import { users } from '@/lib/auth/schema';
import { serviceCategories } from '@/lib/service-categories/schema';

export const requestStatusEnum = pgEnum('request_status', [
  'open',
  'in_progress',
  'completed',
  'cancelled'
]);

export const serviceRequests = pgTable('service_requests', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  clientId: text('client_id')
    .notNull()
    .references(() => users.id),
  categoryId: uuid('category_id').references(() => serviceCategories.id),
  title: text('title').notNull(),
  description: text('description'),
  location: text('location'),
  budgetMin: decimal('budget_min', { precision: 10, scale: 2 }),
  budgetMax: decimal('budget_max', { precision: 10, scale: 2 }),
  desiredDate: date('desired_date'),
  status: requestStatusEnum('status').notNull().default('open'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});
