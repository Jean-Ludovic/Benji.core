import Link from 'next/link';
import { auth } from '@/lib/auth';
import { getArtisanByUserId } from '@/lib/artisan-profiles/service';
import { getQuotesByArtisan } from '@/lib/quotes/service';
import { Receipt, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export const dynamic = 'force-dynamic';

const STATUS_CONFIG = {
  pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-700' },
  accepted: { label: 'Accepté', className: 'bg-green-100 text-green-700' },
  rejected: { label: 'Refusé', className: 'bg-red-100 text-red-700' },
  expired: { label: 'Expiré', className: 'bg-gray-100 text-gray-600' }
};

export default async function ArtisanQuotesPage() {
  const session = await auth();
  const profile = await getArtisanByUserId(session!.user.id);

  const quotes = profile ? await getQuotesByArtisan(profile.id) : [];

  const stats = {
    total: quotes.length,
    pending: quotes.filter((q) => q.status === 'pending').length,
    accepted: quotes.filter((q) => q.status === 'accepted').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mes devis</h1>
          <p className="text-muted-foreground mt-0.5">
            {quotes.length} devis envoyé{quotes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button asChild>
          <Link href="/artisan/requests">
            Voir les demandes <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {quotes.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total', value: stats.total },
            { label: 'En attente', value: stats.pending },
            { label: 'Acceptés', value: stats.accepted }
          ].map(({ label, value }) => (
            <Card key={label}>
              <CardContent className="pt-5">
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Devis envoyés</CardTitle>
          <CardDescription>
            Suivez le statut de vos propositions commerciales
          </CardDescription>
        </CardHeader>
        <CardContent>
          {quotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Receipt className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="font-medium text-lg">Aucun devis envoyé</p>
              <p className="text-sm text-muted-foreground mt-1 mb-4 max-w-sm">
                Parcourez les demandes des clients et envoyez vos premiers devis.
              </p>
              <Button asChild>
                <Link href="/artisan/requests">
                  Voir les demandes disponibles
                </Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {quotes.map((quote) => {
                const cfg = STATUS_CONFIG[quote.status] ?? STATUS_CONFIG.pending;
                return (
                  <div key={quote.id} className="py-4 flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-lg">
                        {parseFloat(quote.amount).toLocaleString('fr-FR', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </p>
                      {quote.description && (
                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                          {quote.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>
                          Envoyé le {new Date(quote.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                        {quote.validUntil && (
                          <span>
                            Valable jusqu&apos;au{' '}
                            {new Date(quote.validUntil).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${cfg.className}`}
                      >
                        {cfg.label}
                      </span>
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/artisan/requests/${quote.requestId}`}>
                          Voir
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
