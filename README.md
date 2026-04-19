# Next.js Auth Starter

A production-ready starter with authentication and a dashboard, built with Next.js 15, NextAuth v5, Drizzle ORM, and Neon PostgreSQL.

## Stack

- **Framework** — Next.js 15 (App Router, Turbopack)
- **Auth** — NextAuth v5 (credentials + GitHub + Google OAuth)
- **Database** — Neon PostgreSQL + Drizzle ORM
- **UI** — shadcn/ui + Tailwind CSS + Radix UI
- **Validation** — Zod + React Hook Form
- **Analytics** — Vercel Analytics

## Features

- Email/password sign up and sign in
- GitHub and Google OAuth
- Protected dashboard with sidebar navigation
- Task management (CRUD, search, filter, pagination)
- Fully typed with TypeScript

## Getting started

### 1. Clone and install

```bash
git clone <repo-url>
cd starter
pnpm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in the values:

| Variable | Description |
|---|---|
| `POSTGRES_URL` | Neon PostgreSQL connection string |
| `AUTH_SECRET` | Random secret — generate with `npx auth secret` |
| `AUTH_GITHUB_ID` | GitHub OAuth app client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth app client secret |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |

### 3. Push the database schema

```bash
pnpm db:push
```

### 4. Run locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

1. Push the repo to GitHub
2. Import it on [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.example` in the Vercel dashboard
4. Set OAuth callback URLs to `https://your-domain.vercel.app/api/auth/callback/github` and `/google`
5. After the first deploy, run `pnpm db:push` against your production database

## OAuth setup

**GitHub** — [github.com/settings/developers](https://github.com/settings/developers) → OAuth Apps → New OAuth App

**Google** — [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials → Create OAuth client ID

## Scripts

```bash
pnpm dev          # Start dev server with Turbopack
pnpm build        # Production build
pnpm start        # Start production server
pnpm db:push      # Push schema to database
pnpm db:generate  # Generate Drizzle migrations
pnpm test         # Run tests
```
