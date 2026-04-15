# Test Manifest

LLM-readable index of all features and their test files.

## Feature Map

| Feature | Test File | Coverage | Status |
|---------|-----------|----------|--------|
| Swarm Coordination | `features/swarm-coordination.spec.ts` | E2E | ✅ Complete |
| Agent Management | `features/agent-management.spec.ts` | E2E | ✅ Complete |
| Memory Operations | `features/memory-operations.spec.ts` | E2E | ✅ Complete |
| Workflow Automation | `features/workflow-automation.spec.ts` | E2E | ✅ Complete |
| CLI Commands | `features/cli-commands.spec.ts` | E2E | ✅ Complete |

## Test Templates

### Standard Test Template (with test.describe wrapper)
```typescript
import { test, expect } from '@playwright/test';

test.describe('[Feature Name]', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/path-to-feature');
  });

  test('should [expected behavior]', async ({ page }) => {
    // Arrange
    await [setup actions];

    // Act
    await page.click('[data-testid="action-button"]');

    // Assert
    await expect(page.locator('[data-testid="result"]')).toBeVisible();
  });
});
```

### Selector Conventions
- Buttons: `[data-testid="{action}-button"]`
- Forms: `[data-testid="{form-name}-form"]`
- Inputs: `[name="{field-name}"]`
- Status: `[data-status="{status}"]`
- Agents: `[data-agent-type="{type}"][data-agent-id="{id}"]`

## Fixtures

| File | Purpose |
|------|---------|
| `fixtures/data.fixture.ts` | Test data constants |
| `fixtures/matchers.ts` | Custom assertion helpers |

## Adding New Feature Tests

1. Create `tests/features/{feature-name}.spec.ts`
2. Follow AAA pattern with test.describe wrapper
3. Use `data-testid` selectors only
4. Use `waitForSelector()` instead of `waitForTimeout()`
5. Update this manifest
