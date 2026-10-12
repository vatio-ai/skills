# Vatio: the Claude Code plugin for your app’s agent

Already have an app and users? Describe the conversational agent you want in
Claude Code. `vatio-init` builds it from your project; [Vatio](https://vatio.ai)
runs it with an inbox, human handoff and evaluation checks. You try the preview
and approve publication.

After launch, report mistakes in the inbox and make `/vatio:vatio-improve` your
daily routine. Claude prepares fixes, Vatio tests the reported cases, and you
approve the update. You do not need to write code yourself; you need access to
your app’s project in Claude Code.

| Skill | What it does |
|---|---|
| `vatio-init` | The first one in a project: looks at what is already there (a `vatio.yml` anywhere in the repository, the app's code) and recommends from it. With no agent yet, builds one: asks the owner what the code does not answer, writes `vatio.yml`, pushes it and hands over a link to try. With one, gets a developer who joined the project up to speed |
| `vatio-improve` | Takes every reply your supervisors reported in the inbox in one session: reads `vatio flags`, fixes each cause, `vatio push`, proves it with `vatio test` (on Vatio's servers, in the background) and publishes with `vatio publish` after your approval |
| `vatio-share-session` | Sends the Claude Code session to the Vatio team when you ask it to, or offers to when the other two finish (send it, not now, or don't ask again), after showing you what goes (images left out, anything that looks like a secret redacted), with your feedback if you want to add some |

The skills are short on purpose. They tell your coding agent when to reach for
the Vatio CLI; the instructions themselves come from the platform when it runs
`vatio docs` or `vatio flags`, so they are never out of date.

## Install in Claude Code

In your app’s project, run these commands one at a time and follow the
installation panel:

```text
/plugin marketplace add vatio-ai/skills
/plugin install vatio@vatio
```

Then ask: “Use vatio-init to build a support agent for this app. Connect it to
our existing users and features, define its permissions and human handoff,
and give me a preview to try before publishing.”

Claude Code does not update plugins from other people's marketplaces on its own:
turn it on once in `/plugin` → **Marketplaces** → **vatio** → **Enable
auto-update**, or run `claude plugin update vatio@vatio`.

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

## Other coding agents

From the root of your project:

```bash
npx @vatio-ai/skills
```

This copies the skills into `.agents/skills/` and `.claude/skills/`.
Run it again to update them. Any coding agent that reads those skills can
follow the same procedures. You can also use `npx skills add vatio-ai/skills`
with the [skills CLI](https://skills.sh).
