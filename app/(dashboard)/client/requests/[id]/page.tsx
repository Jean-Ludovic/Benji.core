import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getRequestById } from '@/lib/service-requests/service';
import { getQuotesByRequest } from '@/lib/quotes/service';
import { QuoteActions } from './quote-actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ArrowLeft, MapPin, Euro, CalendarDays } from 'lucide-react';

export const dynamic = 'force-dynamic';

const STATUS_CONFIG = {
  open: { label: 'Ouverte', className: 'bg-blue-100 text-blue-700' },
  in_progress: { label: 'En cours', className: 'bg-yellow-100 text-yellow-700' },
  completed: { label: 'Terminée', className: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Annulée', className: 'bg-gray-100 text-gray-600' }
};

type Props = { params: Promise<{ id: string }> };

export default async function ClientRequestDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  const request = await getRequestById(id).catch(() => null);
  if (!request || request.clientId !== session!.user.id) notFound();

  const quotes = await getQuotesByRequest(id);

  const status = STATUS_CONFIG[request.status] ?? STATUS_CONFIG.open;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/client/requests">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Mes demandes
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-xl">{request.title}</CardTitle>
              <CardDescription className="mt-1">
                Publiée le {new Date(request.createdAt).toLocaleDateString('fr-FR')}
              </CardDescription>
            </div>
            <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}>
              {status.label}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {request.description && (
            <p className="text-sm leading-relaxed">{request.description}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
            {request.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                {request.location}
              </span>
            )}
            {(request.budgetMin || request.budgetMax) && (
              <span className="flex items-center gap-1.5">
                <Euro className="h-4 w-4 text-primary" />
                Budget :{' '}
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

      <Card>
        <CardHeader>
          <CardTitle>
            Devis reçus{' '}
            <span className="text-muted-foreground font-normal text-base">
              ({quotes.length})
            </span>
          </CardTitle>
          <CardDescription>
            {quotes.filter((q) => q.status === 'pending').length > 0
              ? 'Acceptez ou refusez les offres des artisans.'
              : 'Historique des devis pour cette demande.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QuoteActions quotes={quotes} />
        </CardContent>
      </Card>
    </div>
  );
}
