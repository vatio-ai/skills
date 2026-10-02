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

In Claude Code:

```
/plugin marketplace add vatio-ai/skills
/plugin install vatio@vatio
```

Your agent then uses them on its own when you ask it to build, improve or fix
a Vatio agent, or you can call them as `/vatio:vatio-new` and
`/vatio:vatio-improve`.

Other coding agents: copy the `SKILL.md` files under `skills/` to wherever
yours reads skills from. `vatio init` also writes a pointer to `vatio flags`
into the workspace's `AGENTS.md`, which most coding agents read without
installing anything.

## Docs

[Improve your agent from flags](https://docs.vatio.ai/improve) ·
[CLI](https://docs.vatio.ai/cli/) · [Changelog](https://docs.vatio.ai/changelog)

## Issues

Bugs and ideas go to [issues](https://github.com/vatio-ai/skills/issues).
This repository is a read-only mirror of the skills as they ship inside
Vatio, so a pull request cannot be merged here: open an issue describing the
change instead.

MIT licensed.
