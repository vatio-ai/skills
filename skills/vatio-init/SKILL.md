---
name: vatio-init
description: The first Vatio skill in a project. Looks at what is already there — a vatio.yml anywhere in the repository, the workspace on the platform, the app's own code — and recommends from it, then either builds a customer-facing AI agent (in the app first, through its web widget or mobile SDK, and on WhatsApp or Instagram when asked) and gets it to the Test page in the Vatio inbox, or gets a developer who joined a project that already has one up to speed. Use when asked to create, set up, start or ship a Vatio agent, a chatbot or a support/sales assistant on Vatio, to get started on or onboard onto a project that uses Vatio, or when the user pastes the prompt from vatio.ai.
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
- **This machine.** `vatio doctor`: whether it is signed in, which
  workspace this directory resolves to, and whether it pushed to a trial.

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
     `vatio.yml` (and `tools/` for their APIs, with one that alerts their
     team when a person should take over: **Human in the loop** in the docs).
  3. `vatio diff`, `vatio push`, then try it with `vatio chat`, including a
     conversation that should hand off.
  4. Give them what `vatio push` printed, with what you tried. With no
     account on this machine, the first push deploys a trial preview and
     prints a **Try it** link and a **Keep it** link: give them both. Try it
     is a web chat anyone with the link can use; Keep it is where they sign
     in (email, Google or GitHub) and keep the agent, which publishing,
     secrets and tokens wait for. Never open Keep it yourself. Signed in,
     `Try it:` is the inbox's Test page, with web chat, WhatsApp and
     Instagram. Publish with `vatio publish` only when they ask.
  5. Once they have tried it, offer to put it in the app (the web widget,
     or the iOS, Android or Flutter SDK) with the `vatio-add-to-app` skill. A trial
     has to be kept first.
- **A `vatio.yml`: the agent exists.** Never `vatio init` here: it writes a
  starter agent, and pushing that replaces the real one. Work from the
  directory of the `vatio.yml` and follow **Joining an existing workspace**:
  sign in with the address they were invited with, then
  `vatio diff --env live` and `vatio status`. Explain the agent from
  `vatio.yml` (what it is for, its tools, its knowledge, when it hands off)
  and recommend from what you see:
  - the folder differs from live: say so first, the repository may be behind;
  - open reports in `vatio flags`: work them with the `vatio-improve` skill;
  - tool calls failing in `vatio tools`: the fix is in the backend they call;
  - `workspace_forbidden`: they are not in the workspace yet, and the owner
    invites them from **Team** in the inbox.
- **A workspace slug but no `vatio.yml`.** Ask for the repository it lives
  in: Vatio keeps what was deployed, not the files it came from. Do not
  `vatio init` one instead.

## 3. Before you finish

1. If an error or the docs left you guessing, say so:
   `vatio feedback "what you were doing and what was missing"`.
2. Last, in Claude Code, offer to send this session to the Vatio team, as
   the `vatio-share-session` skill says. It starts with
   `vatio share-session --should-ask`: if that prints `no`, say nothing.

`vatio` is `npx @vatio-ai/cli` when it is not installed globally. Nothing
asks for an account until they keep the trial (or you run `vatio login`).
Once they have kept it, the next `vatio` command signs this terminal in: it
opens the browser on their machine (if it doesn't, give them the link it
prints). Tell them to sign in with the account that kept it and check that
the code on the page matches the one the terminal printed. If the command
times out waiting, run it again after they have signed in: it picks up the
same sign-in page.
