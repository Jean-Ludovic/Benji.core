'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

const CATEGORIES = [
  { id: 'peinture-interieure', label: 'Peinture intérieure' },
  { id: 'peinture-exterieure', label: 'Peinture extérieure' },
  { id: 'platrerie', label: 'Plâtrerie & enduit' },
  { id: 'decoration', label: 'Décoration murale' },
  { id: 'papier-peint', label: 'Pose de papier peint' },
  { id: 'ravalement', label: 'Ravalement de façade' },
  { id: 'renovation', label: 'Rénovation globale' },
  { id: 'autre', label: 'Autre' }
];

export default function NewRequestPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const form = e.currentTarget;
    const data = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
      location: (form.elements.namedItem('location') as HTMLInputElement).value,
      budgetMin: (form.elements.namedItem('budgetMin') as HTMLInputElement).value,
      budgetMax: (form.elements.namedItem('budgetMax') as HTMLInputElement).value,
      desiredDate: (form.elements.namedItem('desiredDate') as HTMLInputElement).value
    };

    startTransition(async () => {
      const res = await fetch('/api/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.error?.message ?? 'Une erreur est survenue.');
        return;
      }

      router.push('/client/requests');
      router.refresh();
    });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/client/requests">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Nouvelle demande</h1>
          <p className="text-muted-foreground text-sm">
            Décrivez votre projet pour recevoir des devis gratuits
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Détails du projet</CardTitle>
            <CardDescription>
              Plus votre description est précise, meilleures seront vos offres.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="title" className="text-sm font-medium">
                Titre du projet <span className="text-destructive">*</span>
              </label>
              <Input
                id="title"
                name="title"
                placeholder="Ex : Peinture salon et chambres (80 m²)"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="category" className="text-sm font-medium">
                Catégorie de service
              </label>
              <select
                id="category"
                name="category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Sélectionnez une catégorie</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Décrivez votre projet : type de travaux, surface, état actuel, contraintes particulières..."
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="location" className="text-sm font-medium">
                Localisation
              </label>
              <Input
                id="location"
                name="location"
                placeholder="Ex : Paris 15e, Lyon 69003..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="budgetMin" className="text-sm font-medium">
                  Budget minimum (€)
                </label>
                <Input
                  id="budgetMin"
                  name="budgetMin"
                  type="number"
                  min="0"
                  placeholder="500"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="budgetMax" className="text-sm font-medium">
                  Budget maximum (€)
                </label>
                <Input
                  id="budgetMax"
                  name="budgetMax"
                  type="number"
                  min="0"
                  placeholder="2000"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="desiredDate" className="text-sm font-medium">
                Date souhaitée
              </label>
              <Input
                id="desiredDate"
                name="desiredDate"
                type="date"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" type="button" asChild>
                <Link href="/client/requests">Annuler</Link>
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Publier ma demande
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
