# RuFlo V3 Development Environment

Complete development setup combining OpenSpec specifications, Playwright testing, and Claude-Flow AI swarm orchestration for building production-ready applications.

> **🚀 New here?** Start with the [Quick Start Guide](./QUICKSTART.md) to get up and running in 5 minutes!

## 📋 Overview

This environment provides:

- **OpenSpec** - Specification-driven development workflow
- **Playwright** - End-to-end testing framework
- **Claude-Flow V3** - Multi-agent AI orchestration with 60+ agent types
- **Serena** - Semantic code analysis and navigation
- **Hierarchical Mesh Swarm** - 15-agent parallel execution
- **Caveman** - Token optimization (50-75% reduction) with compressed communication

---

## 🎯 Purpose

RuFlo V3 is an AI-powered development environment that enables:
- **Automate routine** - AI agents write code, tests, and documentation
- **Guarantee quality** - E2E tests via Playwright deterministically confirm readiness
- **Scale development** - 15+ agents work in parallel on complex tasks
- **Save tokens** - Caveman mode reduces costs by 50-75%

### 📦 Recommended Installation Process

```bash
# 1. Clone or copy this project to your project's root
cd /path/to/your/project
cp -r /path/to/ruflo-v3/* .

# 2. Install dependencies
npm install
npx playwright install

# 3. Start Claude-Flow daemon
npx -y @claude-flow/cli@latest daemon start

# 4. Check system health
npm run claude:doctor
```

### 🔄 Development Workflows for Different Task Types

## 1️⃣ Big Feature Development (Backend + Frontend + DB, Refactoring)

### When to use:
- New business feature with multiple components
- Refactoring existing functionality
- Changes affecting Backend, Frontend, and DB
- Complex business logic requiring thorough testing

### Step-by-Step Process:

#### Step 1: Write Specification via OpenSpec

```bash
# Create spec file from template
cp openspec/specs/template.md openspec/specs/my-big-feature.md
```

Edit the file to describe:
- **Goal** - what and why
- **Requirements** - functional and non-functional
- **Acceptance criteria** - how to know it's done
- **Boundaries** - what NOT to do
- **Dependencies** - what this depends on

Example specification:

```markdown
# Feature: User Profile with Settings

## Goal
Add user profile page with editable settings

## Requirements
### Functional
- View profile (name, email, avatar)
- Edit name and email
- Upload avatar with preview
- Notification settings (email, push, sms)
- Email uniqueness validation

### Non-functional
- Page response time < 200ms
- Avatar up to 5MB, formats: jpg, png, webp
- SEO optimized page
- Mobile-first design

## Acceptance Criteria
- [ ] All tests green
- [ ] PageSpeed score > 90
- [ ] No console errors
- [ ] Accessibility score > 95

## Boundaries
- NOT doing: password change
- NOT doing: 2FA
- NOT doing: activity history

## Dependencies
- Backend: User API (ready)
- Frontend: Design System (ready)
- DB: users table (needs migration)
```

#### Step 2: Ask RuFlo to Generate Playwright Tests

In Claude Code:

```
Write Playwright tests for specification openspec/specs/my-big-feature.md

Tests should:
1. Cover all acceptance criteria
2. Be deterministic (green = ready, red = not ready)
3. Check edge cases
4. Be independent from each other
```

