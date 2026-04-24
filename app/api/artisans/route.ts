import { listArtisans } from '@/lib/artisan-profiles/service';
import { toErrorResponse } from '@/lib/errors';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const artisans = await listArtisans();
    return Response.json(artisans);
  } catch (error) {
    return toErrorResponse(error);
  }
}
