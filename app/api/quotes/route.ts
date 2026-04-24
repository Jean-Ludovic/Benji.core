import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import {
  getQuotesByRequest,
  getQuotesByClient,
  createQuote
} from '@/lib/quotes/service';
import { getArtisanByUserId } from '@/lib/artisan-profiles/service';
import { CreateQuoteSchema } from '@/lib/quotes/validation';
import { toErrorResponse, Errors } from '@/lib/errors';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) throw Errors.unauthorized();

    const requestId = req.nextUrl.searchParams.get('requestId');

    if (requestId) {
      const quotes = await getQuotesByRequest(requestId);
      return Response.json(quotes);
    }

    if (session.user.role === 'CLIENT') {
      const quotes = await getQuotesByClient(session.user.id);
      return Response.json(quotes);
    }

    if (session.user.role === 'ARTISAN') {
      const profile = await getArtisanByUserId(session.user.id);
      if (!profile) return Response.json([]);
      const { getQuotesByArtisan } = await import('@/lib/quotes/service');
      const quotes = await getQuotesByArtisan(profile.id);
      return Response.json(quotes);
    }

    return Response.json([]);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) throw Errors.unauthorized();
    if (session.user.role !== 'ARTISAN') throw Errors.forbidden();

    const profile = await getArtisanByUserId(session.user.id);
    if (!profile) throw Errors.badRequest('Profil artisan introuvable');

    const body: unknown = await req.json();
    const parsed = CreateQuoteSchema.safeParse(body);

    if (!parsed.success) {
      throw Errors.badRequest('Données invalides', {
        issues: parsed.error.flatten().fieldErrors
      });
    }

    const quote = await createQuote(profile.id, parsed.data);
    return Response.json(quote, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
