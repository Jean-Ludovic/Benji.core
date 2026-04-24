import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import {
  getRequestById,
  updateRequest
} from '@/lib/service-requests/service';
import { UpdateRequestSchema } from '@/lib/service-requests/validation';
import { toErrorResponse, Errors } from '@/lib/errors';

export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) throw Errors.unauthorized();

    const request = await getRequestById(id);
    return Response.json(request);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) throw Errors.unauthorized();

    const body: unknown = await req.json();
    const parsed = UpdateRequestSchema.safeParse(body);

    if (!parsed.success) {
      throw Errors.badRequest('Données invalides', {
        issues: parsed.error.flatten().fieldErrors
      });
    }

    const updated = await updateRequest(id, session.user.id, parsed.data);
    return Response.json(updated);
  } catch (error) {
    return toErrorResponse(error);
  }
}
