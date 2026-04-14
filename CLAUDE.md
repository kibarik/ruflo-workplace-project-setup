# Claude Code Configuration - RuFlo V3

## Behavioral Rules (Always Enforced)

- Do what has been asked; nothing more, nothing less
- NEVER create files unless they're absolutely necessary for achieving your goal
- ALWAYS prefer editing an existing file to creating a new one
- NEVER proactively create documentation files (*.md) or README files unless explicitly requested
- NEVER save working files, text/mds, or tests to the root folder
- Never continuously check status after spawning a swarm — wait for results
- ALWAYS read a file before editing it
- NEVER commit secrets, credentials, or .env files
- ALWAYS execute `/opsx:apply` commands through ClaudeFlow swarm coordination

## File Organization

- NEVER save to root folder — use the directories below
- Use `/src` for source code files
- Use `/tests` for test files
- Use `/docs` for documentation and markdown files
- Use `/config` for configuration files
- Use `/scripts` for utility scripts
- Use `/examples` for example code

## Project Architecture

- Follow Domain-Driven Design with bounded contexts
- Keep files under 500 lines
- Use typed interfaces for all public APIs
- Prefer TDD London School (mock-first) for new code
- Use event sourcing for state changes
- Ensure input validation at system boundaries

### Project Config

- **Topology**: hierarchical-mesh
- **Max Agents**: 15
- **Memory**: hybrid
- **HNSW**: Enabled
- **Neural**: Enabled

## Build & Test

```bash
# Build
npm run build

# Test
npm test

# Lint
npm run lint
```

- ALWAYS run tests after making code changes
- ALWAYS verify build succeeds before committing

## Security Rules

- NEVER hardcode API keys, secrets, or credentials in source files
- NEVER commit .env files or any file containing secrets
- Always validate user input at system boundaries
- Always sanitize file paths to prevent directory traversal
- Run `npx @claude-flow/cli@latest security scan` after security-related changes

## Concurrency: 1 MESSAGE = ALL RELATED OPERATIONS

- All operations MUST be concurrent/parallel in a single message
- Use Claude Code's Task tool for spawning agents, not just MCP
- ALWAYS batch ALL todos in ONE TodoWrite call (5-10+ minimum)
- ALWAYS spawn ALL agents in ONE message with full instructions via Task tool
- ALWAYS batch ALL file reads/writes/edits in ONE message
- ALWAYS batch ALL Bash commands in ONE message

## Swarm Orchestration

- MUST initialize the swarm using CLI tools when starting complex tasks
- MUST spawn concurrent agents using Claude Code's Task tool
- Never use CLI tools alone for execution — Task tool agents do the actual work
- MUST call CLI tools AND Task tool in ONE message for complex work

### 3-Tier Model Routing (ADR-026)

| Tier | Handler | Latency | Cost | Use Cases |
|------|---------|---------|------|-----------|
| **1** | Agent Booster (WASM) | <1ms | $0 | Simple transforms (var→const, add types) — Skip LLM |
| **2** | Haiku | ~500ms | $0.0002 | Simple tasks, low complexity (<30%) |
| **3** | Sonnet/Opus | 2-5s | $0.003-0.015 | Complex reasoning, architecture, security (>30%) |

- Always check for `[AGENT_BOOSTER_AVAILABLE]` or `[TASK_MODEL_RECOMMENDATION]` before spawning agents
- Use Edit tool directly when `[AGENT_BOOSTER_AVAILABLE]`

## Swarm Configuration & Anti-Drift

- ALWAYS use hierarchical topology for coding swarms
- Keep maxAgents at 6-8 for tight coordination
- Use specialized strategy for clear role boundaries
- Use `raft` consensus for hive-mind (leader maintains authoritative state)
- Run frequent checkpoints via `post-task` hooks
- Keep shared memory namespace for all agents

```bash
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 8 --strategy specialized
```

## Swarm Execution Rules

