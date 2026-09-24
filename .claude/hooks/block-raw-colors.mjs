// PreToolUse hook (Write|Edit|MultiEdit): blocks raw colours outside the two token files.
// Constitution §4 — app/globals.css and lib/tokens.ts are the only places a colour value lives.
// Exit 2 blocks the write and sends stderr back to the agent; exit 0 lets it through.
import { readFileSync } from "node:fs";
import path from "node:path";

const input = JSON.parse(readFileSync(0, "utf8").replace(/^﻿/, "") || "{}");
const ti = input.tool_input ?? {};
const file = ti.file_path;
if (!file) process.exit(0);

const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const rel = path.relative(root, file).split(path.sep).join("/");

const ALLOWED = new Set(["app/globals.css", "lib/tokens.ts"]);
const CHECKED_DIRS = ["app/", "components/", "content/", "lib/"];
const CHECKED_EXT = /\.(tsx?|jsx?|css|mdx)$/;

if (ALLOWED.has(rel)) process.exit(0);
if (!CHECKED_DIRS.some((d) => rel.startsWith(d)) || !CHECKED_EXT.test(rel)) process.exit(0);

const text =
  ti.content ??
  ti.new_string ??
  (Array.isArray(ti.edits) ? ti.edits.map((e) => e.new_string ?? "").join("\n") : "");

const PALETTE =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";
const PREFIX =
  "bg|text|border|ring|fill|stroke|from|via|to|outline|decoration|divide|placeholder|caret|accent|shadow";

const rules = [
  [/#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?(?:[0-9a-fA-F]{2})?(?![0-9a-zA-Z_-])/g, "raw hex colour"],
  [/\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(/g, "raw colour function"],
  [new RegExp(`\\b(?:${PREFIX})-(?:${PALETTE})-\\d{2,3}\\b`, "g"), "Tailwind palette class"],
  [new RegExp(`\\b(?:${PREFIX})-(?:white|black)\\b`, "g"), "Tailwind white/black class"],
];

const hits = [];
for (const [re, label] of rules) {
  for (const m of text.matchAll(re)) hits.push(`${label}: "${m[0]}"`);
}

if (hits.length === 0) process.exit(0);

console.error(
  `Blocked: ${rel} contains ${[...new Set(hits)].slice(0, 8).join(", ")}.\n` +
    `Constitution §4: every colour comes from a token in app/globals.css (e.g. bg-bg, text-muted, bg-accent). ` +
    `If no token fits, stop and ask the lead — a new token needs the user's yes (design-tokens add). ` +
    `If this is a false positive (e.g. an anchor like "#abc"), report it to the lead; never work around this hook.`
);
process.exit(2);
