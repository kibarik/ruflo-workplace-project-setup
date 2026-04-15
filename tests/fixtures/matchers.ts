import { expect, Locator } from '@playwright/test';

/**
 * Custom Matchers for Playwright Tests
 *
 * Reusable assertion helpers for common patterns.
 */

/**
 * Assert element has all specified data attributes
 */
export async function toHaveDataAttributes(
  locator: Locator,
  data: Record<string, string>
): Promise<void> {
  for (const [key, value] of Object.entries(data)) {
    await expect(locator).toHaveAttribute(`data-${key}`, value);
  }
}

/**
 * Assert agent is in specific state
 */
export async function toHaveAgentState(
  locator: Locator,
  status: 'active' | 'idle' | 'busy' | 'terminated'
): Promise<void> {
  await expect(locator).toHaveAttribute('data-status', status);
}

/**
 * Assert element contains text with timeout
 */
export async function toContainTextSoon(
  locator: Locator,
  text: string,
  timeoutMs = 5000
): Promise<void> {
  await expect(locator).toContainText(text, { timeout: timeoutMs });
}

/**
 * Assert element is visible with timeout
 */
export async function toBeVisibleSoon(
  locator: Locator,
  timeoutMs = 5000
): Promise<void> {
  await expect(locator).toBeVisible({ timeout: timeoutMs });
}
