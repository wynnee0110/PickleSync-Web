#!/usr/bin/env node
import { execSync } from "child_process";
import { resolve, relative } from "path";

const cwd = resolve(import.meta.dirname, "..");

let results;
try {
  const output = execSync("npx eslint . --format json", {
    cwd,
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "pipe"],
  });
  results = JSON.parse(output);
} catch (err) {
  // ESLint exits non-zero when there are errors, but still prints JSON to stdout
  if (err.stdout) {
    try {
      results = JSON.parse(err.stdout);
    } catch {
      console.error("Failed to parse ESLint output.");
      process.exit(1);
    }
  } else {
    console.error(err.message);
    process.exit(1);
  }
}

const total = results.length;
const failed = results.filter((r) => r.errorCount > 0);
const warned = results.filter((r) => r.errorCount === 0 && r.warningCount > 0);
const passed = total - failed.length;

const totalErrors = results.reduce((s, r) => s + r.errorCount, 0);
const totalWarnings = results.reduce((s, r) => s + r.warningCount, 0);

console.log("");
console.log("──────────────────────────────────────");
console.log("  🥒 PickleSync Lint Test Results");
console.log("──────────────────────────────────────");
console.log("");

// Print failures
if (failed.length > 0) {
  console.log("  ❌ FAILED FILES:");
  for (const file of failed) {
    const rel = relative(cwd, file.filePath);
    console.log(`     • ${rel} (${file.errorCount} error${file.errorCount > 1 ? "s" : ""})`);
    for (const msg of file.messages.filter((m) => m.severity === 2)) {
      console.log(`       L${msg.line}:${msg.column}  ${msg.message}  (${msg.ruleId})`);
    }
  }
  console.log("");
}

// Print warnings
if (warned.length > 0) {
  console.log("  ⚠️  WARNINGS:");
  for (const file of warned) {
    const rel = relative(cwd, file.filePath);
    console.log(`     • ${rel} (${file.warningCount} warning${file.warningCount > 1 ? "s" : ""})`);
    for (const msg of file.messages.filter((m) => m.severity === 1)) {
      console.log(`       L${msg.line}:${msg.column}  ${msg.message}  (${msg.ruleId})`);
    }
  }
  console.log("");
}

// Summary
console.log("──────────────────────────────────────");
if (failed.length === 0) {
  console.log(`  ✅ PASSED: ${passed}/${total} files clean`);
} else {
  console.log(`  ❌ FAILED: ${passed}/${total} files clean`);
}
if (totalErrors > 0) console.log(`     Errors:   ${totalErrors}`);
if (totalWarnings > 0) console.log(`     Warnings: ${totalWarnings}`);
console.log("──────────────────────────────────────");
console.log("");

process.exit(failed.length > 0 ? 1 : 0);
