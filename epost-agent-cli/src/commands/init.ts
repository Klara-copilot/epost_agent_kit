/**
 * Command: epost-kit init
 * Initialize epost-agent-kit in existing project
 * Supports both legacy kit-based and new package-based installation
 */

import { join, resolve, basename } from "node:path";
import { readFile, readdir, copyFile, mkdir, rm } from "node:fs/promises";
import { select, confirm, checkbox } from "@inquirer/prompts";
import ora from "ora";
import { logger } from "../core/logger.js";
import { fileExists, dirExists, safeCopyDir } from "../core/file-system.js";
import {
  readMetadata,
  writeMetadata,
  generateMetadata,
} from "../core/ownership.js";
import { downloadKit, getKitFiles } from "../core/template-manager.js";
import {
  classifyFiles,
  planMerge,
  executeMerge,
  previewMerge,
} from "../core/smart-merge.js";
import { createBackup } from "../core/backup-manager.js";
import { hashFile } from "../core/checksum.js";
import {
  resolvePackages,
  loadAllManifests,
  loadProfiles,
} from "../core/package-resolver.js";
import { mergeAndWriteSettings } from "../core/settings-merger.js";
import {
  generateClaudeMd,
  collectSnippets,
  type ClaudeMdContext,
} from "../core/claude-md-generator.js";
import { detectProjectProfile, listProfiles } from "../core/profile-loader.js";
import { tmpdir } from "node:os";
import type { InitOptions } from "../types/command-options.js";
import type { FileOwnership } from "../types/index.js";

/**
 * Determine if we should use package-based installation
 */
function usePackageMode(opts: InitOptions): boolean {
  return !!(opts.profile || opts.packages);
}

/**
 * Find the kit repo's packages directory (search up from CLI location)
 */
async function findKitPackagesDir(): Promise<string | null> {
  // When installed globally or via npx, look for packages/ relative to CLI
  const possiblePaths = [
    join(process.cwd(), "packages"),
    join(process.cwd(), "..", "packages"),
    // When running from epost-agent-cli/
    join(process.cwd(), "..", "packages"),
  ];

  for (const p of possiblePaths) {
    const resolved = resolve(p);
    if (await dirExists(resolved)) {
      // Verify it's actually our packages dir by checking for core/package.yaml
      if (await fileExists(join(resolved, "core", "package.yaml"))) {
        return resolved;
      }
    }
  }

  return null;
}

/**
 * Find the profiles.yaml file
 */
async function findProfilesPath(projectDir: string): Promise<string | null> {
  const possiblePaths = [
    join(projectDir, "profiles", "profiles.yaml"),
    join(projectDir, "..", "profiles", "profiles.yaml"),
  ];

  for (const p of possiblePaths) {
    const resolved = resolve(p);
    if (await fileExists(resolved)) {
      return resolved;
    }
  }

  return null;
}

/**
 * Find the templates directory
 */
async function findTemplatesDir(projectDir: string): Promise<string | null> {
  const possiblePaths = [
    join(projectDir, "templates"),
    join(projectDir, "..", "templates"),
  ];

  for (const p of possiblePaths) {
    const resolved = resolve(p);
    if (await dirExists(resolved)) {
      return resolved;
    }
  }

  return null;
}

// ─── Package-Based Installation ───

