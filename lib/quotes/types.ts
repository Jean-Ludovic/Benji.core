import { quotes } from './schema';

export type Quote = typeof quotes.$inferSelect;
export type NewQuote = typeof quotes.$inferInsert;
export type QuoteStatus = Quote['status'];