RuFlo will create `tests/my-big-feature.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('User Profile', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/profile');
  });

  test('displays user profile', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Profile');
    await expect(page.locator('[data-testid="user-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-email"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-avatar"]')).toBeVisible();
  });

  test('edits user name', async ({ page }) => {
    await page.click('[data-testid="edit-name-button"]');
    await page.fill('[data-testid="name-input"]', 'New Name');
    await page.click('[data-testid="save-button"]');

    await expect(page.locator('[data-testid="toast-success"]')).toContainText('Saved');
    await expect(page.locator('[data-testid="user-name"]')).toContainText('New Name');
  });

  test('validates email uniqueness', async ({ page }) => {
    await page.click('[data-testid="edit-email-button"]');
    await page.fill('[data-testid="email-input"]', 'existing@example.com');
    await page.click('[data-testid="save-button"]');

    await expect(page.locator('[data-testid="email-error"]')).toContainText('Email already taken');
  });

  test('uploads avatar with preview', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/fixtures/avatar.jpg');

    await expect(page.locator('[data-testid="avatar-preview"]')).toBeVisible();
    await page.click('[data-testid="upload-button"]');

    await expect(page.locator('[data-testid="toast-success"]')).toContainText('Avatar uploaded');
  });

  test('saves notification settings', async ({ page }) => {
    await page.click('[data-testid="notifications-tab"]');
    await page.check('[data-testid="email-notifications"]');
    await page.uncheck('[data-testid="sms-notifications"]');
    await page.click('[data-testid="save-button"]');

    await expect(page.locator('[data-testid="toast-success"]')).toContainText('Settings saved');
  });

  test('Performance: page loads faster than 200ms', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/profile');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(200);
  });
});
```

#### Step 3: Verify Tests Cover Task Boundaries

Run tests:

```bash
npm test tests/my-big-feature.spec.ts
```

They should **all fail** (red) - normal, functionality not implemented yet.

Check:
- ✅ All acceptance criteria covered
- ✅ Edge cases tested
- ✅ Tests are independent
- ✅ Tests are deterministic
- ✅ NO tests for "NOT doing" items

If tests don't cover something important - add manually or ask RuFlo to extend.

#### Step 4: Ask RuFlo to Implement Functionality

In Claude Code:

```
Implement functionality per spec openspec/specs/my-big-feature.md

Tests are in tests/my-big-feature.spec.ts

IMPORTANT:
- DO NOT CHANGE TESTS
- Work until all tests are green
- Use hierarchical swarm of 6-8 agents
- Follow CLAUDE.md principles
- Backend in /src/backend, Frontend in /src/frontend
```

RuFlo will:
1. Initialize agent swarm
2. Break task into subtasks
3. Agents implement in parallel:
   - Backend API
   - Frontend components
   - DB migrations
   - Validation
   - Styling

#### Step 5: Verify All Tests Are Green

```bash
npm test tests/my-big-feature.spec.ts
```

If tests fail, tell RuFlo:

```
Test X is failing with: [paste error]
Please fix without changing tests
```

#### Step 6: Complete Tasks in Manual Mode with Superpowers

When all tests are green:

1. **Visually check** in browser
   ```bash
   npm run test:headed
   ```

2. **Manual testing** of all scenarios

3. **Code quality** check
   ```bash
   npm run lint
   ```

4. **Create PR** (if using Git)
   ```bash
   git add .
   git commit -m "feat: profile page with settings"
   git push
   ```

5. **Archive task** in OpenSpec
   ```
   /openspec-archive-change
   ```

---

## 2️⃣ Small Feature Development

### When to use:
- Simple tweak (1-3 files)
- Bug fix
- Single component addition
- Small UI change

### Process:

#### Option A: Via Superpowers (fast)

```
Add "Save" button to settings form
```

RuFlo will:
1. Find files via Serena MCP
2. Add button
3. Connect handler
4. Verify it works

#### Option B: Via Serena MCP (controlled)

```
Using Serena MCP:
1. Find settings form component
2. Add save button
3. Connect to existing API
```

You get full control with Serena's semantic code analysis.

---

## 3️⃣ Refactoring

### When to use:
- Architecture improvements
- Performance optimization
- Simplifying complex code
- Migrating to new tech

### Process:

#### Step 1: Write Refactoring Specification

```markdown
# Refactor: Optimize DB Queries

## Current Problem
N+1 queries when loading posts with comments

## Goal
Use eager loading for comments
Reduce queries from 1+N to 2

## Acceptance Criteria
- [ ] Playwright test shows < 3 DB queries
- [ ] Functionality unchanged (all tests green)
- [ ] Performance improved by 50%+

## Risks
- May break lazy loading
- Need to verify all post usage

## Rollback Plan
- Save commit hash before refactoring
- If tests fail - git revert
```

