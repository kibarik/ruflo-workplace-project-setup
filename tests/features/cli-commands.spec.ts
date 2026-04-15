import { test, expect } from '@playwright/test';

/**
 * CLI Commands Feature Tests
 *
 * Tests the command-line interface including:
 * - Command execution
 * - Output parsing
 * - Error handling
 * - Help system
 */

test.describe('CLI Commands', () => {
  test.describe('Swarm Commands', () => {
    test('should initialize swarm via CLI', async ({ page }) => {
      // Act - simulate CLI command execution
      await page.goto('/cli');
      await page.fill('[name="command-input"]', 'swarm init --topology hierarchical --max-agents 8');
      await page.click('[data-testid="execute-command"]');

      // Assert
      await expect(page.locator('[data-command-output]'))
        .toContainText('Swarm initialized successfully');
      await expect(page.locator('[data-command-exit-code"]'))
        .toHaveText('0');
    });

    test('should display swarm status via CLI', async ({ page }) => {
      // Arrange - initialize swarm first
      await page.fill('[name="command-input"]', 'swarm init --topology hierarchical');
      await page.click('[data-testid="execute-command"]');
      await page.waitForSelector('[data-command-exit-code="0"]');

      // Act
      await page.fill('[name="command-input"]', 'swarm status');
      await page.click('[data-testid="execute-command"]');

      // Assert
      await expect(page.locator('[data-command-output]'))
        .toContainText('Status: active');
      await expect(page.locator('[data-command-output]'))
        .toContainText('Topology: hierarchical');
    });

    test('should shutdown swarm via CLI', async ({ page }) => {
      // Arrange - initialize swarm
      await page.fill('[name="command-input"]', 'swarm init');
      await page.click('[data-testid="execute-command"]');
      await page.waitForSelector('[data-command-exit-code="0"]');

      // Act
      await page.fill('[name="command-input"]', 'swarm shutdown');
      await page.click('[data-testid="execute-command"]');

      // Assert
      await expect(page.locator('[data-command-output]'))
        .toContainText('Swarm shutdown complete');
    });
  });

  test.describe('Agent Commands', () => {
    test('should spawn agent via CLI', async ({ page }) => {
      // Act
      await page.goto('/cli');
      await page.fill('[name="command-input"]', 'agent spawn --type coder --name test-agent');
      await page.click('[data-testid="execute-command"]');

      // Assert
      await expect(page.locator('[data-command-output]'))
        .toContainText('Agent spawned: test-agent');
      await expect(page.locator('[data-command-output]'))
        .toContainText('Type: coder');
    });

    test('should list all agents via CLI', async ({ page }) => {
      // Arrange - spawn multiple agents
      await page.fill('[name="command-input"]', 'agent spawn --type coder');
      await page.click('[data-testid="execute-command"]');
      await page.fill('[name="command-input"]', 'agent spawn --type tester');
      await page.click('[data-testid="execute-command"]');

      // Act
      await page.fill('[name="command-input"]', 'agent list');
      await page.click('[data-testid="execute-command"]');

      // Assert
      await expect(page.locator('[data-command-output]'))
        .toContainText('coder');
      await expect(page.locator('[data-command-output]'))
        .toContainText('tester');
    });

    test('should terminate agent via CLI', async ({ page }) => {
      // Arrange - spawn agent
      await page.fill('[name="command-input"]', 'agent spawn --type coder --name terminate-test');
      await page.click('[data-testid="execute-command"]');

      // Act
      await page.fill('[name="command-input"]', 'agent terminate --name terminate-test');
      await page.click('[data-testid="execute-command"]');

      // Assert
      await expect(page.locator('[data-command-output]'))
        .toContainText('Agent terminated: terminate-test');
    });
  });

  test.describe('Memory Commands', () => {
    test('should store memory via CLI', async ({ page }) => {
      // Act
      await page.goto('/cli');
      await page.fill('[name="command-input"]', 'memory store --key test-key --value "test value" --namespace test');
      await page.click('[data-testid="execute-command"]');

      // Assert
      await expect(page.locator('[data-command-output]'))
        .toContainText('Memory stored successfully');
    });

    test('should retrieve memory via CLI', async ({ page }) => {
      // Arrange - store memory
      await page.fill('[name="command-input"]', 'memory store --key retrieve-test --value "retrievable"');
      await page.click('[data-testid="execute-command"]');

      // Act
      await page.fill('[name="command-input"]', 'memory retrieve --key retrieve-test');
      await page.click('[data-testid="execute-command"]');

      // Assert
      await expect(page.locator('[data-command-output]'))
        .toContainText('retrievable');
    });

    test('should search memories via CLI', async ({ page }) => {
      // Arrange - store some memories
      await page.fill('[name="command-input"]', 'memory store --key auth-1 --value "JWT authentication"');
      await page.click('[data-testid="execute-command"]');
      await page.fill('[name="command-input"]', 'memory store --key auth-2 --value "OAuth2 flow"');
      await page.click('[data-testid="execute-command"]');

      // Act
      await page.fill('[name="command-input"]', 'memory search --query "authentication"');
      await page.click('[data-testid="execute-command"]');

      // Assert
      await expect(page.locator('[data-command-output]'))
        .toContainText('JWT authentication');
    });
  });

  test.describe('Help System', () => {
    test('should display general help', async ({ page }) => {
      // Act
      await page.goto('/cli');
      await page.fill('[name="command-input"]', 'help');
      await page.click('[data-testid="execute-command"]');

      // Assert
      await expect(page.locator('[data-command-output]'))
        .toContainText('Available commands:');
      await expect(page.locator('[data-command-output]'))
        .toContainText('swarm');
      await expect(page.locator('[data-command-output]'))
        .toContainText('agent');
      await expect(page.locator('[data-command-output]'))
        .toContainText('memory');
    });

    test('should display command-specific help', async ({ page }) => {
      // Act
      await page.fill('[name="command-input"]', 'help swarm');
      await page.click('[data-testid="execute-command"]');

      // Assert
      await expect(page.locator('[data-command-output]'))
        .toContainText('Swarm commands:');
      await expect(page.locator('[data-command-output]'))
        .toContainText('init');
      await expect(page.locator('[data-command-output]'))
        .toContainText('status');
      await expect(page.locator('[data-command-output]'))
        .toContainText('shutdown');
    });

    test('should show usage examples', async ({ page }) => {
      // Act
      await page.fill('[name="command-input"]', 'help agent spawn');
      await page.click('[data-testid="execute-command"]');

      // Assert
      await expect(page.locator('[data-command-output]'))
        .toContainText('Examples:');
    });
  });

  test.describe('Error Handling', () => {
    test('should show error for invalid command', async ({ page }) => {
      // Act
      await page.goto('/cli');
      await page.fill('[name="command-input"]', 'invalid-command');
      await page.click('[data-testid="execute-command"]');

      // Assert
      await expect(page.locator('[data-command-exit-code"]'))
        .toHaveText('1');
      await expect(page.locator('.error-message'))
        .toContainText('Unknown command');
    });

    test('should show error for missing required argument', async ({ page }) => {
      // Act
      await page.fill('[name="command-input"]', 'agent spawn --type coder');
      await page.click('[data-testid="execute-command"]');

      // Assert
      await expect(page.locator('[data-command-exit-code"]'))
        .toHaveText('1');
      await expect(page.locator('.error-message'))
        .toContainText('Missing required argument: --name');
    });

    test('should show error for invalid flag value', async ({ page }) => {
      // Act
      await page.fill('[name="command-input"]', 'swarm init --topology invalid-topology');
      await page.click('[data-testid="execute-command"]');

      // Assert
      await expect(page.locator('[data-command-exit-code]'))
        .toHaveText('1');
      await expect(page.locator('.error-message'))
        .toContainText('Invalid topology');
    });
  });

  test.describe('Command History', () => {
    test('should maintain command history', async ({ page }) => {
      // Arrange - execute some commands
      await page.goto('/cli');
      await page.fill('[name="command-input"]', 'help');
      await page.click('[data-testid="execute-command"]');
      await page.waitForSelector('[data-command-exit-code="0"]');

      await page.fill('[name="command-input"]', 'swarm status');
      await page.click('[data-testid="execute-command"]');
      await page.waitForSelector('[data-command-exit-code="0"]');

      // Act - press up arrow to go back in history
      await page.focus('[name="command-input"]');
      await page.keyboard.press('ArrowUp');

      // Assert
      const inputValue = await page.locator('[name="command-input"]').inputValue();
      expect(inputValue).toBe('swarm status');
    });

    test('should allow searching command history', async ({ page }) => {
      // Arrange - execute commands
      await page.goto('/cli');
      await page.fill('[name="command-input"]', 'agent list');
      await page.click('[data-testid="execute-command"]');
      await page.fill('[name="command-input"]', 'memory list');
      await page.click('[data-testid="execute-command"]');

      // Act - search history with Ctrl+R
      await page.focus('[name="command-input"]');
      await page.keyboard.press('Control+r');
      await page.type('[name="command-input"]', 'agent');

      // Assert
      const inputValue = await page.locator('[name="command-input"]').inputValue();
      expect(inputValue).toContain('agent');
    });
  });

  test.describe('Output Formatting', () => {
    test('should support JSON output format', async ({ page }) => {
      // Act
      await page.goto('/cli');
      await page.fill('[name="command-input"]', 'agent list --format json');
      await page.click('[data-testid="execute-command"]');

      // Assert - verify JSON structure
      const output = await page.locator('[data-command-output]').textContent();
      expect(output).toMatch(/^\s*\{/); // Starts with {
      expect(output?.trim()).toMatch(/\}\s*$/); // Ends with }
    });

    test('should support table output format', async ({ page }) => {
      // Act
      await page.fill('[name="command-input"]', 'agent list --format table');
      await page.click('[data-testid="execute-command"]');

      // Assert - check for table formatting
      await expect(page.locator('[data-command-output]'))
        .toContainText('│'); // Table border character
    });
  });
});
