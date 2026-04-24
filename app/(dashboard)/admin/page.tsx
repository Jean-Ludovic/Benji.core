import { Users, Wrench, FileText, BarChart3 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export const dynamic = 'force-dynamic';

// TODO: Replace with real DB queries
const MOCK_STATS = [
  { icon: Users, label: 'Utilisateurs', value: '—', sub: 'clients inscrits' },
  { icon: Wrench, label: 'Artisans', value: '—', sub: 'profils actifs' },
  { icon: FileText, label: 'Demandes', value: '—', sub: 'en cours' },
  { icon: BarChart3, label: 'Devis', value: '—', sub: 'ce mois' }
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Administration</h1>
        <p className="text-muted-foreground mt-0.5">Vue d&apos;ensemble de la plateforme</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {MOCK_STATS.map(({ icon: Icon, label, value, sub }) => (
          <Card key={label}>
            <CardContent className="pt-5">
              <div className="flex flex-col gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-bold">{value}</p>
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>TODO — Statistiques avancées</CardTitle>
          <CardDescription>
            Cette section nécessite l&apos;implémentation des requêtes DB admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>Graphique des inscriptions par semaine</li>
            <li>Liste des artisans en attente de validation</li>
            <li>Modération des avis et profils</li>
            <li>Statistiques des devis acceptés/refusés</li>
            <li>Revenus et commissions (si modèle monétisé)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
