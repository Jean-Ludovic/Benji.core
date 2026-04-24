import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import {
  listRequestsByClient,
  listOpenRequests,
  createRequest
} from '@/lib/service-requests/service';
import { CreateRequestSchema } from '@/lib/service-requests/validation';
import { toErrorResponse, Errors } from '@/lib/errors';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) throw Errors.unauthorized();

    const { searchParams } = req.nextUrl;
    const mode = searchParams.get('mode');

    if (mode === 'open' || session.user.role === 'ARTISAN') {
      const requests = await listOpenRequests(50);
      return Response.json(requests);
    }

    const { requests, nextCursor } = await listRequestsByClient(session.user.id);
    return Response.json({ requests, nextCursor });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) throw Errors.unauthorized();
    if (session.user.role !== 'CLIENT' && session.user.role !== 'ADMIN') {
      throw Errors.forbidden();
    }

    const body: unknown = await req.json();
    const parsed = CreateRequestSchema.safeParse(body);

    if (!parsed.success) {
      throw Errors.badRequest('Données invalides', {
        issues: parsed.error.flatten().fieldErrors
      });
    }

    const request = await createRequest(session.user.id, parsed.data);
    return Response.json(request, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
