import { pgTable, text, integer, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const serviceCategories = pgTable('service_categories', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  icon: text('icon'),
  sortOrder: integer('sort_order').notNull().default(0)
});
