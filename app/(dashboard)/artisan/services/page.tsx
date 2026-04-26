import { Wrench, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default function ArtisanServicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mes services</h1>
          <p className="text-muted-foreground mt-0.5">Définissez vos prestations et tarifs</p>
        </div>
        <Button disabled>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un service
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catalogue de services</CardTitle>
          <CardDescription>
            Décrivez précisément chaque prestation pour attirer les bons clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Wrench className="h-8 w-8 text-primary" />
            </div>
            <p className="font-semibold text-lg">Bientôt disponible</p>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              Vous pourrez créer un catalogue de services avec vos tarifs,
              descriptions et photos pour chaque prestation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
