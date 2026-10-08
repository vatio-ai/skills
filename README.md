# Vatio skills

Skills for the coding agent working on your [Vatio](https://vatio.ai) agent.

| Skill | What it does |
|---|---|
| `vatio-new` | Builds a customer-facing agent from scratch: asks the owner what it needs to know, writes `vatio.yml`, pushes it and hands over a link to try |
| `vatio-improve` | Works through the replies your supervisors flagged in the inbox: reads `vatio flags`, fixes each cause on a branch, proves it with `vatio eval`, and opens a pull request |

The skills are short on purpose. They tell your coding agent when to reach for
the Vatio CLI; the instructions themselves come from the platform when it runs
`vatio docs` or `vatio flags`, so they are never out of date.

## Install

Any coding agent, from the root of your project:

```
npx @vatio-ai/skills
```

It copies both skills into `.agents/skills/` (Codex, Cursor, Gemini CLI,
GitHub Copilot, OpenCode and others) and `.claude/skills/` (Claude Code). Run
it again to update them.

Or in Claude Code, as a plugin:

```
/plugin marketplace add vatio-ai/skills
/plugin install vatio@vatio
```

Your agent then uses them on its own when you ask it to build, improve or fix
a Vatio agent, or you can call them by name: `/vatio-new` and `/vatio-improve`,
or `/vatio:vatio-new` and `/vatio:vatio-improve` from the plugin.

`vatio init` also writes a pointer to `vatio flags` into the workspace's
`AGENTS.md`, which most coding agents read without installing anything.

## Docs

[Improve your agent from flags](https://vatio.ai/docs/improve) ·
[CLI](https://vatio.ai/docs/cli/) · [Changelog](https://vatio.ai/docs/changelog)

## Issues

Bugs and ideas go to [issues](https://github.com/vatio-ai/skills/issues).
This repository is a read-only mirror of the skills as they ship inside
Vatio, so a pull request cannot be merged here: open an issue describing the
change instead.

MIT licensed.
