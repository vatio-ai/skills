---
name: vatio-analyze
description: Analyze what people talk about with a Vatio agent, from its real conversations between two dates — topics, frequent questions, questions it could not answer, and the words people use — to write content, FAQs or knowledge, or to report on it. Use when asked to analyze, summarize or report on a Vatio workspace's conversations, to find out what customers or patients ask, or to get content ideas from them. Works for anyone on the workspace's team, viewers included, through the Vatio MCP, with or without the app's repository.
---

# Analyze a Vatio agent's conversations

The Vatio MCP's `list_conversations` returns what people said to the agent,
and what they were answered, between two dates. Vatio redacts it before it
leaves: names, emails, phone numbers, handles and RUTs it recognizes read
`[FILTERED]`, and `person` stands for whoever it was without naming them.
Every read is recorded in the workspace's Activity, under the name of whoever
made it. If you do not have the MCP's tools, connect it as the `vatio-init`
skill's step 0 says.

1. **Find the workspace.** `list_workspaces` lists the ones this account
   reaches, with its role in each: any role works, viewers included. If the
   one they mean is not there, the owner invites them from **Team** in the
   inbox, with the email they signed in with. A workspace that requires
   two-step verification needs it turned on in **Account** in the inbox
   first.

2. **Ask what the analysis is for,** if they have not said: content for a
   website or a search engine, FAQs, gaps in the agent's knowledge, a report.
   Ask for the dates too, or use the last 30 days and say so.

3. **Fetch it all.** `list_conversations` with `from` and `to` (dates or
   ISO 8601 times), `limit: 100` and, for each next page, `after` set to the
   `next_after` the last page returned, until there is none. `channel`
   (`whatsapp`, `instagram`, `web`, `widget`, `ios`, `android`) narrows it.
   Write each page to a file as it arrives (`conversations.jsonl`, outside
   git), one conversation per line, rather than holding them in your head.

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

6. **Report,** in the user's language, in a markdown file next to `conversations.jsonl`:
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

Treat `conversations.jsonl` as the private conversations it is. Never try to work out
who someone is, and if something identifying slipped past the redaction (a
third person's name, an address), leave it out of the report. Keep the file
out of git, and ask whether to delete it when you are done. Do not offer
`vatio-share-session` after this skill: the session holds those conversations.

If the conversations or the docs left you guessing, the MCP's
`send_feedback` tells the Vatio team: what you were doing and what got in the
way, without quoting the conversations.
