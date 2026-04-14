---
name: openspec-apply-change
description: Implement tasks from an OpenSpec change using RuFlo Swarm coordination. Use when the user wants to start implementing, continue implementation, or work through tasks with multi-agent parallel execution.
license: MIT
compatibility: Requires openspec CLI + @claude-flow/cli
metadata:
  author: openspec
  contributors: [openspec, ruflo]
  version: "2.0"
  generatedBy: "1.2.0"
  swarmIntegration: true
---

Implement tasks from an OpenSpec change using **RuFlo Swarm** for parallel multi-agent execution.

**Input**: Optionally specify a change name. If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Steps**

1. **Select the change**

   If a name is provided, use it. Otherwise:
   - Infer from conversation context if the user mentioned a change
   - Auto-select if only one active change exists
   - If ambiguous, run `openspec list --json` to get available changes and use the **AskUserQuestion tool** to let the user select

   Always announce: "Using change: <name>" and how to override (e.g., `/opsx:apply <other>`).

2. **Check status to understand the schema**
   ```bash
   openspec status --change "<name>" --json
   ```
   Parse the JSON to understand:
   - `schemaName`: The workflow being used (e.g., "spec-driven")
   - Which artifact contains the tasks (typically "tasks" for spec-driven, check status for others)

3. **Get apply instructions**

   ```bash
   openspec instructions apply --change "<name>" --json
   ```

   This returns:
   - Context file paths (varies by schema - could be proposal/specs/design/tasks or spec/tests/implementation/docs)
   - Progress (total, complete, remaining)
   - Task list with status
   - Dynamic instruction based on current state

   **Handle states:**
   - If `state: "blocked"` (missing artifacts): show message, suggest using openspec-continue-change
   - If `state: "all_done"`: congratulate, suggest archive
   - Otherwise: proceed to implementation

4. **Read context files**

   Read the files listed in `contextFiles` from the apply instructions output.
   The files depend on the schema being used:
   - **spec-driven**: proposal, specs, design, tasks
   - Other schemas: follow the contextFiles from CLI output

5. **Show current progress & assess complexity**

   Display:
   - Schema being used
   - Progress: "N/M tasks complete"
   - Remaining tasks overview
   - Dynamic instruction from CLI

   **Assess if Swarm is needed:**
   - **Use Swarm** for: 2+ independent tasks, cross-cutting concerns, complex features, time-critical work
   - **Skip Swarm** for: 1 simple task, single-file edits, trivial changes

6. **Initialize RuFlo Swarm (for complex tasks)**

   IF swarm is needed, initialize before task execution:

   ```bash
   npx @claude-flow/cli@latest swarm init \
     --topology hierarchical \
     --max-agents 8 \
     --strategy specialized
   ```

   **If swarm init fails**: log error, continue with sequential execution

   **Announce:**
   ```
   ## RuFlo Swarm Initialized

   **Topology**: Hierarchical (Queen-Worker)
   **Max Agents**: 8
   **Strategy**: Specialized roles
   ```

7. **Implement tasks (loop until done or blocked)**

   **If Swarm is active:**
   - Group pending tasks by type and dependency
   - Spawn agents in parallel using Task tool (ONE message, ALL agents)
   - Agent types: coder, tester, reviewer, docs
   - Wait for agents to return (NO polling)
   - Review ALL results, then update task checkboxes

   **If Swarm is NOT active (simple tasks):**
   - For each pending task:
     - Show which task is being worked on
     - Make the code changes required
     - Keep changes minimal and focused
     - Mark task complete: `- [ ]` → `- [x]`

   **Pause if:**
   - Task is unclear → ask for clarification
   - Implementation reveals a design issue → suggest updating artifacts
   - Error or blocker encountered → report and wait for guidance
   - User interrupts

8. **On completion or pause, show status**

   Display:
   - Tasks completed this session
   - Overall progress: "N/M tasks complete"
   - If all done: suggest archive AND shutdown swarm
   - If paused: explain why and wait for guidance

**Output During Implementation**

```
## Implementing: <change-name> (schema: <schema-name>)

Working on task 3/7: <task description>
[...implementation happening...]
✓ Task complete

Working on task 4/7: <task description>
[...implementation happening...]
✓ Task complete
```

**Output On Completion**

```
## Implementation Complete

**Change:** <change-name>
**Schema:** <schema-name>
**Progress:** 7/7 tasks complete ✓

### Completed This Session
- [x] Task 1
- [x] Task 2
...

All tasks complete! Ready to archive this change.
```

**Output On Pause (Issue Encountered)**

```
## Implementation Paused

**Change:** <change-name>
**Schema:** <schema-name>
**Progress:** 4/7 tasks complete

### Issue Encountered
<description of the issue>

**Options:**
1. <option 1>
2. <option 2>
3. Other approach

What would you like to do?
```

**Guardrails**
- Keep going through tasks until done or blocked
- Always read context files before starting (from the apply instructions output)
- If task is ambiguous, pause and ask before implementing
- If implementation reveals issues, pause and suggest artifact updates
- Keep code changes minimal and scoped to each task
- Update task checkbox immediately after completing each task
- Pause on errors, blockers, or unclear requirements - don't guess
- Use contextFiles from CLI output, don't assume specific file names
- **For Swarm**: ALWAYS spawn ALL agents in ONE Task tool call
- **For Swarm**: NEVER poll status - wait for agents to return
- **For Swarm**: Shutdown swarm after completion: `npx @claude-flow/cli@latest swarm shutdown --graceful`

**Swarm Configuration Defaults**

```yaml
topology: hierarchical        # Queen-worker for code tasks
maxAgents: 8                 # Tight coordination limit
strategy: specialized        # Clear role boundaries
consensus: raft              # Leader maintains state
memory: hybrid               # Shared context
```

**Agent Type Mapping**

| Task Type | Agent Type | Parallel |
|-----------|------------|----------|
| Implementation | `coder` | Yes (2-3 agents) |
| Tests | `tester` | Yes (2 agents) |
| Review | `reviewer` | Yes (1-2 agents) |
| Documentation | `documentation` | Yes (1 agent) |
| Architecture | `architect` | Sequential (1 agent) |
| Security | `security` | Sequential (1 agent) |

**Fluid Workflow Integration**

This skill supports the "actions on a change" model with swarm acceleration:

- **Can be invoked anytime**: Before all artifacts are done (if tasks exist), after partial implementation, interleaved with other actions
- **Allows artifact updates**: If implementation reveals design issues, suggest updating artifacts - not phase-locked, work fluidly
- **Parallel by default**: Independent tasks execute concurrently across agents
- **Adaptive scaling**: Agent count based on task complexity
