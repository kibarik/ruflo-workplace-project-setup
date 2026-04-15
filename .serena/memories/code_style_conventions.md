# Code Style & Conventions

## TypeScript Configuration
- **Strict mode**: Enabled
- **No unchecked indexed access**: Enabled
- **No implicit any/returns/this**: Enabled
- **Unused locals/parameters**: Error
- **Target**: ES2017
- **Module**: ESNext with bundler resolution

## ESLint
- **Config**: @antfu/eslint-config
- **Plugins**: react, react-hooks, jsx-a11y, tailwindcss, playwright
- **Import sorting**: simple-import-sort (auto-sorted)
- **Format**: ESLint-based (no Prettier)

## Naming Conventions
- **Components**: PascalCase (`DashboardHeader.tsx`)
- **Hooks**: PascalCase with `use` prefix (`UseMenu.ts`)
- **Utilities**: PascalCase (`Helpers.ts`, `AppConfig.ts`)
- **Types**: PascalCase (`Auth.ts`, `Subscription.ts`)
- **Constants**: PascalCase (`AllLocales`, `AppConfig`)
- **Functions**: camelCase

## File Organization
- **Co-location**: Features grouped in folders
- **Index exports**: Use `index.ts` for barrel exports
- **Test files**: `*.test.ts` or `*.spec.ts` alongside source
- **E2E tests**: `tests/` directory with `.e2e.ts` extension

## Component Patterns
- **Server Components**: Default for Next.js App Router
- **Client Components**: Add `'use client'` directive
- **UI Components**: shadcn/ui patterns with variants
- **Feature Components**: Domain-specific, reusable

## Import Order
1. External libraries
2. Internal modules (path aliases)
3. Relative imports
4. Types (if separate)

Auto-sorted by simple-import-sort plugin.

## Git Workflow
- **Commit format**: Conventional Commits via commitizen
- **Branch protection**: Main branch protected
- **Semantic release**: Automated versioning

## Code Quality Gates
1. Type check: `npm run check-types`
2. Lint: `npm run lint`
3. Unit tests: `npm test`
4. E2E tests: `npm run test:e2e`

## Testing Guidelines
- **Unit tests**: Vitest with @testing-library
- **E2E tests**: Playwright
- **Coverage**: Aim for >80% on new features
- **Test location**: Co-located with source code

## Style Notes
- **Arrow functions**: Preferred for callbacks
- **Const over let**: Default to const
- **Explicit returns**: Clear intent
- **Early returns**: Reduce nesting
- **Type annotations**: Public APIs must be typed
