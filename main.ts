// fix-human-sleep — a make.fun program/v1 entry.
//
// The program writes exactly one funny patch note announcing that human
// sleep is fixed to /output/entry.txt: a single line, under 160 characters,
// in the terse voice of a real changelog.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "Fixed: the brain no longer keeps all 47 tabs open at 3 a.m. Tabs now close automatically at bedtime; dreams may still buffer.";

// Competition gate (see competition.yaml): /output/entry.txt must be UTF-8
// text of 1 to 160 characters, not only white space, a single line with no
// trailing newline. Refuse to write a line that would fail the gate.
function validateGate(line: string): void {
  if (line.length < 1 || line.length > 160) {
    throw new Error(
      `gate violation: entry must be 1-160 characters, got ${line.length}`,
    );
  }
  if (line.trim().length === 0) {
    throw new Error("gate violation: entry must not be only white space");
  }
  if (line !== line.trim()) {
    throw new Error(
      "gate violation: entry must not start or end with white space",
    );
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("gate violation: entry must be a single line");
  }
}

validateGate(LINE);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), LINE, "utf8");
// Read back what was written and re-check the gate on the file itself, so
// a bad write fails loudly instead of entering an invalid line.
const back = readFileSync(join(outDir, "entry.txt"), "utf8");
validateGate(back);
if (back !== LINE) {
  throw new Error("gate violation: entry.txt does not match the entry line");
}
console.log(`wrote ${LINE.length} characters to ${join(outDir, "entry.txt")}`);
