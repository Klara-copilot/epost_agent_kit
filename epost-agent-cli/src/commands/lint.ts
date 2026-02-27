/**
 * Command: epost-kit lint
 * Validate references across installed agent/skill/command markdown files.
 * Reports broken skill refs in agent frontmatter, broken agent refs in commands, etc.
 */

import { join, resolve } from "node:path";
import pc from "picocolors";
import { dirExists, fileExists } from "../core/file-system.js";
import { loadAllManifests } from "../core/package-resolver.js";
import {
  buildRefRegistry,
  validateReferences,
  type RefError,
} from "../core/ref-validator.js";
import { logger } from "../core/logger.js";

interface LintOptions {
  verbose?: boolean;
  yes?: boolean;
  json?: boolean;
  dir?: string;
}

async function findPackagesDir(cwd: string): Promise<string | null> {
  const paths = [
    join(cwd, "packages"),
    join(cwd, "..", "packages"),
  ];
  for (const p of paths) {
    const resolved = resolve(p);
    if (
      (await dirExists(resolved)) &&
      (await fileExists(join(resolved, "core", "package.yaml")))
    ) {
      return resolved;
    }
  }
  return null;
}

export async function runLint(opts: LintOptions): Promise<void> {
  const cwd = opts.dir ? resolve(opts.dir) : process.cwd();
  const claudeDir = join(cwd, ".claude");

  if (!(await dirExists(claudeDir))) {
    logger.error("No .claude/ directory found. Run epost-kit init first.");
    process.exit(1);
  }

  const packagesDir = await findPackagesDir(cwd);
  if (!packagesDir) {
    logger.error(
      "Cannot find packages/ directory. Run from the kit repo directory.",
    );
    process.exit(1);
  }

  // Build registry from package manifests
  const manifests = await loadAllManifests(packagesDir);
  const registry = buildRefRegistry(manifests);

  logger.debug(
    `Registry: ${registry.agents.size} agents, ${registry.skills.size} skills, ${registry.commands.size} commands`,
  );

  // Validate
  const errors = await validateReferences(claudeDir, registry);

  if (opts.json) {
    console.log(JSON.stringify({ errors, count: errors.length }, null, 2));
    process.exit(errors.length > 0 ? 1 : 0);
  }

  if (errors.length === 0) {
    logger.success("No broken references found.");
    return;
  }

  // Group errors by file
  const byFile = new Map<string, RefError[]>();
  for (const err of errors) {
    const existing = byFile.get(err.file) ?? [];
    existing.push(err);
    byFile.set(err.file, existing);
  }

  console.log(
    `\n${pc.yellow("⚠")} Found ${pc.bold(String(errors.length))} broken reference(s) in ${byFile.size} file(s):\n`,
  );

  for (const [file, fileErrors] of byFile) {
    console.log(`  ${pc.dim(file)}`);
    for (const err of fileErrors) {
      const loc = err.location === "frontmatter" ? pc.cyan("fm") : pc.dim("body");
      const suggestion = err.suggestion
        ? pc.green(` → ${err.suggestion}`)
        : "";
      console.log(
        `    ${pc.yellow("⚠")} L${err.line} [${loc}] ${err.type}: ${pc.red(err.ref)}${suggestion}`,
      );
    }
    console.log();
  }

  // Summary
  const fmCount = errors.filter((e) => e.location === "frontmatter").length;
  const bodyCount = errors.filter((e) => e.location === "body").length;
  console.log(
    pc.dim(`  ${fmCount} frontmatter, ${bodyCount} body references`),
  );
  console.log(
    pc.dim("  Run with --json for machine-readable output\n"),
  );

  process.exit(1);
}
