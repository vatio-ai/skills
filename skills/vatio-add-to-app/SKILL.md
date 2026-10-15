---
name: vatio-add-to-app
description: Puts a Vatio agent where the app's users talk to it — the web widget in a web app, the Swift package in an iOS app, the Kotlin library in an Android app, the Dart package in a Flutter app — with a publishable token per environment, the signed-in user passed along, and, on mobile, a chat screen in the app's own style. Use after vatio-init, or when asked to add the agent, the chat, the widget or the Vatio SDK to a website, a web app, an iPhone/iOS app, an Android app or a Flutter app.
---

# Put the agent in the app

The agent already exists: a `vatio.yml` in this repository, pushed at least
once. If there is none, use the `vatio-init` skill first.

Vatio keeps the procedure on the platform, so it is never out of date here.
Read it first:

```bash
npx @vatio-ai/cli docs
```

Under **For coding agents**, follow **Putting the agent in the app**. It takes
precedence over the summary below, and the pages it links (Web widget, iOS
SDK, Android SDK, Flutter SDK, Authentication, Supabase) have the details.

## In short

1. **Find where it goes.** Web, iOS, Android, Flutter, or several, and every origin a
   build will call from: local and production web addresses,
   `ios-app://BUNDLE_ID`, `android-app://APPLICATION_ID` (debug ids count).
   A Flutter app needs both app origins. React Native and Expo have no Vatio SDK yet: say so, and
   `vatio feedback` that one was asked for.
2. **Tell the user what you will add before changing anything**: which
   screens or layout, which tokens, how signed-in users are passed, and ask
   them to confirm.
3. **Tokens.** `vatio tokens create --env preview` for development builds and
   `--env live` for release builds, each with its origins (`--json` when the
   token goes straight into a config or secrets store). `vatpub_` tokens
   ship in the app's configuration; a `vat_` token never does.
4. **Add it.** Web: the widget, once for the whole app. iOS, Android and Flutter: the
   SDK has no UI, so write the chat screen in the app's own style from the
   example in [vatio-ai/ios](https://github.com/vatio-ai/ios)
   (`Example/VatioExample/Views.swift`),
   [vatio-ai/android](https://github.com/vatio-ai/android)
   (`example/src/main/kotlin/ai/vatio/example/Views.kt`) or
   [vatio-ai/flutter](https://github.com/vatio-ai/flutter) (`example/lib/views.dart`).
5. **Signed-in users.** With `auth: supabase:` the web widget needs nothing
   and the SDKs take the session's access token; with `auth: public_key:` the
   app's backend signs the visitor token, and the private key never goes into
   the app.
6. **Try it in a development build**, signed out and signed in, then say what
   you added and where each token lives. Release builds answer once the agent
   is published: `vatio publish` only when they ask.

## Before you finish

If an error or the docs left you guessing, say so:
`vatio feedback "what you were doing and what was missing"`. Then, in Claude
Code, offer to send this session to the Vatio team, as the
`vatio-share-session` skill says; if `vatio share-session --should-ask` prints
`no`, say nothing.

`vatio` is `npx @vatio-ai/cli` when it is not installed globally.

A command you hand the developer to run themselves, because a permission
check refused it or it needs their own credentials, says
`npx @vatio-ai/cli@latest`, never `vatio`: the `vatio` installed on their
machine can be too old for Vatio to accept. When one command's output feeds
another (a token into a secrets store), take it with `--json` and chain with
`&&`, never through `grep`, so a failure stops there instead of passing on an
empty value. If Claude Code's auto mode refused a `vatio` command and the
project's `.claude/settings.json` has no `Bash(vatio *)` rule, also mention
**Auto mode** on the docs' Claude Code page.