async function runPackageInit(opts: InitOptions): Promise<void> {
  const projectDir = resolve(process.cwd());
  const projectName = basename(projectDir);

  // Step 1: Find packages directory
  const packagesDir = await findKitPackagesDir();
  if (!packagesDir) {
    throw new Error(
      "Cannot find packages/ directory. Run from the kit repo, or use --kit for legacy installation.",
    );
  }
  logger.debug(`Using packages from: ${packagesDir}`);

  // Step 2: Find profiles
  const profilesPath = await findProfilesPath(projectDir);
  if (!profilesPath) {
    throw new Error("Cannot find profiles/profiles.yaml");
  }

  // Step 3: Check for existing installation
  const metadata = await readMetadata(projectDir);
  const isUpdate = !!metadata && !opts.fresh;

  // Step 4: Parse comma-separated options
  const packagesList = opts.packages
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const optionalList = opts.optional
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const excludeList = opts.exclude
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Step 5: Resolve profile (auto-detect if not specified)
  let profileName = opts.profile;

  if (!profileName && !packagesList) {
    // Try auto-detect
    const profiles = await loadProfiles(profilesPath);
    const detected = await detectProjectProfile(projectDir, profiles);

    if (detected && !opts.yes) {
      const useDetected = await confirm({
        message: `Detected project type: ${detected.displayName} (${detected.confidence} confidence). Use this profile?`,
        default: true,
      });

      if (useDetected) {
        profileName = detected.profile;
      }
    } else if (detected && opts.yes) {
      profileName = detected.profile;
      logger.info(`Auto-detected profile: ${detected.displayName}`);
    }

    // If still no profile, let user choose
    if (!profileName && !packagesList && !opts.yes) {
      const allProfiles = listProfiles(profiles);
      profileName = await select({
        message: "Select a profile:",
        choices: allProfiles.map((p) => ({
          name: `${p.displayName} (${p.packages.length} packages)`,
          value: p.name,
        })),
      });
    }
  }

  // Step 6: Resolve packages
  const spinner = ora("Resolving packages...").start();
  const resolved = await resolvePackages({
    packagesDir,
    profilesPath,
    profile: profileName,
    packages: packagesList,
    includeOptional: optionalList,
    exclude: excludeList,
  });
  spinner.succeed(
    `Resolved ${resolved.packages.length} packages: ${resolved.packages.join(", ")}`,
  );

  // Step 7: Show recommendations
  if (resolved.recommended.length > 0 && !opts.yes) {
    logger.info(`\nRecommended packages: ${resolved.recommended.join(", ")}`);
    const addRecommended = await confirm({
      message: "Include recommended packages?",
      default: false,
    });
    if (addRecommended) {
      // Re-resolve with recommendations
      const reResolved = await resolvePackages({
        packagesDir,
        profilesPath,
        profile: profileName,
        packages: [...resolved.packages, ...resolved.recommended],
        includeOptional: optionalList,
        exclude: excludeList,
      });
      resolved.packages.length = 0;
      resolved.packages.push(...reResolved.packages);
    }
  }

  // Step 8: Show optional packages
  if (resolved.optional.length > 0 && !opts.yes) {
    const selectedOptional = await checkbox({
      message: "Select optional packages to include:",
      choices: resolved.optional.map((name) => ({
        name,
        value: name,
      })),
    });

    if (selectedOptional.length > 0) {
      const reResolved = await resolvePackages({
        packagesDir,
        profilesPath,
        profile: profileName,
        packages: [...resolved.packages, ...selectedOptional],
        exclude: excludeList,
      });
      resolved.packages.length = 0;
      resolved.packages.push(...reResolved.packages);
    }
  }

  // Step 9: Select IDE target
  let target: "claude" | "cursor" | "github-copilot" =
    metadata?.target || "claude";
  if (!metadata && !opts.yes) {
    target = await select({
      message: "Select IDE target:",
      choices: [
        { name: "Claude Code", value: "claude" as const },
        { name: "Cursor", value: "cursor" as const },
        { name: "GitHub Copilot", value: "github-copilot" as const },
      ],
      default: "claude" as const,
    });
  }

  // Determine install directory based on target
  const installDirName =
    target === "claude"
      ? ".claude"
      : target === "cursor"
        ? ".cursor"
        : ".github";
  const installDir = join(projectDir, installDirName);

  // Step 10: Load manifests for install
  const manifests = await loadAllManifests(packagesDir);

  // Step 11: Dry-run preview
  if (opts.dryRun) {
    logger.info("\nDry-run mode — no changes will be made\n");
    logger.info(`Profile: ${profileName || "(explicit packages)"}`);
    logger.info(`Target: ${target} (${installDirName}/)`);
    logger.info(`Packages (${resolved.packages.length}):`);
    for (const pkg of resolved.packages) {
      const manifest = manifests.get(pkg);
      if (manifest) {
        const agents = manifest.provides.agents.length;
        const skills = manifest.provides.skills.length;
        const commands = manifest.provides.commands.length;
        logger.info(
          `  Layer ${manifest.layer}: ${pkg} — ${agents}A ${skills}S ${commands}C`,
        );
      } else {
        logger.info(`  ${pkg} (manifest not found)`);
      }
    }
    return;
  }

  // Step 12: Confirm
  if (!opts.yes) {
    logger.info(
      `\nWill install ${resolved.packages.length} packages into ${installDirName}/`,
    );
    const proceed = await confirm({ message: "Proceed?", default: true });
    if (!proceed) {
      logger.info("Cancelled");
      return;
    }
  }

  // Step 13: Create backup if updating
  if (isUpdate) {
    const backupSpinner = ora("Creating backup...").start();
    await createBackup(projectDir, "pre-update");
    backupSpinner.succeed("Backup created");
  }

  // Step 14: Install packages
  const installSpinner = ora("Installing packages...").start();
  await mkdir(installDir, { recursive: true });

  const allFiles: Record<string, FileOwnership> = {};
  let totalAgents = 0,
    totalSkills = 0,
    totalCommands = 0;
  const settingsPackages: Array<{
    name: string;
    dir: string;
    strategy: "base" | "merge" | "skip";
  }> = [];
  const snippetPackages: Array<{
    name: string;
    dir: string;
    layer: number;
    snippetFile?: string;
  }> = [];

  for (const pkgName of resolved.packages) {
    const manifest = manifests.get(pkgName);
    if (!manifest) {
      logger.warn(`Package "${pkgName}" manifest not found, skipping`);
      continue;
    }

    const pkgDir = join(packagesDir, pkgName);

    // Copy files according to manifest's files mapping
    for (const [srcSubDir, destSubDir] of Object.entries(manifest.files)) {
      const srcPath = join(pkgDir, srcSubDir);
      const destPath = join(installDir, destSubDir);

      // Handle single file mapping (e.g., "settings.json: settings.json")
      if (!srcSubDir.endsWith("/")) {
        if (await fileExists(srcPath)) {
          // Settings files handled separately
          if (srcSubDir === "settings.json") continue;
          await mkdir(join(destPath, ".."), { recursive: true });
          await copyFile(srcPath, destPath);

          // Track file
          const relativePath = join(installDirName, destSubDir);
          const checksum = await hashFile(destPath);
          allFiles[relativePath] = {
            path: relativePath,
            checksum,
            installedAt: new Date().toISOString(),
            version: manifest.version,
            modified: false,
            package: pkgName,
          };
        }
        continue;
      }

      // Directory copy
      if (await dirExists(srcPath)) {
        await safeCopyDir(srcPath, destPath);

        // Track all files in copied directory
        const copiedFiles = await scanDirFiles(destPath);
        for (const file of copiedFiles) {
          const relativePath = join(installDirName, destSubDir, file);
          const fullPath = join(destPath, file);
          const checksum = await hashFile(fullPath);
          allFiles[relativePath] = {
            path: relativePath,
            checksum,
            installedAt: new Date().toISOString(),
            version: manifest.version,
            modified: false,
            package: pkgName,
          };
        }
      }
    }

    // Track settings for merge
    settingsPackages.push({
      name: pkgName,
      dir: pkgDir,
      strategy: manifest.settings_strategy,
    });

    // Track snippets
    if (manifest.claude_snippet) {
      snippetPackages.push({
        name: pkgName,
        dir: pkgDir,
        layer: manifest.layer,
        snippetFile: manifest.claude_snippet,
      });
    }

    // Count provides
    totalAgents += manifest.provides.agents.length;
    totalSkills += manifest.provides.skills.length;
    totalCommands += manifest.provides.commands.length;
  }

  installSpinner.succeed(`Installed ${resolved.packages.length} packages`);

  // Step 15: Merge settings
  const settingsSpinner = ora("Merging settings...").start();
  const settingsOutput = join(installDir, "settings.json");
  const { sources: settingsSources } = await mergeAndWriteSettings(
    settingsPackages,
    settingsOutput,
  );
  settingsSpinner.succeed(
    `Settings merged from ${settingsSources.length} packages`,
  );

  // Step 16: Generate CLAUDE.md
  const claudeSpinner = ora("Generating CLAUDE.md...").start();
  const snippets = await collectSnippets(snippetPackages);
  const templatesDir = await findTemplatesDir(projectDir);
  const templatePath = templatesDir
    ? join(templatesDir, "repo-claude.md.hbs")
    : "";

  const platforms = new Set<string>();
  for (const pkgName of resolved.packages) {
    const manifest = manifests.get(pkgName);
    if (manifest) {
      for (const p of manifest.platforms) platforms.add(p);
    }
  }

  const claudeContext: ClaudeMdContext = {
    profile: profileName,
    packages: resolved.packages,
    target,
    kitVersion: "1.0.0",
    cliVersion: "0.1.0",
    installedAt: new Date().toISOString().split("T")[0],
    projectName,
    platforms: [...platforms],
    agentCount: totalAgents,
    skillCount: totalSkills,
    commandCount: totalCommands,
  };

  const claudeMdPath = join(projectDir, "CLAUDE.md");
  await generateClaudeMd(templatePath, claudeContext, snippets, claudeMdPath);
  claudeSpinner.succeed("CLAUDE.md generated");

  // Step 17: Update metadata
  const metaSpinner = ora("Updating metadata...").start();
  const newMetadata = generateMetadata("0.1.0", target, "1.0.0", allFiles, {
    profile: profileName,
    installedPackages: resolved.packages,
  });
  await writeMetadata(projectDir, newMetadata);
  metaSpinner.succeed("Metadata updated");

  // Step 18: Success summary
  logger.info("\n✓ Installation complete!");
  logger.info(`\nSummary:`);
  if (profileName) {
    logger.info(`  Profile: ${profileName}`);
  }
  logger.info(`  Packages: ${resolved.packages.length}`);
  logger.info(`  Agents: ${totalAgents}`);
  logger.info(`  Skills: ${totalSkills}`);
  logger.info(`  Commands: ${totalCommands}`);
  logger.info(`  Settings sources: ${settingsSources.join(", ") || "none"}`);
  logger.info(`  CLAUDE.md snippets: ${snippets.length}`);
}

