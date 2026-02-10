#!/usr/bin/env node
/**
 * Skill Directory Flattening Script - agentskills.io Compliance
 *
 * Flattens 10 nested skill directories to match their name fields.
 * agentskills.io requires: skill name must match parent directory name.
 *
 * Current: packages/ui-ux/skills/muji/klara-theme/ (parent=klara-theme, name=muji-klara-theme) ❌
 * Target:  packages/ui-ux/skills/muji-klara-theme/ (parent=muji-klara-theme, name=muji-klara-theme) ✅
 *
 * Usage:
 *   node scripts/flatten-skills.mjs                 # Execute flattening
 *   node scripts/flatten-skills.mjs --dry-run       # Preview changes
 *   node scripts/flatten-skills.mjs --verbose       # Detailed logging
 *
 * CWD: Must run from epost-agent-kit/ root
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');
const REPO_ROOT = path.resolve(__dirname, '..');

// Directory flattening targets
const FLATTEN_TARGETS = [
  { package: 'arch-cloud', from: 'arch/cloud', to: 'arch-cloud' },
  { package: 'platform-backend', from: 'backend/databases', to: 'backend-databases' },
  { package: 'platform-backend', from: 'backend/javaee', to: 'backend-javaee' },
  { package: 'domain-b2b', from: 'domain/b2b', to: 'domain-b2b' },
  { package: 'domain-b2c', from: 'domain/b2c', to: 'domain-b2c' },
  { package: 'ui-ux', from: 'muji/android-theme', to: 'muji-android-theme' },
  { package: 'ui-ux', from: 'muji/ios-theme', to: 'muji-ios-theme' },
  { package: 'ui-ux', from: 'muji/klara-theme', to: 'muji-klara-theme' },
  { package: 'rag-ios', from: 'rag/ios-rag', to: 'rag-ios-rag' },
  { package: 'rag-web', from: 'rag/web-rag', to: 'rag-web-rag' }
];

// Empty category directories to remove
const EMPTY_CATEGORIES = [
  'packages/arch-cloud/skills/arch',
  'packages/platform-backend/skills/backend',
  'packages/domain-b2b/skills/domain',
  'packages/domain-b2c/skills/domain',
  'packages/ui-ux/skills/muji',
  'packages/rag-ios/skills/rag',
  'packages/rag-web/skills/rag'
];

// Logging
const log = {
  info: (msg) => console.log(`ℹ ${msg}`),
  success: (msg) => console.log(`✓ ${msg}`),
  warn: (msg) => console.warn(`⚠ ${msg}`),
  error: (msg) => console.error(`✗ ${msg}`),
  verbose: (msg) => VERBOSE && console.log(`  ${msg}`),
  dryRun: (msg) => DRY_RUN && console.log(`[DRY-RUN] ${msg}`)
};

// Stats
const stats = {
  directoriesFlattened: 0,
  categoryDirsRemoved: 0
};

/**
 * Flatten skill directories
 */
function flattenDirectories() {
  log.info('Flattening skill directories...\n');

  for (const target of FLATTEN_TARGETS) {
    const fromPath = path.join(REPO_ROOT, 'packages', target.package, 'skills', target.from);
    const toPath = path.join(REPO_ROOT, 'packages', target.package, 'skills', target.to);

    log.info(`${target.package}: ${target.from} → ${target.to}`);

    if (!fs.existsSync(fromPath)) {
      log.error(`  Source not found: ${fromPath}`);
      continue;
    }

    if (fs.existsSync(toPath)) {
      log.warn(`  Destination exists: ${toPath} (skipping)`);
      continue;
    }

    log.dryRun(`  mv ${target.from} → ${target.to}`);

    if (!DRY_RUN) {
      // Ensure parent exists
      const parentDir = path.dirname(toPath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }

      // Move directory
      fs.renameSync(fromPath, toPath);
      stats.directoriesFlattened++;
      log.success(`  ✓ Moved`);
    }
  }
}

/**
 * Remove empty category directories
 */
function removeEmptyCategories() {
  log.info('\nRemoving empty category directories...\n');

  for (const categoryPath of EMPTY_CATEGORIES) {
    const fullPath = path.join(REPO_ROOT, categoryPath);

    log.info(`Checking: ${categoryPath}`);

    if (!fs.existsSync(fullPath)) {
      log.verbose(`  Already removed`);
      continue;
    }

    // Check if empty
    const files = fs.readdirSync(fullPath).filter(f => !f.startsWith('.'));
    if (files.length > 0) {
      log.warn(`  Not empty (${files.length} files): ${files.join(', ')}`);
      continue;
    }

    log.dryRun(`  rmdir ${categoryPath}`);

    if (!DRY_RUN) {
      fs.rmdirSync(fullPath);
      stats.categoryDirsRemoved++;
      log.success(`  ✓ Removed`);
    }
  }
}

/**
 * Update ui-ux package.yaml paths
 */
function updateUiUxPackageYaml() {
  log.info('\nUpdating ui-ux/package.yaml...\n');

  const yamlPath = path.join(REPO_ROOT, 'packages/ui-ux/package.yaml');

  if (!fs.existsSync(yamlPath)) {
    log.error('ui-ux/package.yaml not found');
    return;
  }

  let content = fs.readFileSync(yamlPath, 'utf8');
  let updated = false;

  // Update skill paths (must handle both provides.skills names and potential path references)
  const pathMappings = [
    { old: 'muji/android-theme', new: 'muji-android-theme' },
    { old: 'muji/ios-theme', new: 'muji-ios-theme' },
    { old: 'muji/klara-theme', new: 'muji-klara-theme' }
  ];

  for (const { old, new: newPath } of pathMappings) {
    if (content.includes(old)) {
      log.dryRun(`  ${old} → ${newPath}`);

      if (!DRY_RUN) {
        content = content.replace(new RegExp(old, 'g'), newPath);
        updated = true;
      }
    }
  }

  if (updated && !DRY_RUN) {
    fs.writeFileSync(yamlPath, content, 'utf8');
    log.success('ui-ux/package.yaml updated');
  }
}

