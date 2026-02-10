#!/usr/bin/env node
/**
 * Skill Migration Script - agentskills.io Compliance
 *
 * Migrates all epost-kit skills to compliant structure:
 * - Move aspect files from root to references/
 * - Move .json files to assets/
 * - Flatten skill names (/ → -)
 * - Flatten skill directories (name must match parent dir)
 * - Update all references (package.yaml, agents, SKILL.md)
 * - Regenerate skill-index.json
 * - Reinstall to .claude/skills/
 *
 * Usage:
 *   node scripts/migrate-skills.mjs                 # Execute migration
 *   node scripts/migrate-skills.mjs --dry-run       # Preview changes
 *   node scripts/migrate-skills.mjs --verbose       # Detailed logging
 *
 * CWD: Must run from epost-agent-kit/ root
 * Audit: ../agent-kit/plans/260209-2203-skill-migration-no-cli-changes/reports/audit-results.json
 *
 * Updated: 2026-02-10 - Added directory flattening for agentskills.io compliance
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
const AUDIT_PATH = path.resolve(REPO_ROOT, '..', 'plans/260209-2203-skill-migration-no-cli-changes/reports/audit-results.json');

// Name mapping corrections (audit JSON → target-structure.md)
const NAME_OVERRIDES = {
  'knowledge-android-theme': 'muji-android-theme',
  'knowledge-ios-theme': 'muji-ios-theme'
};

// Directory flattening targets (agentskills.io compliance: name must match parent directory)
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

// Logging
const log = {
  info: (msg) => console.log(`ℹ ${msg}`),
  success: (msg) => console.log(`✓ ${msg}`),
  warn: (msg) => console.warn(`⚠ ${msg}`),
  error: (msg) => console.error(`✗ ${msg}`),
  verbose: (msg) => VERBOSE && console.log(`  ${msg}`),
  dryRun: (msg) => DRY_RUN && console.log(`[DRY-RUN] ${msg}`)
};

// Stats tracking
const stats = {
  filesMoved: 0,
  dirsCreated: 0,
  nameChanges: 0,
  packageYamlsUpdated: 0,
  agentsUpdated: 0,
  skillsProcessed: 0,
  directoriesFlattened: 0,
  categoryDirsRemoved: 0
};

/**
 * Load audit JSON
 */
function loadAudit() {
  log.info(`Loading audit from: ${path.relative(REPO_ROOT, AUDIT_PATH)}`);

  if (!fs.existsSync(AUDIT_PATH)) {
    log.error(`Audit file not found: ${AUDIT_PATH}`);
    process.exit(1);
  }

  const content = fs.readFileSync(AUDIT_PATH, 'utf8');
  const audit = JSON.parse(content);

  log.success(`Loaded ${audit.skills.length} skills from audit`);
  log.verbose(`Summary: ${JSON.stringify(audit.summary, null, 2)}`);

  return audit;
}

/**
 * Migrate files for a single skill
 */
function migrateSkillFiles(skill) {
  const skillPath = path.join(REPO_ROOT, 'packages', skill.path);

  if (!fs.existsSync(skillPath)) {
    log.warn(`Skill path not found: ${skill.path}`);
    return;
  }

  log.info(`Migrating: ${skill.name} (${skill.classification})`);
  stats.skillsProcessed++;

  // Skip compliant and leaf-only skills
  if (skill.classification === 'compliant' || skill.classification === 'leaf-only') {
    log.verbose(`Skipped (${skill.classification})`);
    return;
  }

  // Handle name-fix-only (no file moves needed)
  if (skill.classification === 'needs-name-fix') {
    updateSkillMdName(skill, skillPath);
    return;
  }

  // Handle file moves (needs-file-move or needs-both)
  if (skill.aspectFiles.length > 0 || skill.nonStandardDirs.length > 0) {
    migrateAspectFiles(skill, skillPath);
  }

  // Handle non-standard directories (android special case, agents)
  if (skill.nonStandardDirs.length > 0) {
    migrateNonStandardDirs(skill, skillPath);
  }

  // Update SKILL.md (name + aspect paths)
  if (skill.classification === 'needs-both' || skill.classification === 'needs-file-move') {
    updateSkillMdPaths(skill, skillPath);
  }

  if (skill.classification === 'needs-both') {
    updateSkillMdName(skill, skillPath);
  }
}

/**
 * Migrate aspect files to references/ or assets/
 */
