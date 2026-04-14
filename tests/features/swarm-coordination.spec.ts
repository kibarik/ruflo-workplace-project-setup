import { test, expect } from '@playwright/test';

/**
 * Swarm Coordination Feature Tests
 *
 * Tests the multi-agent swarm coordination system including:
 * - Swarm initialization
 * - Agent spawning and coordination
 * - Topology management
 * - Consensus and voting
 */

test.describe('Swarm Coordination', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Swarm Initialization', () => {
    test('should initialize swarm with hierarchical topology', async ({ page }) => {
      // Act
      await page.click('[data-testid="swarm-init-button"]');
      await page.selectOption('[name="topology"]', 'hierarchical');
      await page.fill('[name="max-agents"]', '8');
      await page.click('button[type="submit"]');

      // Assert
      await expect(page.locator('[data-testid="swarm-status"]'))
        .toHaveText(/active|initialized/i);
      await expect(page.locator('[data-testid="topology-display"]'))
        .toContainText('hierarchical');
    });

    test('should initialize swarm with mesh topology', async ({ page }) => {
      // Act
      await page.click('[data-testid="swarm-init-button"]');
      await page.selectOption('[name="topology"]', 'mesh');
      await page.fill('[name="max-agents"]', '15');
      await page.click('button[type="submit"]');

      // Assert
      await expect(page.locator('[data-testid="topology-display"]'))
        .toContainText('mesh');
      await expect(page.locator('[data-testid="agent-count"]'))
        .toContainText('15');
    });
  });

  test.describe('Agent Management', () => {
    test.beforeEach(async ({ page }) => {
      // Initialize swarm first
      await page.goto('/');
      await page.click('[data-testid="swarm-init-button"]');
      await page.selectOption('[name="topology"]', 'hierarchical');
      await page.fill('[name="max-agents"]', '8');
      await page.click('button[type="submit"]');
      await page.waitForSelector('[data-testid="swarm-status"]', { timeout: 5000 });
    });

    test('should spawn coder agent successfully', async ({ page }) => {
      // Act
      await page.click('[data-testid="spawn-agent-button"]');
      await page.selectOption('[name="agent-type"]', 'coder');
      await page.fill('[name="agent-name"]', 'test-coder');
      await page.click('[data-testid="confirm-spawn"]');

      // Assert
      await expect(page.locator('[data-agent-type="coder"]'))
        .toBeVisible();
      await expect(page.locator('[data-agent-name="test-coder"]'))
        .toHaveAttribute('data-status', 'active');
    });

    test('should spawn multiple agents in parallel', async ({ page }) => {
      // Act
      const agents = ['coder', 'tester', 'reviewer'];
      for (const agentType of agents) {
        await page.click('[data-testid="spawn-agent-button"]');
        await page.selectOption('[name="agent-type"]', agentType);
        await page.click('[data-testid="confirm-spawn"]');
        await page.waitForTimeout(100);
      }

      // Assert
      await expect(page.locator('[data-agent-type="coder"]')).toBeVisible();
      await expect(page.locator('[data-agent-type="tester"]')).toBeVisible();
      await expect(page.locator('[data-agent-type="reviewer"]')).toBeVisible();
      await expect(page.locator('[data-testid="active-agent-count"]'))
        .toContainText('3');
    });

    test('should terminate agent gracefully', async ({ page }) => {
      // Arrange - spawn an agent first
      await page.click('[data-testid="spawn-agent-button"]');
      await page.selectOption('[name="agent-type"]', 'coder');
      await page.click('[data-testid="confirm-spawn"]');
      const agentId = await page.locator('[data-agent-type="coder"]')
        .getAttribute('data-agent-id');

      // Act
      await page.locator(`[data-agent-id="${agentId}"] [data-action="terminate"]`)
        .click();
      await page.click('[data-testid="confirm-terminate"]');

      // Assert
      await expect(page.locator(`[data-agent-id="${agentId}"]`))
        .toHaveAttribute('data-status', 'terminated');
    });
  });

  test.describe('Consensus & Voting', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.click('[data-testid="swarm-init-button"]');
      await page.selectOption('[name="consensus"]', 'raft');
      await page.click('button[type="submit"]');
      await page.waitForSelector('[data-testid="swarm-status"]', { timeout: 5000 });
    });

    test('should achieve consensus on proposal', async ({ page }) => {
      // Act
      await page.click('[data-testid="create-proposal"]');
      await page.fill('[name="proposal-text"]', 'Test proposal');
      await page.click('button[type="submit"]');

      // Wait for votes
      await page.waitForSelector('[data-vote-status="consensus-reached"]');

      // Assert
      await expect(page.locator('[data-proposal-status="accepted"]'))
        .toBeVisible();
    });

    test('should display voting progress', async ({ page }) => {
      // Act
      await page.click('[data-testid="create-proposal"]');
      await page.fill('[name="proposal-text"]', 'Test proposal');
      await page.click('button[type="submit"]');

      // Assert - check progress indicator
      await expect(page.locator('[data-testid="vote-progress"]'))
        .toBeVisible();
      const progressText = await page.locator('[data-testid="vote-progress"]')
        .textContent();
      expect(progressText).toMatch(/\d+\/\d+ votes/);
    });
  });

  test.describe('Error Handling', () => {
    test('should show error for invalid agent count', async ({ page }) => {
      // Act
      await page.click('[data-testid="swarm-init-button"]');
      await page.fill('[name="max-agents"]', 'invalid');
      await page.click('button[type="submit"]');

      // Assert
      await expect(page.locator('.error-message'))
        .toContainText('Max agents must be a number between 1 and 50');
    });

    test('should show error for unsupported topology', async ({ page }) => {
      // Act - try to set invalid topology via API
      await page.click('[data-testid="swarm-init-button"]');
      await page.evaluate(() => {
        const select = document.querySelector('[name="topology"]') as HTMLSelectElement;
        select.value = 'invalid-topology';
      });
      await page.click('button[type="submit"]');

      // Assert
      await expect(page.locator('.error-message'))
        .toContainText('Invalid topology type');
    });
  });
});
