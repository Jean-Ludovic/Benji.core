import Link from 'next/link';
import {
  Home,
  FileText,
  Receipt,
  Briefcase,
  MessageSquare,
  Wrench,
  Inbox,
  Users,
  BarChart3,
  Settings,
  PanelLeft,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Analytics } from '@vercel/analytics/react';
import { auth } from '@/lib/auth';
import { NavItem } from './nav-item';
import { UserNav } from './user-nav';
import Providers from './providers';
import { DashboardBreadcrumb } from './breadcrumb';

type NavEntry = { href: string; label: string; icon: React.ElementType };

const CLIENT_NAV: NavEntry[] = [
  { href: '/client', label: 'Tableau de bord', icon: Home },
  { href: '/client/requests', label: 'Mes demandes', icon: FileText },
  { href: '/client/quotes', label: 'Mes devis', icon: Receipt },
  { href: '/client/projects', label: 'Mes projets', icon: Briefcase },
  { href: '/messages', label: 'Messages', icon: MessageSquare }
];

const ARTISAN_NAV: NavEntry[] = [
  { href: '/artisan', label: 'Tableau de bord', icon: Home },
  { href: '/artisan/profile', label: 'Mon profil', icon: User },
  { href: '/artisan/services', label: 'Mes services', icon: Wrench },
  { href: '/artisan/requests', label: 'Demandes reçues', icon: Inbox },
  { href: '/artisan/quotes', label: 'Mes devis', icon: Receipt },
  { href: '/artisan/projects', label: 'Mes projets', icon: Briefcase },
  { href: '/messages', label: 'Messages', icon: MessageSquare }
];

const ADMIN_NAV: NavEntry[] = [
  { href: '/admin', label: "Vue d'ensemble", icon: BarChart3 },
  { href: '/admin/users', label: 'Utilisateurs', icon: Users },
  { href: '/admin/artisans', label: 'Artisans', icon: Wrench },
  { href: '/admin/requests', label: 'Demandes', icon: FileText }
];

function FastocheLogo() {
  return (
    <div className="flex items-center gap-2 font-bold">
      <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
        <span className="text-white font-black text-xs">F</span>
      </div>
      <span>Fastoche</span>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const labels: Record<string, string> = {
    CLIENT: 'Client',
    ARTISAN: 'Artisan',
    ADMIN: 'Admin'
  };
  return (
    <span className="text-xs bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full">
      {labels[role] ?? role}
    </span>
  );
}

function DesktopNav({ navItems, role }: { navItems: NavEntry[]; role: string }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
      <div className="flex h-14 items-center justify-between border-b px-4">
        <Link href="/">
          <FastocheLogo />
        </Link>
        <RoleBadge role={role} />
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-2 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem key={item.href} href={item.href} label={item.label}>
            <item.icon className="h-4 w-4" />
          </NavItem>
        ))}
      </nav>

      <div className="border-t px-2 py-3 space-y-1">
        <NavItem href="/settings" label="Paramètres">
          <Settings className="h-4 w-4" />
        </NavItem>
        <UserNav />
      </div>
    </aside>
  );
}

function MobileNav({ navItems, role }: { navItems: NavEntry[]; role: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-14 items-center justify-between border-b px-4">
          <Link href="/">
            <FastocheLogo />
          </Link>
          <RoleBadge role={role} />
        </div>
        <nav className="flex flex-col gap-1 px-2 py-4">
          {navItems.map((item) => (
            <NavItem key={item.href} href={item.href} label={item.label}>
              <item.icon className="h-4 w-4" />
            </NavItem>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const role = session?.user?.role ?? 'CLIENT';

  const navItems =
    role === 'ARTISAN' ? ARTISAN_NAV : role === 'ADMIN' ? ADMIN_NAV : CLIENT_NAV;

  return (
    <Providers>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <DesktopNav navItems={navItems} role={role} />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-60">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <MobileNav navItems={navItems} role={role} />
            <DashboardBreadcrumb />
          </header>
          <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
        </div>
        <Analytics />
      </div>
    </Providers>
  );
}
