#!/usr/bin/env python3
"""
Add (ePost) prefix and remove emojis from agent/command descriptions.

Usage:
    python3 scripts/add-epost-prefix.py --dry-run    # Preview changes
    python3 scripts/add-epost-prefix.py              # Apply changes
"""

import re
import sys
from pathlib import Path
from typing import List, Tuple

def find_all_files() -> Tuple[List[Path], List[Path]]:
    """Find all agent and command markdown files."""
    agent_patterns = [
        ".claude/agents/**/*.md",
        "packages/*/agents/**/*.md"
    ]
    command_patterns = [
        ".claude/commands/**/*.md",
        "packages/*/commands/**/*.md"
    ]

    agents = []
    for pattern in agent_patterns:
        agents.extend(Path(".").glob(pattern))

    commands = []
    for pattern in command_patterns:
        commands.extend(Path(".").glob(pattern))

    return sorted(agents), sorted(commands)

def process_file(filepath: Path, dry_run: bool = False) -> Tuple[bool, str]:
    """
    Process a single file to add (ePost) prefix and remove emojis.

    Returns: (changed, status_message)
    """
    try:
        content = filepath.read_text(encoding='utf-8')
    except Exception as e:
        return False, f"ERROR reading: {e}"

    # Find description in YAML frontmatter
    # Match: description: <text>
    pattern = r'^description:\s*(.+)$'

    def transform_description(match):
        desc = match.group(1).strip()

        # Skip if already has (ePost) prefix
        if desc.startswith('(ePost)'):
            return match.group(0)

        # Remove all ⚡ emojis
        desc_clean = desc.replace('⚡', '').strip()

        # Add (ePost) prefix
        return f'description: (ePost) {desc_clean}'

    # Apply transformation
    new_content, count = re.subn(
        pattern,
        transform_description,
        content,
        count=1,  # Only first occurrence (in frontmatter)
        flags=re.MULTILINE
    )

    if count == 0:
        return False, "No description field found"

    if new_content == content:
        return False, "No changes needed"

    if not dry_run:
        filepath.write_text(new_content, encoding='utf-8')
        return True, "Updated"
    else:
        # Show diff for dry-run
        old_desc = re.search(pattern, content, re.MULTILINE)
        new_desc = re.search(pattern, new_content, re.MULTILINE)
        if old_desc and new_desc:
            return True, f"\n  OLD: {old_desc.group(0)}\n  NEW: {new_desc.group(0)}"
        return True, "Would update"

def main():
    dry_run = '--dry-run' in sys.argv

    print(f"{'[DRY RUN] ' if dry_run else ''}Adding (ePost) prefix and removing emojis...")
    print()

    agents, commands = find_all_files()

    print(f"Found {len(agents)} agent files")
    print(f"Found {len(commands)} command files")
    print(f"Total: {len(agents) + len(commands)} files")
    print()

    if dry_run:
        print("=" * 60)
        print("DRY RUN - No files will be modified")
        print("=" * 60)
        print()

    updated_count = 0
    skipped_count = 0
    error_count = 0

    all_files = list(agents) + list(commands)

    for i, filepath in enumerate(all_files, 1):
        changed, status = process_file(filepath, dry_run=dry_run)

        if changed:
            updated_count += 1
            if dry_run:
                print(f"[{i}/{len(all_files)}] {filepath}{status}")
            else:
                print(f"[{i}/{len(all_files)}] ✓ {filepath}")
        elif "ERROR" in status:
            error_count += 1
            print(f"[{i}/{len(all_files)}] ✗ {filepath}: {status}")
        else:
            skipped_count += 1
            # print(f"[{i}/{len(all_files)}] - {filepath}: {status}")

    print()
    print("=" * 60)
    print(f"{'DRY RUN ' if dry_run else ''}SUMMARY")
    print("=" * 60)
    print(f"Total files: {len(all_files)}")
    print(f"Updated: {updated_count}")
    print(f"Skipped: {skipped_count}")
    print(f"Errors: {error_count}")

    if dry_run:
        print()
        print("Run without --dry-run to apply changes")

    sys.exit(0 if error_count == 0 else 1)

if __name__ == '__main__':
    main()
