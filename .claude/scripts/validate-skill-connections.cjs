#!/usr/bin/env node
/**
 * Validate skill connections in skill-index.json
 * Checks: circular requires/extends, max extends depth, existence, symmetric conflicts
 */

const fs = require('fs');
const path = require('path');

const INDEX_FILE = process.argv[2] || path.join(__dirname, '../skills/skill-index.json');
const index = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf-8'));
const skillMap = new Map(index.skills.map(s => [s.name, s]));
const errors = [];

// Check all referenced skills exist
for (const skill of index.skills) {
  for (const type of ['extends', 'requires', 'enhances', 'conflicts']) {
    for (const ref of skill.connections[type] || []) {
      if (!skillMap.has(ref)) {
        errors.push(`${skill.name} ${type} unknown skill "${ref}"`);
      }
    }
  }
}

// Check no circular requires/extends chains (DFS)
function detectCycle(start, type) {
  const visited = new Set();
  const stack = [start];
  while (stack.length) {
    const name = stack.pop();
    if (visited.has(name)) {
      if (name === start) return true;
      continue;
    }
    visited.add(name);
    const skill = skillMap.get(name);
    if (skill) {
      for (const ref of skill.connections[type] || []) {
        stack.push(ref);
      }
    }
  }
  return false;
}

for (const skill of index.skills) {
  for (const type of ['extends', 'requires']) {
    if ((skill.connections[type] || []).length > 0 && detectCycle(skill.name, type)) {
      errors.push(`Circular ${type} chain detected involving "${skill.name}"`);
    }
  }
}

// Check max 3-hop extends depth
function extendsDepth(name, depth = 0) {
  if (depth > 3) return depth;
  const skill = skillMap.get(name);
  if (!skill || !skill.connections.extends.length) return depth;
  return Math.max(...skill.connections.extends.map(ref => extendsDepth(ref, depth + 1)));
}

for (const skill of index.skills) {
  const depth = extendsDepth(skill.name);
  if (depth > 3) {
    errors.push(`Extends chain too deep (${depth} hops) starting from "${skill.name}"`);
  }
}

// Check conflicts are symmetric (A conflicts B → B conflicts A)
for (const skill of index.skills) {
  for (const ref of skill.connections.conflicts || []) {
    const other = skillMap.get(ref);
    if (other && !(other.connections.conflicts || []).includes(skill.name)) {
      errors.push(`Asymmetric conflict: "${skill.name}" conflicts "${ref}" but not vice versa`);
    }
  }
}

// Report
if (errors.length === 0) {
  console.log(`✓ All ${index.skills.length} skill connections valid`);
  process.exit(0);
} else {
  console.error(`✗ ${errors.length} connection error(s):`);
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
}
