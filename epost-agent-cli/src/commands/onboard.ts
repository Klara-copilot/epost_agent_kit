/**
 * Command: epost-kit onboard
 * Guided first-time setup wizard for new developers
 */

import { resolve, join } from "node:path";
import { select, confirm, checkbox } from "@inquirer/prompts";
import { logger } from "../core/logger.js";
import { fileExists } from "../core/file-system.js";
import { loadProfiles } from "../core/package-resolver.js";
import {
  listProfiles,
  findProfilesByTeam,
  getProfileInfo,
} from "../core/profile-loader.js";
import { runInit } from "./init.js";
import type { OnboardOptions } from "../types/command-options.js";

async function findProfilesPath(): Promise<string> {
  const paths = [
    join(process.cwd(), "profiles", "profiles.yaml"),
    join(process.cwd(), "..", "profiles", "profiles.yaml"),
  ];
  for (const p of paths) {
    if (await fileExists(resolve(p))) return resolve(p);
  }
  throw new Error("Cannot find profiles/profiles.yaml");
}

export async function runOnboard(opts: OnboardOptions): Promise<void> {
  logger.info("\n🚀 Welcome to epost-agent-kit!\n");
  logger.info("This wizard will set up your development environment.\n");

  const profilesPath = await findProfilesPath();
  const profiles = await loadProfiles(profilesPath);

  // Step 1: Team selection
  const allProfiles = listProfiles(profiles);
  const teams = new Set<string>();
  for (const p of allProfiles) {
    for (const t of p.teams) teams.add(t);
  }

  let selectedProfile: string | undefined;

  if (teams.size > 0) {
    const teamChoice = await select({
      message: "What team are you on?",
      choices: [
        ...[...teams].sort().map((t) => ({
          name: t.charAt(0).toUpperCase() + t.slice(1),
          value: t,
        })),
        { name: "I'm not sure / Other", value: "__other__" },
      ],
    });

    if (teamChoice !== "__other__") {
      // Step 2: Show matching profiles
      const teamProfiles = findProfilesByTeam(teamChoice, profiles);

      if (teamProfiles.length === 1) {
        logger.info(`\nSuggested profile: ${teamProfiles[0].displayName}`);
        logger.info(`Packages: ${teamProfiles[0].packages.join(", ")}`);
        const useIt = await confirm({
          message: `Use this profile?`,
          default: true,
        });
        if (useIt) {
          selectedProfile = teamProfiles[0].name;
        }
      } else if (teamProfiles.length > 1) {
        selectedProfile = await select({
          message: "Select your role:",
          choices: teamProfiles.map((p) => ({
            name: `${p.displayName} (${p.packages.length} packages)`,
            value: p.name,
          })),
        });
      }
    }
  }

  // Step 3: Manual selection if no team match
  if (!selectedProfile) {
    selectedProfile = await select({
      message: "Select a developer profile:",
      choices: allProfiles.map((p) => ({
        name: `${p.displayName} (${p.packages.join(", ")})`,
        value: p.name,
      })),
    });
  }

  // Step 4: Show profile details
  const info = getProfileInfo(selectedProfile, profiles);
  if (info) {
    logger.info(`\nProfile: ${info.displayName}`);
    logger.info(`Packages: ${info.packages.join(", ")}`);
  }

  // Step 5: Optional packages
  let optionalList: string[] = [];
  if (info?.optional && info.optional.length > 0) {
    optionalList = await checkbox({
      message: "Include optional packages?",
      choices: info.optional.map((name) => ({ name, value: name })),
    });
  }

  // Step 6: Confirm and install
  const proceed = await confirm({
    message: `\nReady to install. Continue?`,
    default: true,
  });

  if (!proceed) {
    logger.info("Setup cancelled.");
    return;
  }

  // Step 7: Run init with selected profile
  await runInit({
    ...opts,
    profile: selectedProfile,
    optional: optionalList.length > 0 ? optionalList.join(",") : undefined,
  });

  // Step 8: Post-install tips
  logger.info("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  logger.info("🎉 Setup complete! Try these first:");
  logger.info("");
  logger.info("  /plan:fast <feature>     — Quick plan from codebase analysis");
  logger.info("  /core:cook <task>        — Implement a feature");
  logger.info("  /core:review             — Review your code changes");
  logger.info("  /core:test               — Run tests");
  logger.info("");
  logger.info("Run `epost-kit doctor` to verify your installation.");
  logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}
