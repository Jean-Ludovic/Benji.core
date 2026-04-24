import 'server-only';

import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { quotes } from './schema';
import { serviceRequests } from '@/lib/service-requests/schema';
import { Errors } from '@/lib/errors';
import type { Quote } from './types';
import type { CreateQuoteInput } from './validation';

export async function getQuotesByRequest(requestId: string): Promise<Quote[]> {
  return db
    .select()
    .from(quotes)
    .where(eq(quotes.requestId, requestId));
}

export async function getQuotesByArtisan(artisanId: string): Promise<Quote[]> {
  return db
    .select()
    .from(quotes)
    .where(eq(quotes.artisanId, artisanId));
}

export async function getQuotesByClient(clientId: string): Promise<Quote[]> {
  const clientRequests = await db
    .select({ id: serviceRequests.id })
    .from(serviceRequests)
    .where(eq(serviceRequests.clientId, clientId));

  if (clientRequests.length === 0) return [];

  const requestIds = clientRequests.map((r) => r.id);
  const allQuotes: Quote[] = [];

  for (const reqId of requestIds) {
    const reqQuotes = await db
      .select()
      .from(quotes)
      .where(eq(quotes.requestId, reqId));
    allQuotes.push(...reqQuotes);
  }

  return allQuotes;
}

export async function createQuote(
  artisanProfileId: string,
  data: CreateQuoteInput
): Promise<Quote> {
  const [quote] = await db
    .insert(quotes)
    .values({
      requestId: data.requestId,
      artisanId: artisanProfileId,
      amount: data.amount.toString(),
      description: data.description,
      validUntil: data.validUntil
    })
    .returning();
  return quote;
}

export async function updateQuoteStatus(
  quoteId: string,
  status: 'accepted' | 'rejected'
): Promise<Quote> {
  const [updated] = await db
    .update(quotes)
    .set({ status, updatedAt: new Date() })
    .where(eq(quotes.id, quoteId))
    .returning();
  if (!updated) throw Errors.notFound('Devis');
  return updated;
}
