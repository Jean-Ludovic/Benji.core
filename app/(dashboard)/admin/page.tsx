import Link from 'next/link';
import { listArtisans } from '@/lib/artisan-profiles/service';
import { listOpenRequests } from '@/lib/service-requests/service';
import { db } from '@/lib/db';
import { users } from '@/lib/auth/schema';
import { count } from 'drizzle-orm';
import { Users, Wrench, FileText, ArrowRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [artisans, openRequests, [userCount]] = await Promise.all([
    listArtisans({ limit: 5 }),
    listOpenRequests(5),
    db.select({ count: count() }).from(users)
  ]);

  const totalUsers = userCount?.count ?? 0;

  const STATS = [
    {
      icon: Users,
      label: 'Utilisateurs',
      value: totalUsers,
      sub: 'inscrits',
      href: '/admin/users'
    },
    {
      icon: Wrench,
      label: 'Artisans',
      value: artisans.length,
      sub: 'profils actifs',
      href: '/admin/artisans'
    },
    {
      icon: FileText,
      label: 'Demandes',
      value: openRequests.length,
      sub: 'ouvertes',
      href: '/admin/requests'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Administration</h1>
        <p className="text-muted-foreground mt-0.5">Vue d&apos;ensemble de la plateforme</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STATS.map(({ icon: Icon, label, value, sub, href }) => (
          <Link key={label} href={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-3xl font-bold mt-1">{value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
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

      <div className="grid sm:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Derniers artisans</CardTitle>
              <CardDescription>Artisans actifs récents</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/artisans">
                Voir tout <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {artisans.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Aucun artisan inscrit.
              </p>
            ) : (
              <div className="divide-y">
                {artisans.map((a) => (
                  <div key={a.id} className="py-2.5 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {a.user.name ?? a.user.email ?? '—'}
                      </p>
                      {a.location && (
                        <p className="text-xs text-muted-foreground">{a.location}</p>
                      )}
                    </div>
                    {a.isVerified && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full shrink-0">
                        Vérifié
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Dernières demandes</CardTitle>
              <CardDescription>Demandes ouvertes récentes</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/requests">
                Voir tout <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {openRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Aucune demande ouverte.
              </p>
            ) : (
              <div className="divide-y">
                {openRequests.map((req) => (
                  <div key={req.id} className="py-2.5">
                    <p className="text-sm font-medium truncate">{req.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {req.location ?? 'Localisation non précisée'} ·{' '}
                      {new Date(req.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
