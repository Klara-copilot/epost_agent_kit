/**
 * Command: epost-kit dev
 * Watch packages/ and live-sync to target .claude/ directory
 * For kit designers iterating on package content
 */

import { resolve, join, relative, dirname, basename } from "node:path";
import { watch } from "node:fs";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { logger } from "../core/logger.js";
import { fileExists, dirExists } from "../core/file-system.js";
import { loadAllManifests, resolvePackages } from "../core/package-resolver.js";
import { mergeAndWriteSettings } from "../core/settings-merger.js";
import {
  collectSnippets,
  generateClaudeMd,
  generateCopilotInstructions,
  type ClaudeMdContext,
} from "../core/claude-md-generator.js";
import { createTargetAdapter } from "../core/target-adapter.js";
import { readMetadata } from "../core/ownership.js";
import type { DevWatcherOptions } from "../types/command-options.js";

export async function runDev(opts: DevWatcherOptions): Promise<void> {
  // Resolve packages directory
  const packagesDir = resolve(join(process.cwd(), "packages"));
  if (!(await dirExists(packagesDir))) {
    throw new Error(
      "Cannot find packages/ directory. Run from the kit repo root.",
    );
  }

  // Resolve target directory and detect installed target
  const targetDir = opts.target ? resolve(opts.target) : resolve(process.cwd());

  // Auto-detect target from metadata or installed dirs
  const metadata = await readMetadata(targetDir);
  const detectedTarget = metadata?.target || "claude";
  const adapter = await createTargetAdapter(detectedTarget);
  const installDir = join(targetDir, adapter.installDir);

  if (!(await dirExists(installDir))) {
    logger.warn(`Target ${adapter.installDir}/ directory not found at ${installDir}`);
    logger.info(
      "Run `epost-kit init` first, or use --target to point to a project.",
    );
    return;
  }

  // Determine which packages to watch
  let watchPackages: string[];
  const manifests = await loadAllManifests(packagesDir);

  if (opts.profile) {
    const profilesPath = resolve(
      join(process.cwd(), "profiles", "profiles.yaml"),
    );
    if (!(await fileExists(profilesPath))) {
      throw new Error("Cannot find profiles/profiles.yaml");
    }
    const resolved = await resolvePackages({
      packagesDir,
      profilesPath,
      profile: opts.profile,
    });
    watchPackages = resolved.packages;
  } else {
    watchPackages = [...manifests.keys()];
  }

  logger.info(
    `[dev] Watching ${watchPackages.length} packages: ${watchPackages.join(", ")}`,
  );
  logger.info(`[dev] Target: ${installDir}`);
  logger.info(`[dev] Press Ctrl+C to stop\n`);

  // Debounce timer
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  const pendingChanges = new Map<string, string>(); // relativePath → packageName

  const processChanges = async () => {
    const changes = new Map(pendingChanges);
    pendingChanges.clear();

    let needsSettingsRegen = false;
    let needsClaudeMdRegen = false;

    for (const [changedPath, pkgName] of changes) {
      const manifest = manifests.get(pkgName);
      if (!manifest) continue;

      const pkgDir = join(packagesDir, pkgName);

      // Determine which file mapping this belongs to
      for (const [srcSubDir, destSubDir] of Object.entries(manifest.files)) {
        if (srcSubDir === "settings.json" && changedPath === "settings.json") {
          needsSettingsRegen = true;
          continue;
        }

        if (srcSubDir.endsWith("/") && changedPath.startsWith(srcSubDir)) {
          const relativeInSrc = changedPath.slice(srcSubDir.length);
          const srcFile = join(pkgDir, changedPath);

          if (await fileExists(srcFile)) {
            // Determine file type for adapter transformation
            const isAgent = destSubDir.startsWith("agents");
            const isCommand = destSubDir.startsWith("commands");
            const isSkill = destSubDir.startsWith("skills");
            const isHook = destSubDir.startsWith("hooks");
            const isMd = relativeInSrc.endsWith(".md");

            // Resolve actual dest dir (commands→prompts for Copilot)
            const actualDestDir = isCommand
              ? adapter.commandDir()
              : isHook
                ? adapter.hookScriptDir()
                : destSubDir;

            if (isMd && (isAgent || isCommand || isSkill)) {
              // Transform through adapter
              const content = await readFile(srcFile, "utf-8");
              let result: { content: string; filename: string };
              if (isAgent) {
                result = adapter.transformAgent(content, basename(relativeInSrc));
              } else if (isCommand) {
                result = adapter.transformCommand(content, relativeInSrc);
              } else {
                result = { content: adapter.transformSkill(content), filename: relativeInSrc };
              }
              const destFile = isCommand
                ? join(installDir, actualDestDir, result.filename)
                : join(installDir, actualDestDir, dirname(relativeInSrc), result.filename);
              await mkdir(dirname(destFile), { recursive: true });
              await writeFile(destFile, result.content, "utf-8");
              logger.info(
                `[dev] → ${pkgName}/${changedPath} → ${relative(targetDir, destFile)} (transformed)`,
              );
            } else {
              // Non-transformable: copy with path replacement
              const destFile = join(installDir, actualDestDir, relativeInSrc);
              await mkdir(dirname(destFile), { recursive: true });
              if (isHook && (relativeInSrc.endsWith(".cjs") || relativeInSrc.endsWith(".js"))) {
                const content = await readFile(srcFile, "utf-8");
                await writeFile(destFile, adapter.replacePathRefs(content), "utf-8");
              } else {
                await copyFile(srcFile, destFile);
              }
              logger.info(
                `[dev] → ${pkgName}/${changedPath} → ${relative(targetDir, destFile)} (updated)`,
              );
            }
          }
        }
      }

      // Check if snippet changed
      if (manifest.claude_snippet && changedPath === manifest.claude_snippet) {
        needsClaudeMdRegen = true;
      }
    }

    // Re-merge settings if needed
    if (needsSettingsRegen) {
      const settingsPackages = watchPackages
        .filter((name) => manifests.has(name))
        .map((name) => ({
          name,
          dir: join(packagesDir, name),
          strategy: manifests.get(name)!.settings_strategy,
        }));

      await mergeAndWriteSettings(
        settingsPackages,
        join(installDir, "settings.json"),
      );
      logger.info(`[dev] ✓ settings.json regenerated`);
    }

    // Re-generate CLAUDE.md if needed
    if (needsClaudeMdRegen) {
      const snippetPkgs = watchPackages
        .filter((name) => {
          const m = manifests.get(name);
          return m?.claude_snippet;
        })
        .map((name) => {
          const m = manifests.get(name)!;
          return {
            name,
            dir: join(packagesDir, name),
            layer: m.layer,
            snippetFile: m.claude_snippet,
          };
        });

      const snippets = await collectSnippets(snippetPkgs);

      const platforms = new Set<string>();
      for (const name of watchPackages) {
        const m = manifests.get(name);
        if (m) m.platforms.forEach((p) => platforms.add(p));
      }

      const context: ClaudeMdContext = {
        packages: watchPackages,
        target: detectedTarget,
        kitVersion: "1.0.0",
        projectName: "dev",
        platforms: Array.from(platforms),
        agentCount: 0,
        skillCount: 0,
        commandCount: 0,
      };

      if (adapter.usesSettingsJson()) {
        const templatesDir = resolve(join(process.cwd(), "templates"));
        const templatePath = join(templatesDir, "repo-claude.md.hbs");
        await generateClaudeMd(
          templatePath,
          context,
          snippets,
          join(targetDir, "CLAUDE.md"),
        );
        logger.info(
          `[dev] ✓ CLAUDE.md regenerated (${snippets.length} snippets merged)`,
        );
      } else {
        const instrPath = join(installDir, adapter.rootInstructionsFilename());
        await generateCopilotInstructions(context, snippets, instrPath);
        logger.info(
          `[dev] ✓ copilot-instructions.md regenerated (${snippets.length} snippets merged)`,
        );
      }
    }
  };

  // Set up watchers for each package
  const watchers: ReturnType<typeof watch>[] = [];

  for (const pkgName of watchPackages) {
    const pkgDir = join(packagesDir, pkgName);
    if (!(await dirExists(pkgDir))) continue;

    try {
      const watcher = watch(
        pkgDir,
        { recursive: true },
        (_eventType, filename) => {
          if (!filename) return;
          // Skip package.yaml and other meta files
          if (filename === "package.yaml" || filename.startsWith(".")) return;

          pendingChanges.set(filename, pkgName);

          // Debounce
          if (debounceTimer) clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            processChanges().catch((err) => {
              logger.error(`[dev] Error processing changes: ${err.message}`);
            });
          }, 300);
        },
      );

      watchers.push(watcher);
    } catch (err) {
      logger.warn(
        `[dev] Cannot watch ${pkgName}: ${err instanceof Error ? err.message : "unknown"}`,
      );
    }
  }

  // Keep alive until Ctrl+C
  process.on("SIGINT", () => {
    logger.info("\n[dev] Stopping watchers...");
    for (const w of watchers) w.close();
    if (debounceTimer) clearTimeout(debounceTimer);
    logger.info("[dev] Done");
    process.exit(0);
  });

  // Keep the process running
  await new Promise(() => {});
}
