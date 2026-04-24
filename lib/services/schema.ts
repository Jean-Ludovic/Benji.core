import { pgTable, text, timestamp, boolean, uuid, decimal } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { artisanProfiles } from '@/lib/artisan-profiles/schema';
import { serviceCategories } from '@/lib/service-categories/schema';

export const services = pgTable('services', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  artisanId: uuid('artisan_id')
    .notNull()
    .references(() => artisanProfiles.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => serviceCategories.id),
  title: text('title').notNull(),
  description: text('description'),
  basePrice: decimal('base_price', { precision: 10, scale: 2 }),
  priceUnit: text('price_unit').default('devis'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});
