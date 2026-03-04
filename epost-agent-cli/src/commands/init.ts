/**
 * Command: epost-kit init
 * Initialize epost-agent-kit in existing project
 * Supports both legacy kit-based and new package-based installation
 */

import { join, resolve, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  readFile,
  writeFile,
  readdir,
  copyFile,
  mkdir,
  rm,
} from "node:fs/promises";
import { select, confirm, checkbox, Separator } from "@inquirer/prompts";
import ora from "ora";
import pc from "picocolors";
import { logger } from "../core/logger.js";
import { fileExists, dirExists, safeCopyDir } from "../core/file-system.js";
import {
  box,
  keyValue,
  packageTable,
  indent,
  PackageManifestSummary,
} from "../core/ui.js";
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
  generateCopilotInstructions,
  collectSnippets,
  type ClaudeMdContext,
} from "../core/claude-md-generator.js";
import { createTargetAdapter, type TargetAdapter } from "../core/target-adapter.js";
import {
  detectProjectProfile,
  listProfiles,
  getProfileInfo,
} from "../core/profile-loader.js";
import { tmpdir } from "node:os";
import type { InitOptions } from "../types/command-options.js";
import type { FileOwnership } from "../types/index.js";

const __init_dir = dirname(fileURLToPath(import.meta.url));

/**
 * Find the kit repo's packages directory (search up from CLI location + binary path)
 */
async function findKitPackagesDir(): Promise<string | null> {
  const possiblePaths = [
    join(process.cwd(), "packages"),
    join(process.cwd(), "..", "packages"),
    // Relative to CLI binary (npm link: dist/commands/ → epost-agent-cli → kit root)
    join(__init_dir, "..", "..", "packages"),
    join(__init_dir, "..", "..", "..", "packages"),
  ];

  for (const p of possiblePaths) {
    const resolved = resolve(p);
    if (await dirExists(resolved)) {
      if (await fileExists(join(resolved, "core", "package.yaml"))) {
        return resolved;
      }
    }
  }

  return null;
}

/**
 * Find the profiles.yaml file (cwd + binary-relative paths)
 */