function migrateAspectFiles(skill, skillPath) {
  const referencesDir = path.join(skillPath, 'references');
  const assetsDir = path.join(skillPath, 'assets');

  // Create references/ dir
  if (!fs.existsSync(referencesDir)) {
    log.dryRun(`mkdir ${path.relative(REPO_ROOT, referencesDir)}`);
    if (!DRY_RUN) {
      fs.mkdirSync(referencesDir, { recursive: true });
      stats.dirsCreated++;
    }
  }

  // Move aspect files
  for (const file of skill.aspectFiles) {
    const srcPath = path.join(skillPath, file);

    if (!fs.existsSync(srcPath)) {
      log.warn(`Aspect file not found: ${file} in ${skill.path}`);
      continue;
    }

    const ext = path.extname(file);

    if (ext === '.md' && file !== 'SKILL.md') {
      // Move .md to references/
      const destPath = path.join(referencesDir, file);
      log.dryRun(`mv ${path.relative(REPO_ROOT, srcPath)} → ${path.relative(REPO_ROOT, destPath)}`);

      if (!DRY_RUN) {
        fs.renameSync(srcPath, destPath);
        stats.filesMoved++;
      }
    } else if (ext === '.json') {
      // Move .json to assets/
      if (!fs.existsSync(assetsDir)) {
        log.dryRun(`mkdir ${path.relative(REPO_ROOT, assetsDir)}`);
        if (!DRY_RUN) {
          fs.mkdirSync(assetsDir, { recursive: true });
          stats.dirsCreated++;
        }
      }

      const destPath = path.join(assetsDir, file);
      log.dryRun(`mv ${path.relative(REPO_ROOT, srcPath)} → ${path.relative(REPO_ROOT, destPath)}`);

      if (!DRY_RUN) {
        fs.renameSync(srcPath, destPath);
        stats.filesMoved++;
      }
    }
  }
}

/**
 * Migrate non-standard directories (android: patterns/ → references/, agents: mental-model/ → references/)
 */
function migrateNonStandardDirs(skill, skillPath) {
  const referencesDir = path.join(skillPath, 'references');
  const assetsDir = path.join(skillPath, 'assets');
  const scriptsDir = path.join(skillPath, 'scripts');

  for (const dirName of skill.nonStandardDirs) {
    const srcDir = path.join(skillPath, dirName);

    if (!fs.existsSync(srcDir)) {
      log.verbose(`Non-standard dir not found: ${dirName} in ${skill.path}`);
      continue;
    }

    // Check if directory is empty
    const files = fs.readdirSync(srcDir).filter(f => !f.startsWith('.'));
    if (files.length === 0) {
      log.verbose(`Skipping empty dir: ${dirName}`);
      continue;
    }

    // Determine target based on directory name
    let targetDir;
    if (dirName === 'patterns' || dirName === 'mental-model') {
      targetDir = referencesDir;
    } else if (dirName === 'templates') {
      targetDir = assetsDir;
    } else if (dirName === 'tests') {
      targetDir = scriptsDir;
    } else if (dirName === 'claude') {
      // Special case: claude/ contains nested skill directories, skip
      log.verbose(`Skipping nested skill directory: ${dirName} in ${skill.path}`);
      continue;
    } else {
      log.error(`Unknown non-standard dir: ${dirName} in ${skill.path}`);
      if (!DRY_RUN) {
        throw new Error(`Cannot determine target for non-standard dir: ${dirName}`);
      }
      continue;
    }

    // Create target dir if needed
    if (!fs.existsSync(targetDir)) {
      log.dryRun(`mkdir ${path.relative(REPO_ROOT, targetDir)}`);
      if (!DRY_RUN) {
        fs.mkdirSync(targetDir, { recursive: true });
        stats.dirsCreated++;
      }
    }

    // Move files from non-standard dir to target dir
    for (const file of files) {
      const srcPath = path.join(srcDir, file);
      const destPath = path.join(targetDir, file);

      log.dryRun(`mv ${path.relative(REPO_ROOT, srcPath)} → ${path.relative(REPO_ROOT, destPath)}`);

      if (!DRY_RUN) {
        fs.renameSync(srcPath, destPath);
        stats.filesMoved++;
      }
    }

    // Remove empty non-standard dir
    log.dryRun(`rmdir ${path.relative(REPO_ROOT, srcDir)}`);
    if (!DRY_RUN) {
      fs.rmdirSync(srcDir);
    }
  }
}

/**
 * Update SKILL.md name field
 */
