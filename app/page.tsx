import Link from 'next/link';
import {
  Paintbrush,
  Star,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle2,
  Hammer,
  Home,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const CATEGORIES = [
  { icon: Paintbrush, label: 'Peinture intérieure', count: '1 200+ artisans' },
  { icon: Home, label: 'Peinture extérieure', count: '850+ artisans' },
  { icon: Hammer, label: 'Plâtrerie & enduit', count: '640+ artisans' },
  { icon: Sparkles, label: 'Décoration murale', count: '420+ artisans' }
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Décrivez votre projet',
    desc: 'Renseignez le type de travaux, votre budget et vos disponibilités en quelques clics.'
  },
  {
    step: '02',
    title: 'Recevez des devis',
    desc: 'Des artisans qualifiés de votre région vous envoient leurs offres sous 48 h.'
  },
  {
    step: '03',
    title: 'Choisissez et lancez',
    desc: "Comparez les profils, lisez les avis et démarrez votre chantier en toute confiance."
  }
];

const TESTIMONIALS = [
  {
    name: 'Sophie M.',
    location: 'Lyon',
    text: 'J\'ai trouvé un peintre excellent en moins de 24 h. Travail impeccable, prix très correct.',
    rating: 5
  },
  {
    name: 'Thomas B.',
    location: 'Paris',
    text: 'Super plateforme ! J\'ai comparé 4 devis et choisi le meilleur rapport qualité/prix.',
    rating: 5
  },
  {
    name: 'Marie C.',
    location: 'Bordeaux',
    text: 'Rapide, clair, sans prise de tête. Je recommande Fastoche à tous mes proches.',
    rating: 5
  }
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-black text-sm">F</span>
            </div>
            <span>Fastoche</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/artisans" className="hover:text-foreground transition-colors">
              Trouver un artisan
            </Link>
            <Link href="/login?tab=signup&role=artisan" className="hover:text-foreground transition-colors">
              Devenir artisan
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Se connecter</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/login?tab=signup">
                Commencer
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50 py-24 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-100/60 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            La mise en relation artisan-client, simplifiée
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-foreground mb-6 leading-tight">
            Trouvez votre artisan{' '}
            <span className="text-primary">en quelques clics</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Peinture, plâtre, rénovation, décoration — Fastoche met en relation
            des artisans qualifiés et des particuliers pour des projets réussis.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-base px-8 h-12" asChild>
              <Link href="/login?tab=signup">
                Je cherche un artisan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 h-12" asChild>
              <Link href="/login?tab=signup&role=artisan">
                Je suis artisan
              </Link>
            </Button>
          </div>
          <div className="mt-10 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            {[
              { icon: Shield, label: 'Artisans vérifiés' },
              { icon: Star, label: 'Avis authentiques' },
              { icon: Clock, label: 'Réponse sous 48 h' }
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon className="h-4 w-4 text-primary" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Nos catégories de services</h2>
            <p className="text-muted-foreground">
              Des artisans spécialisés pour chaque type de travaux
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map(({ icon: Icon, label, count }) => (
              <Link
                key={label}
                href="/artisans"
                className="group flex flex-col items-center gap-3 p-6 rounded-2xl border bg-white hover:border-primary hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 px-4 bg-muted/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Comment ça marche ?</h2>
            <p className="text-muted-foreground">
              Trois étapes pour lancer votre projet
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-black">
                  {step}
                </div>
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Ils ont utilisé Fastoche</h2>
            <p className="text-muted-foreground">
              Des milliers de projets réussis partout en France
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, location, text, rating }) => (
              <div
                key={name}
                className="rounded-2xl border p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  &ldquo;{text}&rdquo;
                </p>
                <div className="mt-auto">
                  <p className="font-semibold text-sm">{name}</p>
                  <p className="text-xs text-muted-foreground">{location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à lancer votre projet ?
          </h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Rejoignez des milliers de clients et d&apos;artisans qui font
            confiance à Fastoche.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="text-base px-8 h-12"
              asChild
            >
              <Link href="/login?tab=signup">Créer un compte gratuit</Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-base px-8 h-12 text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link href="/artisans">Parcourir les artisans</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
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
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">CGU</Link>
            <Link href="#" className="hover:text-foreground">Confidentialité</Link>
            <Link href="#" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
