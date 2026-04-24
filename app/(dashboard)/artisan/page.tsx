import Link from 'next/link';
import { auth } from '@/lib/auth';
import { getArtisanByUserId } from '@/lib/artisan-profiles/service';
import { listOpenRequests } from '@/lib/service-requests/service';
import { getQuotesByArtisan } from '@/lib/quotes/service';
import {
  User,
  Inbox,
  Receipt,
  Briefcase,
  ArrowRight,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import type { ArtisanProfile } from '@/lib/artisan-profiles/types';
import type { Quote } from '@/lib/quotes/types';
import type { ServiceRequest } from '@/lib/service-requests/types';

export const dynamic = 'force-dynamic';

export default async function ArtisanDashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const profile: ArtisanProfile | null = await getArtisanByUserId(userId);

  const [openRequests, myQuotes]: [ServiceRequest[], Quote[]] = await Promise.all([
    listOpenRequests(5),
    profile ? getQuotesByArtisan(profile.id) : Promise.resolve([])
  ]);

  const profileComplete =
    profile && profile.bio && profile.location && profile.phone;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Bonjour, {session?.user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-0.5">Votre espace artisan</p>
      </div>

      {!profileComplete && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-sm">
                  Complétez votre profil pour recevoir des demandes
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Un profil complet augmente vos chances d&apos;être contacté par
                  des clients.
                </p>
              </div>
              <Button size="sm" asChild>
                <Link href="/artisan/profile">Compléter</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            icon: Inbox,
            label: 'Nouvelles demandes',
            value: openRequests.length,
            href: '/artisan/requests'
          },
          {
            icon: Receipt,
            label: 'Devis envoyés',
            value: myQuotes.length,
            href: '/artisan/quotes'
          },
          {
            icon: Briefcase,
            label: 'Projets actifs',
            value: 0,
            href: '/artisan/projects'
          },
          {
            icon: profileComplete ? CheckCircle2 : User,
            label: 'Profil',
            value: profileComplete ? '✓ Complet' : 'À compléter',
            href: '/artisan/profile'
          }
        ].map(({ icon: Icon, label, value, href }) => (
          <Link key={label} href={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="pt-5">
                <div className="flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground leading-tight">{label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Demandes disponibles</CardTitle>
            <CardDescription>
              Clients qui recherchent un artisan près de vous
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/artisan/requests">
              Voir tout <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {openRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Inbox className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="font-medium">Aucune demande pour l&apos;instant</p>
              <p className="text-sm text-muted-foreground mt-1">
                Revenez plus tard, de nouvelles demandes arrivent régulièrement.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {openRequests.map((req) => (
                <Link
                  key={req.id}
                  href={`/artisan/requests/${req.id}`}
                  className="flex items-center justify-between py-3 hover:bg-muted/40 px-2 rounded-lg transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{req.title}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                      {req.location && <span>{req.location}</span>}
                      {req.budgetMax && (
                        <span>Budget : jusqu&apos;à {req.budgetMax}€</span>
                      )}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="shrink-0 ml-4">
                    Répondre
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