/**
 * Regenerate skill indices
 */
function regenerateSkillIndices() {
  log.info('\nRegenerating skill indices...\n');

  const scriptPath = path.join(REPO_ROOT, 'packages/core/scripts/generate-skill-index.cjs');

  if (!fs.existsSync(scriptPath)) {
    log.error(`generate-skill-index.cjs not found`);
    return;
  }

  // Regenerate for core package
  const coreSkillsDir = path.join(REPO_ROOT, 'packages/core/skills');
  log.info('Regenerating packages/core/skills/skill-index.json');
  log.dryRun(`  node generate-skill-index.cjs ${path.relative(REPO_ROOT, coreSkillsDir)}`);

  if (!DRY_RUN) {
    try {
      execSync(`node "${scriptPath}" "${coreSkillsDir}"`, {
        cwd: REPO_ROOT,
        timeout: 30000,
        encoding: 'utf8'
      });
      log.success('  Core index regenerated');
    } catch (error) {
      log.error(`  Failed: ${error.message}`);
    }
  }

  // Regenerate for installed skills
  const installedSkillsDir = path.join(REPO_ROOT, '.claude/skills');
  if (fs.existsSync(installedSkillsDir)) {
    log.info('Regenerating .claude/skills/skill-index.json');
    log.dryRun(`  node generate-skill-index.cjs ${path.relative(REPO_ROOT, installedSkillsDir)}`);

    if (!DRY_RUN) {
      try {
        execSync(`node "${scriptPath}" "${installedSkillsDir}"`, {
          cwd: REPO_ROOT,
          timeout: 30000,
          encoding: 'utf8'
        });
        log.success('  Global index regenerated');
      } catch (error) {
        log.error(`  Failed: ${error.message}`);
      }
    }
  }
}

/**
 * Reinstall to .claude/skills/
 */
function reinstallToClaudeSkills() {
  log.info('\nReinstalling to .claude/skills/...\n');

  const claudeSkillsDir = path.join(REPO_ROOT, '.claude/skills');
  const packagesDir = path.join(REPO_ROOT, 'packages');

  log.dryRun(`rm -rf .claude/skills/`);
  log.dryRun(`mkdir -p .claude/skills/`);

  if (!DRY_RUN) {
    // Remove old
    if (fs.existsSync(claudeSkillsDir)) {
      fs.rmSync(claudeSkillsDir, { recursive: true, force: true });
    }
    fs.mkdirSync(claudeSkillsDir, { recursive: true });

    // Copy all package skills
    const packages = fs.readdirSync(packagesDir)
      .filter(name => fs.statSync(path.join(packagesDir, name)).isDirectory());

    let copiedCount = 0;

    for (const pkgName of packages) {
      const pkgSkillsDir = path.join(packagesDir, pkgName, 'skills');
      if (!fs.existsSync(pkgSkillsDir)) continue;

      const skillDirs = fs.readdirSync(pkgSkillsDir)
        .filter(name => {
          const skillPath = path.join(pkgSkillsDir, name);
          return fs.statSync(skillPath).isDirectory();
        });

      for (const skillName of skillDirs) {
        const srcPath = path.join(pkgSkillsDir, skillName);
        const destPath = path.join(claudeSkillsDir, skillName);

        log.verbose(`  Copying ${pkgName}/${skillName}`);
        fs.cpSync(srcPath, destPath, { recursive: true });
        copiedCount++;
      }
    }

    log.success(`Copied ${copiedCount} skills from ${packages.length} packages`);

    // Regenerate global index
    const scriptPath = path.join(REPO_ROOT, 'packages/core/scripts/generate-skill-index.cjs');
    if (fs.existsSync(scriptPath)) {
      try {
        log.verbose('Regenerating global index...');
        execSync(`node "${scriptPath}" "${claudeSkillsDir}"`, {
          cwd: REPO_ROOT,
          timeout: 30000,
          encoding: 'utf8'
        });
        log.success('Global skill-index.json generated');
      } catch (error) {
        log.error(`Failed to generate global index: ${error.message}`);
      }
    }
  }
}

/**
 * Print stats
 */
function printStats() {
  console.log('\n' + '='.repeat(60));
  console.log('Flattening Summary');
  console.log('='.repeat(60));
  console.log(`Directories flattened: ${stats.directoriesFlattened}`);
  console.log(`Category dirs removed: ${stats.categoryDirsRemoved}`);

  if (DRY_RUN) {
    console.log('\n⚠ DRY-RUN MODE - No changes made');
  } else {
    console.log('\n✓ Flattening complete');
  }
}

/**
 * Main execution
 */
function main() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║   Skill Directory Flattening - agentskills.io        ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  if (DRY_RUN) {
    log.warn('Running in DRY-RUN mode (preview only)\n');
  }

  // Execute flattening
  flattenDirectories();

  // Update package.yaml
  updateUiUxPackageYaml();

  // Regenerate indices
  regenerateSkillIndices();

  // Remove empty categories
  removeEmptyCategories();

  // Reinstall
  reinstallToClaudeSkills();

  // Print summary
  printStats();
}

// Run
main();
