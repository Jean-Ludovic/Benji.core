import { listOpenRequests } from '@/lib/service-requests/service';
import { Inbox } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ArtisanRequestsPage() {
  const requests = await listOpenRequests(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Demandes disponibles</h1>
        <p className="text-muted-foreground mt-0.5">
          {requests.length} demande{requests.length !== 1 ? 's' : ''} ouverte
          {requests.length !== 1 ? 's' : ''}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demandes de clients</CardTitle>
          <CardDescription>
            Répondez aux demandes qui correspondent à votre activité
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Inbox className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="font-medium text-lg">Aucune demande disponible</p>
              <p className="text-sm text-muted-foreground mt-1">
                De nouvelles demandes arrivent régulièrement. Revenez bientôt !
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="py-4 flex items-start justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{req.title}</p>
                    {req.description && (
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                        {req.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      {req.location && (
                        <span className="bg-muted px-2 py-0.5 rounded-full">
                          📍 {req.location}
                        </span>
                      )}
                      {req.budgetMax && (
                        <span className="bg-muted px-2 py-0.5 rounded-full">
                          💰 Jusqu&apos;à {req.budgetMax}€
                        </span>
                      )}
                      {req.desiredDate && (
                        <span className="bg-muted px-2 py-0.5 rounded-full">
                          📅{' '}
                          {new Date(req.desiredDate).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                      <span className="text-muted-foreground">
                        Publié le{' '}
                        {new Date(req.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" className="shrink-0" asChild>
                    <Link href={`/artisan/requests/${req.id}`}>
                      Faire un devis
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
