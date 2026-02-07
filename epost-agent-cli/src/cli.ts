#!/usr/bin/env node

import { Command } from "@commander-js/extra-typings";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read version from package.json
const packageJsonPath = join(__dirname, "../package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

const program = new Command()
  .name("epost-kit")
  .description("Distribution CLI for epost-agent-kit framework")
  .version(packageJson.version, "-v, --version", "Display version")
  .helpOption("-h, --help", "Display help information")
  .option("--verbose", "Enable verbose logging")
  .option("--yes", "Skip interactive prompts (CI mode)");

// Command: new - Create new project
program
  .command("new")
  .description("Create new project with epost-agent-kit")
  .option("--kit <name>", "Kit template to use", "engineer")
  .option("--dir <path>", "Target directory")
  .action(async (opts) => {
    const { runNew } = await import("./commands/new.js");
    await runNew({ ...program.opts(), ...opts });
  });

// Command: init - Initialize in existing project
program
  .command("init")
  .description("Initialize epost-agent-kit in existing project")
  .option("--kit <name>", "Kit template to use (legacy mode)")
  .option("--profile <name>", "Developer profile (e.g., web-b2b, ios-b2c)")
  .option(
    "--packages <list>",
    "Comma-separated package list (e.g., core,platform-web)",
  )
  .option("--optional <list>", "Comma-separated optional packages to include")
  .option("--exclude <list>", "Comma-separated packages to exclude")
  .option("--fresh", "Fresh install (ignore existing files)", false)
  .option("--dry-run", "Preview changes without applying", false)
  .action(async (opts) => {
    const { runInit } = await import("./commands/init.js");
    await runInit({ ...program.opts(), ...opts });
  });

// Command: doctor - Verify installation
program
  .command("doctor")
  .description("Verify installation and environment health")
  .option("--fix", "Automatically fix issues", false)
  .option("--report", "Generate detailed report", false)
  .action(async (opts) => {
    const { runDoctor } = await import("./commands/doctor.js");
    await runDoctor({ ...program.opts(), ...opts });
  });

// Command: versions - List available versions
program
  .command("versions")
  .description("List available kit versions from GitHub")
  .option("--limit <number>", "Max versions to display", "10")
  .option("--pre", "Include pre-release versions", false)
  .action(async (opts) => {
    const { runVersions } = await import("./commands/versions.js");
    await runVersions({
      ...program.opts(),
      ...opts,
      limit: parseInt(opts.limit || "10"),
    });
  });

// Command: update - Update installed kit
program
  .command("update")
  .description("Update installed kit to latest version")
  .option("--check", "Only check for updates", false)
  .action(async (opts) => {
    const { runUpdate } = await import("./commands/update.js");
    await runUpdate({ ...program.opts(), ...opts });
  });

// Command: uninstall - Remove kit
program
  .command("uninstall")
  .description("Remove installed kit from project")
  .option("--keep-custom", "Keep user-modified files", false)
  .option("--force", "Force removal without confirmation", false)
  .action(async (opts) => {
    const { runUninstall } = await import("./commands/uninstall.js");
    await runUninstall({ ...program.opts(), ...opts });
  });

// ─── Profile Commands ───

const profileCmd = program
  .command("profile")
  .description("Manage developer profiles");

profileCmd
  .command("list")
  .description("List available developer profiles")
  .option("--team <name>", "Filter by team name")
  .action(async (opts) => {
    const { runProfileList } = await import("./commands/profile.js");
    await runProfileList({ ...program.opts(), ...opts });
  });

profileCmd
  .command("show <name>")
  .description("Show details of a specific profile")
  .action(async (name, opts) => {
    const { runProfileShow } = await import("./commands/profile.js");
    await runProfileShow({ ...program.opts(), ...opts, name });
  });

// ─── Package Commands ───

const packageCmd = program
  .command("package")
  .description("Manage installed packages");

packageCmd
  .command("list")
  .description("List available packages")
  .action(async (opts) => {
    const { runPackageList } = await import("./commands/package.js");
    await runPackageList({ ...program.opts(), ...opts });
  });

packageCmd
  .command("add <name>")
  .description("Add a package to existing installation")
  .action(async (name, opts) => {
    const { runPackageAdd } = await import("./commands/package.js");
    await runPackageAdd({ ...program.opts(), ...opts, name });
  });

packageCmd
  .command("remove <name>")
  .description("Remove a package from installation")
  .option("--force", "Skip confirmation", false)
  .action(async (name, opts) => {
    const { runPackageRemove } = await import("./commands/package.js");
    await runPackageRemove({ ...program.opts(), ...opts, name });
  });

// ─── Onboard Command ───

program
  .command("onboard")
  .description("Guided first-time setup wizard for new developers")
  .action(async (opts) => {
    const { runOnboard } = await import("./commands/onboard.js");
    await runOnboard({ ...program.opts(), ...opts });
  });

// ─── Workspace Commands ───

const workspaceCmd = program
  .command("workspace")
  .description("Multi-repo workspace management");

workspaceCmd
  .command("init")
  .description("Generate workspace-level CLAUDE.md")
  .option("--dir <path>", "Workspace root directory")
  .action(async (opts) => {
    const { runWorkspaceInit } = await import("./commands/workspace.js");
    await runWorkspaceInit({ ...program.opts(), ...opts });
  });

// ─── Dev Watcher Command ───

program
  .command("dev")
  .description("Watch packages/ and live-sync to target .claude/ directory")
  .option("--target <dir>", "Target project directory")
  .option("--profile <name>", "Only watch packages for this profile")
  .option("--force", "Overwrite user-modified files", false)
  .action(async (opts) => {
    const { runDev } = await import("./commands/dev.js");
    await runDev({ ...program.opts(), ...opts });
  });

// Error handling
process.on("unhandledRejection", (error) => {
  console.error("Error:", error instanceof Error ? error.message : error);
  process.exit(1);
});

program.parse(process.argv);
