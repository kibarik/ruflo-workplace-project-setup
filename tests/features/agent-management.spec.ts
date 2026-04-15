import { test, expect } from '@playwright/test';

/**
 * Agent Management Feature Tests
 *
 * Tests the agent lifecycle management including:
 * - Agent spawning with configuration
 * - Agent health monitoring
 * - Agent task assignment
 * - Agent communication
 */

test.describe('Agent Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Ensure swarm is initialized
    await page.click('[data-testid="swarm-init-button"]');
    await page.selectOption('[name="topology"]', 'hierarchical');
    await page.click('button[type="submit"]');
    await page.waitForSelector('[data-testid="swarm-status"]');
  });

  test.describe('Agent Spawning', () => {
    test('should spawn coder agent with default config', async ({ page }) => {
      // Act
      await page.click('[data-testid="spawn-agent-button"]');
      await page.selectOption('[name="agent-type"]', 'coder');
      await page.click('[data-testid="confirm-spawn"]');

      // Assert
      await expect(page.locator('[data-agent-type="coder"]')).toBeVisible();
      await expect(page.locator('[data-agent-type="coder"]'))
        .toHaveAttribute('data-status', 'active');
    });

    test('should spawn agent with custom configuration', async ({ page }) => {
      // Act
      await page.click('[data-testid="spawn-agent-button"]');
      await page.selectOption('[name="agent-type"]', 'tester');
      await page.fill('[name="agent-name"]', 'custom-tester');
      await page.fill('[name="agent-model"]', 'sonnet');
      await page.click('[data-testid="confirm-spawn"]');

      // Assert
      const agent = page.locator('[data-agent-name="custom-tester"]');
      await expect(agent).toBeVisible();
      await expect(agent).toHaveAttribute('data-model', 'sonnet');
      await expect(agent).toHaveAttribute('data-agent-type', 'tester');
    });

    test('should validate agent type before spawning', async ({ page }) => {
      // Act - try to spawn invalid agent type
      await page.click('[data-testid="spawn-agent-button"]');
      await page.evaluate(() => {
        const select = document.querySelector('[name="agent-type"]') as HTMLSelectElement;
        select.value = 'invalid-agent-type';
      });
      await page.click('[data-testid="confirm-spawn"]');

      // Assert
      await expect(page.locator('.error-message'))
        .toContainText('Invalid agent type');
    });
  });

  test.describe('Agent Health Monitoring', () => {
    test('should display agent health status', async ({ page }) => {
      // Arrange
      await page.click('[data-testid="spawn-agent-button"]');
      await page.selectOption('[name="agent-type"]', 'coder');
      await page.click('[data-testid="confirm-spawn"]');
      await page.waitForSelector('[data-agent-type="coder"][data-status="active"]', { timeout: 5000 });

      // Act
      await page.click('[data-agent-type="coder"] [data-action="show-health"]');

      // Assert
      await expect(page.locator('[data-testid="health-indicator"]'))
        .toBeVisible();
      const healthText = await page.locator('[data-testid="health-indicator"]')
        .textContent();
      expect(healthText).toMatch(/healthy|degraded|unhealthy/i);
    });

    test('should update health status in real-time', async ({ page }) => {
      // Arrange
      await page.click('[data-testid="spawn-agent-button"]');
      await page.selectOption('[name="agent-type"]', 'coder');
      await page.click('[data-testid="confirm-spawn"]');
      await page.waitForSelector('[data-agent-type="coder"][data-status="active"]');

      // Act - wait for health update
      const health1 = await page.locator('[data-agent-type="coder"]')
        .getAttribute('data-health');

      await page.waitForSelector('[data-agent-type="coder"][data-health][data-health!="0.5"]', { timeout: 5000 });
      const health2 = await page.locator('[data-agent-type="coder"]')
        .getAttribute('data-health');

      // Assert - health values exist and are numeric
      expect(parseFloat(health1 || '0')).toBeGreaterThanOrEqual(0);
      expect(parseFloat(health2 || '0')).toBeLessThanOrEqual(1);
    });
  });

  test.describe('Agent Task Assignment', () => {
    test.beforeEach(async ({ page }) => {
      // Arrange - spawn agent first
      await page.click('[data-testid="spawn-agent-button"]');
      await page.selectOption('[name="agent-type"]', 'coder');
      await page.click('[data-testid="confirm-spawn"]');
      await page.waitForSelector('[data-agent-type="coder"][data-status="idle"]', { timeout: 5000 });
    });

    test('should assign task to idle agent', async ({ page }) => {
      // Act
      await page.click('[data-testid="assign-task-button"]');
      await page.fill('[name="task-description"]', 'Fix auth bug');
      await page.selectOption('[name="target-agent"]', 'coder');
      await page.click('button[type="submit"]');

      // Assert
      await expect(page.locator('[data-agent-type="coder"]'))
        .toHaveAttribute('data-status', 'busy');
      await expect(page.locator('[data-agent-type="coder"]'))
        .toHaveAttribute('data-current-task', 'Fix auth bug');
    });

    test('should list all available agents for task assignment', async ({ page }) => {
      // Arrange - spawn multiple agents
      const agentTypes = ['coder', 'tester', 'reviewer'];
      for (const type of agentTypes) {
        await page.click('[data-testid="spawn-agent-button"]');
        await page.selectOption('[name="agent-type"]', type);
        await page.click('[data-testid="confirm-spawn"]');
        await page.waitForSelector(`[data-agent-type="${type}"][data-status="active"]`);
      }

      // Act
      await page.click('[data-testid="assign-task-button"]');
      const agentSelect = page.locator('[name="target-agent"]');

      // Assert
      const options = await agentSelect.locator('option').allTextContents();
      expect(options).toHaveLength(3);
    });
  });

  test.describe('Agent Communication', () => {
    test('should send message between agents', async ({ page }) => {
      // Arrange - spawn two agents
      await page.click('[data-testid="spawn-agent-button"]');
      await page.selectOption('[name="agent-type"]', 'coder');
      await page.click('[data-testid="confirm-spawn"]');

      await page.click('[data-testid="spawn-agent-button"]');
      await page.selectOption('[name="agent-type"]', 'reviewer');
      await page.click('[data-testid="confirm-spawn"]');

      // Act
      await page.click('[data-agent-type="coder"] [data-action="send-message"]');
      await page.selectOption('[name="recipient"]', 'reviewer');
      await page.fill('[name="message"]', 'Code review requested');
      await page.click('button[type="submit"]');

      // Assert
      await expect(page.locator('[data-agent-type="reviewer"] [data-message-count"]'))
        .toContainText('1');
    });

    test('should broadcast message to all agents', async ({ page }) => {
      // Arrange - spawn multiple agents
      for (let i = 0; i < 3; i++) {
        await page.click('[data-testid="spawn-agent-button"]');
        await page.click('[data-testid="confirm-spawn"]');
        await page.waitForSelector('[data-agent-type][data-status="active"]');
      }

      // Act
      await page.click('[data-testid="broadcast-button"]');
      await page.fill('[name="broadcast-message"]', 'Swarm update');
      await page.click('button[type="submit"]');

      // Assert
      await expect(page.locator('[data-message-count]')).toHaveCount(3);
      const messageCounts = await page.locator('[data-message-count]')
        .allTextContents();
      messageCounts.forEach(count => {
        expect(parseInt(count)).toBeGreaterThan(0);
      });
    });
  });
});
