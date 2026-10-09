#!/usr/bin/env node
// npx @vatio-ai/skills -- copies the Vatio skills into the project the command
// runs in, for every coding agent at once:
//   .agents/skills/   Codex, Cursor, Gemini CLI, GitHub Copilot, OpenCode, Cline, Amp
//   .claude/skills/   Claude Code, which does not read .agents/
// Running it again overwrites the copies with this version's.
import { cpSync, existsSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const usage = `usage: npx @vatio-ai/skills [--dir PATH]

Copies the Vatio skills (vatio-init, vatio-improve, vatio-share-session) into
PATH/.agents/skills and PATH/.claude/skills. PATH defaults to the current
directory.`;

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
// Skills this package used to ship under another name. Left in place, the old
// copy would answer the same requests as the new one.
const RENAMED = { "vatio-new": "vatio-init" };
const skills = readdirSync(source, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

for (const target of [".agents/skills", ".claude/skills"]) {
  for (const skill of skills) {
    const dest = join(root, target, skill);
    cpSync(join(source, skill), dest, { recursive: true, force: true });
    console.log(`  ${relative(process.cwd(), join(dest, "SKILL.md")) || dest}`);
  }
  for (const [old, current] of Object.entries(RENAMED)) {
    const dest = join(root, target, old);
    if (!installedByUs(dest, old)) continue;
    rmSync(dest, { recursive: true, force: true });
    console.log(`  removed ${relative(process.cwd(), dest) || dest} (now ${current})`);
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
