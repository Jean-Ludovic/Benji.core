import 'server-only';

import NextAuth from 'next-auth';
import LinkedIn from 'next-auth/providers/linkedin';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import {
  users,
  accounts,
  sessions,
  verificationTokens
} from '@/lib/auth/schema';
import { authConfig } from '@/lib/auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens
  }),
  session: { strategy: 'jwt' },
  providers: [
    LinkedIn,
    Google,
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string))
          .limit(1);

        if (!user?.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image
        };
      }
    })
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger }) {
      if (user?.id) {
        token.id = user.id;
        const [dbUser] = await db
          .select({ role: users.role, onboardingDone: users.onboardingDone })
          .from(users)
          .where(eq(users.id, user.id))
          .limit(1);
        token.role = (dbUser?.role ?? 'CLIENT') as 'CLIENT' | 'ARTISAN' | 'ADMIN';
        token.onboardingDone = dbUser?.onboardingDone ?? false;
      }
      if (trigger === 'update' && typeof token.id === 'string') {
        const [dbUser] = await db
          .select({ role: users.role, onboardingDone: users.onboardingDone })
          .from(users)
          .where(eq(users.id, token.id))
          .limit(1);
        if (dbUser) {
          token.role = dbUser.role as 'CLIENT' | 'ARTISAN' | 'ADMIN';
          token.onboardingDone = dbUser.onboardingDone;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as 'CLIENT' | 'ARTISAN' | 'ADMIN';
      session.user.onboardingDone = token.onboardingDone as boolean;
      return session;
    }
  }
});
