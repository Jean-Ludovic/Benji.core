import 'server-only';

import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { serviceRequests } from './schema';
import { Errors } from '@/lib/errors';
import type { ServiceRequest, PaginatedRequests } from './types';
import type { CreateRequestInput, UpdateRequestInput } from './validation';

export async function listRequestsByClient(
  clientId: string,
  limit = 20
): Promise<PaginatedRequests> {
  const rows = await db
    .select()
    .from(serviceRequests)
    .where(eq(serviceRequests.clientId, clientId))
    .orderBy(desc(serviceRequests.createdAt))
    .limit(limit + 1);

  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  return { requests: items, nextCursor: hasMore ? items[items.length - 1].id : null };
}

export async function listOpenRequests(limit = 20): Promise<ServiceRequest[]> {
  return db
    .select()
    .from(serviceRequests)
    .where(eq(serviceRequests.status, 'open'))
    .orderBy(desc(serviceRequests.createdAt))
    .limit(limit);
}

export async function getRequestById(id: string): Promise<ServiceRequest> {
  const [req] = await db
    .select()
    .from(serviceRequests)
    .where(eq(serviceRequests.id, id))
    .limit(1);
  if (!req) throw Errors.notFound('Demande');
  return req;
}

export async function createRequest(
  clientId: string,
  data: CreateRequestInput
): Promise<ServiceRequest> {
  const [req] = await db
    .insert(serviceRequests)
    .values({
      clientId,
      title: data.title,
      description: data.description,
      categoryId: data.categoryId,
      location: data.location,
      budgetMin: data.budgetMin?.toString(),
      budgetMax: data.budgetMax?.toString(),
      desiredDate: data.desiredDate
    })
    .returning();
  return req;
}

export async function updateRequest(
  id: string,
  clientId: string,
  data: UpdateRequestInput
): Promise<ServiceRequest> {
  const existing = await getRequestById(id);
  if (existing.clientId !== clientId) throw Errors.forbidden();

  const [updated] = await db
    .update(serviceRequests)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(serviceRequests.id, id))
    .returning();
  return updated;
}
