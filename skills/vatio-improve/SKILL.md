---
name: vatio-improve
description: Improve a Vatio agent from what its supervisors reported. Use when asked to improve, fix or debug a Vatio agent, to work through reported or flagged replies or wrong answers in production, or when the daily Vatio email says there are open reports. Works in any directory with a vatio.yml.
---

# Improve a Vatio agent from its reports

Supervisors report wrong replies in the Vatio inbox and write what it should
have said: a different answer, an action, or a tool the agent should have
used or does not have. One session takes every open report. Vatio keeps the
instructions for working them on the platform, so they are never out of date
here. Start by reading them:

```bash
vatio flags
```

Run it from the directory with the workspace's `vatio.yml` (or below it). It
prints every open report — the conversation, each tool call with what the
backend answered, and the supervisor's note — with how to work them at the
top. Follow those instructions; they take precedence over anything below.

In short:

1. Read each report's **Diagnosis** first: it says whose it is to fix, from
   what that turn did. **Your backend**: a tool call to it failed. **Your
   agent**: everything answered and the reply was still wrong, so the fix is
   in `vatio.yml`, knowledge or a tool's definition. **Vatio**: the model
   provider or Vatio failed and Vatio wrote the reply itself. Do not change
   the agent for those: tell the developer, who can remove the report, and
   if they keep happening, `vatio feedback`.
   `vatio flags rm ID` removes a report and its test for everyone. It is the
   developer's call: propose it (a report Vatio caused, one that asks for
   something the agent must not do, one whose fix is in but the tests cannot
   reproduce) and run it only when they say so.
   A report can also say **What Vatio did**: when the cause was the agent's
   instructions or a knowledge entry, Vatio already tried its own fix on
   preview and tested it. One it kept is done: do not fix it again. One it
   is still testing: leave what it changes alone until it settles. An
   instructions fix is a change made outside the files, so before you edit
   `vatio.yml` run `vatio pull` (commit your work first: it wants a clean git
   tree) and check `git diff`.
2. Group the reports by cause, and fix each cause where it lives:
   `vatio.yml`, a knowledge entry, a tool, or the developer's backend a tool
   calls. `vatio tools --env live` shows each tool's error rate, timeouts and
   latency, and the calls that failed with what the backend answered: a
   failing tool rarely gets reported, because the agent apologizes and moves
   on. Fix those too.
3. `vatio push`. It updates preview and runs no tests. No branch or
   environment to set up: preview is the one. If it is refused because
   preview has changes made outside the files (someone edited the agent from
   the Vatio MCP in Claude or ChatGPT), run `vatio pull`, which writes them
   into `vatio.yml` and `tools/` (commit your work first: it wants a clean
   git tree), check `git diff` still carries your fix, and push again. Never
   `vatio push --force` over them unless the developer says so.
4. `vatio test` tests every report against preview, on Vatio's servers: it
   starts the runs, prints their ids and returns. `vatio test --wait` waits
   for the report (several minutes), so in Claude Code start that with the
   Bash tool's `run_in_background` and read the report when it finishes;
   `vatio test --show RUN_ID` prints a run so far. A case that did not pass
   comes with the `vatio chat show CHAT_ID` of its replay. Iterate (fix, push,
   test) until the reports pass and nothing that passes on live fails. A case
   marked "not tested (Vatio's side)" says nothing about your fix: run
   `vatio test --wait` again. Name reports by id (`F-7K2QX`).
5. Show the developer what passes now, and `vatio publish` once they agree:
   it changes what visitors get. In a draft (no conversation from outside
   the team yet) live already runs every push, and `vatio publish` says
   there is nothing to publish. If it is refused, follow its message: it
   says what to run. Never pass `--force` unless the developer explicitly
   asks for it.
6. If the digest, an error or the docs left you guessing, say so:
   `vatio feedback "what you were doing and what was missing"`.
7. Last, in Claude Code, offer to send this session to the Vatio team, as
   the `vatio-share-session` skill says. It starts with
   `vatio share-session --should-ask`: if that prints `no`, say nothing.

`vatio docs` prints the whole contract (manifest, tools, knowledge, CLI) if
the fix needs more than the digest says. There are two ways to run the CLI,
and the package name appears once in either: `vatio ARGS` when it is
installed globally, and `npx @vatio-ai/cli@latest ARGS` when it is not. Pick
one per command and leave it whole — `npx @vatio-ai/cli @vatio-ai/cli flags`
is the commonest way to get this wrong, and the CLI reads the second name as
the command and fails. If it says to log in, run `vatio login`: it
opens the browser on the developer's machine (if it doesn't, give them the
link it prints), and they sign in and check the code matches. If it times
out, run it again after they have signed in.

A command you hand the developer to run themselves, because a permission
check refused it or it needs their own credentials, says
`npx @vatio-ai/cli@latest`, never `vatio`: the `vatio` installed on their
machine can be too old for Vatio to accept. When one command's output feeds
another (a token into a secrets store), take it with `--json` and chain with
`&&`, never through `grep`, so a failure stops there instead of passing on an
empty value. If Claude Code's auto mode refused a `vatio` command and the
project's `.claude/settings.json` has no `Bash(vatio *)` rule, also mention
**Auto mode** on the docs' Claude Code page.
