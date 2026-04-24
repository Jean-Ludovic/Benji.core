import { serviceRequests } from './schema';

export type ServiceRequest = typeof serviceRequests.$inferSelect;
export type NewServiceRequest = typeof serviceRequests.$inferInsert;
export type RequestStatus = ServiceRequest['status'];

export type PaginatedRequests = {
  requests: ServiceRequest[];
  nextCursor: string | null;
};
