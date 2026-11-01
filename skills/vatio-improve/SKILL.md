---
name: vatio-improve
description: Improve a Vatio agent from what its supervisors reported, through the Vatio MCP. Use when asked to improve, fix or debug a Vatio agent, to work through reported or flagged replies or wrong answers in production, or when the daily Vatio email says there are open reports. Needs the Vatio MCP, not a vatio.yml.
---

# Improve a Vatio agent from its reports

Supervisors report wrong replies in the Vatio inbox and write what it should
have said: a different answer, an action, or a tool the agent should have
used or does not have. One session takes every open report. You work through
the Vatio MCP's tools; if you do not have them (`list_reports`,
`update_agent`, `run_tests`…), connect it as the `vatio-init` skill's step 0
says, and stop until they are there.

Vatio keeps the instructions for working the reports on the platform, so they
are never out of date here. Start by reading them: `list_workspaces` for the
slug (or the one the app names), then `list_reports`. It returns every open
report (the conversation, each tool call with what the backend answered, and
the supervisor's note), then the tests that fail on the newest version and
the ones the agent answers differently each time, with how to work them at
the top, and every test last. Follow those instructions; they take
precedence over anything below.

In short:

1. Read each report's **Diagnosis** first: it says whose it is to fix, from
   what that turn did. **Your backend**: a tool call to it failed. **Your
   agent**: everything answered and the reply was still wrong, so the fix is
   in the agent's instructions, its knowledge or a tool's definition.
   **Vatio**: the model provider or Vatio failed and Vatio wrote the reply
   itself. Do not change the agent for those: tell the developer, who can
   remove the report, and if they keep happening,
   `npx @vatio-ai/cli@latest feedback "…"`.
   `remove_test` removes a report and its test for everyone. It is the
   developer's call: propose it (a report Vatio caused, one that asks for
   something the agent must not do, one whose fix is in but the tests cannot
   reproduce) and run it only when they say so. A note someone on the team
   left on one of their own conversations has no test: fix it from its
   conversation and try it again with `chat_with_agent`; the next change
   closes it.
2. Group the reports by cause, and fix each cause where it lives:
   `update_agent` (instructions, tools, knowledge, links),
   `write_knowledge_entry`, `set_tool`, or the app's backend a tool calls
   (that code is in the app's repository). `get_tool_health` shows each tool's
   error rate, timeouts and latency, and the calls that failed with what the
   backend answered: a failing tool rarely gets reported, because the agent
   apologizes and moves on. Fix those too. After the reports come the tests
   that fail on the newest version and the ones the agent answers differently
   each time: work those too, as their sections say. Never remove a test
   because it fails. Something the developer asks the agent to do that no
   report covers is a test first: `add_test` with `question` and `should`
   asks it in a new conversation, and `get_test` with the `chat_id` it
   answers with says whether it passes now; then fix until it does.
3. Reports come from people who talk to the agent, so show the developer
   each fix first and change the agent (`update_agent`,
   `write_knowledge_entry`, `set_tool`) once they agree. There is nothing to
   publish: each change reaches the team at once (`chat_with_agent` talks to
   it) and everyone a few minutes later, once the tests that pass today pass
   on it. `get_agent` reads the agent whole before you change it.
4. `run_tests` replays every report and test against the newest version on
   Vatio's servers and returns the run ids; `get_test_results` with each id
   shows the report so far. It takes a few minutes: ask again until it has
   finished. A case that did not pass names the conversation of its replay
   (`get_conversation`). Iterate (fix, `run_tests`) until the reports pass
   and nothing that passed before fails. A case marked "not tested (Vatio's
   side)" says nothing about your fix: run the tests again. One not tested
   because a tool needs a signed-in visitor replays signed in with
   `run_tests` and a `visitor_token`
   (https://vatio.ai/docs/authentication/tools.md#test-a-private-tool).
   Name reports by id (`F-7K2QX`).
5. `get_status` says whether the fix reached everyone, in `shipping.state`:
   `live` when everyone has it, `testing` while Vatio replays the tests that
   pass today on it (`testing.expected_by` says until about when), and `held`
   when one of them fails on it in every attempt. Held, the team keeps it,
   everyone else keeps the version before, and whoever made the change gets
   an email; `shipping.held.tests` names each test, with the `chat_id` of its
   replay. Another change that fixes it moves it on, as does `remove_test`
   for a test the change made obsolete (the developer's call) or a
   `run_tests` run that passes; there is no way to force it. Once the fix
   reaches everyone, the reports it passes are marked resolved in the inbox.
   Tell the developer what passes now and where the change stands.
   `rollback` undoes the last change for everyone, the team included: only
   when they ask.
6. Last, tell the Vatio team how it went, with the MCP's `send_feedback`
   (and the workspace's slug): which step of fixing the reports took the most
   work, and why (a report that left you guessing, a test that would not
   reproduce, a tool or an error that got in the way). A few sentences, with no
   secrets or visitors' words, and tell the developer in one line that you
   sent it.

The reports hold real visitors' conversations. Keep them out of commits,
issues and logs: refer to a report by its id and describe the cause, never
quote what the visitor or the backend said.

When a fix needs more than the reports say,
`npx @vatio-ai/cli@latest docs search TERM` prints the sections of the docs
that mention it, with their page, and `npx @vatio-ai/cli@latest docs PAGE`
one page (`tools`, `knowledge`); neither needs a workspace or a sign-in.
https://vatio.ai/docs/llms.txt indexes every page as markdown.
