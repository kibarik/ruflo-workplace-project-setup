import { test, expect } from '@playwright/test';

/**
 * Memory Operations Feature Tests
 *
 * Tests the AgentDB memory system including:
 * - Memory storage and retrieval
 * - HNSW vector search
 * - Hierarchical memory tiers
 * - Memory consolidation
 */

test.describe('Memory Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/memory');
  });

  test.describe('Memory Storage', () => {
    test('should store memory with key and value', async ({ page }) => {
      // Act
      await page.fill('[name="memory-key"]', 'test-pattern');
      await page.fill('[name="memory-value"]', 'Test memory content');
      await page.selectOption('[name="namespace"]', 'patterns');
      await page.click('[data-testid="store-button"]');

      // Assert
      await expect(page.locator('[data-testid="success-message"]'))
        .toContainText('Memory stored');
      await expect(page.locator('[data-memory-key="test-pattern"]'))
        .toBeVisible();
    });

    test('should store memory with tags', async ({ page }) => {
      // Act
      await page.fill('[name="memory-key"]', 'tagged-memory');
      await page.fill('[name="memory-value"]', 'Content with tags');
      await page.fill('[name="memory-tags"]', 'auth,security,important');
      await page.click('[data-testid="store-button"]');

      // Assert
      const memory = page.locator('[data-memory-key="tagged-memory"]');
      await expect(memory).toBeVisible();
      const tags = await memory.locator('[data-tags]').textContent();
      expect(tags).toContain('auth');
      expect(tags).toContain('security');
    });

    test('should update existing memory with upsert', async ({ page }) => {
      // Arrange - store initial memory
      await page.fill('[name="memory-key"]', 'upsert-test');
      await page.fill('[name="memory-value"]', 'Initial value');
      await page.click('[data-testid="store-button"]');

      // Act - update with upsert
      await page.fill('[name="memory-key"]', 'upsert-test');
      await page.fill('[name="memory-value"]', 'Updated value');
      await page.check('[name="upsert"]');
      await page.click('[data-testid="store-button"]');

      // Assert
      await expect(page.locator('[data-memory-key="upsert-test"]'))
        .toContainText('Updated value');
    });
  });

  test.describe('Memory Retrieval', () => {
    test.beforeEach(async ({ page }) => {
      // Store test data
      await page.fill('[name="memory-key"]', 'retrieve-test');
      await page.fill('[name="memory-value"]', 'Retrievable content');
      await page.click('[data-testid="store-button"]');
    });

    test('should retrieve memory by key', async ({ page }) => {
      // Act
      await page.fill('[name="retrieve-key"]', 'retrieve-test');
      await page.click('[data-testid="retrieve-button"]');

      // Assert
      await expect(page.locator('[data-testid="retrieved-value"]'))
        .toContainText('Retrievable content');
    });

    test('should retrieve memory from specific namespace', async ({ page }) => {
      // Arrange - store in specific namespace
      await page.fill('[name="memory-key"]', 'namespace-test');
      await page.fill('[name="memory-value"]', 'Namespaced content');
      await page.selectOption('[name="namespace"]', 'user-preferences');
      await page.click('[data-testid="store-button"]');

      // Act
      await page.fill('[name="retrieve-key"]', 'namespace-test');
      await page.selectOption('[name="namespace"]', 'user-preferences');
      await page.click('[data-testid="retrieve-button"]');

      // Assert
      await expect(page.locator('[data-testid="retrieved-value"]'))
        .toContainText('Namespaced content');
    });
  });

  test.describe('Vector Search', () => {
    test.beforeEach(async ({ page }) => {
      // Seed test memories
      const memories = [
        { key: 'auth-jwt', value: 'JWT token authentication with refresh tokens' },
        { key: 'auth-oauth', value: 'OAuth2 authorization code flow' },
        { key: 'db-sql', value: 'SQL database query optimization' }
      ];

      for (const memory of memories) {
        await page.fill('[name="memory-key"]', memory.key);
        await page.fill('[name="memory-value"]', memory.value);
        await page.click('[data-testid="store-button"]');
        await page.waitForTimeout(100);
      }
    });

    test('should perform semantic search', async ({ page }) => {
      // Act
      await page.fill('[name="search-query"]', 'user login security');
      await page.click('[data-testid="search-button"]');

      // Assert
      const results = page.locator('[data-testid="search-result"]');
      await expect(results.first()).toBeVisible();

      // Should return auth-related results first
      const firstResult = await results.first().textContent();
      expect(firstResult).toMatch(/jwt|oauth|auth/i);
    });

    test('should respect similarity threshold', async ({ page }) => {
      // Act
      await page.fill('[name="search-query"]', 'database queries');
      await page.fill('[name="threshold"]', '0.8');
      await page.click('[data-testid="search-button"]');

      // Assert
      const results = page.locator('[data-testid="search-result"]');
      const count = await results.count();

      // Should only return highly similar results
      expect(count).toBeGreaterThan(0);
      const similarity = await results.first()
        .locator('[data-similarity]').textContent();
      expect(parseFloat(similarity || '0')).toBeGreaterThanOrEqual(0.8);
    });

    test('should limit search results', async ({ page }) => {
      // Act
      await page.fill('[name="search-query"]', 'authentication');
      await page.fill('[name="limit"]', '2');
      await page.click('[data-testid="search-button"]');

      // Assert
      const results = page.locator('[data-testid="search-result"]');
      await expect(results).toHaveCount(2);
    });
  });

  test.describe('Hierarchical Memory', () => {
    test('should store to working memory tier', async ({ page }) => {
      // Act
      await page.fill('[name="memory-key"]', 'working-test');
      await page.fill('[name="memory-value"]', 'Temporary working data');
      await page.selectOption('[name="tier"]', 'working');
      await page.click('[data-testid="store-button"]');

      // Assert
      await expect(page.locator('[data-memory-key="working-test"]'))
        .toHaveAttribute('data-tier', 'working');
    });

    test('should promote memory from working to episodic', async ({ page }) => {
      // Arrange
      await page.fill('[name="memory-key"]', 'promote-test');
      await page.fill('[name="memory-value"]', 'Important session data');
      await page.selectOption('[name="tier"]', 'working');
      await page.click('[data-testid="store-button"]');
      await page.waitForSelector('[data-memory-key="promote-test"]');

      // Act
      await page.click('[data-memory-key="promote-test"] [data-action="promote"]');
      await page.selectOption('[name="target-tier"]', 'episodic');
      await page.click('button[type="submit"]');

      // Assert
      await expect(page.locator('[data-memory-key="promote-test"]'))
        .toHaveAttribute('data-tier', 'episodic');
    });
  });

  test.describe('Memory Consolidation', () => {
    test('should consolidate old memories', async ({ page }) => {
      // Arrange - create old memories
      for (let i = 0; i < 5; i++) {
        await page.fill('[name="memory-key"]', `old-memory-${i}`);
        await page.fill('[name="memory-value"]', `Old content ${i}`);
        await page.click('[data-testid="store-button"]');
      }

      // Act
      await page.click('[data-testid="consolidate-button"]');
      await page.fill('[name="min-age"]', '1');
      await page.click('button[type="submit"]');

      // Assert
      await expect(page.locator('[data-testid="consolidation-report"]'))
        .toBeVisible();
      const report = await page.locator('[data-testid="consolidation-report"]')
        .textContent();
      expect(report).toMatch(/consolidated \d+ memories/i);
    });
  });

  test.describe('Error Handling', () => {
    test('should show error for missing key', async ({ page }) => {
      // Act - try to store without key
      await page.fill('[name="memory-value"]', 'Value without key');
      await page.click('[data-testid="store-button"]');

      // Assert
      await expect(page.locator('.error-message'))
        .toContainText('Memory key is required');
    });

    test('should show error for duplicate key without upsert', async ({ page }) => {
      // Arrange
      await page.fill('[name="memory-key"]', 'duplicate-test');
      await page.fill('[name="memory-value"]', 'First value');
      await page.click('[data-testid="store-button"]');

      // Act - try to store again without upsert
      await page.fill('[name="memory-key"]', 'duplicate-test');
      await page.fill('[name="memory-value"]', 'Second value');
      await page.uncheck('[name="upsert"]');
      await page.click('[data-testid="store-button"]');

      // Assert
      await expect(page.locator('.error-message'))
        .toContainText('Memory key already exists');
    });
  });
});
