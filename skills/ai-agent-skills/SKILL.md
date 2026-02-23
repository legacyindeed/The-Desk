---
name: ai-agent-skills
description: Overview and manager for the AI Agent Skills architecture. Use to understand the 3-layer system, initialize new skills, and manage standards.
---

# AI Agent Skills (Wednesday Framework)

This skill provides the overarching framework for the 3-layer architecture used to build reliable and autonomous AI applications.

## The 3-Layer Architecture

1. **Layer 1: Directives**: High-level SOPs and natural language instructions.
2. **Layer 2: Orchestration**: Intelligent routing and decision-making logic.
3. **Layer 3: Execution**: Deterministic scripts and tools for reliable actions.

## Related Skills

- **[wednesday-dev](../wednesday-dev/SKILL.md)**: Engineering standards and code quality.
- **[wednesday-design](../wednesday-design/SKILL.md)**: UX/UI and aesthetic guidelines.
- **[skill-creator](../../SKILL.md)**: Guide for creating new skills within this system.

## Command Reference (Local Utilities)

If the `@wednesday-solutions/ai-agent-skills` package is unavailable via npm, use the following local scripts:

### Initialize a Skill
```bash
python scripts/init_skill.py <skill-name>
```
*Creates a standard skill directory with SKILL.md and resource folders.*

### Package a Skill
```bash
python scripts/package_skill.py <path/to/skill>
```
*Bundles the skill into a .skill file for distribution.*

## Directory Structure

```
├── directives/      # SOPs (Layer 1)
├── scripts/         # Local utilities
├── execution/       # Deterministic tools (Layer 3)
└── skills/          # Modular agent capabilities
    ├── skill-a/
    └── skill-b/
```
