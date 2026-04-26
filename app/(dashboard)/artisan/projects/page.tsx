import { Briefcase } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default function ArtisanProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mes projets</h1>
        <p className="text-muted-foreground mt-0.5">Chantiers en cours et terminés</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projets acceptés</CardTitle>
          <CardDescription>Gérez vos chantiers en cours de réalisation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
            <p className="font-semibold text-lg">Bientôt disponible</p>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              La gestion de projet vous permettra de suivre chaque chantier,
              partager des photos et communiquer avec vos clients.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