- ALWAYS use `run_in_background: true` for all agent Task calls
- ALWAYS put ALL agent Task calls in ONE message for parallel execution
- After spawning, STOP — do NOT add more tool calls or check status
- Never poll TaskOutput or check swarm status — trust agents to return
- When agent results arrive, review ALL results before proceeding

## V3 CLI Commands

### Core Commands

| Command | Subcommands | Description |
|---------|-------------|-------------|
| `init` | 4 | Project initialization |
| `agent` | 8 | Agent lifecycle management |
| `swarm` | 6 | Multi-agent swarm coordination |
| `memory` | 11 | AgentDB memory with HNSW search |
| `task` | 6 | Task creation and lifecycle |
| `session` | 7 | Session state management |
| `hooks` | 17 | Self-learning hooks + 12 workers |
| `hive-mind` | 6 | Byzantine fault-tolerant consensus |

### Quick CLI Examples

```bash
npx @claude-flow/cli@latest init --wizard
npx @claude-flow/cli@latest agent spawn -t coder --name my-coder
npx @claude-flow/cli@latest swarm init --v3-mode
npx @claude-flow/cli@latest memory search --query "authentication patterns"
npx @claude-flow/cli@latest doctor --fix
```

## Available Agents (60+ Types)

### Core Development
`coder`, `reviewer`, `tester`, `planner`, `researcher`

### Specialized
`security-architect`, `security-auditor`, `memory-specialist`, `performance-engineer`

### Swarm Coordination
`hierarchical-coordinator`, `mesh-coordinator`, `adaptive-coordinator`

### GitHub & Repository
`pr-manager`, `code-review-swarm`, `issue-tracker`, `release-manager`

### SPARC Methodology
`sparc-coord`, `sparc-coder`, `specification`, `pseudocode`, `architecture`

## Memory Commands Reference

```bash
# Store (REQUIRED: --key, --value; OPTIONAL: --namespace, --ttl, --tags)
npx @claude-flow/cli@latest memory store --key "pattern-auth" --value "JWT with refresh" --namespace patterns

# Search (REQUIRED: --query; OPTIONAL: --namespace, --limit, --threshold)
npx @claude-flow/cli@latest memory search --query "authentication patterns"

# List (OPTIONAL: --namespace, --limit)
npx @claude-flow/cli@latest memory list --namespace patterns --limit 10

# Retrieve (REQUIRED: --key; OPTIONAL: --namespace)
npx @claude-flow/cli@latest memory retrieve --key "pattern-auth" --namespace patterns
```

## Quick Setup

```bash
claude mcp add claude-flow -- npx -y @claude-flow/cli@latest
npx @claude-flow/cli@latest daemon start
npx @claude-flow/cli@latest doctor --fix
```

## Claude Code vs CLI Tools

- Claude Code's Task tool handles ALL execution: agents, file ops, code generation, git
- CLI tools handle coordination via Bash: swarm init, memory, hooks, routing
- NEVER use CLI tools as a substitute for Task tool agents

## Superpowers - TDD, Debugging & Collaboration

This project includes **superpowers** - a comprehensive skills library for AI agents developed by Jesse Vincent (obra). Superpowers provides automated workflows for test-driven development, systematic debugging, and collaborative development patterns.

### Available Superpowers Skills

**Testing & Quality:**
- **test-driven-development** - Enforces RED-GREEN-REFACTOR cycle
- **verification-before-completion** - Ensures fixes actually work

**Debugging:**
- **systematic-debugging** - 4-phase root cause analysis process

**Planning & Collaboration:**
- **brainstorming** - Socratic design refinement through questions
- **writing-plans** - Detailed implementation planning with bite-sized tasks
- **executing-plans** - Batch execution with human checkpoints
- **requesting-code-review** - Pre-review checklist and workflow
- **receiving-code-review** - Responding to feedback constructively

**Advanced Workflows:**
- **subagent-driven-development** - Fast iteration with two-stage review
- **dispatching-parallel-agents** - Concurrent subagent workflows
- **using-git-worktrees** - Parallel development branches
- **finishing-a-development-branch** - Merge/PR decision workflow

