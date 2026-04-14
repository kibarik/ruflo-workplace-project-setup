import { test, expect } from '@playwright/test';

/**
 * Workflow Automation Feature Tests
 *
 * Tests the workflow execution system including:
 * - Workflow creation and configuration
 * - Step execution (parallel and sequential)
 * - Variable management
 * - Workflow status tracking
 */

test.describe('Workflow Automation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/workflows');
  });

  test.describe('Workflow Creation', () => {
    test('should create workflow with sequential steps', async ({ page }) => {
      // Act
      await page.click('[data-testid="create-workflow-button"]');
      await page.fill('[name="workflow-name"]', 'Test Sequential Workflow');
      await page.fill('[name="workflow-description"]', 'Tests sequential execution');
      await page.click('[data-testid="add-step-button"]');
      await page.fill('[name="step-1-name"]', 'Step 1');
      await page.selectOption('[name="step-1-type"]', 'task');
      await page.click('[data-testid="add-step-button"]');
      await page.fill('[name="step-2-name"]', 'Step 2');
      await page.selectOption('[name="step-2-type"]', 'task');
      await page.click('button[type="submit"]');

      // Assert
      await expect(page.locator('[data-workflow-name="Test Sequential Workflow"]'))
        .toBeVisible();
      await expect(page.locator('[data-workflow-name="Test Sequential Workflow"]'))
        .toHaveAttribute('data-strategy', 'sequential');
    });

    test('should create workflow with parallel execution', async ({ page }) => {
      // Act
      await page.click('[data-testid="create-workflow-button"]');
      await page.fill('[name="workflow-name"]', 'Parallel Workflow');
      await page.selectOption('[name="execution-strategy"]', 'parallel');
      await page.click('[data-testid="add-step-button"]');
      await page.fill('[name="step-1-name"]', 'Parallel Task 1');
      await page.click('[data-testid="add-step-button"]');
      await page.fill('[name="step-2-name"]', 'Parallel Task 2');
      await page.click('button[type="submit"]');

      // Assert
      await expect(page.locator('[data-workflow-name="Parallel Workflow"]'))
        .toHaveAttribute('data-strategy', 'parallel');
    });

    test('should validate workflow name uniqueness', async ({ page }) => {
      // Arrange - create workflow first
      await page.click('[data-testid="create-workflow-button"]');
      await page.fill('[name="workflow-name"]', 'Duplicate Workflow');
      await page.click('button[type="submit"]');

      // Act - try to create with same name
      await page.click('[data-testid="create-workflow-button"]');
      await page.fill('[name="workflow-name"]', 'Duplicate Workflow');
      await page.click('button[type="submit"]');

      // Assert
      await expect(page.locator('.error-message'))
        .toContainText('Workflow name already exists');
    });
  });

  test.describe('Workflow Execution', () => {
    test.beforeEach(async ({ page }) => {
      // Create a test workflow
      await page.click('[data-testid="create-workflow-button"]');
      await page.fill('[name="workflow-name"]', 'Execution Test Workflow');
      await page.click('[data-testid="add-step-button"]');
      await page.fill('[name="step-1-name"]', 'Test Step');
      await page.selectOption('[name="step-1-type"]', 'task');
      await page.click('button[type="submit"]');
      await page.waitForSelector('[data-workflow-name="Execution Test Workflow"]');
    });

    test('should execute workflow successfully', async ({ page }) => {
      // Act
      await page.click('[data-workflow-name="Execution Test Workflow"] [data-action="execute"]');

      // Assert
      await expect(page.locator('[data-workflow-status="running"]')).toBeVisible();
      await expect(page.locator('[data-workflow-status="completed"]'))
        .toBeVisible({ timeout: 10000 });
    });

    test('should display execution progress', async ({ page }) => {
      // Act
      await page.click('[data-workflow-name="Execution Test Workflow"] [data-action="execute"]');

      // Assert - check progress indicator
      await expect(page.locator('[data-testid="execution-progress"]'))
        .toBeVisible();
      const progressText = await page.locator('[data-testid="execution-progress"]')
        .textContent();
      expect(progressText).toMatch(/\d+%/);
    });

    test('should allow pausing and resuming workflow', async ({ page }) => {
      // Act - start execution
      await page.click('[data-workflow-name="Execution Test Workflow"] [data-action="execute"]');

      // Pause
      await page.click('[data-action="pause-workflow"]');
      await expect(page.locator('[data-workflow-status="paused"]'))
        .toBeVisible();

      // Resume
      await page.click('[data-action="resume-workflow"]');
      await expect(page.locator('[data-workflow-status="running"]'))
        .toBeVisible();
    });

    test('should allow canceling workflow', async ({ page }) => {
      // Act
      await page.click('[data-workflow-name="Execution Test Workflow"] [data-action="execute"]');
      await page.click('[data-action="cancel-workflow"]');
      await page.click('[data-testid="confirm-cancel"]');

      // Assert
      await expect(page.locator('[data-workflow-status="cancelled"]'))
        .toBeVisible();
    });
  });

  test.describe('Variable Management', () => {
    test('should pass variables to workflow', async ({ page }) => {
      // Arrange - create workflow with variables
      await page.click('[data-testid="create-workflow-button"]');
      await page.fill('[name="workflow-name"]', 'Variable Test Workflow');
      await page.click('[data-testid="add-variable-button"]');
      await page.fill('[name="variable-1-name"]', 'testVar');
      await page.fill('[name="variable-1-value"]', 'testValue');
      await page.click('button[type="submit"]');

      // Act
      await page.click('[data-workflow-name="Variable Test Workflow"] [data-action="execute"]');

      // Assert - check variables were passed
      await page.click('[data-workflow-name="Variable Test Workflow"] [data-action="show-details"]');
      await expect(page.locator('[data-variable-name="testVar"]'))
        .toContainText('testValue');
    });

    test('should allow runtime variable injection', async ({ page }) => {
      // Arrange - create and start workflow
      await page.click('[data-testid="create-workflow-button"]');
      await page.fill('[name="workflow-name"]', 'Runtime Var Workflow');
      await page.click('button[type="submit"]');
      await page.click('[data-workflow-name="Runtime Var Workflow"] [data-action="execute"]');

      // Act - inject variable during execution
      await page.click('[data-action="inject-variable"]');
      await page.fill('[name="variable-name"]', 'runtimeVar');
      await page.fill('[name="variable-value"]', 'runtimeValue');
      await page.click('button[type="submit"]');

      // Assert
      await expect(page.locator('[data-variable-name="runtimeVar"]'))
        .toBeVisible();
    });
  });

  test.describe('Step Dependencies', () => {
    test('should respect step dependencies', async ({ page }) => {
      // Arrange - create workflow with dependent steps
      await page.click('[data-testid="create-workflow-button"]');
      await page.fill('[name="workflow-name"]', 'Dependent Steps Workflow');
      await page.click('[data-testid="add-step-button"]');
      await page.fill('[name="step-1-name"]', 'First Step');
      await page.click('[data-testid="add-step-button"]');
      await page.fill('[name="step-2-name"]', 'Second Step');
      await page.check('[name="step-2-depends-on-step-1"]');
      await page.click('button[type="submit"]');

      // Act
      await page.click('[data-workflow-name="Dependent Steps Workflow"] [data-action="execute"]');

      // Assert - second step should wait for first
      await expect(page.locator('[data-step-name="First Step"][data-status="completed"]'))
        .toBeVisible();
      await expect(page.locator('[data-step-name="Second Step"][data-status="pending"]'))
        .toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle step failure gracefully', async ({ page }) => {
      // Arrange - create workflow that will fail
      await page.click('[data-testid="create-workflow-button"]');
      await page.fill('[name="workflow-name"]', 'Failing Workflow');
      await page.click('[data-testid="add-step-button"]');
      await page.fill('[name="step-1-name"]', 'Failing Step');
      await page.selectOption('[name="step-1-type"]', 'task');
      await page.click('[data-testid="configure-step"]'); // Configure to fail
      await page.selectOption('[name="failure-mode"]', 'always-fail');
      await page.click('button[type="submit"]');

      // Act
      await page.click('[data-workflow-name="Failing Workflow"] [data-action="execute"]');

      // Assert
      await expect(page.locator('[data-workflow-status="failed"]'))
        .toBeVisible({ timeout: 10000 });
      await expect(page.locator('.error-message'))
        .toContainText('Step failed');
    });

    test('should allow retry on failure', async ({ page }) => {
      // Arrange - create failing workflow
      await page.click('[data-testid="create-workflow-button"]');
      await page.fill('[name="workflow-name"]', 'Retry Workflow');
      await page.click('[data-testid="add-step-button"]');
      await page.fill('[name="step-1-name"]', 'Flaky Step');
      await page.click('[data-testid="configure-step"]');
      await page.fill('[name="max-retries"]', '3');
      await page.click('button[type="submit"]');
      await page.click('button[type="submit"]');

      // Act
      await page.click('[data-workflow-name="Retry Workflow"] [data-action="execute"]');

      // Assert - check retry count
      await page.click('[data-workflow-name="Retry Workflow"] [data-action="show-details"]');
      await expect(page.locator('[data-retry-count]'))
        .toBeVisible();
    });
  });
});
