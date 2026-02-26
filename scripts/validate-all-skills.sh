#!/bin/bash
# Validate All Skills - Batch agentskills.io Compliance Checker
#
# Usage:
#   ./scripts/validate-all-skills.sh                         # Check packages/ (source, default)
#   ./scripts/validate-all-skills.sh --target .claude/skills # Check generated output
#   ./scripts/validate-all-skills.sh --target both           # Check source + generated
#   ./scripts/validate-all-skills.sh --verbose               # Show full output
#   ./scripts/validate-all-skills.sh --summary               # Summary only

VERBOSE=false
SUMMARY_ONLY=false
TARGET="packages"

# Parse flags
while [[ $# -gt 0 ]]; do
  case "$1" in
    --verbose)  VERBOSE=true; shift ;;
    --summary)  SUMMARY_ONLY=true; shift ;;
    --target)   TARGET="$2"; shift 2 ;;
    *)          shift ;;
  esac
done

TOTAL=0
PASSED=0
FAILED=0
WARNINGS=0

run_validation() {
  local search_root="$1"
  local label="$2"

  echo
  echo "╔═══════════════════════════════════════════════════════╗"
  printf  "║   Batch Skill Validation - %-27s║\n" "$label"
  echo "╚═══════════════════════════════════════════════════════╝"
  echo

  # maxdepth 5 to cover both packages/ (4 levels: pkg/skills/ns/name/SKILL.md)
  # and .claude/skills/ (deeper: skills/ns/sub/name/SKILL.md)
  SKILL_DIRS=$(find "$search_root" -maxdepth 5 -name "SKILL.md" -exec dirname {} \; | sort)

  for skill_dir in $SKILL_DIRS; do
    TOTAL=$((TOTAL + 1))
    skill_name=$(basename "$skill_dir")
    package=$(echo "$skill_dir" | cut -d/ -f2)

    if [ "$VERBOSE" = true ]; then
      echo
      echo "═══════════════════════════════════════════════════════"
      ./scripts/validate-skill.sh "$skill_dir"
    else
      # Run validation and capture result
      output=$(./scripts/validate-skill.sh "$skill_dir" 2>&1)
      errors=$(echo "$output" | grep "^Errors:" | cut -d: -f2 | xargs)
      warns=$(echo "$output" | grep "^Warnings:" | cut -d: -f2 | xargs)

      if [ "$errors" -eq 0 ]; then
        PASSED=$((PASSED + 1))
        if [ "$warns" -gt 0 ]; then
          WARNINGS=$((WARNINGS + warns))
          echo "⚠ $skill_name ($package) - PASS with $warns warning(s)"
          if [ "$SUMMARY_ONLY" = false ]; then
            echo "$output" | grep "WARNING:" | sed 's/^/  /'
          fi
        else
          if [ "$SUMMARY_ONLY" = false ]; then
            echo "✓ $skill_name ($package) - PASS"
          fi
        fi
      else
        FAILED=$((FAILED + 1))
        echo "✗ $skill_name ($package) - FAIL ($errors errors, $warns warnings)"
        if [ "$SUMMARY_ONLY" = false ]; then
          echo "$output" | grep "ERROR:" | sed 's/^/  /'
        fi
      fi
    fi
  done
}

# Run validation on selected targets
case "$TARGET" in
  packages)
    run_validation "packages" "agentskills.io (source)"
    ;;
  .claude/skills)
    run_validation ".claude/skills" "agentskills.io (generated)"
    ;;
  both)
    run_validation "packages" "agentskills.io (source)"
    run_validation ".claude/skills" "agentskills.io (generated)"
    ;;
  *)
    # Allow arbitrary path
    run_validation "$TARGET" "agentskills.io ($TARGET)"
    ;;
esac

echo
echo "═══════════════════════════════════════════════════════"
echo "  Summary"
echo "═══════════════════════════════════════════════════════"
echo
echo "Total skills checked: $TOTAL"
echo "Passed: $PASSED"
echo "Failed: $FAILED"
echo "Warnings: $WARNINGS"
echo

if [ $FAILED -eq 0 ]; then
  echo "✓ All skills are agentskills.io compliant!"
  exit 0
else
  echo "✗ $FAILED skills have compliance issues"
  exit 1
fi