**Meta:**
- **writing-skills** - Create new skills following best practices
- **using-superpowers** - Introduction to the skills system

### How Superpowers Works

Superpowers skills activate **automatically** based on context. The system checks for relevant skills before any task:

1. **Before coding** → brainstorming skill refines requirements
2. **After design approval** → using-git-worktrees creates isolated workspace
3. **With approved design** → writing-plans breaks work into tasks
4. **With plan** → subagent-driven-development or executing-plans
5. **During implementation** → test-driven-development enforces TDD
6. **Between tasks** → requesting-code-review validates progress
7. **When tasks complete** → finishing-a-development-branch handles cleanup

### Usage Examples

**Planning a feature:**
```
Help me plan a user authentication system
```
→ Activates brainstorming skill

**Debugging an issue:**
```
This test is failing intermittently
```
→ Activates systematic-debugging skill

**Writing tests:**
```
Add tests for the payment processing module
```
→ Activates test-driven-development skill

**Code review:**
```
Review my changes to the API layer
```
→ Activates requesting-code-review skill

### Key Philosophies

- **Test-Driven Development** - Write tests first, always
- **Systematic over ad-hoc** - Process over guessing
- **Complexity reduction** - Simplicity as primary goal
- **Evidence over claims** - Verify before declaring success

### Integration with RuFlo

Superpowers complements RuFlo's existing workflow:
- **OpenSpec** → What to build
- **Superpowers planning** → How to approach it
- **Playwright tests** → Verification
- **Claude-Flow agents** → Implementation

For more details, see: https://github.com/obra/superpowers

---

## OpenSpec - Spec-Driven Development

This project includes **OpenSpec** - an AI-native system for spec-driven development. OpenSpec manages change proposals with structured artifacts (proposal, design, tasks) for systematic feature development.

### Installation

OpenSpec is a separate CLI tool (not part of `@claude-flow/cli`):

```bash
# Install globally
npm install -g @fission-ai/openspec

# Or use npx without installing
npx -y @fission-ai/openspec --help
```

### Quick Start

```bash
# Initialize OpenSpec in your project (one-time setup)
openspec init

# Create a new change proposal
openspec new change "feature-name"

# Check status of a change
openspec status --change "feature-name"

# View all changes
openspec list changes

# Show change details
openspec show change "feature-name"
```

### OpenSpec Workflow

1. **Propose** → Create change with artifacts
   ```bash
   openspec new change "add-user-auth"
   ```

2. **Create Artifacts** → Generate proposal, design, tasks
   - The skill creates files in `openspec/changes/<name>/`
   - Artifacts include: `proposal.md`, `design.md`, `tasks.md`

3. **Implement** → Execute tasks
   ```bash
   # Use Claude Code skill to implement
   /opsx:apply add-user-auth
   ```

4. **Archive** → Move completed changes to archive
   ```bash
   openspec archive "add-user-auth"
   ```

### Using with Claude Code

OpenSpec integrates with Claude Code via skills:

- **`/opsx:propose <name>`** - Create new change with all artifacts
- **`/opsx:apply <name>`** - Implement tasks from a change
- **`/opsx:explore`** - Explore and refine requirements interactively
- **`/opsx:archive <name>`** - Archive completed change

**Example:**
```
/opsx:propose frontend-refactor-ai-optimization
```

This creates:
```
openspec/changes/frontend-refactor-ai-optimization/
├── .openspec.yaml
├── proposal.md       (what & why)
├── design.md         (how)
└── tasks.md          (implementation steps)
```

### OpenSpec vs CLI Tools

**Important:** OpenSpec is a separate tool, NOT part of `@claude-flow/cli`:

```bash
# ❌ WRONG - This will fail
npx @claude-flow/cli@latest openspec new change "name"

# ✅ CORRECT - Use openspec directly
openspec new change "name"

# ✅ ALSO CORRECT - Use npx for openspec package
npx -y @fission-ai/openspec new change "name"
```

### Available Commands

