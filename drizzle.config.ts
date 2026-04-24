import type { Config } from 'drizzle-kit';

export default {
  schema: [
    './lib/auth/schema.ts',
    './lib/artisan-profiles/schema.ts',
    './lib/service-categories/schema.ts',
    './lib/services/schema.ts',
    './lib/service-requests/schema.ts',
    './lib/quotes/schema.ts',
    './lib/projects/schema.ts',
    './lib/reviews/schema.ts',
    './lib/messages/schema.ts'
  ],
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!
  }
} satisfies Config;
