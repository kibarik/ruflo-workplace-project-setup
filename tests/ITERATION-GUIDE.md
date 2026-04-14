# Test-Driven Development Workflow for LLM

## Process for Each Development Iteration

### Phase 1: Before Code (RED)

1. **Identify feature to implement**
   ```
   "I need to add [feature]"
   ```

2. **Find or create test file**
   ```bash
   # Check if test exists
   ls tests/features/ | grep -i [feature-keyword]

   # If not, create new file
   touch tests/features/[feature-name].spec.ts
   ```

3. **Write failing test first**
   - Use template from `.llm-test-guide.md`
   - Test MUST fail initially
   - Run `npm test -- [file].spec.ts` to confirm failure

### Phase 2: Implement Code (GREEN)

4. **Write minimal code to pass test**
   - Don't add extra features
   - Focus on making test pass only

5. **Add `data-testid` selectors in code**
   ```html
   <!-- NOT this -->
   <button class="btn-primary">Submit</button>

   <!-- BUT this -->
   <button data-testid="submit-button" class="btn-primary">
     Submit
   </button>
   ```

6. **Verify test passes**
   ```bash
   npm test -- [file].spec.ts
   ```

### Phase 3: Refine (REFACTOR)

7. **Run all tests**
   ```bash
   npm test
   ```

8. **Update MANIFEST.md** if new feature added

9. **Commit with test**
   ```bash
   git add tests/features/[file].spec.ts src/[implementation].ts
   git commit -m "feat: [feature] with tests"
   ```

## Quick Commands for LLM

```bash
# Find test by feature keyword
grep -l "should.*[keyword]" tests/features/*.spec.ts

# Run single test file
npm test -- [filename].spec.ts

# Run tests with specific pattern
npm test -- --grep "should [pattern]"

# Run tests in debug mode
npm run test:debug -- [filename].spec.ts

# Run tests with UI
npm run test:ui
```

## Test Coverage Goals

| Level | Coverage | Focus |
|-------|----------|-------|
| Happy Path | ✅ Always | Primary user workflow |
| Error Cases | ✅ Always | Invalid input, failures |
| Edge Cases | ⚡ As needed | Boundary conditions |

## Anti-Patterns to Avoid

❌ **Writing tests AFTER code**
- Tests become documentation, not drivers
- LLM can't validate against requirements

❌ **Testing implementation details**
- Tests break when code refactors
- Use `data-testid` selectors instead

❌ **Over-mocking**
- Tests don't validate real behavior
- Keep mocks simple and focused

❌ **Testing multiple behaviors in one test**
- Hard to debug failures
- One test = one assertion focus

## Example Workflow

```
User: "Add agent health monitoring feature"

LLM:
1. Check existing: ls tests/features/ | grep -i health
2. No file found → create agent-health.spec.ts
3. Write failing test:
   test('should display agent health status', async ({ page }) => {
     await page.goto('/agents/test-agent');
     await expect(page.locator('[data-health-indicator]'))
       .toBeVisible();
   });
4. Run test: npm test -- agent-health.spec.ts (FAILS ✅)
5. Implement code with data-testid="health-indicator"
6. Run test: npm test -- agent-health.spec.ts (PASSES ✅)
7. Update MANIFEST.md
```
