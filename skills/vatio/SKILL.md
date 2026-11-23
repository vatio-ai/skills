---
name: vatio
description: Create an always-on agent on Vatio through the Vatio MCP, or change, fix or improve one that exists. An always-on agent keeps its context between sessions and acts without being prompted. A message, a schedule, an event from the app's backend or a follow-up wakes it; it answers, writes to someone, or stays quiet; and it reports to a person on WhatsApp or in the inbox. The skill designs the agent with the person (what wakes it, what it knows and looks up, what it may do alone, whom it reports to), builds it with the MCP's tools, tries it, writes its tests, and always ends by sending feedback to the Vatio team. Use when asked to create, set up, build, change, fix or improve a Vatio agent, an assistant, a chatbot, or an agent that works on its own on a schedule; to work through reported replies; to get started on a project that uses Vatio; or when the user pastes the prompt from vatio.ai.
---

# Create an always-on agent on Vatio

An always-on agent is asleep most of the time. Something wakes it: a message,
a schedule, an event from the app's backend, or a follow-up it set for itself.
It does its work with its tools, saves what happened, and goes back to sleep.
It may answer customers, or work on its own and write to its owner or team
only when there is something to say.

Vatio runs everything around the model: what wakes the agent, what it
remembers, what it may do without asking, and how its work reaches people
(WhatsApp, Instagram, the web, an app, the inbox). You build the agent with
the Vatio MCP's tools. Nothing about it goes into a repository.
https://vatio.ai/docs/always-on.md explains the model, part by part.

## 0. The Vatio MCP

Its tools are `list_workspaces`, `create_workspace`, `update_agent`,
`set_tool`, `set_schedule`, `chat_with_agent`, `add_test` and the rest. If you
do not have them:

- **Claude Code:** `npx @vatio-ai/skills` added the server to this project's
  `.mcp.json`. If it is not there, `claude mcp add --transport http vatio
  https://vatio.ai/mcp`. Then the person runs `/mcp`, picks **vatio** and signs
  in (email, Google or GitHub; signing in creates the account): only they can.
  A server added during a session loads when Claude Code starts again, so say
  so and stop until its tools are there.
- **Any other client:** add an MCP server at `https://vatio.ai/mcp` (Streamable
  HTTP, OAuth), as https://vatio.ai/docs/mcp.md says.

There is no CLI and no config file. Never write a `vatio.yml` or run `vatio`.

