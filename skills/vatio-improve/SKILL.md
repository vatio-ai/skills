---
name: vatio-improve
description: Improve a Vatio agent from what its supervisors flagged. Use when asked to improve, fix or debug a Vatio agent, to work through flagged replies or wrong answers in production, or when a GitHub issue labelled vatio-flags arrives. Works in any directory with a vatio.yml.
---

# Improve a Vatio agent from its flags

Supervisors flag wrong replies in the Vatio inbox and write what should have
happened: a different answer, an action, or a tool the agent should have used
or does not have. Vatio keeps the instructions for working them on the
platform, so they are never out of date here. Start by reading them:

```bash
vatio flags
```

Run it from the directory with the workspace's `vatio.yml` (or below it). It
prints every open flag — the conversation, each tool call with what the
backend answered, and the supervisor's note — with how to work them at the
top. Follow those instructions; they take precedence over anything below.

In short:

1. Group the flags by cause, and fix each cause where it lives: `vatio.yml`,
   a knowledge entry, a tool, or the backend a tool calls.
2. Work on a git branch. `vatio push` deploys it to the branch's own
   environment, never to live.
3. Prove it with `vatio eval`: every flag is an eval case, replayed against
   the branch and judged. The report counts the open flags apart from the
   regression cases. A fix is done when its flags pass and nothing that
   passed on live now fails.
4. Open a pull request with what you changed and the eval result. Name flags
   by id (`F-7K2QX`), and report the open flags and the
   regression cases as two counts, never one total. With no GitHub
   repository connected, `vatio propose --env <branch> --title "…"
   --summary-file why.md` instead: the workspace's owner accepts it from the
   inbox, which publishes it. Never `vatio publish` it yourself.
5. If the digest, an error or the docs left you guessing, say so:
   `vatio feedback "what you were doing and what was missing"`.

`vatio docs` prints the whole contract (manifest, tools, knowledge, CLI) if
the fix needs more than the digest says. If `vatio` is not installed, use
`npx @vatio-ai/cli` in its place; if it says to log in, run `vatio login`: it
opens the browser on the developer's machine (if it doesn't, give them the
link it prints), and they sign in and check the code matches. If it times
out, run it again after they have signed in.