function updateSkillMdName(skill, skillPath) {
  if (skill.nameCompliant) {
    log.verbose(`Name already compliant: ${skill.name}`);
    return;
  }

  const skillMdPath = path.join(skillPath, 'SKILL.md');

  if (!fs.existsSync(skillMdPath)) {
    log.warn(`SKILL.md not found: ${skillMdPath}`);
    return;
  }

  let content = fs.readFileSync(skillMdPath, 'utf8');

  // Apply name override if needed
  const newName = NAME_OVERRIDES[skill.proposedName] || skill.proposedName;

  // Replace name field in frontmatter
  const nameRegex = /^name:\s*(.+)$/m;
  const match = content.match(nameRegex);

  if (match) {
    const oldName = match[1].trim();
    log.dryRun(`Update ${skill.name}: name: ${oldName} → name: ${newName}`);

    if (!DRY_RUN) {
      content = content.replace(nameRegex, `name: ${newName}`);
      fs.writeFileSync(skillMdPath, content, 'utf8');
      stats.nameChanges++;
    }
  } else {
    log.warn(`Name field not found in SKILL.md: ${skill.path}`);
  }
}

/**
 * Update aspect file paths in SKILL.md body
 */
function updateSkillMdPaths(skill, skillPath) {
  const skillMdPath = path.join(skillPath, 'SKILL.md');

  if (!fs.existsSync(skillMdPath)) {
    return;
  }

  let content = fs.readFileSync(skillMdPath, 'utf8');
  let updated = false;

  // For each aspect file, add references/ prefix if missing
  for (const file of skill.aspectFiles) {
    if (path.extname(file) !== '.md' || file === 'SKILL.md') continue;

    const basename = path.basename(file);
    const prefixedPath = `references/${basename}`;

    // Replace bare filename with references/ prefixed path
    // Pattern: match filename not already prefixed
    const pattern = new RegExp(`(?<!references/)\\b${basename}\\b`, 'g');

    if (pattern.test(content)) {
      log.dryRun(`Update ${skill.name}: ${basename} → ${prefixedPath}`);

      if (!DRY_RUN) {
        content = content.replace(pattern, prefixedPath);
        updated = true;
      }
    }
  }

  if (updated && !DRY_RUN) {
    fs.writeFileSync(skillMdPath, content, 'utf8');
  }
}

/**
 * Update package.yaml files
 */
function updatePackageYamls(audit) {
  log.info('Updating package.yaml files...');

  const packageDirs = fs.readdirSync(path.join(REPO_ROOT, 'packages'))
    .filter(name => {
      const pkgPath = path.join(REPO_ROOT, 'packages', name);
      return fs.statSync(pkgPath).isDirectory();
    });

  for (const pkgName of packageDirs) {
    const yamlPath = path.join(REPO_ROOT, 'packages', pkgName, 'package.yaml');

    if (!fs.existsSync(yamlPath)) {
      log.verbose(`No package.yaml in ${pkgName}`);
      continue;
    }

    let content = fs.readFileSync(yamlPath, 'utf8');
    let updated = false;

    // For each skill with name change, replace in provides.skills
    for (const skill of audit.skills) {
      if (!skill.nameCompliant) {
        const oldName = skill.name;
        const newName = NAME_OVERRIDES[skill.proposedName] || skill.proposedName;

        // Match skill name in array (handles both inline and multiline)
        const pattern = new RegExp(`(skills:\\s*\\[.*?\\b)${oldName}(\\b.*?\\]|,|\\s|$)`, 's');
        const pattern2 = new RegExp(`^\\s*-\\s+${oldName}\\s*$`, 'm');

        if (pattern.test(content) || pattern2.test(content)) {
          log.dryRun(`Update ${pkgName}/package.yaml: ${oldName} → ${newName}`);

          if (!DRY_RUN) {
            content = content.replace(pattern, `$1${newName}$2`);
            content = content.replace(pattern2, `  - ${newName}`);
            updated = true;
          }
        }
      }
    }

    if (updated && !DRY_RUN) {
      fs.writeFileSync(yamlPath, content, 'utf8');
      stats.packageYamlsUpdated++;
    }
  }
}

/**
 * Update agent files
 */
