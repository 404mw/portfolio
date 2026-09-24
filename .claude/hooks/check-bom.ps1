# Guards against UTF-8 BOM corruption in .claude skill/agent definitions.
# A leading BOM (EF BB BF) before the opening `---` breaks YAML frontmatter
# parsing, which silently drops the agent/skill or mangles its description.
#
# Default: scan and warn (used by the SessionStart hook).
# -Fix:    strip the BOM in place from any offending file.
param([switch]$Fix)

$ErrorActionPreference = 'Stop'
$root = if ($env:CLAUDE_PROJECT_DIR) { $env:CLAUDE_PROJECT_DIR } else { (Get-Location).Path }
$claudeDir = Join-Path $root '.claude'
if (-not (Test-Path $claudeDir)) { exit 0 }

# Agent defs (*.md) + skill defs (SKILL.md), project scope only.
$targets = @()
$agentsDir = Join-Path $claudeDir 'agents'
$skillsDir = Join-Path $claudeDir 'skills'
if (Test-Path $agentsDir) { $targets += Get-ChildItem $agentsDir -Filter *.md -File }
if (Test-Path $skillsDir) { $targets += Get-ChildItem $skillsDir -Recurse -Filter SKILL.md -File }

$bom = [byte[]](0xEF, 0xBB, 0xBF)
$offenders = @()
foreach ($f in $targets) {
    $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
    if ($bytes.Length -ge 3 -and $bytes[0] -eq $bom[0] -and $bytes[1] -eq $bom[1] -and $bytes[2] -eq $bom[2]) {
        $offenders += $f
    }
}

if ($offenders.Count -eq 0) { exit 0 }

if ($Fix) {
    foreach ($f in $offenders) {
        $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
        [System.IO.File]::WriteAllBytes($f.FullName, $bytes[3..($bytes.Length - 1)])
        Write-Output "fixed (stripped BOM): $($f.FullName)"
    }
    exit 0
}

# Warn-only (hook mode). stdout becomes SessionStart context so it surfaces.
Write-Output "[BOM GUARD] UTF-8 BOM found in $($offenders.Count) .claude definition file(s) -- these may fail to load (agent/skill silently dropped or description shows as '---'):"
foreach ($f in $offenders) {
    $rel = $f.FullName.Substring($root.Length).TrimStart('\', '/')
    Write-Output "  - $rel"
}
Write-Output "[BOM GUARD] Fix with: powershell -NoProfile -File .claude/hooks/check-bom.ps1 -Fix"
exit 0
