// PreToolUse hook (Write|Edit|MultiEdit): blocks money amounts in files that end up on the site.
// Constitution §7 — the site shows no prices, rates or earnings.
// Checks only the text being written. Exit 2 blocks the write and sends stderr back to the agent.
import { readFileSync } from "node:fs";
import path from "node:path";

const input = JSON.parse(readFileSync(0, "utf8").replace(/^﻿/, "") || "{}");
const ti = input.tool_input ?? {};
const file = ti.file_path;
if (!file) process.exit(0);

const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const rel = path.relative(root, file).split(path.sep).join("/");

const CHECKED_DIRS = ["app/", "components/", "content/", "public/"];
const CHECKED_EXT = /\.(tsx?|jsx?|mdx?|json|txt|xml)$/;
if (!CHECKED_DIRS.some((d) => rel.startsWith(d)) || !CHECKED_EXT.test(rel)) process.exit(0);

const text =
  ti.content ??
  ti.new_string ??
  (Array.isArray(ti.edits) ? ti.edits.map((e) => e.new_string ?? "").join("\n") : "");

const rules = [
  [/[$€£¥₹]\s?\d/g, "currency amount"],
  [/\b(?:USD|EUR|GBP|PKR|INR|Rs\.?)\s?\d/g, "currency amount"],
  [/\d[\d,.]*\s?(?:USD|EUR|GBP|PKR|INR|dollars?|rupees?)\b/gi, "currency amount"],
  [/\/\s?(?:hr|hour|month|mo)\b/gi, "rate"],
];

const hits = [];
for (const [re, label] of rules) {
  for (const m of text.matchAll(re)) hits.push(`${label}: "${m[0]}"`);
}

if (hits.length === 0) process.exit(0);

console.error(
  `Blocked: ${rel} contains ${[...new Set(hits)].slice(0, 8).join(", ")}.\n` +
    `Constitution §7: the site shows no money figures, prices or rates. ` +
    `If the user wrote this line, don't change it; report the hit to the lead so the user can decide. ` +
    `If it's a false positive, report it to the lead; never work around this hook.`
);
process.exit(2);
