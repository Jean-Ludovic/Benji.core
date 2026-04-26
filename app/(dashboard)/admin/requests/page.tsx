import { listOpenRequests } from '@/lib/service-requests/service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, MapPin, Euro } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminRequestsPage() {
  const requests = await listOpenRequests(100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Demandes</h1>
        <p className="text-muted-foreground mt-0.5">
          {requests.length} demande{requests.length !== 1 ? 's' : ''} ouvertes
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demandes ouvertes</CardTitle>
          <CardDescription>Toutes les demandes clients en attente de devis</CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="font-medium">Aucune demande ouverte</p>
            </div>
          ) : (
            <div className="divide-y">
              {requests.map((req) => (
                <div key={req.id} className="py-3">
                  <p className="font-medium">{req.title}</p>
                  {req.description && (
                    <p className="text-sm text-muted-foreground truncate mt-0.5">
                      {req.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                    {req.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {req.location}
                      </span>
                    )}
                    {req.budgetMax && (
                      <span className="flex items-center gap-1">
                        <Euro className="h-3 w-3" />
                        Jusqu&apos;à {req.budgetMax} €
                      </span>
                    )}
                    <span>
                      {new Date(req.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
