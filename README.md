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

## 🔍 Setting Up Serena MCP

**Serena = semantic code search & navigation. Index your project, find anything instantly.**

### Installation

```bash
# Install Serena MCP server
npx -y @modelcontextprotocol/server-serena

# Or add to Claude Code MCP servers
claude mcp add serena -- npx -y @modelcontextprotocol/server-serena
```

### Initial Index

```bash
# Index your project (one-time setup)
# In Claude Code, run:
"Index the current project with Serena"

# Or via MCP:
mcp__serena__index_project
```

**What gets indexed:**
- All source files (src/, tests/, etc.)
- Symbols (classes, functions, variables)
- Dependencies and imports
- Code structure and relationships

### Usage Examples

**Find components:**
```
Find all components using UserProfile
```

**Navigate code:**
```
Show structure of UserService class
What depends on validateUser method?
Find all references to UserRepository
```

**Search patterns:**
```
Find symbols matching "Auth*"
Show files that import axios
List all API endpoints in backend/
```

### When to Use Serena

✅ **Use Serena for:**
- Finding where code is used
- Understanding dependencies
- Navigating large codebases
- Refactoring (find all usages)
- Code exploration

❌ **Don't use for:**
- Simple grep searches (use Grep tool)
- File finding (use Glob tool)
- Reading files (use Read tool)

### Tips

1. **Index after big changes** - Re-index after adding many files
2. **Use semantic queries** - "Find components that use X" not "search for X"
3. **Combine with other tools** - Serena to find, Read to view
4. **Specific questions** - "What calls UserService.login?" not "tell me about login"

### Troubleshooting

**Problem:** Serena can't find your code
```bash
# Re-index the project
"Re-index with Serena, include src/ and tests/"
```

**Problem:** Slow searches
```
Use more specific queries
"Find components using UserProfile" not "Find everything about users"
```

---

## 🎯 What It Does

**Three approaches, optimized for task complexity:**

1. **Direct Claude Code** - Simple tasks, fast execution
2. **Superpowers** - Medium tasks, structured quality
3. **OpenSpec + Claude-Flow** - Complex tasks, comprehensive orchestration

**Three-component workflow for complex tasks:**

1. **OpenSpec** - Write specifications (what to build)
2. **Playwright** - Write tests (how to verify)
3. **Claude-Flow** - AI agents implement (make it work)

**Formula (complex tasks):** Specification → Tests → Implementation → Green Tests = Done

**Formula (medium tasks with Superpowers):** Ask → Auto-skills activate → TDD → Review → Done

---

## 📋 When to Use What

### Quick Decision Matrix

| Task Complexity | Approach | Example | Time |
|-----------------|----------|---------|------|
| **Simple** (1-3 files) | Direct Claude Code | "Add Save button" | Minutes |
| **Medium** (feature, debugging) | Superpowers | "Implement auth with TDD" | Hours |
| **Complex** (multi-component, architecture) | OpenSpec + Swarm | "Refactor DB layer" | Days |

### Task Complexity Levels

RuFlo provides three approaches optimized for different task complexities:

**Simple Tasks** (1-3 files, bug fixes, small tweaks)
→ **Direct Claude Code execution**
- Just ask Claude directly: "Add Save button to form"
- No formal process needed
- Fast, direct completion

**Medium Tasks** (features requiring planning, TDD, debugging)
→ **Superpowers workflows**
- Structured approach with automated skills
- Test-driven development enforced
- Systematic debugging and planning
- Best balance of speed and quality

**Complex Tasks** (multi-component, refactoring, microservices)
→ **OpenSpec + Claude-Flow swarm**
- Formal specifications required
- Multi-agent coordination
- Comprehensive testing and verification
- Full traceability and rollback planning

---

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

### Scenario 2: Medium Feature with Superpowers (Recommended)
**Example:** User authentication with login form

**Steps:**
```bash
# In Claude Code, just say:
"Implement user authentication with Superpowers"

# Superpowers will automatically:
# 1. Use brainstorming skill to refine requirements
# 2. Create detailed implementation plan
# 3. Enforce TDD: write failing tests first
# 4. Implement with test-driven-development skill
# 5. Review with requesting-code-review skill
# 6. Finish with clean git history
```

**When to use:**
- Single feature requiring careful design
- Need test coverage and quality assurance
- Want systematic approach without full swarm overhead
- Debugging complex issues
- Refactoring with verification

**Benefits:**
- Automated TDD enforcement (RED-GREEN-REFACTOR)
- Systematic debugging (4-phase root cause analysis)
- Structured planning and review
- Clean git history
- No manual configuration needed

---

### Scenario 3: Small Feature (Direct Claude Code)
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

### Scenario 4: Refactoring (Big)
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

### Scenario 5: Microservices
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

### Superpowers (TDD, debugging, collaboration)
**Optimal for medium-complexity tasks requiring structure without swarm overhead.**

Superpowers provides automated workflows that activate based on context:

**When Superpowers activates:**
- "Help me implement user authentication" → brainstorming → planning → TDD → review
- "This test is failing intermittently" → systematic-debugging (4-phase root cause)
- "Add tests for payment module" → test-driven-development (RED-GREEN-REFACTOR)
- "Review my API changes" → requesting-code-review workflow

**Core Skills (auto-activating):**
- **test-driven-development** - Enforces RED-GREEN-REFACTOR cycle
- **systematic-debugging** - 4-phase root cause analysis
- **brainstorming** - Socratic design refinement
- **writing-plans** - Detailed implementation planning
- **subagent-driven-development** - Fast iteration with two-stage review
- **requesting-code-review** - Pre-review checklist and validation

**Perfect for:**
- Single-feature development requiring quality assurance
- Debugging complex issues systematically
- Refactoring with verification
- Code reviews and collaboration
- Teams wanting structure without full swarm complexity

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

### Skills & Plugins
- **caveman** - Token optimization (50-75% reduction)
- **superpowers** - TDD, debugging, collaboration workflows

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
- **Superpowers**: https://github.com/obra/superpowers

---

## 💡 Key Principles

1. **Tests first** - Write tests before implementation
2. **Spec driven** - Specifications guide development
3. **Parallel execution** - Multiple agents work simultaneously
4. **Token efficient** - Caveman mode reduces costs 50-75%
5. **Deterministic** - Green tests = done, red = not done

---

**Built with ❤️ using Claude-Flow V3, OpenSpec, Playwright, Caveman, and Superpowers**
