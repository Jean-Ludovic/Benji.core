import { listArtisans } from '@/lib/artisan-profiles/service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, MapPin, Star, CheckCircle2, XCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminArtisansPage() {
  const artisans = await listArtisans({ limit: 100 });

  const verified = artisans.filter((a) => a.isVerified).length;
  const active = artisans.filter((a) => a.isActive).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Artisans</h1>
        <p className="text-muted-foreground mt-0.5">
          {artisans.length} artisan{artisans.length !== 1 ? 's' : ''} inscrits
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: artisans.length },
          { label: 'Actifs', value: active },
          { label: 'Vérifiés', value: verified }
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="pt-5">
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des artisans</CardTitle>
          <CardDescription>Tous les artisans inscrits sur la plateforme</CardDescription>
        </CardHeader>
        <CardContent>
          {artisans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Shield className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="font-medium">Aucun artisan inscrit</p>
            </div>
          ) : (
            <div className="divide-y">
              {artisans.map((artisan) => (
                <div key={artisan.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">
                        {artisan.user.name ?? artisan.user.email ?? 'Artisan'}
                      </p>
                      {artisan.isVerified ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                      {artisan.companyName && <span>{artisan.companyName}</span>}
                      {artisan.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {artisan.location}
                        </span>
                      )}
                      {artisan.avgRating && parseFloat(artisan.avgRating) > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {parseFloat(artisan.avgRating).toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        artisan.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {artisan.isActive ? 'Actif' : 'Inactif'}
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
