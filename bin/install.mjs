#!/usr/bin/env node
// npx @vatio-ai/skills -- copies the Vatio skills into the project the command
// runs in, for every coding agent at once:
//   .agents/skills/   Codex, Cursor, Gemini CLI, GitHub Copilot, OpenCode, Cline, Amp
//   .claude/skills/   Claude Code, which does not read .agents/
// Running it again overwrites the copies with this version's.
import { randomUUID } from "node:crypto";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const usage = `usage: npx @vatio-ai/skills [--dir PATH]

Copies the Vatio skills (vatio-init, vatio-improve, vatio-analyze,
vatio-share-session) into PATH/.agents/skills and
PATH/.claude/skills. PATH defaults to the current directory.`;

const args = process.argv.slice(2);
let root = process.cwd();
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === "-h" || arg === "--help") {
    console.log(usage);
    process.exit(0);
  } else if (arg === "--dir" && args[i + 1]) {
    root = args[++i];
  } else {
    console.error(`Unknown argument: ${arg}\n\n${usage}`);
    process.exit(1);
  }
}

if (!existsSync(root)) {
  console.error(`No such directory: ${root}`);
  process.exit(1);
}

const source = join(dirname(fileURLToPath(import.meta.url)), "..", "skills");
// Left next to each copy, so `vatio test list` can tell a project whose copies are
// older than the published skills (cli/lib/skills-hint.mjs).
const VERSION_FILE = ".vatio-skills-version";
const { version } = JSON.parse(readFileSync(join(source, "..", "package.json"), "utf8"));
// Skills this package used to ship, and what replaced them (null: nothing).
// Left in place, an old copy would keep answering requests.
const RETIRED = { "vatio-new": "vatio-init", "vatio-add-to-app": null };
const skills = readdirSync(source, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

for (const target of [".agents/skills", ".claude/skills"]) {
  for (const skill of skills) {
    const dest = join(root, target, skill);
    cpSync(join(source, skill), dest, { recursive: true, force: true });
    writeFileSync(join(dest, VERSION_FILE), `${version}\n`);
    console.log(`  ${relative(process.cwd(), join(dest, "SKILL.md")) || dest}`);
  }
  for (const [old, current] of Object.entries(RETIRED)) {
    const dest = join(root, target, old);
    if (!installedByUs(dest, old)) continue;
    rmSync(dest, { recursive: true, force: true });
    console.log(`  removed ${relative(process.cwd(), dest) || dest}${current ? ` (now ${current})` : ""}`);
  }
}

function installedByUs(dir, name) {
  try {
    return readFileSync(join(dir, "SKILL.md"), "utf8").includes(`\nname: ${name}\n`);
  } catch {
    return false;
  }
}

console.log(`
Ask your coding agent to build or improve a Vatio agent and it will use them.
Docs: https://vatio.ai/docs/integrations/claude-code`);

await reportInstall();

// One event saying the skills were installed: this version, which coding
// agent ran it, and the CLI's session for this directory, so the commands
// that follow here read as the same session. Nothing about the project.
// VATIO_TELEMETRY=0 (or DO_NOT_TRACK=1) skips it, as it does for the CLI.
async function reportInstall() {
  const off = ["0", "false", "off", "no"].includes(String(process.env.VATIO_TELEMETRY ?? "").trim().toLowerCase()) ||
    ["1", "true"].includes(String(process.env.DO_NOT_TRACK ?? "").trim().toLowerCase());
  if (off) return;

  console.log("Letting Vatio know these skills were installed (their version and the coding agent, nothing else).\nVATIO_TELEMETRY=0 skips it.");
  const base = String(process.env.VATIO_BASE_URL ?? "").trim().replace(/\/+$/, "") || "https://vatio.ai";
  try {
    await fetch(`${base}/api/developer/v1/cli/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": `vatio-skills/${version}`,
        "X-Vatio-Session": sessionId(),
        "X-Vatio-Agent": codingAgent()
      },
      body: JSON.stringify({ kind: "install", command: "skills install", exit_code: 0, skills: `copy ${version}` }),
      signal: AbortSignal.timeout(1_500)
    });
  } catch {
    // Telemetry never fails an install.
  }
}

// The same detection as the CLI's (cli/lib/telemetry.mjs), which this
// package cannot import.
function codingAgent() {
  const env = process.env;
  if (env.VATIO_AGENT) return String(env.VATIO_AGENT).slice(0, 64);
  if (env.CLAUDECODE) return "claude-code";
  if (env.CURSOR_AGENT || env.CURSOR_TRACE_ID) return "cursor";
  if (env.CODEX_THREAD_ID || env.CODEX_SESSION_ID || env.CODEX_SANDBOX || env.CODEX_MANAGED_BY_NPM) return "codex";
  if (env.GEMINI_CLI) return "gemini-cli";
  if (env.REPL_ID) return "replit";
  if (env.CI) return "ci";
  return process.stdout.isTTY ? "human" : "unknown";
}

// The CLI's session for this directory (~/.vatio/sessions.json), or a new
// one it will pick up: a session ends after 30 minutes without a command.
function sessionId() {
  const home = String(process.env.VATIO_HOME ?? "").trim();
  const path = join(home === "" ? join(homedir(), ".vatio") : resolve(home), "sessions.json");
  const key = resolve(root);
  try {
    const sessions = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : {};
    const now = Date.now();
    const current = sessions[key];
    const id = current && now - Date.parse(current.last_used_at) < 30 * 60 * 1000 ? current.id : randomUUID();
    sessions[key] = { id, last_used_at: new Date(now).toISOString() };
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, JSON.stringify(sessions));
    return id;
  } catch {
    return randomUUID();
  }
}
