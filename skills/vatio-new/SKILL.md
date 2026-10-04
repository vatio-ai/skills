---
name: vatio-new
description: Build someone a customer-facing AI agent on Vatio and get it to the console's Test screen, where they can try it — for WhatsApp, Instagram, a website widget or an app. Use when asked to create, set up, start or ship a Vatio agent, a chatbot or a support/sales assistant on Vatio, or when the user pastes the prompt from vatio.ai.
---

# Start a Vatio agent

Vatio keeps the contract and the procedure on the platform, so they are never
out of date here. Read them first:

```bash
npx @vatio-ai/cli docs
```

The section **For coding agents → Starting a new agent** is the procedure;
follow it, it takes precedence over the summary below. The rest of that
output is the contract for `vatio.yml`, tools, knowledge and the CLI.

In short:

1. If a `vatio.yml` exists at or above the current directory, work in that
   workspace and keep its slug.
2. Before writing anything, ask the owner briefly: what the business does,
   what the agent must never say, when it must hand off to a person, and which
   of their systems it should read from. Do not invent business facts.
3. `vatio init SLUG` in the repository the agent belongs in, then write
   `vatio.yml` (and `tools/` for their APIs).
4. `vatio diff`, `vatio push`, then try it with `vatio chat` —
   including a conversation that should hand off.
5. Give them the link `vatio push` prints after `Try it:` — the console's
   Test screen, with web chat, WhatsApp and Instagram — with what you tried.
   Publish with `vatio publish` only when they ask.
6. If an error or the docs left you guessing, say so before you finish:
   `vatio feedback "what you were doing and what was missing"`.

`vatio` is `npx @vatio-ai/cli` when it is not installed globally. The first
`vatio push` signs the developer in: it opens the browser on their machine
(if it doesn't, give them the link it prints). Tell them to sign in with
email, Google or GitHub and check that the code on the page matches the one
the terminal printed. If the command times out waiting, run it again after
they have signed in: it picks up the same sign-in page.
