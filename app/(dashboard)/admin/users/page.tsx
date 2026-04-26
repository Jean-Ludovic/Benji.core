import { Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/db';
import { users } from '@/lib/auth/schema';
export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role
    })
    .from(users)
    .limit(100);

  const byRole = {
    CLIENT: allUsers.filter((u) => u.role === 'CLIENT').length,
    ARTISAN: allUsers.filter((u) => u.role === 'ARTISAN').length,
    ADMIN: allUsers.filter((u) => u.role === 'ADMIN').length
  };

  const ROLE_CONFIG: Record<string, { label: string; className: string }> = {
    CLIENT: { label: 'Client', className: 'bg-blue-100 text-blue-700' },
    ARTISAN: { label: 'Artisan', className: 'bg-orange-100 text-orange-700' },
    ADMIN: { label: 'Admin', className: 'bg-purple-100 text-purple-700' }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Utilisateurs</h1>
        <p className="text-muted-foreground mt-0.5">
          {allUsers.length} utilisateur{allUsers.length !== 1 ? 's' : ''} inscrits
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Clients', value: byRole.CLIENT },
          { label: 'Artisans', value: byRole.ARTISAN },
          { label: 'Admins', value: byRole.ADMIN }
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="pt-5">
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tous les utilisateurs</CardTitle>
          <CardDescription>Inscrits par ordre décroissant d&apos;inscription</CardDescription>
        </CardHeader>
        <CardContent>
          {allUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="font-medium">Aucun utilisateur</p>
            </div>
          ) : (
            <div className="divide-y">
              {allUsers.map((user) => {
                const cfg = ROLE_CONFIG[user.role] ?? ROLE_CONFIG.CLIENT;
                return (
                  <div
                    key={user.id}
                    className="py-3 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">
                        {user.name ?? user.email ?? 'Utilisateur'}
                      </p>
                      {user.name && user.email && (
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      )}
                      </div>
                    <span
                      className={`shrink-0 text-xs font-medium px-2.5 py-0.5 rounded-full ${cfg.className}`}
                    >
                      {cfg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
