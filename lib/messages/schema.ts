import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from '@/lib/auth/schema';
import { serviceRequests } from '@/lib/service-requests/schema';

export const messages = pgTable('messages', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  senderId: text('sender_id')
    .notNull()
    .references(() => users.id),
  recipientId: text('recipient_id')
    .notNull()
    .references(() => users.id),
  requestId: uuid('request_id').references(() => serviceRequests.id),
  content: text('content').notNull(),
  readAt: timestamp('read_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});
