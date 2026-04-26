'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2, Clock, Euro } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Quote } from '@/lib/quotes/types';

const STATUS_CONFIG = {
  pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-700' },
  accepted: { label: 'Accepté', className: 'bg-green-100 text-green-700' },
  rejected: { label: 'Refusé', className: 'bg-red-100 text-red-700' },
  expired: { label: 'Expiré', className: 'bg-gray-100 text-gray-600' }
};

export function QuoteActions({ quotes }: { quotes: Quote[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handle(quoteId: string, status: 'accepted' | 'rejected') {
    setLoading(quoteId + status);
    await fetch(`/api/quotes/${quoteId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    setLoading(null);
    router.refresh();
  }

  if (quotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Clock className="h-10 w-10 text-muted-foreground/30 mb-3" />
        <p className="font-medium">Aucun devis reçu</p>
        <p className="text-sm text-muted-foreground mt-1">
          Les artisans peuvent encore répondre à votre demande.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {quotes.map((quote) => {
        const cfg = STATUS_CONFIG[quote.status] ?? STATUS_CONFIG.pending;
        const isPending = quote.status === 'pending';

        return (
          <div key={quote.id} className="py-4 flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xl font-bold">
                  {parseFloat(quote.amount).toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </p>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${cfg.className}`}>
                  {cfg.label}
                </span>
              </div>
              {quote.description && (
                <p className="text-sm text-muted-foreground">{quote.description}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Reçu le {new Date(quote.createdAt).toLocaleDateString('fr-FR')}
                {quote.validUntil &&
                  ` · Valable jusqu'au ${new Date(quote.validUntil).toLocaleDateString('fr-FR')}`}
              </p>
            </div>

            {isPending && (
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  disabled={loading !== null}
                  onClick={() => handle(quote.id, 'rejected')}
                >
                  {loading === quote.id + 'rejected' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline ml-1">Refuser</span>
                </Button>
                <Button
                  size="sm"
                  disabled={loading !== null}
                  onClick={() => handle(quote.id, 'accepted')}
                >
                  {loading === quote.id + 'accepted' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline ml-1">Accepter</span>
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
