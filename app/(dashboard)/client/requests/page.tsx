import Link from 'next/link';
import { auth } from '@/lib/auth';
import { listRequestsByClient } from '@/lib/service-requests/service';
import { PlusCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export const dynamic = 'force-dynamic';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  open: { label: 'Ouverte', color: 'bg-blue-100 text-blue-700' },
  in_progress: { label: 'En cours', color: 'bg-yellow-100 text-yellow-700' },
  completed: { label: 'Terminée', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Annulée', color: 'bg-gray-100 text-gray-600' }
};

export default async function ClientRequestsPage() {
  const session = await auth();
  const { requests } = await listRequestsByClient(session!.user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mes demandes</h1>
          <p className="text-muted-foreground mt-0.5">
            {requests.length} demande{requests.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button asChild>
          <Link href="/client/requests/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle demande
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Toutes mes demandes</CardTitle>
          <CardDescription>Suivez l&apos;état de vos demandes de service</CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="font-medium text-lg">Aucune demande</p>
              <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-sm">
                Créez votre première demande pour recevoir des devis d&apos;artisans
                qualifiés près de chez vous.
              </p>
              <Button asChild>
                <Link href="/client/requests/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Créer une demande
                </Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {requests.map((req) => {
                const status = STATUS_LABELS[req.status] ?? STATUS_LABELS.open;
                return (
                  <Link
                    key={req.id}
                    href={`/client/requests/${req.id}`}
                    className="flex items-center justify-between py-4 hover:bg-muted/40 px-2 rounded-lg transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate">{req.title}</p>
                      {req.description && (
                        <p className="text-sm text-muted-foreground truncate mt-0.5">
                          {req.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        {req.location && <span>{req.location}</span>}
                        {req.budgetMin && (
                          <span>
                            Budget : {req.budgetMin}
                            {req.budgetMax ? ` – ${req.budgetMax}` : ''}€
                          </span>
                        )}
                        <span>
                          {new Date(req.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 ml-4 text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
