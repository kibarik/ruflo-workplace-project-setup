# Course Platform - Project Overview

## Purpose
SaaS boilerplate/Next.js course platform with:
- Multi-language support (i18n)
- Clerk authentication
- Organization management
- Stripe billing integration
- Sentry monitoring

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.6 (strict mode)
- **UI**: React 18, Radix UI, Tailwind CSS, shadcn/ui components
- **Styling**: Tailwind CSS + CSS Modules
- **i18n**: next-intl with Crowdin sync

### Backend
- **Auth**: Clerk (user + organization management)
- **Database**: PostgreSQL with Drizzle ORM
- **API**: Next.js API routes
- **Logging**: Pino with Logtail

### Services
- **Payments**: Stripe
- **Monitoring**: Sentry
- **Testing**: Vitest (unit), Playwright (E2E)

## Code Organization

### Directory Structure
```
web/src/
├── app/[locale]/         # Next.js App Router with locale
│   ├── (auth)/          # Protected routes
│   ├── (unauth)/        # Public routes
│   └── layout.tsx       # Root layout
├── components/          # Reusable components
│   └── ui/             # shadcn/ui components
├── features/           # Feature modules
│   ├── auth/           # Authentication components
│   ├── billing/        # Pricing/subscription
│   ├── dashboard/      # Dashboard UI
│   ├── landing/        # Landing page components
│   └── sponsors/       # Sponsor logos
├── templates/          # Page templates (Hero, Footer, Navbar, etc.)
├── libs/               # Core libraries
│   ├── DB.ts          # Database client
│   ├── Env.ts         # Environment validation
│   ├── Logger.ts      # Pino logger
│   └── i18n.ts        # i18n config
├── utils/              # Utilities
├── types/              # TypeScript types
├── hooks/              # React hooks
├── models/             # Database schema
└── middleware.ts       # Auth + i18n middleware
```

### Path Aliases
- `@/*` → `./src/*`
- `@/public/*` → `./public/*`

## Key Architectural Decisions

### Authentication Flow
1. Unauthenticated users → sign-in page
2. Authenticated without org → organization selection
3. Authenticated with org → dashboard

### Route Protection
- Protected: `/dashboard/*`, `/onboarding/*`, `/api/*`
- Public: landing page, sign-in/sign-up

### Locale Handling
- Middleware adds locale prefix automatically
- Supported locales: defined in `AppConfig.AllLocales`
- Default: English
- Messages synced via Crowdin GitHub Actions

### Database
- Schema in `web/src/models/Schema.ts`
- Migrations via Drizzle Kit
- Uses organization-based data isolation
