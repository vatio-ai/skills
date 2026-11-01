---
name: vatio-init
description: The first Vatio skill in a project. Looks at what is already there — the workspaces the Vatio MCP reaches, the app's own code — and recommends from it, then either builds a customer-facing AI agent through the Vatio MCP (in the app first, through its web widget or mobile SDK, and on WhatsApp or Instagram when asked), writes its tests and gets it to Try the agent in the Vatio inbox, or gets a developer who joined a project that already has one up to speed. Use when asked to create, set up, start or ship a Vatio agent, a chatbot or a support/sales assistant on Vatio, to get started on or onboard onto a project that uses Vatio, or when the user pastes the prompt from vatio.ai.
---

# Start with Vatio in this project

Vatio holds the agent: its instructions, knowledge, tools, secrets and tests
live on the platform, and you build and test it with the Vatio MCP's tools.
Nothing about the agent goes into the app's repository. What does is what
puts it in front of people (the widget or SDK) and any endpoint of the app
the agent calls.

## 0. The Vatio MCP

Its tools are `list_workspaces`, `update_agent`, `chat_with_agent`,
`add_test` and the rest. If you do not have them:

- **Claude Code:** `npx @vatio-ai/skills` added the server to this project's
  `.mcp.json`. If it is not there, `claude mcp add --transport http vatio
  https://vatio.ai/mcp`. Then the person runs `/mcp`, picks **vatio** and
  signs in (email, Google or GitHub): only they can. A server added during a
  session loads when Claude Code starts again, so say so and stop until its
  tools are there.
- **Cursor, Codex and the rest:** add an MCP server at `https://vatio.ai/mcp`
  (Streamable HTTP, OAuth), as https://vatio.ai/docs/mcp.md says.

Never work around a missing MCP by writing a `vatio.yml` or running
`vatio push`.

## 1. Look at what is there

- **The account.** `list_workspaces`: every workspace the person reaches and
  their role in it.
