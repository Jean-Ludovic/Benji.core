import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArtisanByIdWithUser } from '@/lib/artisan-profiles/service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MapPin,
  Star,
  Briefcase,
  Shield,
  Phone,
  Globe,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export default async function PublicArtisanProfilePage({ params }: Props) {
  const { id } = await params;
  const artisan = await getArtisanByIdWithUser(id).catch(() => null);
  if (!artisan) notFound();

  const initials = (artisan.user.name ?? 'A')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

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

      <main className="flex-1 bg-muted/30 py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <Link
            href="/artisans"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux artisans
          </Link>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-5">
                <div className="w-20 h-20 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0 text-primary font-bold text-xl overflow-hidden">
                  {artisan.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={artisan.user.image} alt="" className="w-20 h-20 object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold">{artisan.user.name ?? 'Artisan'}</h1>
                    {artisan.isVerified && (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                        <Shield className="h-3 w-3" />
                        Vérifié
                      </span>
                    )}
                  </div>
                  {artisan.companyName && (
                    <p className="text-muted-foreground mt-0.5">{artisan.companyName}</p>
                  )}
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                    {artisan.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-primary" />
                        {artisan.location}
                        {artisan.radiusKm && ` · ${artisan.radiusKm} km`}
                      </span>
                    )}
                    {artisan.yearsExperience && (
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="h-4 w-4 text-primary" />
                        {artisan.yearsExperience} ans d&apos;expérience
                      </span>
                    )}
                    {artisan.avgRating && parseFloat(artisan.avgRating) > 0 && (
                      <span className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {parseFloat(artisan.avgRating).toFixed(1)}{' '}
                        <span className="text-muted-foreground">
                          ({artisan.reviewCount} avis)
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {artisan.bio && (
                <div className="mt-5 pt-5 border-t">
                  <p className="text-sm leading-relaxed whitespace-pre-line">{artisan.bio}</p>
                </div>
              )}

              {(artisan.phone || artisan.website) && (
                <div className="mt-5 pt-5 border-t flex flex-wrap gap-2 text-sm">
                  {artisan.phone && (
                    <a
                      href={`tel:${artisan.phone}`}
                      className="inline-flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full hover:bg-muted/80 transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {artisan.phone}
                    </a>
                  )}
                  {artisan.website && (
                    <a
                      href={artisan.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full hover:bg-muted/80 transition-colors"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      Site web
                    </a>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Services proposés</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground py-6 text-center">
                Les services détaillés seront disponibles prochainement.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avis clients</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground py-6 text-center">
                Aucun avis pour l&apos;instant.
              </p>
            </CardContent>
          </Card>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
            <h2 className="font-bold text-lg mb-2">
              Intéressé par cet artisan ?
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Créez un compte et déposez votre demande de devis en quelques minutes.
            </p>
            <Button asChild>
              <Link href="/login?tab=signup">
                Créer ma demande <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t py-8 px-4 bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-white font-black text-xs">F</span>
            </div>
            <span>Fastoche</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Fastoche
          </p>
        </div>
      </footer>
    </div>
  );
}
