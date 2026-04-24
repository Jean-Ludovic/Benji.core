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
import { artisanProfiles } from '@/lib/artisan-profiles/schema';
import { quotes } from '@/lib/quotes/schema';

export const projectStatusEnum = pgEnum('project_status', [
  'scheduled',
  'in_progress',
  'completed',
  'cancelled'
]);

export const projectTaskStatusEnum = pgEnum('project_task_status', [
  'todo',
  'in_progress',
  'done'
]);

export const projects = pgTable('projects', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  quoteId: uuid('quote_id').unique().references(() => quotes.id),
  clientId: text('client_id')
    .notNull()
    .references(() => users.id),
  artisanId: uuid('artisan_id')
    .notNull()
    .references(() => artisanProfiles.id),
  title: text('title').notNull(),
  description: text('description'),
  status: projectStatusEnum('status').notNull().default('scheduled'),
  startDate: date('start_date'),
  endDate: date('end_date'),
  finalAmount: decimal('final_amount', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

export const projectTasks = pgTable('project_tasks', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  status: projectTaskStatusEnum('status').notNull().default('todo'),
  dueDate: timestamp('due_date', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});
