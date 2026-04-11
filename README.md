# RuFlo V3 Development Environment

AI-powered development environment with OpenSpec specifications, Playwright testing, and Claude-Flow swarm orchestration.

> **🚀 New here?** Start with the [Quick Start Guide](./QUICKSTART.md) to get up and running in 5 minutes!

---

## 🚀 Quick Start

```bash
# 1. Copy to your project root
cd /path/to/your/project
cp -r /path/to/ruflo-v3/* .

# 2. Install dependencies
npm install
npx playwright install
npx -y @claude-flow/cli@latest daemon start

# 3. Verify setup
npm run claude:doctor
npm test
```

---

## 🎯 What It Does

**Three components, one workflow:**

1. **OpenSpec** - Write specifications (what to build)
2. **Playwright** - Write tests (how to verify)
3. **Claude-Flow** - AI agents implement (make it work)

**Formula:** Specification → Tests → Implementation → Green Tests = Done

---

## 📋 When to Use What

### Scenario 1: Big Feature (Backend + Frontend + DB)
**Example:** User profile page with settings

**Steps:**
```bash
# 1. Write spec
cp openspec/specs/template.md openspec/specs/user-profile.md
# Edit: goal, requirements, acceptance criteria

# 2. Write tests
tests/user-profile.spec.ts
# Test all acceptance criteria

# 3. In Claude Code:
"Implement user-profile per spec"

# 4. Verify
npm test tests/user-profile.spec.ts
```

**When to use:**
- Multiple components (Backend + Frontend + DB)
- Complex business logic
- Refactoring large systems
- Need thorough testing

---

### Scenario 2: Small Feature
**Example:** Add "Save" button to form

**In Claude Code:**
```
Add Save button to settings form
```

**RuFlo handles it automatically.**

**When to use:**
- 1-3 file changes
- Bug fixes
- Simple UI tweaks
- Single component additions

---

### Scenario 3: Refactoring
**Example:** Optimize N+1 database queries

**Steps:**
```bash
# 1. Write refactoring spec
openspec/specs/db-optimization.md
# Include: current problem, metrics, rollback plan

# 2. Write tests fixing current behavior
tests/posts.spec.ts

# 3. In Claude Code:
"Refactor per db-optimization spec"

# 4. Compare metrics
npm test tests/posts.spec.ts
```

**When to use:**
- Performance optimization
- Architecture improvements
- Code simplification
- Tech migration

---

### Scenario 4: Microservices
**Example:** User Service + Order Service

**Steps:**
```bash
# 1. Define service boundaries
# User Service: auth, profile, settings
# Order Service: orders, history, statuses

# 2. Create specs for each service
openspec/specs/user-service.md
openspec/specs/order-service.md

# 3. Write integration tests
tests/integration/user-orders.spec.ts

# 4. In Claude Code:
"Implement User Service and Order Service in parallel"
```

**When to use:**
- Multiple independent services
- Different teams/tech stacks
- Independent deployments needed

---

## 🛠️ Common Commands

### Development
```bash
npm test                  # Run all tests
npm run test:ui           # Run with UI (debugging)
npm run test:headed       # See browser
npm run test:coverage     # Generate coverage
npm run lint              # Lint code
```

### Claude-Flow
```bash
npm run claude:doctor     # Fix issues
npm run claude:swarm      # Initialize swarm (complex tasks)
npm run claude:status     # Check status
```

### OpenSpec (in Claude Code)
```
/openspec-propose         # Propose new change
/openspec-apply-change    # Start implementation
/openspec-archive-change  # Mark complete
/openspec-explore         # Explore ideas
```

### Caveman (token optimization)
```
/caveman                 # Activate (50-60% savings)
/caveman lite            # Professional (25-35% savings)
/caveman ultra           # Max compression (70-75% savings)
stop caveman             # Deactivate
```

---

## 🧪 Testing Strategy

**Playwright E2E tests = truth**

- ✅ Green tests = feature works
- ❌ Red tests = feature broken
- 📊 Tests cover acceptance criteria
- 🔄 Tests drive development

**Coverage targets:**
- Big features: >80% coverage
- Refactoring: all existing tests pass
- Performance: measure before/after

---

## 🔍 Troubleshooting

### Tests are unstable (flaky)
```
Check for race conditions
Add explicit waits (waitFor, waitForResponse)
Avoid hardcoded timeouts
```

### Swarm can't solve task
```
Break into smaller subtasks
Create separate specs for each
Implement sequentially
```

### Slow agent performance
```
/caveman ultra
Use parallel execution
Enable HNSW indexing (150x faster search)
```

### Can't find code
```
Use Serena MCP:
"Find components using UserProfile"
"Show structure of UserService"
"What depends on validateUser?"
```

---

## 📊 Success Metrics

### Big Features:
- ✅ All tests green
- ✅ Coverage >80%
- ✅ Performance improved
- ✅ No console errors

### Refactoring:
- ✅ All existing tests pass
- ✅ Performance improved >50%
- ✅ Complexity reduced

### Microservices:
- ✅ Integration tests pass
- ✅ Services deploy independently
- ✅ Fault tolerance works

---

## 📦 What's Included

### MCP Servers
- **claude-flow** - 60+ AI agents, memory, hooks
- **playwright** - E2E testing, snapshots
- **serena** - Semantic code search, refactoring

### Directory Structure
```
├── openspec/              # Specifications
│   ├── specs/            # Requirements
│   └── changes/          # Tasks & proposals
├── tests/                # Playwright E2E tests
├── scripts/              # Setup scripts
├── .claude-flow/         # Runtime data
│   ├── agents/           # Agent configs
│   ├── memory/           # AgentDB storage
│   └── swarm/            # Swarm state
├── .claude/              # Claude Code config
│   └── skills/           # 60+ agent skills
├── CLAUDE.md             # AI instructions
└── package.json          # Dependencies
```

---

## 🔒 Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Validate at boundaries** - Input validation on all external inputs
3. **Sanitize file paths** - Prevent directory traversal
4. **Run security scans** - `npx @claude-flow/cli@latest security scan`

---

## 🤝 Support & Resources

- **Documentation**: https://github.com/ruvnet/claude-flow
- **Issues**: https://github.com/ruvnet/claude-flow/issues
- **OpenSpec**: Use `/openspec-explore` in Claude Code
- **Playwright**: https://playwright.dev
- **Caveman**: https://github.com/JuliusBrussee/caveman

---

## 💡 Key Principles

1. **Tests first** - Write tests before implementation
2. **Spec driven** - Specifications guide development
3. **Parallel execution** - Multiple agents work simultaneously
4. **Token efficient** - Caveman mode reduces costs 50-75%
5. **Deterministic** - Green tests = done, red = not done

---

**Built with ❤️ using Claude-Flow V3, OpenSpec, Playwright, and Caveman**
