#!/bin/bash
# Validate All Skills - Batch agentskills.io Compliance Checker
#
# Usage:
#   ./scripts/validate-all-skills.sh              # Check all packages
#   ./scripts/validate-all-skills.sh --verbose    # Show full output
#   ./scripts/validate-all-skills.sh --summary    # Summary only

VERBOSE=false
SUMMARY_ONLY=false

if [[ "$1" == "--verbose" ]]; then
  VERBOSE=true
elif [[ "$1" == "--summary" ]]; then
  SUMMARY_ONLY=true
fi

TOTAL=0
PASSED=0
FAILED=0
WARNINGS=0

echo
echo "╔═══════════════════════════════════════════════════════╗"
echo "║   Batch Skill Validation - agentskills.io            ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo

# Find all SKILL.md files
SKILL_DIRS=$(find packages -maxdepth 4 -name "SKILL.md" -exec dirname {} \; | sort)

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
        echo "⚠ $skill_name ($package) - PASS with $warns warnings"
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
