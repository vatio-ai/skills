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

1. Group the reports by cause, and fix each cause where it lives:
   `vatio.yml`, a knowledge entry, a tool, or the developer's backend a tool
   calls. `vatio tools --env live` shows each tool's error rate, timeouts and
   latency, and the calls that failed with what the backend answered: a
   failing tool rarely gets reported, because the agent apologizes and moves
   on. Fix those too.
2. `vatio push`. It updates preview and runs no tests. No branch or
   environment to set up: preview is the one.
3. `vatio eval` tests every report against preview. It can take several
   minutes, so in Claude Code start it with the Bash tool's
   `run_in_background` and read its report when it finishes. Iterate (fix,
   push, eval) until the reports pass and nothing that passes on live fails.
   Name reports by id (`F-7K2QX`).
4. Show the developer what passes now, and `vatio publish` once they agree:
   it changes what visitors get. If it is refused, follow its message: it
   says what to run. Never pass `--force` unless the developer explicitly
   asks for it.
5. If the digest, an error or the docs left you guessing, say so:
   `vatio feedback "what you were doing and what was missing"`.
6. Last, in Claude Code, offer to send this session to the Vatio team, as
   the `vatio-share-session` skill says. It starts with
   `vatio share-session --should-ask`: if that prints `no`, say nothing.

`vatio docs` prints the whole contract (manifest, tools, knowledge, CLI) if
the fix needs more than the digest says. If `vatio` is not installed, use
`npx @vatio-ai/cli` in its place; if it says to log in, run `vatio login`: it
opens the browser on the developer's machine (if it doesn't, give them the
link it prints), and they sign in and check the code matches. If it times
out, run it again after they have signed in.
