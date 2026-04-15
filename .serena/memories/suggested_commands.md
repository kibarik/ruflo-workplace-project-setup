# Essential Commands

## Development
```bash
cd web                    # Work in web directory
npm run dev               # Start dev server (Next.js + Spotlight)
npm run build             # Production build
npm run start             # Start production server
npm run clean             # Clean build artifacts
```

## Testing
```bash
npm test                  # Run unit tests (Vitest)
npm run test:e2e          # Run E2E tests (Playwright)
npm run test:ui           # Playwright UI mode
npm run test:coverage     # Generate coverage report
```

## Code Quality
```bash
npm run lint              # ESLint check
npm run lint:fix          # Auto-fix lint issues
npm run check-types       # TypeScript type check
```

## Database
```bash
npm run db:generate       # Generate migration from schema
npm run db:migrate        # Run migrations (production env)
npm run db:studio         # Open Drizzle Studio
```

## Storybook
```bash
npm run storybook         # Start Storybook dev server
npm run storybook:build   # Build static Storybook
npm run test-storybook:ci # CI test Storybook components
```

## Git
```bash
npm run commit            # Commitizen (conventional commits)
```

## Claude-Flow (Root Directory)
```bash
npm run claude:doctor     # Fix Claude-Flow issues
npm run claude:swarm      # Initialize swarm
npm run claude:status     # Check swarm status
```

## Darwin (macOS) Utilities
```bash
git status                # Check git state
git log --oneline -10     # Recent commits
ls -la                    # List files (includes hidden)
grep -r "pattern" .       # Search files
find . -name "*.ts"       # Find TypeScript files
```

## Quick Workflow
1. Make changes
2. `npm run check-types`  # Verify types
3. `npm run lint`         # Check code style
4. `npm test`             # Run tests
5. `npm run commit`       # Commit with conventional format
