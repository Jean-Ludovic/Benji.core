'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function QuoteForm({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const form = e.currentTarget;
    const amount = parseFloat((form.elements.namedItem('amount') as HTMLInputElement).value);
    const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value;
    const validUntilStr = (form.elements.namedItem('validUntil') as HTMLInputElement).value;

    startTransition(async () => {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          amount,
          description: description || undefined,
          validUntil: validUntilStr ? new Date(validUntilStr).toISOString() : undefined
        })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.error?.message ?? 'Erreur lors de l\'envoi du devis.');
        return;
      }

      router.push('/artisan/quotes');
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Envoyer un devis</CardTitle>
        <CardDescription>
          Proposez votre offre au client. Soyez précis pour maximiser vos chances.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Montant (€) <span className="text-destructive">*</span>
            </label>
            <Input
              name="amount"
              type="number"
              min="1"
              step="0.01"
              required
              placeholder="Ex : 850"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Description de votre offre</label>
            <textarea
              name="description"
              rows={4}
              placeholder="Détaillez les travaux inclus, la durée estimée, les matériaux utilisés..."
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Valable jusqu&apos;au</label>
            <Input
              name="validUntil"
              type="date"
              min={new Date().toISOString().split('T')[0]}
            />
            <p className="text-xs text-muted-foreground">
              Laissez vide si le devis est valable indéfiniment.
            </p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Envoyer le devis
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