function updateAgentFiles(audit) {
  log.info('Updating agent files...');

  const agentsDir = path.join(REPO_ROOT, '.claude', 'agents');

  if (!fs.existsSync(agentsDir)) {
    log.warn('Agents directory not found');
    return;
  }

  const agentFiles = fs.readdirSync(agentsDir)
    .filter(name => name.endsWith('.md'));

  for (const fileName of agentFiles) {
    const agentPath = path.join(agentsDir, fileName);
    let content = fs.readFileSync(agentPath, 'utf8');
    let updated = false;

    // For each skill with name change
    for (const skill of audit.skills) {
      if (!skill.nameCompliant) {
        const oldName = skill.name;
        const newName = NAME_OVERRIDES[skill.proposedName] || skill.proposedName;

        // Match in skills: array (both inline and multiline formats)
        const pattern1 = new RegExp(`(skills:\\s*\\[.*?\\b)${oldName}(\\b.*?\\])`, 's');
        const pattern2 = new RegExp(`^(\\s*-\\s+)${oldName}\\s*$`, 'm');

        if (pattern1.test(content) || pattern2.test(content)) {
          log.dryRun(`Update ${fileName}: ${oldName} → ${newName}`);

          if (!DRY_RUN) {
            content = content.replace(pattern1, `$1${newName}$2`);
            content = content.replace(pattern2, `$1${newName}`);
            updated = true;
          }
        }
      }
    }

    if (updated && !DRY_RUN) {
      fs.writeFileSync(agentPath, content, 'utf8');
      stats.agentsUpdated++;
    }
  }
}

/**
 * Regenerate skill-index.json (for both source and installed)
 */
function regenerateSkillIndex() {
  log.info('Regenerating skill-index.json...');

  const scriptPath = path.join(REPO_ROOT, 'packages/core/scripts/generate-skill-index.cjs');

  if (!fs.existsSync(scriptPath)) {
    log.error(`generate-skill-index.cjs not found: ${scriptPath}`);
    return;
  }

  // Generate for packages/core/skills/ (source index)
  const coreSkillsDir = path.join(REPO_ROOT, 'packages/core/skills');
  log.dryRun(`node ${path.relative(REPO_ROOT, scriptPath)} ${path.relative(REPO_ROOT, coreSkillsDir)}`);

  if (!DRY_RUN) {
    try {
      const output = execSync(`node "${scriptPath}" "${coreSkillsDir}"`, {
        cwd: REPO_ROOT,
        timeout: 30000,
        encoding: 'utf8'
      });
      log.verbose(output);
      log.success('skill-index.json regenerated (source)');
    } catch (error) {
      log.error(`Failed to regenerate skill-index.json: ${error.message}`);
    }
  }
}

/**
 * Flatten skill directories to match name fields (agentskills.io compliance)
 * Spec requires: name field must match parent directory name
 */
function flattenSkillDirectories() {
  log.info('Flattening skill directories...');

  for (const target of FLATTEN_TARGETS) {
    const fromPath = path.join(REPO_ROOT, 'packages', target.package, 'skills', target.from);
    const toPath = path.join(REPO_ROOT, 'packages', target.package, 'skills', target.to);

    if (!fs.existsSync(fromPath)) {
      log.warn(`Source not found: ${target.from} in ${target.package}`);
      continue;
    }

    if (fs.existsSync(toPath)) {
      log.warn(`Destination exists: ${target.to} in ${target.package} (skipping)`);
      continue;
    }

    log.dryRun(`mv ${target.package}/skills/${target.from} → ${target.package}/skills/${target.to}`);

    if (!DRY_RUN) {
      // Ensure parent directory exists
      const parentDir = path.dirname(toPath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }

      // Move directory
      fs.renameSync(fromPath, toPath);
      stats.directoriesFlattened++;
      log.success(`Flattened: ${target.package}/skills/${target.to}`);
    }
  }

  // Remove empty category directories
  const emptyCategories = [
    'packages/arch-cloud/skills/arch',
    'packages/platform-backend/skills/backend',
    'packages/domain-b2b/skills/domain',
    'packages/domain-b2c/skills/domain',
    'packages/ui-ux/skills/muji',
    'packages/rag-ios/skills/rag',
    'packages/rag-web/skills/rag'
  ];

  for (const categoryPath of emptyCategories) {
    const fullPath = path.join(REPO_ROOT, categoryPath);

    if (!fs.existsSync(fullPath)) {
      log.verbose(`Category dir already removed: ${categoryPath}`);
      continue;
    }

    // Check if empty
    const files = fs.readdirSync(fullPath).filter(f => !f.startsWith('.'));
    if (files.length > 0) {
      log.warn(`Category dir not empty: ${categoryPath} (${files.length} files)`);
      continue;
    }

    log.dryRun(`rmdir ${categoryPath}`);

    if (!DRY_RUN) {
      fs.rmdirSync(fullPath);
      stats.categoryDirsRemoved++;
      log.verbose(`Removed empty: ${categoryPath}`);
    }
  }
}