// ─── Utility: scan directory for relative file paths ───

async function scanDirFiles(dir: string, prefix = ""): Promise<string[]> {
  const files: string[] = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const relativePath = prefix ? join(prefix, entry.name) : entry.name;
      if (entry.isDirectory()) {
        files.push(
          ...(await scanDirFiles(join(dir, entry.name), relativePath)),
        );
      } else {
        files.push(relativePath);
      }
    }
  } catch {
    // Directory doesn't exist
  }
  return files;
}

// ─── Legacy Kit-Based Installation ───

async function runKitInit(opts: InitOptions): Promise<void> {
  const projectDir = resolve(process.cwd());

  // Step 1: Validate project directory
  const hasPackageJson = await fileExists(join(projectDir, "package.json"));
  const hasGit = await dirExists(join(projectDir, ".git"));

  if (!hasPackageJson && !hasGit) {
    throw new Error("No project detected (missing package.json or .git)");
  }

  // Step 2: Check for existing installation
  let metadata = await readMetadata(projectDir);

  // Step 3: Check for ClaudeKit migration
  const claudekitMetadata = join(projectDir, ".claude", "metadata.json");
  if (!metadata && (await fileExists(claudekitMetadata))) {
    logger.info("ClaudeKit installation detected");

    try {
      const content = await readFile(claudekitMetadata, "utf-8");
      const ckMeta = JSON.parse(content);

      if (ckMeta.name === "claudekit-engineer") {
        logger.info("ClaudeKit Engineer kit detected - migration available");

        let migrationTarget: "claude" | "cursor" | "github-copilot" = "claude";
        if (!opts.yes) {
          migrationTarget = await select({
            message: "Select epost-agent-kit target for migration:",
            choices: [
              { name: "Claude Code", value: "claude" as const },
              {
                name: "Cursor (not yet supported)",
                value: "cursor" as const,
                disabled: true,
              },
              {
                name: "GitHub Copilot (not yet supported)",
                value: "github-copilot" as const,
                disabled: true,
              },
            ],
            default: "claude" as const,
          });
        }

        logger.info(`Migration target: ${migrationTarget}`);
        metadata = null;
      }
    } catch (error) {
      logger.debug(`Failed to read ClaudeKit metadata: ${error}`);
    }
  }

  // Step 4: Determine installation mode
  const isUpdate = !!metadata;
  const isFresh = opts.fresh || !metadata;

  if (isUpdate && !isFresh) {
    logger.info("Updating existing installation");
  } else {
    logger.info("Fresh installation");
  }

  // Step 5: Select target
  let target: "claude" | "cursor" | "github-copilot" =
    metadata?.target || "claude";
  if (!metadata && !opts.yes) {
    target = await select({
      message: "Select IDE target:",
      choices: [
        { name: "Claude Code", value: "claude" as const },
        { name: "Cursor", value: "cursor" as const },
        { name: "GitHub Copilot", value: "github-copilot" as const },
      ],
      default: "claude" as const,
    });
  }

  // Step 6: Download kit
  const spinner = ora("Downloading kit template...").start();
  const tempDir = join(tmpdir(), `epost-kit-${Date.now()}`);

  try {
    await mkdir(tempDir, { recursive: true });
    await downloadKit(opts.kit || "engineer", "latest", tempDir);
    spinner.succeed("Kit downloaded");
  } catch (error) {
    spinner.fail("Download failed");
    await rm(tempDir, { recursive: true, force: true });
    throw error;
  }

  try {
    // Step 7: Classify files
    spinner.start("Analyzing project files...");
    const kitFiles = await getKitFiles(tempDir);
    const classification = await classifyFiles(projectDir, kitFiles, metadata);
    const plan = planMerge(classification);
    spinner.succeed("Analysis complete");

    // Step 8: Dry-run preview
    if (opts.dryRun) {
      logger.info("\n" + previewMerge(plan));
      logger.info("\nDry-run mode - no changes made");
      await rm(tempDir, { recursive: true, force: true });
      return;
    }

    // Step 9: Show merge plan
    logger.info("\n" + previewMerge(plan));

    // Step 10: Handle conflicts
    const conflictResolutions = new Map<string, "keep" | "overwrite">();
    if (plan.summary.conflict > 0 && !opts.yes) {
      logger.info("\nConflicts detected - requires manual resolution:");

      for (const [file, action] of plan.actions) {
        if (action === "conflict") {
          const resolution = await select({
            message: `Resolve conflict: ${file}`,
            choices: [
              {
                name: "Keep current version (skip update)",
                value: "keep" as const,
              },
              {
                name: "Use new version (overwrite)",
                value: "overwrite" as const,
              },
            ],
          });
          conflictResolutions.set(file, resolution as "keep" | "overwrite");
        }
      }
    } else if (plan.summary.conflict > 0 && opts.yes) {
      for (const [file, action] of plan.actions) {
        if (action === "conflict") {
          conflictResolutions.set(file, "keep");
        }
      }
      logger.info("Auto-resolved conflicts (keeping user modifications)");
    }

    // Step 11: Confirm
    if (!opts.yes) {
      const proceed = await confirm({
        message: "Apply changes?",
        default: true,
      });
      if (!proceed) {
        logger.info("Cancelled");
        await rm(tempDir, { recursive: true, force: true });
        return;
      }
    }

    // Step 12: Backup
    if (metadata) {
      spinner.start("Creating backup...");
      await createBackup(projectDir, "pre-update");
      spinner.succeed("Backup created");
    }

    // Step 13: Execute merge
    spinner.start("Applying changes...");
    await executeMerge(plan, tempDir, projectDir, {
      resolveConflicts: conflictResolutions,
    });
    spinner.succeed("Changes applied");

    // Step 14: Update metadata
    spinner.start("Updating metadata...");
    const files: Record<string, FileOwnership> = {};

    for (const relativePath of kitFiles) {
      const fullPath = join(projectDir, relativePath);
      if (await fileExists(fullPath)) {
        const checksum = await hashFile(fullPath);
        files[relativePath] = {
          path: relativePath,
          checksum,
          installedAt:
            metadata?.files[relativePath]?.installedAt ||
            new Date().toISOString(),
          version: "latest",
          modified: false,
        };
      }
    }

    const newMetadata = generateMetadata("0.1.0", target, "latest", files);
    await writeMetadata(projectDir, newMetadata);
    spinner.succeed("Metadata updated");

    // Step 15: Success
    logger.info("\n✓ Installation complete!");
    logger.info(`\nSummary:`);
    logger.info(`  Created: ${plan.summary.create} file(s)`);
    logger.info(`  Updated: ${plan.summary.overwrite} file(s)`);
    logger.info(`  Skipped: ${plan.summary.skip} file(s)`);
    if (plan.summary.conflict > 0) {
      logger.info(`  Conflicts: ${plan.summary.conflict} file(s)`);
    }
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

// ─── Main Entry ───

export async function runInit(opts: InitOptions): Promise<void> {
  if (usePackageMode(opts)) {
    return runPackageInit(opts);
  }

  // Try package-based if packages/ dir exists and no explicit --kit
  if (!opts.kit) {
    const packagesDir = await findKitPackagesDir();
    if (packagesDir) {
      logger.debug(
        "Packages directory found, using package-based installation",
      );
      return runPackageInit(opts);
    }
  }

  return runKitInit(opts);
}
