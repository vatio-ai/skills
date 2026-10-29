# Vatio: an AI agent for the app you’re building

Building an app with Claude Code, Cursor or Codex? Give it an agent that knows
the app and its users. In your app’s project:

```bash
npx @vatio-ai/skills
```

Then, in Claude Code, run `/vatio-init` (in Cursor or Codex, ask it to use
vatio-init). It builds the agent from your project; [Vatio](https://vatio.ai)
runs it with an inbox, human handoff and evaluation checks. You try the preview
and approve publication.

After launch, report mistakes in the inbox and make `/vatio-improve` your
daily routine. Your coding agent prepares fixes, Vatio tests the reported
cases, and you approve the update. You do not need to write code yourself; you
need your app’s project on your computer and Node.js 20 or newer.

| Skill | What it does |
|---|---|
| `vatio-init` | The first one in a project: looks at what is already there (a `vatio.yml` anywhere in the repository, the app's code) and recommends from it. With no agent yet, builds one: asks the owner what the code does not answer, writes `vatio.yml`, pushes it and hands over a link to try. With one, gets a developer who joined the project up to speed |
| `vatio-improve` | Takes every reply your supervisors reported in the inbox in one session: reads `vatio test list`, fixes each cause, `vatio push`, proves it with `vatio test` (on Vatio's servers, in the background) and publishes with `vatio publish` after your approval |
| `vatio-analyze` | Reads what people talked about with the agent between two dates, from `vatio chat export` (redacted by Vatio before it leaves): topics with their counts, the questions it could not answer and the words people use, in a report for writing content, FAQs or knowledge. Anyone on the workspace's team can run it, viewers included |
| `vatio-share-session` | Sends the coding session to the Vatio team when you ask it to, or offers to when the others finish (send it, not now, or don't ask again), after showing you what goes (images left out, anything that looks like a secret redacted), with your feedback if you want to add some |

The skills are short on purpose. They tell your coding agent when to reach for
the Vatio CLI; the instructions themselves come from the platform when it runs
`vatio docs` or `vatio test list`, so they are never out of date.

## Install

`npx @vatio-ai/skills` copies the skills into `.claude/skills/`, where Claude
Code reads them, and `.agents/skills/`, where Codex, Cursor, Gemini CLI,
GitHub Copilot and most other coding agents do. Run it again to update them.

### As a Claude Code plugin

In Claude Code the same skills come as a plugin that can update itself. Run
these one at a time and follow the installation panel; the commands are then
`/vatio:vatio-init` and `/vatio:vatio-improve`:

```text
/plugin marketplace add vatio-ai/skills
/plugin install vatio@vatio
```

Claude Code does not update plugins from other people's marketplaces on its own:
turn it on once in `/plugin` → **Marketplaces** → **vatio** → **Enable
auto-update**, or run `claude plugin update vatio@vatio`.

Your coding agent then uses them on its own when you ask it to build, improve
or fix a Vatio agent, to analyze its conversations, or to send the session to
Vatio, or you can call them by
name: `/vatio-init`, `/vatio-improve`, `/vatio-analyze` and `/vatio-share-session`, or
`/vatio:vatio-init` and so on from the plugin.

`vatio init` also writes a pointer to `vatio test list` into the workspace's
`AGENTS.md`, which most coding agents read without installing anything.

## What it runs and sends

The skills are instructions for your coding agent, with no hooks, MCP servers
or anything that runs by itself. What they have your agent run is one
program, the [Vatio CLI](https://github.com/vatio-ai/cli)
(`npx @vatio-ai/cli`, downloaded from npm), and it talks to one service,
[vatio.ai](https://vatio.ai):

- **Sign-in.** The first `vatio push` (or `vatio login`) opens vatio.ai in your
  browser; the token it gets back is saved in `~/.vatio/config.json`.
- **Your agent's files.** `vatio check` and `vatio push` send the directory
  that holds `vatio.yml` (its tools and knowledge, never hidden files such as
  `.env` or `.git/`) to vatio.ai, which runs the agent. `vatio secrets set`
  sends a secret you name, stored encrypted.
- **Conversations.** `vatio chat` sends what you type to your agent.
  `vatio test list`, `vatio chat show` and `vatio chat export` (redacted by Vatio
  before it leaves) bring your workspace's conversations to your terminal.
  `vatio docs` fetches the docs.
- **How each command ended.** The CLI tells Vatio which command ran, its exit
  code and, on failure, what it printed; never arguments, file contents,
  secrets or what a chat said. `VATIO_TELEMETRY=0` turns it off.
- **Feedback.** `vatio feedback "..."` sends the text your agent writes about
  what got in its way.
- **Your coding session, only if you say yes.** `vatio-share-session` shows
  you what would go (images left out, anything that looks like a secret
  redacted) and sends it to the Vatio team only after you agree.

What Vatio keeps and for how long is in its
[privacy policy](https://vatio.ai/legal/privacy-policy).

## Docs

[Improve your agent from flags](https://vatio.ai/docs/improve) ·
[CLI](https://vatio.ai/docs/cli/) · [Changelog](https://vatio.ai/docs/changelog)

## Issues

Bugs and ideas go to [issues](https://github.com/vatio-ai/skills/issues).
This repository is a read-only mirror of the skills as they ship inside
Vatio, so a pull request cannot be merged here: open an issue describing the
change instead.

MIT licensed.

## Other coding agents

From the root of your project:

```bash
npx @vatio-ai/skills
```

This copies the skills into `.agents/skills/` and `.claude/skills/`.
Run it again to update them. Any coding agent that reads those skills can
follow the same procedures. You can also use `npx skills add vatio-ai/skills`
with the [skills CLI](https://skills.sh).
