'use client';

import { useState, useEffect, useTransition } from 'react';
import { Loader2, Save, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default function ArtisanProfilePage() {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<{
    companyName: string;
    siret: string;
    bio: string;
    yearsExperience: string;
    location: string;
    radiusKm: string;
    phone: string;
    website: string;
  }>({
    companyName: '',
    siret: '',
    bio: '',
    yearsExperience: '',
    location: '',
    radiusKm: '30',
    phone: '',
    website: ''
  });

  useEffect(() => {
    fetch('/api/artisan/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setProfile({
            companyName: data.companyName ?? '',
            siret: data.siret ?? '',
            bio: data.bio ?? '',
            yearsExperience: data.yearsExperience?.toString() ?? '',
            location: data.location ?? '',
            radiusKm: data.radiusKm?.toString() ?? '30',
            phone: data.phone ?? '',
            website: data.website ?? ''
          });
        }
      })
      .catch(() => {});
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaved(false);

    startTransition(async () => {
      const res = await fetch('/api/artisan/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          yearsExperience: profile.yearsExperience
            ? parseInt(profile.yearsExperience)
            : undefined,
          radiusKm: profile.radiusKm ? parseInt(profile.radiusKm) : 30
        })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.error?.message ?? 'Erreur lors de la sauvegarde.');
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mon profil artisan</h1>
        <p className="text-muted-foreground mt-0.5">
          Ces informations sont visibles par les clients
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations professionnelles</CardTitle>
            <CardDescription>Présentez votre activité</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Nom de l&apos;entreprise</label>
                <Input
                  name="companyName"
                  value={profile.companyName}
                  onChange={handleChange}
                  placeholder="Jean Dupont Peinture"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">SIRET</label>
                <Input
                  name="siret"
                  value={profile.siret}
                  onChange={handleChange}
                  placeholder="12345678901234"
                  maxLength={14}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Présentation</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Décrivez votre activité, vos spécialités, votre expérience..."
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Années d&apos;expérience
              </label>
              <Input
                name="yearsExperience"
                value={profile.yearsExperience}
                onChange={handleChange}
                type="number"
                min="0"
                max="60"
                placeholder="10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Zone d&apos;intervention</CardTitle>
            <CardDescription>
              Définissez où vous intervenez
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Ville principale</label>
              <Input
                name="location"
                value={profile.location}
                onChange={handleChange}
                placeholder="Paris, Lyon, Bordeaux..."
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Rayon d&apos;intervention (km)
              </label>
              <Input
                name="radiusKm"
                value={profile.radiusKm}
                onChange={handleChange}
                type="number"
                min="5"
                max="200"
                placeholder="30"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Téléphone</label>
              <Input
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                type="tel"
                placeholder="06 00 00 00 00"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Site web</label>
              <Input
                name="website"
                value={profile.website}
                onChange={handleChange}
                type="url"
                placeholder="https://mon-site.fr"
              />
            </div>
          </CardContent>
        </Card>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending} className="min-w-32">
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : saved ? (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {saved ? 'Sauvegardé !' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </div>
  );
}
