# Task Completion Checklist

## After Any Code Change

### 1. Type Safety
```bash
npm run check-types       # Must pass
```

### 2. Code Quality
```bash
npm run lint              # Must pass (or lint:fix)
```

### 3. Testing
```bash
npm test                  # Unit tests must pass
npm run test:e2e          # E2E tests must pass
```

### 4. Build Verification
```bash
npm run build             # Must succeed
```

## Feature-Specific Checks

### Database Changes
- [ ] Run `npm run db:generate` after schema changes
- [ ] Test migrations locally
- [ ] Update `Schema.ts` with new models
- [ ] Consider data migration for existing records

### UI Changes
- [ ] Test in multiple locales (if i18n affected)
- [ ] Verify mobile responsiveness
- [ ] Check dark mode (if applicable)
- [ ] Test accessibility (keyboard nav, screen readers)

### API Changes
- [ ] Update TypeScript types
- [ ] Add error handling
- [ ] Test authentication edge cases
- [ ] Verify rate limiting (if applicable)

### Authentication Changes
- [ ] Test sign-in flow
- [ ] Test organization selection
- [ ] Verify protected routes
- [ ] Check middleware behavior

## Before Committing
1. **No secrets**: Verify no `.env` files or API keys
2. **Conventional commit**: Use `npm run commit`
3. **Type safety**: `check-types` passes
4. **Tests**: All tests green
5. **Build**: Production build succeeds

## Common Gotchas

### Next.js
- Server Components: Default, no `'use client'` needed
- Client Components: Add `'use client'` for hooks/event handlers
- Static vs Dynamic: Check `fetch` options for caching

### i18n
- Always use `AllLocales` from `AppConfig`
- New strings: Add to `locales/en.json`, Crowdin syncs others
- Locale prefix: Middleware handles automatically

### Database
- Drizzle ORM: Use schema-based queries
- Migrations: Always generate, never edit manually
- Connection: Use `DB` from `libs/DB.ts`

### Clerk
- Middleware handles auth protection
- `auth.protect()` for server components
- Use clerk helpers for client components
