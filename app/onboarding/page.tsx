'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Paintbrush, User, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { setUserRole } from '@/lib/auth/actions';

const ROLES = [
  {
    value: 'CLIENT' as const,
    icon: User,
    title: 'Je suis client',
    description:
      'Je cherche un artisan pour mes travaux de peinture, rénovation ou décoration.',
    perks: [
      'Recevez des devis gratuits',
      'Comparez les profils et avis',
      'Suivez vos projets en temps réel'
    ]
  },
  {
    value: 'ARTISAN' as const,
    icon: Paintbrush,
    title: 'Je suis artisan',
    description:
      'Je propose mes services de peinture, plâtrerie ou rénovation à des particuliers.',
    perks: [
      'Créez votre profil professionnel',
      'Recevez des demandes qualifiées',
      'Gérez devis et projets facilement'
    ]
  }
];

export default function OnboardingPage() {
  const { update } = useSession();
  const router = useRouter();
  const [selected, setSelected] = useState<'CLIENT' | 'ARTISAN' | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  function handleContinue() {
    if (!selected) return;
    setError('');

    startTransition(async () => {
      const result = await setUserRole(selected);
      if ('error' in result) {
        setError(result.error);
        return;
      }
      // Refresh the JWT so the session reflects new role + onboardingDone
      await update();
      router.push(selected === 'ARTISAN' ? '/artisan' : '/client');
    });
  }

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
              <span className="text-white font-black text-xl">F</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Bienvenue sur Fastoche !</h1>
          <p className="text-muted-foreground">
            Dites-nous qui vous êtes pour personnaliser votre expérience.
          </p>
        </div>

        {/* Role cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {ROLES.map(({ value, icon: Icon, title, description, perks }) => {
            const isSelected = selected === value;
            return (
              <button
                key={value}
                onClick={() => setSelected(value)}
                className={`relative rounded-2xl border-2 p-6 text-left transition-all hover:shadow-md ${
                  isSelected
                    ? 'border-primary bg-orange-50'
                    : 'border-border bg-white hover:border-primary/40'
                }`}
              >
                {isSelected && (
                  <CheckCircle2 className="absolute top-4 right-4 h-5 w-5 text-primary" />
                )}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-muted-foreground'}`}
                    />
                  </div>
                  <span className="font-bold text-lg">{title}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{description}</p>
                <ul className="space-y-1.5">
                  {perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-sm">
                      <CheckCircle2
                        className={`h-4 w-4 shrink-0 ${
                          isSelected ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {error && (
          <p className="text-sm text-destructive text-center mb-4">{error}</p>
        )}

        <Button
          size="lg"
          className="w-full h-12 text-base"
          disabled={!selected || isPending}
          onClick={handleContinue}
        >
          {isPending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <>
              Continuer
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
