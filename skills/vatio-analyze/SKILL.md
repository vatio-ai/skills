---
name: vatio-analyze
description: Analyze what people talk about with a Vatio agent, from its real conversations between two dates — topics, frequent questions, questions it could not answer, and the words people use — to write content, FAQs or knowledge, or to report on it. Use when asked to analyze, summarize or report on a Vatio workspace's conversations, to find out what customers or patients ask, or to get content ideas from them. Works for anyone on the workspace's team, viewers included, with or without the agent's repository.
---

# Analyze a Vatio agent's conversations

`vatio chat export` prints what people said to the agent, and what they were
answered, between two dates: one conversation per line as JSON. Vatio redacts
it before it leaves: names, emails, phone numbers, handles and RUTs it
recognizes read `[FILTERED]`, and `person` stands for whoever it was without
naming them. Every export is recorded in the workspace's Activity, under the
name of whoever ran it.

1. **Find the workspace.** The CLI reads it from the nearest `vatio.yml`. With
   none here, ask for the workspace's slug (the part after
   `inbox.vatio.ai/` in their inbox) and write a one-line one in a new folder
   outside any repository:

   ```bash
   mkdir vatio-conversations && cd vatio-conversations
   echo "workspace: SLUG" > vatio.yml
   ```

2. **Ask what the analysis is for,** if they have not said: content for a
   website or a search engine, FAQs, gaps in the agent's knowledge, a report.
   Ask for the dates too, or use the last 30 days and say so.

3. **Export.** Use `npx @vatio-ai/cli@latest` if `vatio` is not installed:

   ```bash
   vatio chat export --from 2026-09-01 --to 2026-09-30 --out conversations.jsonl
   ```

   `--channel whatsapp` (or `instagram`, `web`, `widget`, `ios`, `android`)
   narrows it, and `vatio chat help` explains the rest. If it asks to sign in,
   run `vatio login`: they sign in in the browser with the email they were
   invited with. `workspace_forbidden` means another email, or nobody has
   invited them yet: the owner does it from **Team** in the inbox, and any
   role works. `two_factor_required` means turning on two-step verification
   in **Account** in the inbox first.

4. **Count before reading.** In a script (`jq`, Python or Node), get the number
   of conversations and messages, conversations per channel and per week, and
   how many reached someone on the team (`"from": "team"`). Then read only what
   people wrote (`"from": "person"`) with enough of the agent's reply to know
   whether it helped.

5. **Read it all, in batches.** Read a sample first and draft a short list of
   topics in the user's terms, then go through every conversation and assign
   each one a topic and whether the agent answered it, could not
   ("no tengo esa información", passing it to a person, asking them to call),
   or answered wrongly. With hundreds of conversations, split them into
   batches, in parallel if you can run subagents, and keep the tally in a
   file, not in your head.

6. **Report,** in the user's language, in a markdown file next to the export:
   - the dates, channels and number of conversations it covers;
   - the topics, largest first, each with its count and share and two or
     three short questions as people wrote them, spelling and all: they are
     the words content has to match;
   - what the agent could not answer or got wrong, by topic: the content
     that is missing;
   - for content, the pieces to write, each tied to the topic and the
     numbers that justify it.

   Say what the numbers cannot tell: a sample, a short window, a channel left
   out.

Treat the export as the private conversations it is. Never try to work out
who someone is, and if something identifying slipped past the redaction (a
third person's name, an address), leave it out of the report. Keep the export
out of git, and ask whether to delete it when you are done. Do not offer
`vatio-share-session` after this skill: the session holds those conversations.

If the export or its docs left you guessing,
`vatio feedback "what you were doing and what was missing"` tells the Vatio
team.
