import Link from 'next/link';
import { listArtisans } from '@/lib/artisan-profiles/service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Star, Briefcase, Shield, Search, ArrowRight } from 'lucide-react';
import type { ArtisanWithUser } from '@/lib/artisan-profiles/service';

export const dynamic = 'force-dynamic';

type Props = { searchParams: Promise<{ q?: string }> };

export default async function ArtisansPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = params.q?.toLowerCase() ?? '';

  const all = await listArtisans({ limit: 100 });

  const artisans = q
    ? all.filter((a) => {
        const name = (a.user.name ?? '').toLowerCase();
        const company = (a.companyName ?? '').toLowerCase();
        const loc = (a.location ?? '').toLowerCase();
        const bio = (a.bio ?? '').toLowerCase();
        return name.includes(q) || company.includes(q) || loc.includes(q) || bio.includes(q);
      })
    : all;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-black text-sm">F</span>
            </div>
            <span>Fastoche</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/artisans" className="font-medium text-foreground">
              Trouver un artisan
            </Link>
            <Link href="/login?tab=signup&role=artisan" className="text-muted-foreground hover:text-foreground transition-colors">
              Devenir artisan
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Se connecter</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/login?tab=signup">
                Commencer <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Nos artisans</h1>
            <p className="text-muted-foreground mt-1">
              {artisans.length} artisan{artisans.length !== 1 ? 's' : ''} disponible{artisans.length !== 1 ? 's' : ''}
              {q && ` pour « ${params.q} »`}
            </p>
          </div>

          <form action="/artisans" method="GET" className="mb-8">
            <div className="flex gap-3 max-w-lg">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="q"
                  defaultValue={params.q ?? ''}
                  placeholder="Nom, spécialité, ville..."
                  className="pl-9"
                />
              </div>
              <Button type="submit">Rechercher</Button>
              {q && (
                <Button variant="ghost" asChild>
                  <Link href="/artisans">Effacer</Link>
                </Button>
              )}
            </div>
          </form>

          {artisans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="font-medium text-lg">Aucun artisan trouvé</p>
              <p className="text-sm text-muted-foreground mt-1">
                Essayez avec d&apos;autres mots-clés ou{' '}
                <Link href="/artisans" className="text-primary underline">
                  voir tous les artisans
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {artisans.map((a) => (
                <ArtisanCard key={a.id} artisan={a} />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t py-8 px-4 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-white font-black text-xs">F</span>
            </div>
            <span>Fastoche</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Fastoche. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}

function ArtisanCard({ artisan }: { artisan: ArtisanWithUser }) {
  const initials = (artisan.user.name ?? 'A')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0 text-primary font-bold overflow-hidden">
            {artisan.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={artisan.user.image} alt="" className="w-12 h-12 object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="font-semibold truncate">{artisan.user.name ?? 'Artisan'}</p>
              {artisan.isVerified && (
                <Shield className="h-3.5 w-3.5 text-primary shrink-0" />
              )}
            </div>
            {artisan.companyName && (
              <p className="text-xs text-muted-foreground truncate">{artisan.companyName}</p>
            )}
          </div>
        </div>

        {artisan.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{artisan.bio}</p>
        )}

        <div className="flex flex-wrap gap-3 mb-4 text-xs text-muted-foreground">
          {artisan.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {artisan.location}
            </span>
          )}
          {artisan.yearsExperience && (
            <span className="flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              {artisan.yearsExperience} ans
            </span>
          )}
          {artisan.avgRating && parseFloat(artisan.avgRating) > 0 && (
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {parseFloat(artisan.avgRating).toFixed(1)}
            </span>
          )}
        </div>

        <Button size="sm" variant="outline" className="w-full" asChild>
          <Link href={`/artisans/${artisan.id}`}>Voir le profil</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
