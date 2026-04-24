'use client';

import { Suspense, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Loader2, Paintbrush } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { register } from '@/lib/auth/actions';

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login';

  const [tab, setTab] = useState<'login' | 'signup'>(defaultTab);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    startTransition(async () => {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      });

      if (result?.error) {
        setError('Email ou mot de passe incorrect.');
      } else {
        router.push('/onboarding');
        router.refresh();
      }
    });
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirm = formData.get('confirm') as string;

    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    startTransition(async () => {
      const result = await register(formData);

      if ('error' in result) {
        setError(result.error);
        return;
      }

      const signInResult = await signIn('credentials', {
        email: formData.get('email') as string,
        password,
        redirect: false
      });

      if (signInResult?.error) {
        setError('Compte créé mais connexion échouée. Essayez de vous connecter.');
      } else {
        router.push('/onboarding');
        router.refresh();
      }
    });
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between bg-primary p-10 text-primary-foreground">
        <div className="flex items-center gap-2 text-lg font-bold">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Paintbrush className="h-4 w-4" />
          </div>
          <span>Fastoche</span>
        </div>
        <div className="space-y-3">
          <blockquote className="text-3xl font-light leading-snug">
            "Trouvez le bon artisan,<br />au bon prix, maintenant."
          </blockquote>
          <p className="text-sm text-primary-foreground/60">
            Peinture · Plâtrerie · Rénovation · Décoration
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { value: '10 000+', label: 'Artisans' },
            { value: '50 000+', label: 'Projets' },
            { value: '4.8/5', label: 'Note moyenne' }
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-primary-foreground/60">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center p-8 bg-muted/40">
        <div className="w-full max-w-sm space-y-6">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Paintbrush className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-lg">Fastoche</span>
          </div>

          <div className="flex rounded-lg border bg-background p-1 gap-1">
            <button
              onClick={() => { setTab('login'); setError(''); }}
              className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
                tab === 'login'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => { setTab('signup'); setError(''); }}
              className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
                tab === 'signup'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Inscription
            </button>
          </div>

          <Card>
            {tab === 'login' ? (
              <>
                <CardHeader>
                  <CardTitle>Bon retour !</CardTitle>
                  <CardDescription>
                    Connectez-vous pour accéder à votre espace.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-3">
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email"
                      required
                      autoComplete="email"
                    />
                    <Input
                      name="password"
                      type="password"
                      placeholder="Mot de passe"
                      required
                      autoComplete="current-password"
                    />
                    {error && (
                      <p className="text-sm text-destructive">{error}</p>
                    )}
                    <Button type="submit" className="w-full" disabled={isPending}>
                      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Se connecter
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">ou</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => signIn('linkedin', { callbackUrl: '/onboarding' })}
                      disabled={isPending}
                    >
                      <LinkedInIcon className="mr-2 h-4 w-4" />
                      Continuer avec LinkedIn
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => signIn('google', { callbackUrl: '/onboarding' })}
                      disabled={isPending}
                    >
                      <GoogleIcon className="mr-2 h-4 w-4" />
                      Continuer avec Google
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader>
                  <CardTitle>Créer un compte</CardTitle>
                  <CardDescription>
                    Rejoignez Fastoche gratuitement.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleRegister} className="space-y-3">
                    <Input
                      name="name"
                      type="text"
                      placeholder="Nom complet"
                      required
                      autoComplete="name"
                    />
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email"
                      required
                      autoComplete="email"
                    />
                    <Input
                      name="password"
                      type="password"
                      placeholder="Mot de passe (min. 8 caractères)"
                      required
                      autoComplete="new-password"
                    />
                    <Input
                      name="confirm"
                      type="password"
                      placeholder="Confirmer le mot de passe"
                      required
                      autoComplete="new-password"
                    />
                    {error && (
                      <p className="text-sm text-destructive">{error}</p>
                    )}
                    <Button type="submit" className="w-full" disabled={isPending}>
                      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Créer mon compte
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">ou</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => signIn('linkedin', { callbackUrl: '/onboarding' })}
                      disabled={isPending}
                    >
                      <LinkedInIcon className="mr-2 h-4 w-4" />
                      S&apos;inscrire avec LinkedIn
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => signIn('google', { callbackUrl: '/onboarding' })}
                      disabled={isPending}
                    >
                      <GoogleIcon className="mr-2 h-4 w-4" />
                      S&apos;inscrire avec Google
                    </Button>
                  </div>
                </CardContent>
              </>
            )}
          </Card>

          <p className="text-center text-xs text-muted-foreground">
            En continuant, vous acceptez nos{' '}
            <a href="#" className="underline hover:text-foreground">
              conditions d&apos;utilisation
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
