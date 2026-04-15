# Test Structure & Instructions

## Overview

Feature-based testing model: one test file per product feature. Each test validates complete user workflows from outside-in (London School TDD).

## Directory Structure

```
tests/
├── README.md                    # This file
├── fixtures/                    # Shared test data & helpers
│   ├── auth.fixture.ts          # Authentication fixtures
│   └── data.fixture.ts          # Test data fixtures
├── features/                    # Feature-based test suites
│   ├── swarm-coordination.spec.ts
│   ├── agent-management.spec.ts
│   ├── memory-operations.spec.ts
│   ├── workflow-automation.spec.ts
│   └── cli-commands.spec.ts
└── helpers/                     # Test utilities & page objects
    ├── test-helpers.ts
    └── api-client.ts
```

## Test Writing Guidelines

### 1. Feature File Structure

Each `*.spec.ts` file covers ONE product feature:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: navigate, login, seed data
  });

  test('should [expected behavior]', async ({ page }) => {
    // Arrange: setup test state
    // Act: execute user action
    // Assert: verify outcome
  });
});
```

### 2. London School TDD Pattern

```typescript
// Outside-In: start with user behavior
test('should register user successfully', async ({ page }) => {
  // Act: user action
  await page.goto('/register');
  await page.fill('[name=email]', 'user@example.com');
  await page.click('button[type=submit]');

  // Assert: verify collaborator interactions
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('.welcome')).toContainText('Welcome');
});
```

### 3. Test Naming Convention

- **Pattern**: `should [expected behavior]`
- **Use**: user language, not implementation details
- **Good**: `should redirect to login when not authenticated`
- **Bad**: `should return 401 and redirect to /login`

### 4. AAA Pattern (Arrange-Act-Assert)

```typescript
test('should create agent successfully', async ({ page }) => {
  // Arrange
  const agentData = { name: 'test-agent', type: 'coder' };
  await page.goto('/agents/new');

  // Act
  await page.fill('[name=name]', agentData.name);
  await page.selectOption('[name=type]', agentData.type);
  await page.click('button[type=submit]');

  // Assert
  await expect(page).toHaveURL(/\/agents\/[a-z0-9-]+/);
  await expect(page.locator('h1')).toContainText(agentData.name);
});
```

### 5. Fixtures for Shared State

```typescript
// tests/fixtures/auth.fixture.ts
import { test as base } from '@playwright/test';

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Login before test
    await page.goto('/login');
    await page.fill('[name=email]', 'test@example.com');
    await page.fill('[name=password]', 'password');
    await page.click('button[type=submit]');
    await page.waitForURL('/dashboard');
    await use(page);
  },
});
```

### 6. Page Objects for Complex Interactions

```typescript
// tests/helpers/swarm-page.ts
export class SwarmPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/swarm');
  }

  async initializeSwarm(config: SwarmConfig) {
    await this.page.click('[data-testid="init-swarm"]');
    await this.page.fill('[name="topology"]', config.topology);
    await this.page.fill('[name="max-agents"]', String(config.maxAgents));
    await this.page.click('button[type=submit]');
  }

  async expectAgentActive(agentId: string) {
    await expect(this.page.locator(`[data-agent-id="${agentId}"]`))
      .toHaveAttribute('data-status', 'active');
  }
}
```

### 7. Reusable Matchers (from fixtures)

```typescript
// tests/fixtures/matchers.ts
import { expect } from '@playwright/test';

// Custom matcher for agent data attributes
export const toHaveAgentData = async (locator: Locator, data: Record<string, string>) => {
  for (const [key, value] of Object.entries(data)) {
    await expect(locator).toHaveAttribute(`data-${key}`, value);
  }
};
```

## Running Tests

```bash
# All tests
npm test

# Specific file
npm test -- swarm-coordination.spec.ts

# UI mode
npm run test:ui

# Debug mode
npm run test:debug

# Coverage report
npm run test:coverage
```

## Test Coverage Goals

- **E2E**: Critical user workflows (happy path + edge cases)
- **Integration**: API + UI interactions
- **Acceptance**: OpenSpec requirement validation

## Common Patterns

### Async Operations

```typescript
test('should wait for swarm initialization', async ({ page }) => {
  await page.click('[data-testid="init-swarm"]');

  // Wait for specific condition
  await expect(page.locator('[data-status="ready"]')).toBeVisible();
});
```

### API Mocking

```typescript
test.beforeEach(async ({ page }) => {
  await page.route('**/api/swarm/**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'active', agents: [] })
    });
  });
});
```

### Error Handling

```typescript
test('should show error on invalid input', async ({ page }) => {
  await page.fill('[name=max-agents]', 'invalid');
  await page.click('button[type=submit]');

  await expect(page.locator('.error-message'))
    .toContainText('Max agents must be a number');
});
```

## Feature Test Checklist

- [ ] Tests cover happy path
- [ ] Tests cover error cases
- [ ] Tests cover edge cases
- [ ] Tests use fixtures for setup
- [ ] Tests follow AAA pattern
- [ ] Test names describe user behavior
- [ ] Tests are independent (no shared state)
- [ ] Tests clean up after themselves
