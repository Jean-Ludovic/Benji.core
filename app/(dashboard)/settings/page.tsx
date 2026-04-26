import { auth } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bell, Lock, User } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const session = await auth();
  const user = session!.user;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground mt-0.5">Gérez votre compte</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Informations du compte</CardTitle>
          </div>
          <CardDescription>Vos informations de connexion</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Nom</label>
            <Input value={user.name ?? ''} disabled />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Email</label>
            <Input value={user.email ?? ''} disabled type="email" />
          </div>
          <p className="text-xs text-muted-foreground">
            Pour modifier votre nom ou email, contactez le support.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Mot de passe</CardTitle>
          </div>
          <CardDescription>Modifier votre mot de passe</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-6 text-center gap-2">
            <p className="text-sm text-muted-foreground">
              La modification de mot de passe sera disponible prochainement.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Notifications</CardTitle>
          </div>
          <CardDescription>Choisissez comment être notifié</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-6 text-center gap-2">
            <p className="text-sm text-muted-foreground">
              Les préférences de notification arrivent bientôt.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
