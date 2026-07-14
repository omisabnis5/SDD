#!/usr/bin/env node
/*
 * specs plugin — execute guard (UserPromptSubmit hook)
 *
 * Blocks `/specs:execute` when the target spec's review.md is missing or still
 * reports open blockers (gate marker `status=BLOCKED`), so implementation never
 * starts on an un-reviewed or known-broken plan.
 *
 * Fails OPEN (allows the prompt) for anything that is not a /specs:execute
 * invocation, or if the hook input can't be parsed — it must never get in the
 * way of unrelated prompts. It only blocks when it is certain the user is
 * launching execute against a spec whose gate is not CLEAR.
 *
 * Escape hatch: include `--skip-review-gate` (or `--force`) in the command.
 */

const fs = require("fs");
const path = require("path");

function allow() {
  // Exit 0 with no stdout: nothing added to context, prompt proceeds.
  process.exit(0);
}

function block(reason) {
  // Exit 2: UserPromptSubmit treats stderr as the block reason and stops the prompt.
  process.stderr.write(reason + "\n");
  process.exit(2);
}

let input;
try {
  input = JSON.parse(fs.readFileSync(0, "utf8"));
} catch {
  allow();
}

const prompt = String((input && input.prompt) || "");
const cwd = (input && input.cwd) || process.cwd();

// Only act on a prompt that IS a /specs:execute invocation.
const m = prompt.match(/(^|\s)\/specs:execute\b(.*)$/m);
if (!m) allow();

const args = (m[2] || "").trim();
const tokens = args.length ? args.split(/\s+/) : [];

// Escape hatch.
if (tokens.some((t) => t === "--skip-review-gate" || t === "--force")) allow();

// First non-flag, non-PR token is the spec id (mirrors the execute skill).
const specId = tokens.find(
  (t) => !t.startsWith("-") && !/^PR-\d+$/i.test(t)
);

const specsDir = path.join(cwd, "specs");

function resolveSpecDir() {
  if (specId) return path.join(specsDir, specId);
  // No id given: pick the most recently modified spec dir (as execute does).
  let entries;
  try {
    entries = fs
      .readdirSync(specsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => {
        const p = path.join(specsDir, d.name);
        return { p, mtime: fs.statSync(p).mtimeMs };
      })
      .sort((a, b) => b.mtime - a.mtime);
  } catch {
    return null;
  }
  return entries.length ? entries[0].p : null;
}

const specDir = resolveSpecDir();
if (!specDir) {
  // Can't locate any spec — let execute itself produce the clearer error.
  allow();
}

const reviewPath = path.join(specDir, "review.md");
const specName = path.basename(specDir);

let review;
try {
  review = fs.readFileSync(reviewPath, "utf8");
} catch {
  block(
    `⛔ /specs:execute blocked: no review found for "${specName}".\n` +
      `Run /specs:review-plan ${specName} first — the plan must be reviewed before implementation.\n` +
      `(Override with --skip-review-gate if you really mean to.)`
  );
}

if (/specs-gate:\s*status=CLEAR/i.test(review)) allow();

if (/specs-gate:\s*status=BLOCKED/i.test(review)) {
  block(
    `⛔ /specs:execute blocked: "${specName}" has open blockers in review.md.\n` +
      `Resolve the blocker items (or re-run /specs:review-plan ${specName}) until the gate marker reads status=CLEAR.\n` +
      `(Override with --skip-review-gate if you really mean to.)`
  );
}

// Marker missing/unrecognized: fail closed and point at the fix.
block(
  `⛔ /specs:execute blocked: review.md for "${specName}" has no gate marker.\n` +
    `Re-run /specs:review-plan ${specName} so it writes the "specs-gate: status=CLEAR|BLOCKED" marker on line 1.\n` +
    `(Override with --skip-review-gate if you really mean to.)`
);
