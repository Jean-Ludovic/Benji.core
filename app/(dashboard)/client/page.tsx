import Link from 'next/link';
import { auth } from '@/lib/auth';
import { listRequestsByClient } from '@/lib/service-requests/service';
import {
  FileText,
  Receipt,
  Briefcase,
  PlusCircle,
  ArrowRight,
  Clock
} from 'lucide-react';
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

export default async function ClientDashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const { requests } = await listRequestsByClient(userId, 5);

  const stats = {
    total: requests.length,
    open: requests.filter((r) => r.status === 'open').length,
    inProgress: requests.filter((r) => r.status === 'in_progress').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Bonjour, {session?.user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-muted-foreground mt-0.5">
            Voici l&apos;état de vos projets
          </p>
        </div>
        <Button asChild>
          <Link href="/client/requests/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle demande
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: FileText, label: 'Demandes totales', value: stats.total, href: '/client/requests' },
          { icon: Clock, label: 'En attente de devis', value: stats.open, href: '/client/requests' },
          { icon: Briefcase, label: 'Projets en cours', value: stats.inProgress, href: '/client/projects' }
        ].map(({ icon: Icon, label, value, href }) => (
          <Link key={label} href={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-3xl font-bold mt-1">{value}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Demandes récentes</CardTitle>
            <CardDescription>Vos 5 dernières demandes de service</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/client/requests">
              Voir tout
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="font-medium">Aucune demande pour l&apos;instant</p>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Créez votre première demande pour recevoir des devis d&apos;artisans.
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
                    className="flex items-center justify-between py-3 hover:bg-muted/50 px-2 rounded-lg transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">{req.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {req.location ?? 'Localisation non précisée'} ·{' '}
                        {new Date(req.createdAt).toLocaleDateString('fr-FR')}
                      </p>
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

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Devis reçus</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Consultez et acceptez les offres d&apos;artisans.
                </p>
                <Button variant="link" className="p-0 h-auto mt-2 text-primary" asChild>
                  <Link href="/client/quotes">
                    Voir mes devis <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Mes projets</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Suivez l&apos;avancement de vos chantiers.
                </p>
                <Button variant="link" className="p-0 h-auto mt-2 text-primary" asChild>
                  <Link href="/client/projects">
                    Voir mes projets <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