async function findProfilesPath(projectDir: string): Promise<string | null> {
  const possiblePaths = [
    join(projectDir, "profiles", "profiles.yaml"),
    join(projectDir, "..", "profiles", "profiles.yaml"),
    // Relative to CLI binary (npm link)
    join(__init_dir, "..", "..", "profiles", "profiles.yaml"),
    join(__init_dir, "..", "..", "..", "profiles", "profiles.yaml"),
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
 * Find the templates directory (cwd + binary-relative paths)
 */
async function findTemplatesDir(projectDir: string): Promise<string | null> {
  const possiblePaths = [
    join(projectDir, "templates"),
    join(projectDir, "..", "templates"),
    // Relative to CLI binary (npm link)
    join(__init_dir, "..", "..", "templates"),
    join(__init_dir, "..", "..", "..", "templates"),
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
  // Support --dir to install into a different directory
  if (opts.dir) {
    const targetPath = resolve(opts.dir);
    if (!(await dirExists(targetPath))) {
      throw new Error(`Directory not found: ${targetPath}`);
    }
    process.chdir(targetPath);
  }

  const projectDir = resolve(process.cwd());
  const projectName = basename(projectDir);

  // ── Step 1/7: Find packages ──
  logger.step(1, 7, "Locating packages");
  const packagesDir = await findKitPackagesDir();
  if (!packagesDir) {
    throw new Error(
      "Cannot find packages/ directory. Run from the kit repo, or use --kit for legacy installation.",
    );
  }
  logger.debug(`Using packages from: ${packagesDir}`);

  const profilesPath = await findProfilesPath(projectDir);
  if (!profilesPath) {
    throw new Error("Cannot find profiles/profiles.yaml");
  }

  const metadata = await readMetadata(projectDir);
  const isUpdate = !!metadata && !opts.fresh;

  // Parse comma-separated options
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

  // ── Step 2/7: Select profiles ──
  let profileName = opts.profile;
  let mergedProfilePackages: string[] | undefined;

  if (!profileName && !packagesList) {
    logger.step(2, 7, "Selecting profiles");
    const profiles = await loadProfiles(profilesPath);

    if (opts.yes) {
      // Non-interactive: use auto-detect or default to core
      const detected = await detectProjectProfile(projectDir, profiles);
      if (detected) {
        profileName = detected.profile;
        logger.info(`Auto-detected profile: ${detected.displayName}`);
      }
    } else {
      // Interactive: multi-select with auto-detected profile pre-checked
      const detected = await detectProjectProfile(projectDir, profiles);
      const allProfiles = listProfiles(profiles);

      if (detected) {
        logger.info(
          `Detected project type: ${detected.displayName} (${detected.confidence} confidence)`,
        );
      }

      const selectedProfiles = await checkbox({
        message: "Select profiles (space to toggle, enter to confirm):",
        choices: allProfiles.map((p) => ({
          name: `${p.displayName} (${p.packages.join(", ")})`,
          value: p.name,
          checked: detected ? p.name === detected.profile : false,
        })),
      });

      if (selectedProfiles.length === 0) {
        logger.info("No profiles selected. Cancelled.");
        return;
      } else if (selectedProfiles.length === 1) {
        profileName = selectedProfiles[0];
      } else {
        // Merge packages from all selected profiles
        const pkgSet = new Set<string>();
        for (const pName of selectedProfiles) {
          const pInfo = getProfileInfo(pName, profiles);
          if (pInfo) pInfo.packages.forEach((pkg) => pkgSet.add(pkg));
        }
        mergedProfilePackages = [...pkgSet];
        profileName = selectedProfiles.join("+");
        logger.info(
          `Combined ${selectedProfiles.length} profiles: ${mergedProfilePackages.join(", ")}`,
        );
      }
    }
  }

  // ── Step 3/7: Select editor/IDE ──
  const validTargets = ["claude", "cursor", "github-copilot", "zed", "windsurf"] as const;
  type ValidTarget = typeof validTargets[number];
  let target: ValidTarget = (metadata?.target as ValidTarget) || "claude";

  if (opts.target) {
    if (!validTargets.includes(opts.target as any)) {
      throw new Error(
        `Invalid target "${opts.target}". Valid: ${validTargets.join(", ")}`
      );
    }
    target = opts.target as ValidTarget;
  } else if (!opts.yes) {
    logger.step(3, 7, "Selecting editor");
    target = await select({
      message: "Which editor/IDE are you using?",
      choices: [
        { name: "Claude Code", value: "claude" as const },
        { name: "Cursor", value: "cursor" as const },
        { name: "GitHub Copilot", value: "github-copilot" as const },
        { name: "Zed", value: "zed" as const },
        { name: "Windsurf", value: "windsurf" as const },
      ],
      default: target,
    });
  }

  // ── Step 4/7: Resolve packages ──
  logger.step(4, 7, "Resolving packages");
  const spinner = ora("Resolving packages...").start();
  const resolved = await resolvePackages({
    packagesDir,
    profilesPath,
    profile: mergedProfilePackages ? undefined : profileName,
    packages: mergedProfilePackages || packagesList,
    includeOptional: optionalList,
    exclude: excludeList,
  });
  spinner.succeed(
    `Resolved ${resolved.packages.length} packages: ${resolved.packages.join(", ")}`,
  );

  // Show recommendations
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
        profile: mergedProfilePackages ? undefined : profileName,
        packages: [...resolved.packages, ...resolved.recommended],
        includeOptional: optionalList,
        exclude: excludeList,
      });
      resolved.packages.length = 0;
      resolved.packages.push(...reResolved.packages);
    }
  }

  // ── Step 5/7: Select extras ──
  logger.step(5, 7, "Selecting extras");
  const manifests = await loadAllManifests(packagesDir);
  const additionalList = opts.additional
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (additionalList && additionalList.length > 0) {
    // Non-interactive: add specified additional packages
    const reResolved = await resolvePackages({
      packagesDir,
      profilesPath,
      packages: [...resolved.packages, ...additionalList],
      exclude: excludeList,
    });
    resolved.packages.length = 0;
    resolved.packages.push(...reResolved.packages);
  } else if (!opts.yes) {
    const currentPkgSet = new Set(resolved.packages);

    type CheckboxChoice = { name: string; value: string; checked: boolean };
    const optionalChoices: CheckboxChoice[] = resolved.optional.map((name) => ({
      name,
      value: name,
      checked: false,
    }));
    const additionalChoices: CheckboxChoice[] = [...manifests.keys()]
      .filter((name) => !currentPkgSet.has(name) && !resolved.optional.includes(name))
      .map((name) => {
        const m = manifests.get(name);
        return { name: m ? `${name} — ${m.description}` : name, value: name, checked: false };
      });

    const hasExtras = optionalChoices.length > 0 || additionalChoices.length > 0;
    if (hasExtras) {
      const choices: (CheckboxChoice | Separator)[] = [];
      if (optionalChoices.length > 0) {
        choices.push(new Separator("── Optional (from your profile) ──"), ...optionalChoices);
      }
      if (additionalChoices.length > 0) {
        choices.push(new Separator("── Additional packages ──"), ...additionalChoices);
      }

      const selected = await checkbox({ message: "Select extra packages:", choices });
      if (selected.length > 0) {
        const reResolved = await resolvePackages({
          packagesDir,
          profilesPath,
          profile: mergedProfilePackages ? undefined : profileName,
          packages: [...resolved.packages, ...selected],
          exclude: excludeList,
        });
        resolved.packages.length = 0;
        resolved.packages.push(...reResolved.packages);
      }
    }
  }

  // Create target adapter for format transformation
  const adapter = await createTargetAdapter(target);
  const installDirName = adapter.installDir;
  const installDir = join(projectDir, installDirName);

  // Build summary for display
  const pkgSummaries: PackageManifestSummary[] = resolved.packages
    .map((name) => {
      const m = manifests.get(name);
      return m
        ? {
            name,
            layer: m.layer,
            agents: m.provides.agents.length,
            skills: m.provides.skills.length,
          }
        : null;
    })
    .filter((s): s is PackageManifestSummary => s !== null);

  // Dry-run preview
  if (opts.dryRun) {
    const summaryContent = [
      `Profile: ${profileName || "(explicit packages)"}`,
      `Target:  ${target} (${installDirName}/)`,
      `Packages: ${resolved.packages.length}`,
    ].join("\n");
    console.log(box(summaryContent, { title: "Dry Run Preview" }));

    console.log(indent(packageTable(pkgSummaries), 2));
    console.log("\n  No changes made (dry-run mode).\n");
    return;
  }

  // Confirm
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

  // ── Step 6/7: Install packages ──
  logger.step(6, 7, "Installing packages");
  if (isUpdate) {
    const backupSpinner = ora("Creating backup...").start();
    await createBackup(projectDir, "pre-update");
    backupSpinner.succeed("Backup created");
  }

  // On fresh install, remove stale generated directories to prevent accumulation
  if (!isUpdate) {
    const staleDirs = ["agents", "skills"];
    if (!adapter.usesSettingsJson()) staleDirs.push("hooks", "instructions");
    for (const dir of staleDirs) {
      const dirPath = join(installDir, dir);
      if (await dirExists(dirPath)) {
        await rm(dirPath, { recursive: true });
        logger.debug(`Cleaned stale directory: ${dir}`);
      }
    }
  }
  const installSpinner = ora("Installing packages...").start();
  await mkdir(installDir, { recursive: true });

  const allFiles: Record<string, FileOwnership> = {};
  let totalAgents = 0,
    totalSkills = 0;
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

      // Handle single file mapping (e.g., "settings.json: settings.json")
      if (!srcSubDir.endsWith("/")) {
        if (await fileExists(srcPath)) {
          // Settings files handled separately
          if (srcSubDir === "settings.json") continue;

          const destPath = join(installDir, destSubDir);
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

      // Directory copy — apply adapter transforms for agents, commands, skills
      if (await dirExists(srcPath)) {
        const destDir = join(installDir, destSubDir);
        const existingFiles = (await dirExists(destDir))
          ? new Set(await scanDirFiles(destDir))
          : new Set<string>();

        // Determine if this is a transformable directory
        const isAgentDir = destSubDir.startsWith("agents");
        const isSkillDir = destSubDir.startsWith("skills");
        const isHookDir = destSubDir.startsWith("hooks");

        const actualDestDir = isHookDir
          ? join(installDir, adapter.hookScriptDir())
          : destDir;

        await mkdir(actualDestDir, { recursive: true });

        if (isAgentDir || isSkillDir) {
          // Transform files individually through adapter
          await transformAndCopyDir(
            srcPath,
            actualDestDir,
            adapter,
            isAgentDir ? "agent" : "skill",
          );
        } else {
          // Non-transformable dirs: copy as-is, apply path replacements
          await safeCopyDir(srcPath, actualDestDir);
          // Apply path replacement in hook scripts
          if (isHookDir) {
            await replacePathsInDir(actualDestDir, adapter);
          }
        }

        // Track only NEW files from this package
        const allFilesNow = await scanDirFiles(actualDestDir);
        const actualDestSubDir = isHookDir
          ? adapter.hookScriptDir()
          : destSubDir;
        for (const file of allFilesNow) {
          if (existingFiles.has(file)) continue;
          const relativePath = join(installDirName, actualDestSubDir, file);
          const fullPath = join(actualDestDir, file);
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
  }

  // Recount from actual installed files for accuracy
  const agentsDir = join(installDir, "agents");
  if (await dirExists(agentsDir)) {
    const agentFiles = (await scanDirFiles(agentsDir)).filter((f) =>
      f.endsWith(".md"),
    );
    totalAgents = agentFiles.length;
  }

  installSpinner.succeed(`Installed ${resolved.packages.length} packages`);

  // Show per-package details
  for (const pkgName of resolved.packages) {
    const m = manifests.get(pkgName);
    if (m) {
      const parts: string[] = [];
      if (m.provides.agents.length > 0)
        parts.push(
          `${m.provides.agents.length} agent${m.provides.agents.length !== 1 ? "s" : ""}`,
        );
      if (m.provides.skills.length > 0)
        parts.push(
          `${m.provides.skills.length} skill${m.provides.skills.length !== 1 ? "s" : ""}`,
        );
      const detail = parts.length > 0 ? parts.join(", ") : "config";
      const dots = ".".repeat(Math.max(1, 22 - pkgName.length));
      console.log(`    ${pc.green("✓")} ${pkgName} ${pc.dim(dots)} ${detail}`);
    }
  }

  // ── Step 6/7: Generate configuration ──
  logger.step(6, 7, "Generating configuration");
  const skillIndexSpinner = ora("Generating skill index...").start();
  const skillsDir = join(installDir, "skills");
  if (await dirExists(skillsDir)) {
    const skillIndex = await generateSkillIndex(skillsDir);
    const skillIndexPath = join(skillsDir, "skill-index.json");
    await writeFile(
      skillIndexPath,
      JSON.stringify(skillIndex, null, 2),
      "utf-8",
    );
    // Track the generated file
    const skillIndexRelPath = join(
      installDirName,
      "skills",
      "skill-index.json",
    );
    const skillIndexChecksum = await hashFile(skillIndexPath);
    allFiles[skillIndexRelPath] = {
      path: skillIndexRelPath,
      checksum: skillIndexChecksum,
      installedAt: new Date().toISOString(),
      version: "1.0.0",
      modified: false,
      package: "core",
    };
    totalSkills = skillIndex.count;
    skillIndexSpinner.succeed(
      `Skill index generated: ${skillIndex.count} skills`,
    );
  } else {
    skillIndexSpinner.warn("No skills directory found");
  }

  // Merge settings / generate hooks
  if (adapter.usesSettingsJson()) {
    const settingsSpinner = ora("Merging settings...").start();
    const settingsOutput = join(installDir, "settings.json");
    const { sources: settingsSources } = await mergeAndWriteSettings(
      settingsPackages,
      settingsOutput,
    );
    settingsSpinner.succeed(
      `Settings merged from ${settingsSources.length} packages`,
    );
  } else {
    // Copilot: merge settings first (in-memory), then transform hooks
    const settingsSpinner = ora("Generating hooks configuration...").start();
    const tmpSettingsPath = join(tmpdir(), `epost-settings-${Date.now()}.json`);
    const { merged } = await mergeAndWriteSettings(
      settingsPackages,
      tmpSettingsPath,
    );
    // Transform hooks from merged settings
    const hookResult = adapter.transformHooks(merged as Record<string, unknown>);
    if (hookResult) {
      const hooksDir = join(installDir, "hooks");
      await mkdir(hooksDir, { recursive: true });
      await writeFile(join(hooksDir, hookResult.filename), hookResult.content, "utf-8");
    }
    // Clean up temp file
    try { await rm(tmpSettingsPath); } catch { /* ignore */ }
    settingsSpinner.succeed("Hooks configuration generated");
  }

  // Generate root instructions (CLAUDE.md or copilot-instructions.md)
  const snippets = await collectSnippets(snippetPackages);
  const platforms = new Set<string>();
  for (const pkgName of resolved.packages) {
    const manifest = manifests.get(pkgName);
    if (manifest) {
      for (const p of manifest.platforms) platforms.add(p);
    }
  }

  const instrContext: ClaudeMdContext = {
    profile: profileName,
    packages: resolved.packages,
    target,
    kitVersion: "1.0.0",
    cliVersion: "0.1.0",
    installedAt: new Date().toISOString().split("T")[0],
    projectName,
    platforms: Array.from(platforms),
    agentCount: totalAgents,
    skillCount: totalSkills,
    commandCount: 0,
  };

  if (adapter.usesSettingsJson()) {
    // Claude/Cursor: generate CLAUDE.md
    const claudeSpinner = ora("Generating CLAUDE.md...").start();
    const templatesDir = await findTemplatesDir(projectDir);
    const templatePath = templatesDir
      ? join(templatesDir, "repo-claude.md.hbs")
      : "";
    const claudeMdPath = join(projectDir, "CLAUDE.md");
    await generateClaudeMd(templatePath, instrContext, snippets, claudeMdPath);
    claudeSpinner.succeed("CLAUDE.md generated");
  } else {
    // Copilot: generate copilot-instructions.md
    const copilotSpinner = ora("Generating copilot-instructions.md...").start();
    const instrPath = join(installDir, adapter.rootInstructionsFilename());
    await generateCopilotInstructions(instrContext, snippets, instrPath);
    copilotSpinner.succeed("copilot-instructions.md generated");
  }

  // Auto-fix stale references using rename maps, then validate remaining
  const {
    buildRefRegistry,
    buildRenameMap,
    fixReferences: fixRefs,
    validateReferences,
  } = await import("../core/ref-validator.js");

  const renameMap = buildRenameMap(manifests);
  if (renameMap.size > 0) {
    const fixResults = await fixRefs(installDir, renameMap, false);
    if (fixResults.length > 0) {
      const totalFixes = fixResults.reduce(
        (sum, r) => sum + r.replacements.length,
        0,
      );
      console.log(
        `\n  ${pc.green("✓")} Auto-fixed ${totalFixes} stale reference(s) via rename map`,
      );
    }
  }

  const refRegistry = buildRefRegistry(manifests);
  const refErrors = await validateReferences(installDir, refRegistry);
  if (refErrors.length > 0) {
    console.log(
      `\n  ${pc.yellow("⚠")} Found ${refErrors.length} broken reference(s):`,
    );
    for (const err of refErrors.slice(0, 10)) {
      const suggestion = err.suggestion ? ` → ${err.suggestion}` : "";
      console.log(
        `    ${pc.dim(err.file)}:${err.line} ${err.type} "${pc.red(err.ref)}"${pc.green(suggestion)}`,
      );
    }
    if (refErrors.length > 10) {
      console.log(
        pc.dim(`    ... and ${refErrors.length - 10} more. Run: epost-kit lint`),
      );
    }
    console.log();
  }

  // ── Step 7/7: Finalize ──
  logger.step(7, 7, "Finalizing");
  const metaSpinner = ora("Updating metadata...").start();
  const newMetadata = generateMetadata("0.1.0", target, "1.0.0", allFiles, {
    profile: profileName,
    installedPackages: resolved.packages,
  });
  await writeMetadata(projectDir, newMetadata);
  metaSpinner.succeed("Metadata updated");

  // Success summary
  console.log("\n");
  const summaryPairs: Array<[string, string]> = [];
  if (profileName) summaryPairs.push(["Profile", profileName]);
  summaryPairs.push([
    "Target",
    `${target === "claude" ? "Claude Code" : target === "cursor" ? "Cursor" : target === "zed" ? "Zed" : target === "windsurf" ? "Windsurf" : "GitHub Copilot"} (${installDirName}/)`,
  ]);
  summaryPairs.push(["Packages", `${resolved.packages.length}`]);
  summaryPairs.push(["Agents", `${totalAgents}`]);
  summaryPairs.push(["Skills", `${totalSkills}`]);
  console.log(
    box(keyValue(summaryPairs, { indent: 0 }), {
      title: "Installation Complete",
    }),
  );

  const readyMsg = target === "github-copilot"
    ? `Open VS Code → Copilot Chat → type ${pc.bold("@")} to discover agents.\nType ${pc.bold("/")} to discover all available skills.`
    : `Run ${pc.bold("claude")} to activate your AI assistant.\nType ${pc.bold("/")} to discover all available skills.`;
  console.log(box(readyMsg, { title: "Ready" }));
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

// ─── Utility: transform and copy directory through adapter ───

async function transformAndCopyDir(
  srcDir: string,
  destDir: string,
  adapter: TargetAdapter,
  fileType: "agent" | "skill",
): Promise<void> {
  const files = await scanDirFiles(srcDir);
  for (const relPath of files) {
    const srcFile = join(srcDir, relPath);
    const content = await readFile(srcFile, "utf-8");

    if (!relPath.endsWith(".md")) {
      // Non-markdown files: copy as-is with path replacement
      const destFile = join(destDir, relPath);
      await mkdir(dirname(destFile), { recursive: true });
      const transformed = adapter.replacePathRefs(content);
      await writeFile(destFile, transformed, "utf-8");
      continue;
    }

    let result: { content: string; filename: string };
    switch (fileType) {
      case "agent":
        result = adapter.transformAgent(content, basename(relPath));
        break;
      case "skill":
        // Skills keep their directory structure
        result = { content: adapter.transformSkill(content), filename: relPath };
        break;
    }

    // For agents, filename is just the basename (may be renamed by adapter)
    // so we need dirname(relPath) to preserve directory structure.
    // For skills, filename IS relPath (full relative path preserved),
    // so dirname(relPath) would double-count the directory.
    const destFile =
      fileType === "agent"
        ? join(destDir, dirname(relPath), result.filename)
        : join(destDir, result.filename);
    await mkdir(dirname(destFile), { recursive: true });
    await writeFile(destFile, result.content, "utf-8");
  }
}

// ─── Utility: replace path references in directory files ───

async function replacePathsInDir(
  dir: string,
  adapter: TargetAdapter,
): Promise<void> {
  const files = await scanDirFiles(dir);
  for (const relPath of files) {
    if (!relPath.endsWith(".cjs") && !relPath.endsWith(".js") && !relPath.endsWith(".json")) continue;
    const filePath = join(dir, relPath);
    const content = await readFile(filePath, "utf-8");
    const transformed = adapter.replacePathRefs(content);
    if (transformed !== content) {
      await writeFile(filePath, transformed, "utf-8");
    }
  }
}

// ─── Utility: generate skill-index.json from installed SKILL.md files ───

interface SkillConnections {
  extends: string[];
  requires: string[];
  conflicts: string[];
  enhances: string[];
}

interface SkillIndexEntry {
  name: string;
  description: string;
  keywords: string[];
  platforms: string[];
  triggers: string[];
  "agent-affinity": string[];
  connections: SkillConnections;
  path: string;
}

async function generateSkillIndex(skillsDir: string): Promise<{
  generated: string;
  version: string;
  count: number;
  skills: SkillIndexEntry[];
}> {
  const skillFiles = await findSkillFiles(skillsDir);
  const skills: SkillIndexEntry[] = [];

  for (const filePath of skillFiles) {
    try {
      const content = await readFile(filePath, "utf-8");
      const metadata = extractSkillFrontmatter(content);
      if (!metadata || !metadata.name) continue;

      const relativePath = filePath.substring(skillsDir.length + 1); // strip skillsDir prefix + /
      const asStr = (v: string | string[] | undefined, fallback: string) =>
        typeof v === "string" ? v : fallback;
      const asArr = (v: string | string[] | undefined, fallback: string[]) =>
        Array.isArray(v) ? v : fallback;
      // Build connections from metadata.connections (parser flattens nested YAML)
      const connections: SkillConnections = {
        extends: asArr(metadata.extends, []),
        requires: asArr(metadata.requires, []),
        conflicts: asArr(metadata.conflicts, []),
        enhances: asArr(metadata.enhances, []),
      };
      skills.push({
        name: asStr(metadata.name, ""),
        description: asStr(metadata.description, ""),
        keywords: asArr(metadata.keywords, []),
        platforms: asArr(metadata.platforms, ["all"]),
        triggers: asArr(metadata.triggers, []),
        "agent-affinity": asArr(metadata["agent-affinity"], []),
        connections,
        path: relativePath,
      });
    } catch {
      // Skip files that can't be read
    }
  }

  skills.sort((a, b) => a.name.localeCompare(b.name));

  return {
    generated: new Date().toISOString(),
    version: "1.0.0",
    count: skills.length,
    skills,
  };
}

async function findSkillFiles(dir: string): Promise<string[]> {
  const results: string[] = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...(await findSkillFiles(fullPath)));
      } else if (entry.name === "SKILL.md") {
        results.push(fullPath);
      }
    }
  } catch {
    // Directory doesn't exist
  }
  return results;
}