#### Step 2: Write Tests Fixing Current Behavior

```
Write Playwright tests for current posts functionality

Tests should check:
- Post list loads
- Comments display
- Pagination works
Save results (response time, query count)
```

#### Step 3: Ask RuFlo to Refactor

```
Refactor per spec openspec/specs/db-refactor.md

IMPORTANT:
- All tests must stay green
- Functionality MUST NOT change
- Only performance optimization
```

#### Step 4: Compare Results

```bash
# Before refactoring
npm test tests/posts.spec.ts
# Save results

# After refactoring
npm test tests/posts.spec.ts
# Compare results
```

---

## 4️⃣ Microservices Architecture

### When to use:
- Multiple independent services
- Different teams on different services
- Independent deployments needed
- Different tech stacks

### Process:

#### Step 1: Define Service Boundaries

```markdown
# Microservices: User Service + Order Service

## User Service
- Authentication
- User profile
- Settings

## Order Service
- Order creation
- Order history
- Order statuses

## Communication
- REST API for sync operations
- Message Queue (RabbitMQ) for async
- Shared Kernel: UserId, User DTO
```

#### Step 2: Create Spec for Each Service

```bash
# User Service
cp openspec/specs/template.md openspec/specs/user-service.md

# Order Service
cp openspec/specs/template.md openspec/specs/order-service.md
```

#### Step 3: Create Integration Tests

```
Write Playwright tests for User Service + Order Service integration

Scenarios:
1. User authenticates → User Service
2. Creates order → Order Service
3. Views their orders → Order Service
4. Edits profile → User Service

Tests should check:
- API call correctness
- Error handling (service unavailable)
- Data consistency
```

#### Step 4: Implement Services in Parallel

```
Implement User Service per spec openspec/specs/user-service.md
Implement Order Service per spec openspec/specs/order-service.md

Use separate agents for each service
Different directories: /services/user and /services/order
```

RuFlo will create 2 agent swarms working in parallel.

#### Step 5: Test Integration

```bash
npm test tests/integration/user-orders.spec.ts
```

---

## 🎛️ Useful Commands & Patterns

### Running Agent Swarm

```
# Initialize swarm for complex task
npm run claude:swarm

# Check swarm status
npm run claude:status

# Diagnose issues
npm run claude:doctor
```

### OpenSpec Workflow

```
# Propose new task
/openspec-propose

# Start implementation
/openspec-apply-change

# Complete and archive
/openspec-archive-change

# Explore idea
/openspec-explore
```

### Playwright Tests

```bash
# Run all tests
npm test

# With UI (good for debugging)
npm run test:ui

# With headed mode (see browser)
npm run test:headed

# With coverage
npm run test:coverage

# Deep debugging
npm run test:debug

# Report
npm run test:report
```

### Caveman Mode

```
/caveman           # Normal mode (50-60% savings)
/caveman lite      # Professional (25-35% savings)
/caveman ultra     # Max compression (70-75% savings)
stop caveman       # Turn off
```

### Serena MCP for Code Navigation

```
Find all components using UserProfile
Show structure of UserService class
What depends on validateUser method?
```

---

## 🔍 Troubleshooting

### Problem: Tests are unstable (flaky)

**Solution:**
```
Check tests tests/my-feature.spec.ts for race conditions
Add explicit waits (waitFor, waitForResponse)
Avoid hardcoded timeouts
```

### Problem: Agent swarm can't solve task

**Solution:**
```
Break task into smaller subtasks
Create separate specs for each subtask
Implement sequentially
```

### Problem: Slow agent performance

**Solution:**
```
/caveman ultra          # Enable max compression
npx @claude-flow/cli@latest memory search --query "optimization"
# Check recommendations from memory
```

### Problem: Can't find needed code