/**
 * Reinstall to .claude/skills/
 */
function reinstallToClaudeSkills() {
  log.info('Reinstalling to .claude/skills/...');

  const claudeSkillsDir = path.join(REPO_ROOT, '.claude/skills');
  const packagesDir = path.join(REPO_ROOT, 'packages');

  log.dryRun(`rm -rf ${path.relative(REPO_ROOT, claudeSkillsDir)}`);
  log.dryRun(`mkdir -p ${path.relative(REPO_ROOT, claudeSkillsDir)}`);

  if (!DRY_RUN) {
    // Remove old .claude/skills/
    if (fs.existsSync(claudeSkillsDir)) {
      fs.rmSync(claudeSkillsDir, { recursive: true, force: true });
    }
    fs.mkdirSync(claudeSkillsDir, { recursive: true });

    // Copy each package's skills/ to .claude/skills/
    const packages = fs.readdirSync(packagesDir)
      .filter(name => {
        const pkgPath = path.join(packagesDir, name);
        return fs.statSync(pkgPath).isDirectory();
      });

    for (const pkgName of packages) {
      const pkgSkillsDir = path.join(packagesDir, pkgName, 'skills');

      if (!fs.existsSync(pkgSkillsDir)) continue;

      // Copy skill directories
      const skillDirs = fs.readdirSync(pkgSkillsDir)
        .filter(name => {
          const skillPath = path.join(pkgSkillsDir, name);
          return fs.statSync(skillPath).isDirectory() || name === 'SKILL.md';
        });

      for (const skillName of skillDirs) {
        const srcPath = path.join(pkgSkillsDir, skillName);
        const destPath = path.join(claudeSkillsDir, skillName);

        log.verbose(`Copying ${pkgName}/${skillName} → .claude/skills/${skillName}`);

        fs.cpSync(srcPath, destPath, { recursive: true });
      }
    }

    log.success(`Reinstalled ${packages.length} package skills to .claude/skills/`);

    // Regenerate skill-index.json for .claude/skills/ (global index)
    const scriptPath = path.join(REPO_ROOT, 'packages/core/scripts/generate-skill-index.cjs');
    if (fs.existsSync(scriptPath)) {
      try {
        log.verbose('Regenerating global skill-index.json for .claude/skills/');
        const output = execSync(`node "${scriptPath}" "${claudeSkillsDir}"`, {
          cwd: REPO_ROOT,
          timeout: 30000,
          encoding: 'utf8'
        });
        log.verbose(output);
        log.success('Global skill-index.json generated');
      } catch (error) {
        log.error(`Failed to generate global index: ${error.message}`);
      }
    }
  }
}

/**
 * Print final stats
 */
function printStats() {
  console.log('\n' + '='.repeat(60));
  console.log('Migration Summary');
  console.log('='.repeat(60));
  console.log(`Skills processed: ${stats.skillsProcessed}`);
  console.log(`Files moved: ${stats.filesMoved}`);
  console.log(`Directories created: ${stats.dirsCreated}`);
  console.log(`Name changes: ${stats.nameChanges}`);
  console.log(`Directories flattened: ${stats.directoriesFlattened}`);
  console.log(`Category dirs removed: ${stats.categoryDirsRemoved}`);
  console.log(`package.yaml updated: ${stats.packageYamlsUpdated}`);
  console.log(`Agent files updated: ${stats.agentsUpdated}`);

  if (DRY_RUN) {
    console.log('\n⚠ DRY-RUN MODE - No changes made');
  } else {
    console.log('\n✓ Migration complete');
  }
}

/**
 * Main execution
 */
function main() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║   Skill Migration Script - agentskills.io Compliance ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  if (DRY_RUN) {
    log.warn('Running in DRY-RUN mode (preview only)');
  }

  // Load audit
  const audit = loadAudit();

  // Migrate each skill
  log.info('Starting skill migration...\n');
  for (const skill of audit.skills) {
    migrateSkillFiles(skill);
  }

  // Update cascading references
  console.log();
  updatePackageYamls(audit);
  updateAgentFiles(audit);

  // Regenerate skill index
  console.log();
  regenerateSkillIndex();

  // Flatten skill directories (agentskills.io compliance)
  console.log();
  flattenSkillDirectories();

  // Reinstall to .claude/skills/
  console.log();
  reinstallToClaudeSkills();

  // Print summary
  printStats();
}

// Run
main();
