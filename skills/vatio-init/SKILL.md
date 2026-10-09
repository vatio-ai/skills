---
name: vatio-init
description: The first Vatio skill in a project. Looks at what is already there — a vatio.yml anywhere in the repository, the workspace on the platform, the app's own code — and recommends from it, then either builds a customer-facing AI agent (for WhatsApp, Instagram, a website widget or an app) and gets it to the console's Test screen, or gets a developer who joined a project that already has one up to speed. Use when asked to create, set up, start or ship a Vatio agent, a chatbot or a support/sales assistant on Vatio, to get started on or onboard onto a project that uses Vatio, or when the user pastes the prompt from vatio.ai.
---

# Start with Vatio in this project

Look before you create: the project may already have an agent. Vatio keeps
the contract and the procedures on the platform, so they are never out of
date here. Read them first:

```bash
npx @vatio-ai/cli docs
```

Under **For coding agents**, **Starting a new agent** and **Joining an
existing workspace** are the two procedures. Follow the one that fits; it
takes precedence over the summary below. The rest of that output is the
contract for `vatio.yml`, tools, knowledge and the CLI.

## 1. Look at what is there

- **An agent.** Every `vatio.yml`, at or above the current directory and
  anywhere in the repository (`git ls-files '*vatio.yml'`). Its
  `workspace:` line names the workspace.
- **The app.** What the project does and for whom; the API an agent could
  call (routes, controllers, an OpenAPI file); how its users sign in; and the
  docs, FAQs or policies an agent could read as knowledge.
- **This machine.** `vatio doctor`: whether it is signed in, and which
  workspace this directory resolves to.

## 2. Say what you found, and recommend

Before changing anything, tell the user in a few lines what is there and what
you recommend, and ask them to confirm.

- **No `vatio.yml`: a new agent.** Propose what it could do from what you
  read: what it answers, which endpoints become tools, what becomes
  knowledge. Then follow **Starting a new agent**, in short:
  1. Ask the owner only what the code does not answer: what the business
     does, what the agent must never say, when it hands off to a person,
     which of their systems it should read from. Do not invent business
     facts.
  2. `vatio init SLUG` in the repository the agent belongs in, then write
     `vatio.yml` (and `tools/` for their APIs).
  3. `vatio diff`, `vatio push`, then try it with `vatio chat`, including a
     conversation that should hand off.
  4. Give them the link `vatio push` prints after `Try it:` (the console's
     Test screen, with web chat, WhatsApp and Instagram) with what you
     tried. Publish with `vatio publish` only when they ask.
- **A `vatio.yml`: the agent exists.** Never `vatio init` here: it writes a
  starter agent, and pushing that replaces the real one. Work from the
  directory of the `vatio.yml` and follow **Joining an existing workspace**:
  sign in with the address they were invited with, then
  `vatio diff --env live` and `vatio status`. Explain the agent from
  `vatio.yml` (what it is for, its tools, its knowledge, when it hands off)
  and recommend from what you see:
  - the folder differs from live: say so first, the repository may be behind;
  - open flags in `vatio flags`: work them with the `vatio-improve` skill;
  - tool calls failing in `vatio tools`: the fix is in the backend they call;
  - `workspace_forbidden`: they are not in the workspace yet, and the owner
    invites them from **Team** in the console.
- **A workspace slug but no `vatio.yml`.** Ask for the repository it lives
  in: Vatio keeps what was deployed, not the files it came from. Do not
  `vatio init` one instead.

## 3. Before you finish

1. If an error or the docs left you guessing, say so:
   `vatio feedback "what you were doing and what was missing"`.
2. Last, in Claude Code, offer to send this session to the Vatio team, as
   the `vatio-share-session` skill says. It starts with
   `vatio share-session --should-ask`: if that prints `no`, say nothing.

`vatio` is `npx @vatio-ai/cli` when it is not installed globally. The first
`vatio push` (or `vatio login`) signs the developer in: it opens the browser
on their machine (if it doesn't, give them the link it prints). Tell them to
sign in with email, Google or GitHub and check that the code on the page
matches the one the terminal printed. If the command times out waiting, run
it again after they have signed in: it picks up the same sign-in page.