**Solution:**
```
Use Serena MCP:
Find symbols by pattern "UserProfile*"
Show overview of file src/services/user.ts
Find all references to validateUser method
```

---

## 📊 Success Metrics

### For Big Features:
- ✅ All tests green
- ✅ Code coverage > 80%
- ✅ Performance improved
- ✅ No console errors
- ✅ Accessibility score > 95

### For Refactoring:
- ✅ All existing tests pass
- ✅ Performance improved > 50%
- ✅ Code complexity reduced
- ✅ Technical debt reduced

### For Microservices:
- ✅ Integration tests pass
- ✅ Services deploy independently
- ✅ Fault tolerance works
- ✅ Communication is async where possible

---

## 🤝 Support & Resources

- **Claude-Flow Documentation**: https://github.com/ruvnet/claude-flow
- **Issues**: https://github.com/ruvnet/claude-flow/issues
- **OpenSpec**: Use `/openspec-explore` in Claude Code
- **Playwright**: https://playwright.dev
- **Caveman**: https://github.com/JuliusBrussee/caveman

## 🚀 Quick Setup

```bash
# Run the automated setup script
bash scripts/setup.sh  # Linux/Mac
.\scripts\setup.ps1    # Windows PowerShell

# Or manually:
npm install
npx playwright install
npx -y @claude-flow/cli@latest daemon start
npx -y @claude-flow/cli@latest doctor --fix
```

## 📖 Documentation

- **Quick Start Guide**: [QUICKSTART.md](./QUICKSTART.md) - Get started in 5 minutes
- **OpenSpec Guide**: [openspec/specs/template.md](./openspec/specs/template.md) - Write specifications
- **Playwright Tests**: [tests/example.spec.ts](./tests/example.spec.ts) - Test examples
- **Claude-Flow**: https://github.com/ruvnet/claude-flow - Full documentation

## 🎯 Caveman Token Optimization

This project includes **Caveman** - a Claude Code skill that reduces token usage by 50-75% through compressed communication patterns while maintaining full technical accuracy.

### Available Commands

- `/caveman` - Activate default (full) mode
- `/caveman lite` - Professional but tight (25-35% reduction)
- `/caveman ultra` - Extreme abbreviation (70-75% reduction)
- `/caveman wenyan` - Semi-classical Chinese
- `stop caveman` or `normal mode` - Deactivate

### When to Use Each Level

**Use `lite` for:**
- Formal documentation
- Client-facing communications
- Code reviews requiring clarity

**Use `full` (default) for:**
- Daily development work
- Debugging and troubleshooting
- Technical discussions

**Use `ultra` for:**
- Quick exchanges
- Well-understood contexts
- Rapid iteration sessions

### Auto-Activation

Caveman automatically activates on session start (via hooks). It automatically deactivates for:
- Security warnings
- Irreversible action confirmations
- Multi-step sequences requiring clarity

### Examples

**Normal Claude (69 tokens):**
> "The reason your React component is re-rendering is likely because you're creating a new object reference on each render cycle. When you pass an inline object as a prop, React's shallow comparison sees it as a different object every time, which triggers a re-render. I'd recommend using useMemo to memoize the object."

**Caveman Full (19 tokens - 72% reduction):**
> "New object ref each render. Inline object prop = new ref = re-render. Wrap in `useMemo`."

**Caveman Ultra (10 tokens - 85% reduction):**
> "Inline obj prop → new ref → re-render. `useMemo`."

## 📦 What's Included

### MCP Servers

| Server | Purpose | Tools |
|--------|---------|-------|
| **claude-flow** | AI swarm orchestration | 60+ agents, memory, hooks |
| **playwright** | Browser automation & testing | E2E testing, snapshots |
| **serena** | Semantic code analysis | Symbol search, refactoring |

### Directory Structure