function extractSkillFrontmatter(
  content: string,
): Record<string, string | string[]> | null {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return null;

  const metadata: Record<string, string | string[]> = {};
  const lines = match[1].split("\n");
  let currentKey: string | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("-") && currentKey) {
      const value = trimmed.substring(1).trim();
      if (!Array.isArray(metadata[currentKey])) metadata[currentKey] = [];
      (metadata[currentKey] as string[]).push(value);
      continue;
    }

    const colonIndex = trimmed.indexOf(":");
    if (colonIndex === -1) continue;

    const key = trimmed.substring(0, colonIndex).trim();
    let value = trimmed.substring(colonIndex + 1).trim();

    // Remove quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.substring(1, value.length - 1);
    }

    // Inline array [a, b, c]
    if (value.startsWith("[") && value.endsWith("]")) {
      const items = value
        .substring(1, value.length - 1)
        .split(",")
        .map((item) => item.trim().replace(/^["']|["']$/g, ""))
        .filter((item) => item);
      metadata[key] = items;
    } else if (value) {
      metadata[key] = value;
    } else {
      currentKey = key;
    }
  }

  return metadata;
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
  const validTargetsLegacy = ["claude", "cursor", "github-copilot", "zed", "windsurf"] as const;
  type LegacyTarget = typeof validTargetsLegacy[number];
  let target: LegacyTarget = (metadata?.target as LegacyTarget) || "claude";

  if (opts.target) {
    if (!validTargetsLegacy.includes(opts.target as any)) {
      throw new Error(
        `Invalid target "${opts.target}". Valid: ${validTargetsLegacy.join(", ")}`
      );
    }
    target = opts.target as LegacyTarget;
  } else if (!metadata && !opts.yes) {
    target = await select({
      message: "Select IDE target:",
      choices: [
        { name: "Claude Code", value: "claude" as const },
        { name: "Cursor", value: "cursor" as const },
        { name: "GitHub Copilot", value: "github-copilot" as const },
        { name: "Zed", value: "zed" as const },
        { name: "Windsurf", value: "windsurf" as const },
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
  // Legacy kit mode
  if (opts.kit) {
    return runKitInit(opts);
  }

  // Explicit flags → direct package install
  if (opts.profile || opts.packages || opts.yes) {
    return runPackageInit(opts);
  }

  // Auto-detect packages dir
  const packagesDir = await findKitPackagesDir();
  if (!packagesDir) {
    throw new Error(
      "Cannot find packages/ directory. Run from the kit repo, or use --kit for legacy installation.",
    );
  }

  // Existing installation → direct update
  const metadata = await readMetadata(resolve(process.cwd()));
  if (metadata) {
    return runPackageInit(opts);
  }

  // First-time: run package init directly (same flow as update)
  return runPackageInit(opts);
}
