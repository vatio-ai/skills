# @vatio-ai/skills

The Vatio skill for coding agents. Vatio is a managed platform for always-on
agents: it holds the agent and runs what wakes it, what it remembers, what it
may do without asking and how its work reaches people.

```bash
npx @vatio-ai/skills
```

Run it in a project. It copies the `vatio` skill into `.claude/skills` (Claude
Code) and `.agents/skills` (Codex, Cursor and most other coding agents) and
adds the Vatio MCP (`https://vatio.ai/mcp`) to the project's `.mcp.json`, and
to `.cursor/mcp.json` when there is a `.cursor/`. `--no-mcp` leaves those
alone; `--dir PATH` installs somewhere else. Running it again replaces the
copies and removes the skills this package used to ship (`vatio-init`,
`vatio-improve`, `vatio-analyze`, `vatio-share-session`).

Then, in Claude Code, approve the `vatio` server (or run `/mcp`), sign in to
Vatio, and run `/vatio`, or just ask to build, change, improve or analyze a
Vatio agent. In another coding agent, connect `https://vatio.ai/mcp` and ask
it to use the vatio skill.

The skill looks at what is there (your workspaces, the app's code), builds a
new agent or works on the one you have through the MCP, and always ends by
sending feedback to the Vatio team with `send_feedback`.

Docs: <https://vatio.ai/docs/mcp>. Node.js 18 or newer.
