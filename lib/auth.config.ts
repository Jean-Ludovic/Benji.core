import type { NextAuthConfig } from 'next-auth';

const PUBLIC_PATHS = ['/', '/artisans'];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (pathname.startsWith('/artisans/')) return true;
  if (pathname.startsWith('/api/auth')) return true;
  return false;
}

function roleDashboard(role: string): string {
  if (role === 'ARTISAN') return '/artisan';
  if (role === 'ADMIN') return '/admin';
  return '/client';
}

export const authConfig: NextAuthConfig = {
  pages: { signIn: '/login' },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      if (isPublicPath(pathname)) return true;

      if (pathname === '/login') {
        if (!isLoggedIn) return true;
        const onboardingDone = (auth.user as any).onboardingDone ?? false;
        if (!onboardingDone) {
          return Response.redirect(new URL('/onboarding', nextUrl));
        }
        const role = (auth.user as any).role ?? 'CLIENT';
        return Response.redirect(new URL(roleDashboard(role), nextUrl));
      }

      if (!isLoggedIn) {
        return Response.redirect(new URL('/login', nextUrl));
      }

      const onboardingDone = (auth.user as any).onboardingDone ?? false;
      if (!onboardingDone && pathname !== '/onboarding') {
        return Response.redirect(new URL('/onboarding', nextUrl));
      }

      return true;
    }
  }
};