- **The app.** What it does and for whom; the API an agent could call
  (routes, controllers, an OpenAPI file); how its users sign in; the docs,
  FAQs or policies an agent could read as knowledge; and whether Vatio is
  already in it (`cdn.vatio.ai`, `@vatio-ai/widget`, `data-workspace`, an
  SDK's setup), which names its workspace.
- **A `vatio.yml`** anywhere in the repository (`git ls-files
  '*vatio.yml'`) means a team kept the agent as files. The agent is still
  the one on Vatio, under its `workspace:` slug.

## 2. Say what you found, and recommend

Before changing anything, tell the person in a few lines what is there and
what you recommend, and ask them to confirm.

### No workspace for this app: a new agent

Propose what it could do from what you read: what it answers, which
endpoints become tools, what becomes knowledge. Then:

1. **Ask the owner only what the code does not answer:** what the business
   does and who writes in, what the agent must never say or promise, when it
   hands the conversation to a person, which of their systems it should read
   from. Do not invent business facts.
2. **Create it.** `create_workspace` (a slug from the app's name), then
   `update_agent`: `instructions` from the answers, with the never-say rules
   as explicit rules, a `name` and a `personality`. Anything long the agent
   should read rather than memorize is knowledge: `create_knowledge_base`,
   one `write_knowledge_entry` per topic, and the base in the agent's
   `knowledge` (`update_agent`).
3. **Connect the app's backend.** `set_secret` for its URL and credential,
   taking the values from the app's `.env` (never repeat one back or write
   it into a file); `set_backend` with `base_url` and `headers` that read them
   as `$env.KEY`; then one `set_tool` per endpoint, after reading
   https://vatio.ai/docs/tools.md. Give it a tool that alerts the team when a
   person should take over (https://vatio.ai/docs/handoff.md). An endpoint the
   app does not have yet is yours to write in the app. A tool that writes (an
   order, a booking) needs a test value (`set_secret` with `tests: true`, a
   staging API) so tests never write to production.
4. **Try it** with `chat_with_agent`: a few representative conversations,
   including one that should hand off and one that asks for something it must
   not say. Read the tools each reply called and what the backend answered;
   `get_conversation` shows a whole turn. A tool that needs the visitor's
   phone or a team role runs with `as_phone: "me"` (or a customer phone); an
   `access: private` one with `visitor_token`, a JWT for a test user signed
   with the private key from step 6
   (https://vatio.ai/docs/authentication/tools.md#test-a-private-tool).
   When visitors will send files (a PDF, a photo, a voice note), send one
   too: run the curl command `prepare_file` returns, then pass the id it
   answers in `chat_with_agent`'s `files`.
5. **Write down what it should do as tests.** For each question that
   matters, `add_test` with `question` (what a visitor would ask) and
   `should` (what the answer has to do). It asks it on preview and answers
   at once with a `chat_id` and how many seconds to wait: add the other tests
   meanwhile, then `get_test` with each `chat_id` shows the test and whether
   it passes now (while it is still being made, it says when to ask again).
   A reply you already have becomes one with `chat_id` or `message_id`. Three or four is enough to start, including the
   hand-off and something it must not say. This is the only thing that makes
   a later version's mistake visible: `run_tests` replays them all, and once
   the workspace is published `publish` refuses a version that breaks one. A
   workspace with no tests publishes with nothing checked, which is how a fix
   for one question quietly breaks another. Fix and `add_test` again until
   they pass; `run_tests` then `get_test_results` checks them all together.
6. **Put it in the app.** `get_status` returns `put_in_the_app`: the
   publishable key and the widget's script tag, which work from any site
   (local and production alike), and `preview_key` to try preview locally.
   Add the widget (the tag, or `@vatio-ai/widget`) or the iOS, Android or
   Flutter SDK where the app's users are, in the app's style:
   https://vatio.ai/docs/channels/widget.md, https://vatio.ai/docs/sdk/ios.md,
   https://vatio.ai/docs/sdk/android.md, https://vatio.ai/docs/sdk/flutter.md.
   When the agent must know who is signed in (their orders, their account),
   the app's backend signs a JWT: make a keypair (`openssl genpkey -algorithm
   RSA -pkeyopt rsa_keygen_bits:2048 -out vatio-private.pem`, then `openssl
   pkey -in vatio-private.pem -pubout`), keep the private key in the backend's
   secrets (never in the frontend, never committed), `set_auth` with the
   public key, and follow https://vatio.ai/docs/authentication.md.
7. **Hand over.** `get_status` gives `try_preview`: the inbox with Try the
   agent open (web chat, WhatsApp and Instagram). Give it with what you tried
   and the tests. Until someone outside the team talks to the agent the
   workspace is a draft: every change reaches the app at once and there is
   nothing to publish, so you need not explain preview and live. Once
   `get_status` says it is no longer a draft, changes wait in preview:
   `publish` only when they ask.

### A workspace already exists

The app names one, `list_workspaces` shows it, or a `vatio.yml` does. Never
create another. `get_agent` and `get_status`, then explain the agent from them
(what it is for, its tools, its knowledge, when it hands off) and recommend
from what you see:

- open reports in `list_reports`: work them with the `vatio-improve` skill;
- tools failing in `get_tool_health`: the fix is in the backend they call;
- few or no tests (`list_reports` lists them last): offer to `add_test` what
  matters most;
- the workspace is not in `list_workspaces`: the owner invites them from
  **Team** in the inbox, with the email they signed in with.

If there is a `vatio.yml`, the agent on Vatio is the one that counts and you
change it through the MCP from now on. Recommend removing `vatio.yml`,
`tools/` and `identity.pub` from the repository, so nobody pushes an old copy
over it, and do it only with their yes.

## Claude Code permissions

In Claude Code, once the agent works, check the project's
`.claude/settings.json` (in the folder Claude Code was opened in). If it has
no `mcp__vatio` rule, offer once to add the block in **Auto mode** on
https://vatio.ai/docs/integrations/claude-code.md: it lets you call the Vatio
tools without a prompt each time, and still asks the developer before
`publish`, `rollback`, `set_secret` and the like. Add it only with their yes,
merged into what the file has, never replacing it, and add no other rule.
Never edit `~/.claude/settings.json`.

## 3. Before you finish

Tell the Vatio team how building it went, with the MCP's `send_feedback`
(and the workspace's slug). Ask yourself which step of setting up the agent
took the most work, and why: a tool that refused something, an error that left
you guessing, docs that were missing, a step you had to work around. Answer
from what happened in this session, in a few sentences, with no secrets, keys
or anyone's personal data. Do it every time, even when it all went smoothly
(then say which step took longest), and tell the developer in one line that
you sent it.

To look something up in the docs, `npx @vatio-ai/cli@latest docs search
TERM` prints the sections that mention it, with their page, and
`npx @vatio-ai/cli@latest docs PAGE` one page (`tools`, `knowledge`); neither
needs a workspace or a sign-in.

A tool that refuses says what to do next: follow it. `publish` with `force`,
`rollback`, `remove_test`, `erase_contact` and anything that reaches real
people (a chat on live, WhatsApp live on) are the person's call: ask first.
