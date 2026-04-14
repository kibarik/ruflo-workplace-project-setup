import { test, expect } from '@playwright/test';
import { detectSourceFiles } from '../../.claude/helpers/serena-detector.cjs';
import path from 'path';

test.describe('Serena Detector', () => {
  test('should detect TypeScript project', async () => {
    const projectPath = path.resolve(__dirname, '../../..');
    const result = detectSourceFiles(projectPath);
    expect(result).toBe(true);
  });

  test('should skip docs-only project', async () => {
    const result = detectSourceFiles('/project-with-md-only');
    expect(result).toBe(false);
  });
});
