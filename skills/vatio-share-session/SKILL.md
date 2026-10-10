---
name: vatio-share-session
allowed-tools: AskUserQuestion
description: Send this coding session to the Vatio team, so they can see where building or improving a Vatio agent got stuck. Use when the user asks to share, send or report this session (or "the conversation", "what we did") to Vatio, when the Vatio team asked them for it, when Vatio itself got in the way and they want the team to see exactly how, or when vatio-init or vatio-improve finish and say to offer it.
---

# Send this session to the Vatio team

`vatio share-session` sends the Claude Code session you are running in: what
the user asked, what you read and ran, and what came back. It leaves out
images, replaces anything that looks like a key, token or password with
`[REDACTED]`, and the home directory with `~`. Only the Vatio team reads it,
to see where Vatio got in the way and fix it.

It is sent in one of two ways: the user asked for it, or you offer it because
`vatio-init` or `vatio-improve` just finished.

1. **Only when you are offering it**, ask the CLI first:

   ```bash
   npx @vatio-ai/cli@latest share-session --should-ask
   ```

   If it prints `no`, stop here and do not mention it: the developer said not
   to ask again, or was asked recently. If it prints `yes`, go on.

2. Show the user what would go, without sending anything:

   ```bash
   npx @vatio-ai/cli@latest share-session --save /tmp/vatio-session.jsonl
   ```

   Tell them which session it is (the summary it prints), that it is the
   whole conversation, and that the file is there if they want to read it.

3. Ask whether to send it, once. It is their conversation: never send it on
   your own, even when the task seems to call for it.

   When you are offering it, ask with the **AskUserQuestion** tool, Claude
   Code's own question, not in a message. One question, in the user's
   language, header `Vatio`, for example: "Do you want to send this session
   to the Vatio team, so they can see where Vatio got in the way and improve
   it?", with these options:

   - **Send it** — "The whole conversation, as shown above."
   - **Send it with a comment** — "You say what got in the way, what you
     expected, or anything else for the team."
   - **Not now** — "It won't be offered again for a week."
   - **Don't ask again** — "It won't be offered again."

   **Send it with a comment**: ask for the comment in one plain message, then
   send. A comment they type in the question's own text field instead (its
   "Other" answer, or a note on an option) is their feedback too, unless it
   says no. **Not now**: do nothing more. **Don't ask again**: run
   `npx @vatio-ai/cli@latest share-session --never`. A no is a fine answer:
   do not insist.

   When the user asked for it themselves, just confirm in a message and
   take any feedback they give.

4. If they say to send it, send it. With their feedback, in their words, as
   they gave it:

   ```bash
   npx @vatio-ai/cli@latest share-session --yes "their feedback"
   ```

   Without it, just the session:

   ```bash
   npx @vatio-ai/cli@latest share-session --yes
   ```

   Never write feedback for them: a summary of the session in your words adds
   nothing the session does not already say.

   The first time it may ask to sign in: it opens the browser (if it doesn't,
   give them the link it prints). Tell them it was sent and the number it
   printed.

Only Claude Code sessions can be sent. In any other coding agent, do not offer
it; when the user asks, write what happened instead:
`npx @vatio-ai/cli@latest feedback "…"`.
