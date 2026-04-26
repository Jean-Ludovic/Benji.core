import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getRequestById } from '@/lib/service-requests/service';
import { getArtisanByUserId } from '@/lib/artisan-profiles/service';
import { getQuotesByRequest } from '@/lib/quotes/service';
import { QuoteForm } from './quote-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MapPin, Euro, CalendarDays, CheckCircle2, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

const QUOTE_STATUS_CONFIG = {
  pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-700' },
  accepted: { label: 'Accepté ✓', className: 'bg-green-100 text-green-700' },
  rejected: { label: 'Refusé', className: 'bg-red-100 text-red-700' },
  expired: { label: 'Expiré', className: 'bg-gray-100 text-gray-600' }
};

type Props = { params: Promise<{ id: string }> };

export default async function ArtisanRequestDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  const [request, artisanProfile] = await Promise.all([
    getRequestById(id).catch(() => null),
    getArtisanByUserId(session!.user.id)
  ]);

  if (!request) notFound();

  const quotes = await getQuotesByRequest(id);
  const myQuote = artisanProfile
    ? quotes.find((q) => q.artisanId === artisanProfile.id)
    : null;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/artisan/requests">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Demandes disponibles
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{request.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Publiée le {new Date(request.createdAt).toLocaleDateString('fr-FR')}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {request.description && (
            <p className="text-sm leading-relaxed">{request.description}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {request.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                {request.location}
              </span>
            )}
            {(request.budgetMin || request.budgetMax) && (
              <span className="flex items-center gap-1.5">
                <Euro className="h-4 w-4 text-primary" />
                {request.budgetMin && request.budgetMax
                  ? `${request.budgetMin} – ${request.budgetMax} €`
                  : request.budgetMax
                  ? `jusqu'à ${request.budgetMax} €`
                  : `à partir de ${request.budgetMin} €`}
              </span>
            )}
            {request.desiredDate && (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-primary" />
                Souhaité le{' '}
                {new Date(request.desiredDate).toLocaleDateString('fr-FR')}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {!artisanProfile ? (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-5">
            <p className="font-semibold text-sm">Profil artisan requis</p>
            <p className="text-sm text-muted-foreground mt-1">
              Vous devez compléter votre profil artisan avant d&apos;envoyer un devis.
            </p>
            <Button size="sm" className="mt-3" asChild>
              <Link href="/artisan/profile">Compléter mon profil</Link>
            </Button>
          </CardContent>
        </Card>
      ) : myQuote ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {myQuote.status === 'accepted' ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <Clock className="h-5 w-5 text-yellow-600" />
              )}
              Votre devis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">
                {parseFloat(myQuote.amount).toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR'
                })}
              </p>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  QUOTE_STATUS_CONFIG[myQuote.status]?.className ?? ''
                }`}
              >
                {QUOTE_STATUS_CONFIG[myQuote.status]?.label ?? myQuote.status}
              </span>
            </div>
            {myQuote.description && (
              <p className="text-sm text-muted-foreground">{myQuote.description}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Envoyé le {new Date(myQuote.createdAt).toLocaleDateString('fr-FR')}
              {myQuote.validUntil &&
                ` · Valable jusqu'au ${new Date(myQuote.validUntil).toLocaleDateString('fr-FR')}`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <QuoteForm requestId={id} />
      )}
    </div>
  );
}
