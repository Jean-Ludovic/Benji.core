import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { updateQuoteStatus } from '@/lib/quotes/service';
import { UpdateQuoteStatusSchema } from '@/lib/quotes/validation';
import { toErrorResponse, Errors } from '@/lib/errors';

export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) throw Errors.unauthorized();
    if (session.user.role !== 'CLIENT') throw Errors.forbidden();

    const body: unknown = await req.json();
    const parsed = UpdateQuoteStatusSchema.safeParse(body);

    if (!parsed.success) {
      throw Errors.badRequest('Statut invalide');
    }

    const updated = await updateQuoteStatus(id, parsed.data.status);
    return Response.json(updated);
  } catch (error) {
    return toErrorResponse(error);
  }
}
