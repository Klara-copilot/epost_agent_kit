#!/bin/bash
# validate-skill.sh — Validate a single SKILL.md against agentskills.io spec
#
# Usage:
#   ./scripts/validate-skill.sh <skill-directory>
#
# Output (machine-readable for validate-all-skills.sh):
#   Skill: <name>
#   Path: <dir>
#   Errors: <n>
#   Warnings: <n>
#   ERROR: <message>
#   WARNING: <message>
#
# Exit codes:
#   0 — passed (0 errors; warnings are OK)
#   1 — failed (1+ errors)

SKILL_DIR="$1"
SKILL_FILE="$SKILL_DIR/SKILL.md"

ERRORS=0
WARNINGS=0
MESSAGES=()

# ─── Allowed agentskills.io standard fields ───────────────────────────────────
SPEC_FIELDS=("name" "description" "license" "compatibility" "metadata" "allowed-tools")

# epost-kit Claude Code runtime extensions — intentional, allowlisted (not warned)
EPOST_EXTENSIONS=("user-invocable" "disable-model-invocation" "context" "agent"
                  "keywords" "platforms" "triggers" "agent-affinity")

# ─── Helper: extract frontmatter (between first pair of ---) ─────────────────
extract_frontmatter() {
  awk '/^---/{found++; if(found==1){next}; if(found==2){exit}} found==1{print}' "$SKILL_FILE"
}

# ─── Helper: extract body (everything after closing ---) ─────────────────────
extract_body() {
  awk '/^---/{found++; if(found==2){skip=1; next}} skip{print}' "$SKILL_FILE"
}

# ─── Check SKILL.md exists ────────────────────────────────────────────────────
if [ ! -f "$SKILL_FILE" ]; then
  MESSAGES+=("ERROR: SKILL.md not found in $SKILL_DIR")
  ERRORS=$((ERRORS + 1))
  # Cannot proceed further
  echo "Skill: (unknown)"
  echo "Path: $SKILL_DIR"
  echo "Errors: $ERRORS"
  echo "Warnings: $WARNINGS"
  for msg in "${MESSAGES[@]}"; do echo "$msg"; done
  exit 1
fi

# ─── Parse frontmatter fields ─────────────────────────────────────────────────
FRONTMATTER=$(extract_frontmatter)

get_field() {
  echo "$FRONTMATTER" | grep "^$1:" | head -1 | sed "s/^$1:[[:space:]]*//" | sed 's/^"//' | sed 's/"$//'
}

NAME=$(get_field "name")
DESCRIPTION=$(get_field "description")

# ─── Required: name ───────────────────────────────────────────────────────────
if [ -z "$NAME" ]; then
  MESSAGES+=("ERROR: 'name' field is missing")
  ERRORS=$((ERRORS + 1))
fi

# ─── Required: description ────────────────────────────────────────────────────
if [ -z "$DESCRIPTION" ]; then
  MESSAGES+=("ERROR: 'description' field is missing")
  ERRORS=$((ERRORS + 1))
fi

# ─── name max length (64 chars) ───────────────────────────────────────────────
if [ -n "$NAME" ] && [ ${#NAME} -gt 64 ]; then
  MESSAGES+=("ERROR: 'name' exceeds 64 characters (${#NAME} chars): $NAME")
  ERRORS=$((ERRORS + 1))
fi

# ─── description max length (1024 chars) ─────────────────────────────────────
if [ -n "$DESCRIPTION" ] && [ ${#DESCRIPTION} -gt 1024 ]; then
  MESSAGES+=("ERROR: 'description' exceeds 1024 characters (${#DESCRIPTION} chars)")
  ERRORS=$((ERRORS + 1))
fi

# ─── Non-standard top-level fields ────────────────────────────────────────────
# Extract all field names from frontmatter (lines like "key: value" or "key:")
while IFS= read -r line; do
  # Match lines that start with a field key (not list items or continuation)
  field_key=$(echo "$line" | grep -E "^[a-z][a-z0-9_-]*:" | sed 's/:.*//')
  if [ -z "$field_key" ]; then continue; fi

  # Check if it's a spec-defined field
  is_spec=false
  for sf in "${SPEC_FIELDS[@]}"; do
    if [ "$field_key" = "$sf" ]; then is_spec=true; break; fi
  done
  [ "$is_spec" = true ] && continue

  # Check if it's an allowlisted epost-kit extension
  is_ext=false
  for ef in "${EPOST_EXTENSIONS[@]}"; do
    if [ "$field_key" = "$ef" ]; then is_ext=true; break; fi
  done
  [ "$is_ext" = true ] && continue

  # Unknown field — warn
  MESSAGES+=("WARNING: Non-standard top-level field '$field_key' (not in agentskills.io spec; consider metadata.$field_key)")
  WARNINGS=$((WARNINGS + 1))
done <<< "$FRONTMATTER"

# ─── SKILL.md body line count (>500 = warning) ────────────────────────────────
BODY_LINES=$(extract_body | wc -l | xargs)
if [ "$BODY_LINES" -gt 500 ]; then
  MESSAGES+=("WARNING: SKILL.md body is $BODY_LINES lines (>500 recommended — consider splitting into references/)")
  WARNINGS=$((WARNINGS + 1))
fi

# ─── Output ───────────────────────────────────────────────────────────────────
echo "Skill: ${NAME:-unknown}"
echo "Path: $SKILL_DIR"
echo "Errors: $ERRORS"
echo "Warnings: $WARNINGS"
for msg in "${MESSAGES[@]}"; do echo "$msg"; done

# ─── Exit ─────────────────────────────────────────────────────────────────────
if [ "$ERRORS" -gt 0 ]; then
  exit 1
fi
exit 0