```
.
├── openspec/              # OpenSpec specifications
│   ├── specs/            # Requirement specifications
│   ├── changes/          # Change proposals & tasks
│   └── config.yaml       # OpenSpec configuration
├── tests/                # Playwright E2E tests
├── scripts/              # Setup and utility scripts
├── .claude-flow/         # Claude-Flow runtime data
│   ├── agents/           # Agent configurations
│   ├── memory/           # AgentDB memory storage
│   ├── hooks/            # Self-learning hooks
│   └── swarm/            # Swarm state & logs
├── .claude/              # Claude Code configuration
│   ├── skills/           # 60+ agent skills (including caveman)
│   ├── commands/         # Custom commands
│   └── helpers/          # Utility functions
├── CLAUDE.md             # Project-specific AI instructions
├── package.json          # Dependencies and scripts
├── playwright.config.ts  # Playwright configuration
└── README.md             # This file
```

## 🔄 Development Workflow

### Step 1: Write Specification with OpenSpec

```bash
cp openspec/specs/template.md openspec/specs/my-feature.md
# Edit the spec with your requirements
```

### Step 2: Write Playwright Tests

```typescript
// tests/my-feature.spec.ts
import { test, expect } from '@playwright/test';

test('my feature works', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/My App/);
});
```

### Step 3: Run Tests

```bash
npm test              # Run all tests
npm run test:ui       # Run with UI
npm run test:debug    # Debug mode
```

### Step 4: Develop with Claude-Flow

In Claude Code, simply say:

```
Implement the feature in openspec/specs/my-feature.md
```

Or use the skill:

```
/openspec-apply-change
```

### Step 5: Iterate to Compliance

```bash
npm test  # Run tests
# Claude fixes failures automatically
# Repeat until all tests pass
```

## 🛠️ Common Commands

```bash
# Testing
npm test              # Run all tests
npm run test:ui       # Run with UI
npm run test:coverage # Generate coverage

# Claude-Flow
npm run claude:doctor     # Fix issues
npm run claude:swarm      # Initialize swarm
npm run claude:status     # Check status

# OpenSpec (in Claude Code)
/openspec-propose        # Propose new change
/openspec-apply-change   # Start implementation
/openspec-archive-change # Mark complete

# Caveman
/caveman                # Activate (default: full)
/caveman lite           # Professional mode
/caveman ultra          # Extreme compression
stop caveman            # Deactivate
```

## 🧪 Testing Strategy

- **E2E Tests (Playwright)** - Validate complete user flows
- **Unit Tests** - Test individual functions and components
- **Integration Tests** - Test module interactions
- **Security Tests** - Validate security requirements

## 🔒 Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Validate at boundaries** - Input validation on all external inputs
3. **Sanitize file paths** - Prevent directory traversal
4. **Run security scans** - `npx @claude-flow/cli@latest security scan`

## 🤝 Getting Help

- **Claude-Flow Documentation**: https://github.com/ruvnet/claude-flow
- **Issues**: https://github.com/ruvnet/claude-flow/issues
- **OpenSpec**: Use `/openspec-explore` skill in Claude Code
- **Playwright**: https://playwright.dev
- **Caveman**: https://github.com/JuliusBrussee/caveman

## 📝 Example Workflow

```bash
# 1. Create specification
cp openspec/specs/template.md openspec/specs/user-profile.md

# 2. Write tests
cat > tests/profile.spec.ts << 'EOF'
import { test, expect } from '@playwright/test';

test('can view user profile', async ({ page }) => {
  await page.goto('/profile');
  await expect(page.locator('h1')).toContainText('Profile');
});
EOF

# 3. Run tests (they will fail initially)
npm test

# 4. In Claude Code:
/openspec-apply-change

# 5. Tests will pass automatically
npm test

# 6. Archive when complete
/openspec-archive-change
```

## 📈 Performance Tips

1. **Use parallel execution** - Spawn multiple agents at once
2. **Enable HNSW indexing** - 150x faster memory search
3. **Cache frequently accessed data** - Reduce redundant operations
4. **Monitor with metrics** - Track agent performance

---

**Built with ❤️ using Claude-Flow V3, OpenSpec, Playwright, and Caveman**