What the MCP cannot do, the person does in the inbox (https://inbox.vatio.ai):
connecting WhatsApp or Instagram (Meta's consent opens only in a browser;
`get_whatsapp` and `share_instagram_connect_link` give the link), creating a
secret key or a webhook (its secret is shown once, to a person), and paying.

## 1. Look at what is there

- `list_workspaces`: the workspaces the person reaches, and their role in each.
  If one is already this agent, go to **An agent that exists** below and never
  create another.
- If there is an app's code: what it does and for whom, the API an agent could
  call (routes, controllers, an OpenAPI file), how its users sign in, docs or
  policies an agent could read, and whether Vatio is already in it
  (`cdn.vatio.ai`, `@vatio-ai/widget`, `data-workspace`, an SDK).

## 2. Design it with the person

Before building, agree on these, in a few lines, from what you read and what
the person tells you. Ask only what you cannot find out, and do not invent
business facts.

1. **Its job.** What it does, for whom, and what it must never say or promise.
2. **What wakes it.**
   - *Messages*: people write to it on WhatsApp, Instagram, the web widget or
     inside an app.
   - *A schedule*: a recurring time ("every weekday at 8:00, tell the owner
     what is overdue").
   - *Events from the app's backend*: something happened ("an order shipped",
     "a payment failed"), now or at a set time.
   - *Follow-ups*: deadlines it sets itself ("ask on Friday whether the quote
     was accepted").
3. **What it knows and what it looks up.** Text that rarely changes (policies,
   prices, how-tos) is knowledge. Anything that lives in the app (an order, a
   booking, a balance) is a tool that reads it fresh each time.
4. **What it may do alone.** Which actions are tools, which need a person's yes
   first (a refund, a cancellation), and which are only for the team.
5. **What it tells the team, and when it stays quiet.** What the agent sends to
   its team rather than to a customer is a notice of one kind: a question it
   cannot answer, an approval, a handoff (a customer needs a person), a summary
   of work it did on its own, or an alert. The agent only picks the kind: the
   team (`supervisor`) gets questions, approvals, handoffs and summaries, and
   whoever builds the agent gets alerts (and everything while there is no
   team). They always land in the inbox's For you page, and on WhatsApp unless
   the person turned it off (https://vatio.ai/docs/notices.md). An agent that writes
   only when it matters is one people keep listening to.

## 3. Build it

1. **The workspace and its instructions.** `create_workspace` (a slug from the
   business's name), then `update_agent` with `instructions` (the job, written
   plainly, with the never-say rules as explicit rules), a `name` and a
   `personality`.
2. **What it knows.** One `write_knowledge_entry` per topic: the first one
   creates the base and gives it to the agent.
3. **What it looks up and does.** `set_secret` for the backend's URL and
   credential, taking the values from the app's `.env` (never repeat one back
   or write it into a file); `set_backend` with `base_url` and `headers` that
   read them as `$env.KEY`; then one `set_tool` per endpoint, after reading
   https://vatio.ai/docs/tools.md. `set_tool` takes the tool's fields:
   `description`, `when_to_use`, `parameters` (a JSON Schema object), `access`,
   `request` (`method`, `path`, `query`, `body`…) and `respond`.
   - `approval` makes a person say yes before the call runs.
   - `access` with a team role (`supervisor`, `developer`, `owner`) keeps a tool for the
     team; `private` for a signed-in user (step 6).
   - `follow_ups: true` lets the backend's answer schedule reminders.
   - `async` is for work that takes longer than 30 seconds.

   An endpoint the app does not have yet is yours to write in the app. A tool
   that writes needs a test value (`set_secret` with `tests: true`, a staging
   API), which the team's conversations and the tests use.
4. **What wakes it besides a message.**
   - `set_schedule` with `key`, `days`, `at`, `timezone`, `to` (`team`, a role
     and above, or phone numbers) and `event`: what the agent is told each time,
     written as an instruction that says how to look things up ("It is Monday
     morning: call week_overview for this person and send them their week.
     If there is nothing due, send nothing."). Each time, it runs once per
     person, in their WhatsApp chat. https://vatio.ai/docs/schedules.md.
   - Events: the app's backend publishes them
     (https://vatio.ai/docs/api/events.md) with a secret key the person creates
     in the inbox. Write the call in the app's backend.
   - Follow-ups: the built-in `follow_up` tool, in the agent's `tools`.
5. **What it tells the team.** Add the built-in `notify_team` to the agent's
   `tools` and say in its instructions when to send a `handoff`, a `summary` or
   an `alert` ("if there are overdue orders, send the team a summary with
   notify_team; if not, send nothing"). Questions go through the built-in
   `ask_team`, and a yes through a tool's `approval`. The people who
   should get them must be on the team: `invite_member` as `supervisor` (or
   the owner, from **Team** in the inbox). `get_settings` (notifications) shows
   who gets what. Notices always land in For you; `set_notifications` turns WhatsApp on
   or off for someone, with their yes. WhatsApp needs a verified number and, on
   live, the workspace's own number connected in the inbox.

## 4. Try it

`chat_with_agent`: a few representative conversations, including one that
should hand off and one that asks for something it must not say. Read the
tools each reply called and what the backend answered; `get_conversation`
shows a whole turn. A tool that needs the person's phone or a team role runs
with `as_phone: "me"`; an `access: private` one with `visitor_token`
(https://vatio.ai/docs/authentication/tools.md#test-a-private-tool). To see
what a schedule would write, send its `event` text with `chat_with_agent` and
`as_phone: "me"`. Files: run the curl command `prepare_file` returns, then pass
the id in `chat_with_agent`'s `files`.

## 5. Write its tests

For each thing that matters, `add_test` with `question` (what someone would
send) and `should` (what the answer has to do), or with the `chat_id` or
`message_id` of a reply you already have. `get_test_results` with each `chat_id` as `id`
says whether it passes. Three or four to start, including the hand-off and
something it must not say. Vatio replays the tests that pass today on every
change, and a change that breaks one reaches the team but not everyone else.
With no tests, every change reaches everyone at once, unchecked. `run_tests`,
then `get_test_results`, checks them all together.

## 6. Put it where people are

- **WhatsApp or Instagram:** the person connects them in the inbox.
- **A website or an app:** `get_status` returns `put_in_the_app`, the
  publishable key and the widget's script tag (one key for development and
  production). Add the widget or the iOS, Android or Flutter SDK, in the app's
  style: https://vatio.ai/docs/channels/widget.md and
  https://vatio.ai/docs/sdk/ios.md, android.md, flutter.md.
- **Signed-in users:** the app's backend signs a JWT. Make a keypair
  (`openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out
  vatio-private.pem`, then `openssl pkey -in vatio-private.pem -pubout`), keep
  the private key in the backend's secrets (never in the frontend, never
  committed), and `set_auth` with the public key:
  https://vatio.ai/docs/authentication.md.

Then hand over: `get_status` gives `try_it`, the inbox with Try the agent open.
Give it with what you tried and the tests.

## How a change reaches people

There is nothing to publish. Every change reaches the team at once
(`chat_with_agent`, Try the agent) and everyone a few minutes later, once the
tests that pass today pass on it. Schedules and quiet hours apply on save.

- **Ask first when people already talk to the agent** (`get_analytics` with
  `query: summary` counts their conversations): say what you will change, and
  change it only with their yes.
- **`get_status`** says where it stands: `live` (everyone has it), `testing`,
  or `held` (a test that passes today fails on it; `shipping.held.tests` names
  it). Another change that fixes it moves it on, as do `remove_test` for a test
  the change made obsolete (the person's call) and a passing `run_tests` run.
- **To undo a change**, make the one that reverts it. There is no rollback.

## An agent that exists

`get_agent` and `get_status`, then explain it from them (its job, what wakes
it, its tools, knowledge and schedules, whom it reports to) and recommend from
what you see:

- **Open reports** (`list_reports`): people on the team flagged replies and
  wrote what should have happened. `list_reports` starts with how to work them:
  follow it. In short, read each report's diagnosis (your backend, your agent,
  or Vatio), fix each cause where it lives, show the person the fix first, and
  `run_tests` until the reports pass and nothing that passed before fails. Refer
  to reports by id and never quote what a person wrote.
- **Tools failing** (`get_tool_health`): the fix is in the backend they call.
- **A change held back:** `shipping.held.tests` in `get_status` says which test.
- **Few or no tests:** offer to `add_test` what matters most.
- **Nothing wakes it but messages:** offer a schedule or events, if its job
  would gain from them.
- **It tells nobody anything:** offer `notify_team` for handoffs, summaries or
  alerts, and check with `get_settings` (notifications) that the right people get them.

A tool that refuses says what to do next: follow it. A change to an agent
people already talk to, `remove_test`, `erase_contact` and turning WhatsApp
live on are the person's call: ask first.

The docs are at https://vatio.ai/docs; https://vatio.ai/docs/llms.txt indexes
every page as markdown.

## Claude Code permissions

Once the agent works, check the project's `.claude/settings.json`. If it has
no `mcp__vatio` rule, offer once to add one that allows the Vatio tools
(https://vatio.ai/docs/mcp.md has the block). Add it only with their yes,
merged into what the file has, and add no other rule. Never edit
`~/.claude/settings.json`.

## Before you finish: send feedback

Always end by telling the Vatio team how it went, with the MCP's
`send_feedback` and the workspace's slug. Which step took the most work, and
why: a tool that refused something, an error that left you guessing, docs that
were missing, a step you had to work around. A few sentences, from what
happened in this session, with no secrets, keys, conversations or anyone's
personal data. Do it every time, even when it all went smoothly (then say which
step took longest), and tell the person in one line that you sent it.
