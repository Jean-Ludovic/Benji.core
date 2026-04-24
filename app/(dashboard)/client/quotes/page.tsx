import { auth } from '@/lib/auth';
import { getQuotesByClient } from '@/lib/quotes/service';
import { Receipt } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export const dynamic = 'force-dynamic';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
  accepted: { label: 'Accepté', color: 'bg-green-100 text-green-700' },
  rejected: { label: 'Refusé', color: 'bg-red-100 text-red-700' },
  expired: { label: 'Expiré', color: 'bg-gray-100 text-gray-600' }
};

export default async function ClientQuotesPage() {
  const session = await auth();
  const quotes = await getQuotesByClient(session!.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mes devis</h1>
        <p className="text-muted-foreground mt-0.5">
          {quotes.length} devis reçu{quotes.length !== 1 ? 's' : ''}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Devis reçus</CardTitle>
          <CardDescription>
            Consultez et acceptez les offres des artisans
          </CardDescription>
        </CardHeader>
        <CardContent>
          {quotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Receipt className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="font-medium text-lg">Aucun devis reçu</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Créez une demande de service pour commencer à recevoir des offres
                d&apos;artisans.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {quotes.map((quote) => {
                const status = STATUS_LABELS[quote.status] ?? STATUS_LABELS.pending;
                return (
                  <div key={quote.id} className="py-4 flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">
                        {parseFloat(quote.amount).toLocaleString('fr-FR')} €
                      </p>
                      {quote.description && (
                        <p className="text-sm text-muted-foreground mt-0.5 truncate">
                          {quote.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Reçu le{' '}
                        {new Date(quote.createdAt).toLocaleDateString('fr-FR')}
                        {quote.validUntil && ` · Valable jusqu'au ${new Date(quote.validUntil).toLocaleDateString('fr-FR')}`}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}
                    >
                      {status.label}
                    </span>
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
