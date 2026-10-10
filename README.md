# Vatio skills

Skills for the coding agent working on your [Vatio](https://vatio.ai) agent.

| Skill | What it does |
|---|---|
| `vatio-init` | The first one in a project: looks at what is already there (a `vatio.yml` anywhere in the repository, the app's code) and recommends from it. With no agent yet, builds one: asks the owner what the code does not answer, writes `vatio.yml`, pushes it and hands over a link to try. With one, gets a developer who joined the project up to speed |
| `vatio-improve` | Takes every reply your supervisors reported in the inbox in one session: reads `vatio flags`, fixes each cause, `vatio push`, proves it with `vatio eval` (in the background in Claude Code) and publishes with `vatio publish` |
| `vatio-share-session` | Sends the Claude Code session to the Vatio team when you ask it to, or offers to when the other two finish (send it, not now, or don't ask again), after showing you what goes (images left out, anything that looks like a secret redacted), with your feedback if you want to add some |

The skills are short on purpose. They tell your coding agent when to reach for
the Vatio CLI; the instructions themselves come from the platform when it runs
`vatio docs` or `vatio flags`, so they are never out of date.

## Install

Any coding agent, from the root of your project:

```
npx @vatio-ai/skills
```

It copies the skills into `.agents/skills/` (Codex, Cursor, Gemini CLI,
GitHub Copilot, OpenCode and others) and `.claude/skills/` (Claude Code). Run
it again to update them.

Or with the open [skills](https://skills.sh) CLI, which asks which agents you
use and installs for those:

```
npx skills add vatio-ai/skills
```

Or in Claude Code, as a plugin:

```
/plugin marketplace add vatio-ai/skills
/plugin install vatio@vatio
```

Your agent then uses them on its own when you ask it to build, improve or fix
a Vatio agent, or to send the session to Vatio, or you can call them by name:
`/vatio-init`, `/vatio-improve` and `/vatio-share-session`, or
`/vatio:vatio-init` and so on from the plugin.

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
