import { Briefcase } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default function ClientProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mes projets</h1>
        <p className="text-muted-foreground mt-0.5">Suivez l&apos;avancement de vos chantiers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projets en cours</CardTitle>
          <CardDescription>Vos chantiers acceptés et en cours de réalisation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
            <p className="font-semibold text-lg">Bientôt disponible</p>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              Le suivi de projet vous permettra de suivre l&apos;avancement des chantiers,
              valider les étapes et échanger des documents avec votre artisan.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
