// PreToolUse hook (Bash|PowerShell|Artifact|ArtifactData|mcp__claude_ai_Claude_Docs__delete):
// blocks every command that deletes files, folders, git history or published things.
// Only the user deletes. Exit 2 blocks the call and sends stderr back to the agent.
import { readFileSync } from "node:fs";

const input = JSON.parse(readFileSync(0, "utf8").replace(/^\uFEFF/, "") || "{}");
const tool = input.tool_name ?? "";
const ti = input.tool_input ?? {};

const block = (what) => {
  console.error(
    `Blocked: ${what}.\n` +
      `Only the user deletes things in this project. Don't retry, and never work around this hook ` +
      `(no other tool, script, rename-to-hide or emptying the file). Tell the lead exactly what ` +
      `should be deleted and why, so the user can do it.`
  );
  process.exit(2);
};

// Tools with a delete action.
if (tool === "mcp__claude_ai_Claude_Docs__delete") block("deleting a Claude Doc");
if ((tool === "Artifact" || tool === "ArtifactData") && ti.action === "delete") {
  block(`${tool} delete`);
}
if (tool !== "Bash" && tool !== "PowerShell") process.exit(0);

const cmd = String(ti.command ?? "");
// A command word: at the start, or after a separator, pipe, subshell, xargs/sudo etc.
const S = String.raw`(?:^|[\s;&|(\x60{]|\$\()`;
const E = String.raw`(?=\s|$|[;&|)\x60}])`;

const rules = [
  // Shell and cmd.exe
  [new RegExp(`${S}(?:rm|rmdir|unlink|shred|srm|trash|rimraf|del|erase|rd)${E}`, "i"), "a delete command (rm / rmdir / del / rd / …)"],
  [/\bfind\b[^;&|]*\s-delete\b/i, "find -delete"],
  [/\bfind\b[^;&|]*-exec(?:dir)?\s+(?:rm|unlink|shred)\b/i, "find -exec rm"],
  [/\b(?:npx|pnpm\s+dlx|bunx)\s+(?:rimraf|del-cli|trash-cli)\b/i, "a delete package"],
  // PowerShell
  [/\bRemove-Item\w*\b/i, "Remove-Item"],
  [new RegExp(`${S}ri${E}`, "i"), "ri (Remove-Item)"],
  [/\bClear-Content\b/i, "Clear-Content"],
  [/\bClear-RecycleBin\b/i, "Clear-RecycleBin"],
  [/\[(?:System\.)?IO\.(?:File|Directory|FileInfo|DirectoryInfo)\]::Delete\b/i, ".NET file delete"],
  [/\.Delete\(\s*(?:\$true|true)?\s*\)/i, ".Delete()"],
  // Scripts run inline
  [/\bfs(?:\.promises)?\.(?:rm|rmSync|rmdir|rmdirSync|unlink|unlinkSync)\b/, "Node fs delete"],
  [/\b(?:rmSync|unlinkSync|rmdirSync)\s*\(/, "Node fs delete"],
  [/\b(?:os\.(?:remove|unlink|rmdir|removedirs)|shutil\.rmtree|Path\([^)]*\)\.unlink)\b/, "Python delete"],
  // Git
  [/\bgit\s+(?:-\S+\s+)*rm\b/i, "git rm"],
  [/\bgit\s+(?:-\S+\s+)*clean\b/i, "git clean"],
  [/\bgit\s+(?:-\S+\s+)*branch\b[^;&|]*\s(?:-d|-D|--delete)\b/, "git branch delete"],
  [/\bgit\s+(?:-\S+\s+)*tag\b[^;&|]*\s(?:-d|--delete)\b/, "git tag delete"],
  [/\bgit\s+(?:-\S+\s+)*push\b[^;&|]*(?:\s--delete\b|\s-d\b|\s:\S)/, "git push delete"],
  [/\bgit\s+(?:-\S+\s+)*stash\s+(?:drop|clear)\b/i, "git stash drop/clear"],
  [/\bgit\s+(?:-\S+\s+)*worktree\s+(?:remove|prune)\b/i, "git worktree remove"],
  [/\bgit\s+(?:-\S+\s+)*reset\b[^;&|]*\s--hard\b/i, "git reset --hard (throws away uncommitted work)"],
  [/\bgit\s+(?:-\S+\s+)*checkout\b[^;&|]*\s--\s/i, "git checkout -- (throws away uncommitted work)"],
  [/\bgit\s+(?:-\S+\s+)*restore\b(?![^;&|]*--staged(?![^;&|]*--worktree))/i, "git restore (throws away uncommitted work)"],
  [/\bgit\s+(?:-\S+\s+)*update-ref\s+-d\b/i, "git update-ref -d"],
  [/\bgit\s+(?:-\S+\s+)*reflog\s+(?:delete|expire)\b/i, "git reflog delete"],
  [/\bgit\s+(?:-\S+\s+)*gc\b[^;&|]*--prune/i, "git gc --prune"],
  // GitHub, Vercel, npm caches
  [/\bgh\s+(?:repo|release|gist|secret|variable|label|run|cache)\s+delete\b/i, "gh delete"],
  [/\b(?:vercel|vc)\s+(?:rm|remove|domains\s+rm|dns\s+rm|env\s+rm|project\s+rm)\b/i, "vercel remove"],
  [/\bnpm\s+cache\s+clean\b/i, "npm cache clean"],
];

const hit = rules.find(([re]) => re.test(cmd));
if (hit) block(`${hit[1]} in: ${cmd.length > 160 ? cmd.slice(0, 160) + "…" : cmd}`);
process.exit(0);