| Command | Description |
|---------|-------------|
| `init` | Initialize OpenSpec in project |
| `new change <name>` | Create new change proposal |
| `list [changes\|specs]` | List items |
| `show <item>` | Display change or spec details |
| `status --change <name>` | Show artifact completion status |
| `instructions <artifact>` | Get creation instructions |
| `validate <name>` | Validate change/spec |
| `archive <name>` | Archive completed change |
| `schema` | Manage workflow schemas |

### Integration with RuFlo

OpenSpec complements RuFlo's workflow:
- **OpenSpec** → What to build (specification)
- **Superpowers planning** → How to approach it
- **Playwright tests** → Verification
- **Claude-Flow agents** → Implementation

### Support

- Documentation: https://github.com/Fission-AI/OpenSpec
- NPM Package: https://www.npmjs.com/package/@fission-ai/openspec

---

## Caveman Token Optimization

This project includes **caveman** - a Claude Code skill that reduces token usage by 50-75% through condensed communication patterns. Caveman maintains full technical accuracy while dramatically reducing API costs.

### Available Commands

- `/caveman lite` - Professional but tight (25-35% reduction)
- `/caveman full` - Classic caveman style, default mode (50-60% reduction)
- `/caveman ultra` - Extreme abbreviation (70-75% reduction)
- `/caveman wenyan-lite` - Semi-classical Chinese
- `/caveman wenyan-full` - Full 文言文 (80-90% character reduction)
- `/caveman wenyan-ultra` - Extreme classical Chinese abbreviation

### When to Use Each Level

**Use `lite` for:**
- Formal documentation
- Client-facing communications
- Code reviews requiring clarity

**Use `full` (default) for:**
- Daily development work
- Debugging and troubleshooting
- Technical discussions
- Most project communication

**Use `ultra` for:**
- Quick exchanges
- Well-understood contexts
- Rapid iteration sessions
- Internal team communication

**Use `wenyan` modes for:**
- Chinese-speaking team members
- Cross-cultural collaboration
- When classical Chinese brevity is preferred

### Examples

**Question:** "Why is my React component re-rendering?"

**Normal Claude (69 tokens):**
> "The reason your React component is re-rendering is likely because you're creating a new object reference on each render cycle. When you pass an inline object as a prop, React's shallow comparison sees it as a different object every time, which triggers a re-render. I'd recommend using useMemo to memoize the object."

**Caveman Full (19 tokens - 72% reduction):**
> "New object ref each render. Inline object prop = new ref = re-render. Wrap in `useMemo`."

**Caveman Ultra (10 tokens - 85% reduction):**
> "Inline obj prop → new ref → re-render. `useMemo`."

### Configuration

Caveman is configured in `.claude/skills/caveman/config.yaml`:
- Default intensity: `full`
- Auto-clarity: Enabled (automatically disables for security warnings)
- Status line integration: Available but disabled by default

### Activation

Caveman activates when:
- You invoke any `/caveman` command
- You say "caveman mode", "talk like caveman", "use caveman"
- You request token efficiency or brevity

Caveman deactivates when:
- You say "stop caveman" or "normal mode"
- Security warnings or irreversible actions are needed
- Multi-step sequences require clarity (auto-disabled)

### Token Savings

Based on project analysis:
- **Expected reduction:** 50-75% for most interactions
- **Best use cases:** Debugging, code reviews, technical discussions
- **Minimal impact:** Security warnings, complex explanations (auto-disabled)

### Integration Details

- **Installation:** Git submodule at `.claude/skills/caveman/` (pinned to v1.4.1)
- **Type:** Project-local skill (does not affect other projects)
- **Updates:** Run `git submodule update --remote .claude/skills/caveman` to update
- **Rollback:** Run `git submodule deinit -f .claude/skills/caveman` to remove

## Support

- Documentation: https://github.com/ruvnet/claude-flow
- Issues: https://github.com/ruvnet/claude-flow/issues
- Caveman: https://github.com/JuliusBrussee/caveman
- Superpowers: https://github.com/obra/superpowers
