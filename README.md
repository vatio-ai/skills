# Vatio: an AI agent for the app you’re building

Building an app with Claude Code, Cursor or Codex? Give it an agent that knows
the app and its users. In your app’s project:

```bash
npx @vatio-ai/skills
```

Then, in Claude Code, approve the **vatio** MCP server it asks about, sign in
to Vatio, and run `/vatio-init` (in Cursor or Codex, ask it to use
vatio-init). It builds the agent from your project, writes its tests and puts
it in your app; [Vatio](https://vatio.ai) holds and runs it, with an inbox,
human handoff and the tests checked before every publish. There are no config
files to keep in your repository: the agent lives on Vatio and your coding
agent changes it through the Vatio MCP.

After launch, report mistakes in the inbox and make `/vatio-improve` your
daily routine. Your coding agent fixes the agent, Vatio replays the reported
cases and your tests, and you approve the update. You do not need to write
code yourself; you need your app’s project on your computer and Node.js 20 or
newer.

| Skill | What it does |
|---|---|
| `vatio-init` | The first one in a project: looks at what is already there (the workspaces your account reaches, the app's code) and recommends from it. With no agent yet, builds one through the MCP: asks the owner what the code does not answer, writes its instructions, knowledge and tools, tries it, writes its tests, puts the widget or SDK in your app and hands over a link to try. With one, gets a developer who joined the project up to speed |
| `vatio-improve` | Takes every reply your supervisors reported in the inbox in one session: reads `list_reports`, fixes each cause, proves it with `run_tests` (on Vatio's servers) and publishes after your approval |
| `vatio-analyze` | Reads what people talked about with the agent between two dates, from `list_conversations` (redacted by Vatio before it leaves): topics with their counts, the questions it could not answer and the words people use, in a report for writing content, FAQs or knowledge. Anyone on the workspace's team can run it, viewers included |
| `vatio-share-session` | Sends the coding session to the Vatio team when you ask it to, after showing you what goes (images left out, anything that looks like a secret redacted), with your feedback if you want to add some |

The skills are short on purpose. They tell your coding agent which of the
Vatio MCP's tools to reach for; the instructions for working reports and tests
come from the platform when it reads them, so they are never out of date.

## Install

`npx @vatio-ai/skills` copies the skills into `.claude/skills/`, where Claude
Code reads them, and `.agents/skills/`, where Codex, Cursor, Gemini CLI,
GitHub Copilot and most other coding agents do. It also adds the Vatio MCP
(`https://vatio.ai/mcp`) to the project's `.mcp.json` and, when the project
has a `.cursor/`, to `.cursor/mcp.json`; `--no-mcp` leaves those alone. Run it
again to update the skills. Elsewhere, connect `https://vatio.ai/mcp` as your
coding agent's docs say ([Vatio in Claude and ChatGPT](https://vatio.ai/docs/mcp)).

### As a Claude Code plugin

In Claude Code the same skills come as a plugin that can update itself, and
brings the Vatio MCP with it. Run these one at a time and follow the
installation panel; the commands are then `/vatio:vatio-init` and
`/vatio:vatio-improve`:

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

## What it runs and sends

The skills are instructions for your coding agent, with no hooks or anything
that runs by itself. They work through one MCP server,
[vatio.ai/mcp](https://vatio.ai/docs/mcp), and for sharing a session when you
ask, the [Vatio CLI](https://github.com/vatio-ai/cli)
(`npx @vatio-ai/cli`, downloaded from npm). Both talk to one service,
[vatio.ai](https://vatio.ai):

- **Sign-in.** Your coding agent's MCP client opens vatio.ai to sign you in,
  and keeps the token it gets back. You see the connection under
  **Account → Sessions** in the inbox and can end it there.
- **Your agent.** The MCP's tools send what your coding agent writes (the
  agent's instructions, knowledge, tools and tests) to vatio.ai, which runs
  the agent. `set_secret` sends a secret you name, stored encrypted and never
  shown again.
- **Conversations.** `chat_with_agent` sends what your coding agent types to
  your agent. `list_reports`, `get_conversation` and `list_conversations`
  (redacted by Vatio before it leaves) bring your workspace's conversations to
  it, and each read is recorded in the workspace's Activity.
- **How each tool call ended.** Vatio records which tool ran, whether it ended
  in an error, how long it took and which app made the call; never what a tool
  was given or returned. Installing these skills tells Vatio once, with their
  version and the coding agent. `VATIO_TELEMETRY=0` skips that.
- **Feedback.** At the end of `vatio-init` and `vatio-improve`, your agent
  sends the Vatio team a few sentences with the MCP's `send_feedback`: which
  step took the most work, and why.
- **Your coding session, only if you say yes.** `vatio-share-session` shows
  you what would go (images left out, anything that looks like a secret
  redacted) and sends it to the Vatio team only after you agree.

What Vatio keeps and for how long is in its
[privacy policy](https://vatio.ai/legal/privacy-policy).

## Docs

[Vatio MCP](https://vatio.ai/docs/mcp) ·
[Improve your agent from reports](https://vatio.ai/docs/improve) ·
[Changelog](https://vatio.ai/docs/changelog)

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
Run it again to update them. Any coding agent that reads those skills, and
connects `https://vatio.ai/mcp`, can follow the same procedures. You can also
use `npx skills add vatio-ai/skills` with the [skills CLI](https://skills.sh).
