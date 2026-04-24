import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import {
  getArtisanByUserId,
  upsertArtisanProfile
} from '@/lib/artisan-profiles/service';
import { toErrorResponse, Errors } from '@/lib/errors';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) throw Errors.unauthorized();

    const profile = await getArtisanByUserId(session.user.id);
    return Response.json(profile ?? {});
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) throw Errors.unauthorized();
    if (session.user.role !== 'ARTISAN' && session.user.role !== 'ADMIN') {
      throw Errors.forbidden();
    }

    const body = await req.json();
    const profile = await upsertArtisanProfile(session.user.id, body);
    return Response.json(profile);
  } catch (error) {
    return toErrorResponse(error);
  }
}
