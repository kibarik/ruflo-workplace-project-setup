import { Page, Locator } from '@playwright/test';
import { promises as fs } from 'fs';

/**
 * Test Helper Utilities
 *
 * Common utilities for Playwright tests.
 */

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Wait for element with explicit timeout
   */
  async waitForElement(selector: string, timeoutMs = 5000): Promise<Locator> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible', timeout: timeoutMs });
    return element;
  }

  /**
   * Fill form fields from object
   */
  async fillForm(fields: Record<string, string>): Promise<void> {
    for (const [selector, value] of Object.entries(fields)) {
      await this.page.fill(selector, value);
    }
  }

  /**
   * Check if element exists
   */
  async elementExists(selector: string): Promise<boolean> {
    return await this.page.locator(selector).count() > 0;
  }

  /**
   * Get text content from element
   */
  async getText(selector: string): Promise<string> {
    const element = this.page.locator(selector);
    return (await element.textContent()) || '';
  }

  /**
   * Click and wait for navigation
   */
  async clickAndWait(selector: string): Promise<void> {
    await Promise.all([
      this.page.waitForLoadState('networkidle'),
      this.page.click(selector)
    ]);
  }

  /**
   * Wait for toast notification
   */
  async waitForToast(type: 'success' | 'error' = 'success'): Promise<Locator> {
    return await this.waitForElement(`[data-testid="${type}-message"]`);
  }

  /**
   * Get attribute value
   */
  async getAttribute(selector: string, attribute: string): Promise<string | null> {
    return await this.page.locator(selector).getAttribute(attribute);
  }

  /**
   * Check if element has class
   */
  async hasClass(selector: string, className: string): Promise<boolean> {
    const element = this.page.locator(selector);
    const classes = (await element.getAttribute('class')) || '';
    return classes.split(' ').includes(className);
  }

  /**
   * Wait for API response
   */
  async waitForApi(pathPattern: string): Promise<void> {
    await this.page.waitForResponse(
      response => response.url().match(pathPattern) !== null
    );
  }

  /**
   * Mock API endpoint with precise path matching
   */
  async mockApi(endpoint: string, response: object): Promise<void> {
    await this.page.route(`**/api/**${endpoint}**`, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      });
    });
  }

  /**
   * Clear all inputs
   */
  async clearForm(selectors: string[]): Promise<void> {
    for (const selector of selectors) {
      await this.page.fill(selector, '');
    }
  }

  /**
   * Select option by text
   */
  async selectOptionByText(selector: string, text: string): Promise<void> {
    await this.page.selectOption(selector, [{ label: text }]);
  }

  /**
   * Upload file
   */
  async uploadFile(selector: string, filePath: string): Promise<void> {
    const fileInput = this.page.locator(selector);
    await fileInput.setInputFiles(filePath);
  }

  /**
   * Take screenshot on failure (creates directory if needed)
   */
  async screenshotOnError(testName: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const dir = 'test-failures';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    await this.page.screenshot({
      path: `${dir}/${testName}-${timestamp}.png`,
      fullPage: true
    });
  }

  /**
   * Check if element is visible
   */
  async isVisible(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isVisible();
  }

  /**
   * Get all text content from multiple elements
   */
  async getAllText(selector: string): Promise<string[]> {
    return await this.page.locator(selector).allTextContents();
  }

  /**
   * Wait for count of elements
   */
  async waitForCount(selector: string, count: number): Promise<void> {
    await this.page.waitForFunction(
      ({ selector, count }) => {
        return document.querySelectorAll(selector).length === count;
      },
      { selector, count }
    );
  }
}

/**
 * Page Object base class
 */
export class PageObject {
  constructor(protected page: Page) {}

  protected helpers = new TestHelpers(this.page);

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async reload(): Promise<void> {
    await this.page.reload();
  }

  async back(): Promise<void> {
    await this.page.goBack();
  }

  url(): string {
    return this.page.url();
  }
}
