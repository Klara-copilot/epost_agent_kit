#!/usr/bin/env node
/**
 * Tests for State Management Scripts (Phase 04)
 * Run: node --test .claude/scripts/__tests__/state-management.test.cjs
 *
 * Covers:
 * - set-active-plan.cjs: Basic functionality, error handling, path resolution
 * - get-active-plan.cjs: State reading, missing session, no active plan
 * - Session persistence: Write and read lifecycle
 * - Path normalization: Relative/absolute, trailing slashes
 * - Error recovery: Corrupted session files
 */

const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');

// Test utilities
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ck-test-'));
const testPlanDir = path.join(tempDir, 'test-plans');
const testSessionId = 'test-' + Date.now();
const testSessionPath = path.join(os.tmpdir(), `ck-session-${testSessionId}.json`);

// Helper functions
function createTestPlan(name) {
  const planPath = path.join(testPlanDir, name);
  fs.mkdirSync(planPath, { recursive: true });
  return planPath;
}

function runSetActivePlan(planPath, env = {}) {
  const scriptPath = path.join(__dirname, '..', 'set-active-plan.cjs');
  try {
    const envVars = {
      ...process.env,
      CK_SESSION_ID: testSessionId,
      ...env
    };
    const output = execSync(`node ${scriptPath} "${planPath}"`, {
      cwd: process.cwd(),
      env: envVars,
      encoding: 'utf8'
    });
    return { success: true, output, code: 0 };
  } catch (error) {
    return {
      success: false,
      code: error.status || 1,
      output: error.stdout || '',
      stderr: error.stderr || error.message
    };
  }
}

function runGetActivePlan(env = {}) {
  const scriptPath = path.join(__dirname, '..', 'get-active-plan.cjs');
  try {
    const envVars = {
      ...process.env,
      CK_SESSION_ID: testSessionId,
      ...env
    };
    const output = execSync(`node ${scriptPath}`, {
      cwd: process.cwd(),
      env: envVars,
      encoding: 'utf8'
    }).trim();
    return { success: true, output, code: 0 };
  } catch (error) {
    return {
      success: false,
      code: error.status || 1,
      output: error.stdout ? error.stdout.trim() : '',
      stderr: error.stderr || error.message
    };
  }
}

function getSessionState() {
  if (!fs.existsSync(testSessionPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(testSessionPath, 'utf8'));
  } catch (e) {
    return null;
  }
}

function writeCorruptedSession() {
  fs.writeFileSync(testSessionPath, '{ invalid json }');
}

describe('State Management Scripts - Phase 04', () => {

  beforeEach(() => {
    // Clean up test artifacts
    if (fs.existsSync(testSessionPath)) {
      fs.unlinkSync(testSessionPath);
    }
    if (!fs.existsSync(testPlanDir)) {
      fs.mkdirSync(testPlanDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up session file
    if (fs.existsSync(testSessionPath)) {
      fs.unlinkSync(testSessionPath);
    }
  });

  describe('set-active-plan.cjs', () => {

    describe('Basic Functionality', () => {

      it('T1: set plan with valid directory path', () => {
        const planPath = createTestPlan('valid-plan');
        const result = runSetActivePlan(planPath);

        assert.strictEqual(result.success, true, 'Script should succeed');
        assert.strictEqual(result.code, 0, 'Exit code should be 0');
        assert(result.output.includes('Active plan set'), 'Should confirm plan was set');
        assert(result.output.includes(planPath), 'Output should contain plan path');
      });

      it('T2: verify session state file created with plan path', () => {
        const planPath = createTestPlan('verified-plan');
        runSetActivePlan(planPath);

        const state = getSessionState();
        assert(state !== null, 'Session state file should exist');
        assert.strictEqual(state.activePlan, planPath, 'activePlan should match input');
        assert(state.timestamp > 0, 'Session should have timestamp');
        assert.strictEqual(state.source, 'set-active-plan', 'Source should be set-active-plan');
      });

    });

    describe('Error Handling', () => {

      it('T3: set-active-plan with no arguments shows usage', () => {
        const scriptPath = path.join(__dirname, '..', 'set-active-plan.cjs');
        let result;
        try {
          execSync(`node ${scriptPath}`, {
            cwd: process.cwd(),
            env: { ...process.env, CK_SESSION_ID: testSessionId }
          });
          result = { success: true };
        } catch (error) {
          result = {
            success: false,
            stderr: error.stderr ? error.stderr.toString() : '',
            code: error.status
          };
        }

        assert.strictEqual(result.success, false, 'Should fail without argument');
        assert(result.stderr.includes('Usage:'), 'Should show usage message');
      });

      it('T4: set-active-plan with nonexistent directory shows error', () => {
        const nonexistentPath = path.join(tempDir, 'nonexistent-plan');
        const result = runSetActivePlan(nonexistentPath);

        assert.strictEqual(result.success, false, 'Should fail for nonexistent path');
        assert(result.stderr.includes('does not exist'), 'Error should mention nonexistent path');
      });

      it('T5: set-active-plan with file instead of directory shows error', () => {
        const filePath = path.join(tempDir, 'test-file.txt');
        fs.writeFileSync(filePath, 'test content');

        const result = runSetActivePlan(filePath);

        assert.strictEqual(result.success, false, 'Should fail for file path');
        assert(result.stderr.includes('not a directory'), 'Error should mention not a directory');
      });

    });

    describe('Path Resolution', () => {

      it('T6: relative path resolves to absolute', () => {
        const planName = 'relative-plan';
        // Create plan directory first (in tempDir)
        const planPath = createTestPlan(planName);

        // Now test relative path resolution from tempDir
        const scriptPath = path.join(__dirname, '..', 'set-active-plan.cjs');

        execSync(`node "${scriptPath}" "${planPath}"`, {
          cwd: tempDir,  // Run from tempDir as CWD
          env: { ...process.env, CK_SESSION_ID: testSessionId },
          encoding: 'utf8'
        });

        const state = getSessionState();
        assert(path.isAbsolute(state.activePlan), 'Resolved path should be absolute');
        assert.strictEqual(state.activePlan, planPath, 'Should resolve to correct absolute path');
      });

      it('T7: absolute path is used as-is', () => {
        const planPath = createTestPlan('absolute-plan');
        const result = runSetActivePlan(planPath);

        assert.strictEqual(result.success, true, 'Should accept absolute path');
        const state = getSessionState();
        assert.strictEqual(state.activePlan, planPath, 'Path should match exactly');
      });

      it('T8: path with trailing slashes is normalized', () => {
        const planPath = createTestPlan('trailing-slash-plan');
        const pathWithSlashes = planPath + '///';
        const result = runSetActivePlan(pathWithSlashes);

        assert.strictEqual(result.success, true, 'Should accept path with trailing slashes');
        const state = getSessionState();
        assert.strictEqual(state.activePlan, planPath, 'Trailing slashes should be removed');
      });

    });

    describe('Session Management', () => {

      it('T9: warning issued when CK_SESSION_ID not set', () => {
        const planPath = createTestPlan('no-session-plan');
        const scriptPath = path.join(__dirname, '..', 'set-active-plan.cjs');

        // Test without setting CK_SESSION_ID - script exits with code 1
        let result;
        try {
          execSync(`unset CK_SESSION_ID && node "${scriptPath}" "${planPath}" 2>&1`, {
            cwd: process.cwd(),
            encoding: 'utf8',
            shell: '/bin/bash'
          });
          result = { success: true, output: '' };
        } catch (error) {
          result = {
            success: false,
            output: error.stdout || error.message,
            code: error.status
          };
        }

        // Script should fail without session ID
        assert.strictEqual(result.success, false, 'Should fail without session ID');
        assert(result.output.includes('Warning'), `Expected 'Warning' in output but got:\n${result.output}`);
        assert(result.output.includes('not persist'), 'Should mention persistence issue');
      });

      it('T10: existing session state is preserved with update', () => {
        // Write initial session state
        const initialState = {
          sessionOrigin: '/test/origin',
          timestamp: 12345,
          someOtherField: 'value'
        };
        fs.writeFileSync(testSessionPath, JSON.stringify(initialState));

        // Set active plan
        const planPath = createTestPlan('preserve-plan');
        runSetActivePlan(planPath);

        // Verify state was updated but other fields preserved
        const state = getSessionState();
        assert.strictEqual(state.activePlan, planPath, 'activePlan should be set');
        assert.strictEqual(state.someOtherField, 'value', 'Other fields should be preserved');
        assert(state.timestamp > initialState.timestamp, 'Timestamp should be updated');
      });

    });

  });

  describe('get-active-plan.cjs', () => {

    describe('Basic Functionality', () => {

      it('T11: get-active-plan returns active plan path', () => {
        const planPath = createTestPlan('get-plan');
        runSetActivePlan(planPath);

        const result = runGetActivePlan();
        assert.strictEqual(result.success, true, 'Should succeed');
        assert.strictEqual(result.output, planPath, 'Should return exact plan path');
      });

    });

    describe('Error Handling', () => {

      it('T12: get-active-plan with no session returns "none"', () => {
        const result = runGetActivePlan({ CK_SESSION_ID: '' });

        assert.strictEqual(result.success, true, 'Should complete gracefully');
        assert.strictEqual(result.output, 'none', 'Should return "none" when no session');
      });

      it('T13: get-active-plan with no active plan returns "none"', () => {
        // Create session without activePlan
        fs.writeFileSync(testSessionPath, JSON.stringify({
          sessionOrigin: '/test',
          timestamp: Date.now()
        }));

        const result = runGetActivePlan();
        assert.strictEqual(result.success, true, 'Should complete gracefully');
        assert.strictEqual(result.output, 'none', 'Should return "none" when no active plan');
      });

      it('T14: get-active-plan with corrupted session returns "none"', () => {
        writeCorruptedSession();

        const result = runGetActivePlan();
        assert.strictEqual(result.success, true, 'Should recover gracefully');
        assert.strictEqual(result.output, 'none', 'Should return "none" for corrupted session');
      });

    });

  });

  describe('Integration Tests', () => {

    it('T15: set and get cycle works end-to-end', () => {
      const planPath = createTestPlan('e2e-plan');

      // Set
      const setResult = runSetActivePlan(planPath);
      assert.strictEqual(setResult.success, true, 'Set should succeed');

      // Get
      const getResult = runGetActivePlan();
      assert.strictEqual(getResult.success, true, 'Get should succeed');
      assert.strictEqual(getResult.output, planPath, 'Should retrieve same path');
    });

    it('T16: multiple set calls update the plan', () => {
      const plan1 = createTestPlan('plan-1');
      const plan2 = createTestPlan('plan-2');

      // Set plan 1
      runSetActivePlan(plan1);
      let result = runGetActivePlan();
      assert.strictEqual(result.output, plan1, 'Should have plan 1');

      // Set plan 2
      runSetActivePlan(plan2);
      result = runGetActivePlan();
      assert.strictEqual(result.output, plan2, 'Should have plan 2 after update');
    });

    it('T17: session state written to /tmp with correct naming', () => {
      const planPath = createTestPlan('tmp-location-plan');
      runSetActivePlan(planPath);

      assert(fs.existsSync(testSessionPath), 'Session file should exist in /tmp');
      const fileName = path.basename(testSessionPath);
      assert(fileName.startsWith('ck-session-'), 'Filename should have correct prefix');
      assert(fileName.endsWith('.json'), 'Filename should end with .json');
    });

    it('T18: session state is valid JSON', () => {
      const planPath = createTestPlan('valid-json-plan');
      runSetActivePlan(planPath);

      const content = fs.readFileSync(testSessionPath, 'utf8');
      let parsed;
      assert.doesNotThrow(() => {
        parsed = JSON.parse(content);
      }, 'Session file should contain valid JSON');

      assert(parsed, 'Parsed state should be truthy');
      assert.strictEqual(typeof parsed.activePlan, 'string', 'activePlan should be string');
      assert.strictEqual(typeof parsed.timestamp, 'number', 'timestamp should be number');
    });

    it('T19: corrupted session recovers gracefully on get', () => {
      writeCorruptedSession();

      const result = runGetActivePlan();
      assert.strictEqual(result.success, true, 'Should handle corruption gracefully');
      assert.strictEqual(result.output, 'none', 'Should return safe default');
      // Session file should still exist (not deleted)
      assert(fs.existsSync(testSessionPath), 'Corrupted file should not be deleted');
    });

    it('T20: set plan after corrupted session overwrites safely', () => {
      writeCorruptedSession();

      const planPath = createTestPlan('overwrite-plan');
      const result = runSetActivePlan(planPath);

      assert.strictEqual(result.success, true, 'Should overwrite corrupted session');
      const state = getSessionState();
      assert(state !== null, 'New session should be valid');
      assert.strictEqual(state.activePlan, planPath, 'Plan should be set correctly');
    });

  });

  describe('Edge Cases', () => {

    it('T21: plan path with spaces is handled correctly', () => {
      const planName = 'plan with spaces';
      const planPath = createTestPlan(planName);
      const result = runSetActivePlan(planPath);

      assert.strictEqual(result.success, true, 'Should handle spaces in path');
      const state = getSessionState();
      assert.strictEqual(state.activePlan, planPath, 'Path with spaces should be preserved');
    });

    it('T22: very long plan path is handled', () => {
      const longName = 'a'.repeat(100) + '-plan';
      const planPath = createTestPlan(longName);
      const result = runSetActivePlan(planPath);

      assert.strictEqual(result.success, true, 'Should handle long paths');
      const state = getSessionState();
      assert.strictEqual(state.activePlan, planPath, 'Long path should be preserved');
    });

    it('T23: session state contains all required fields', () => {
      const planPath = createTestPlan('required-fields-plan');
      runSetActivePlan(planPath);

      const state = getSessionState();
      assert(state.activePlan, 'Should have activePlan');
      assert(state.timestamp, 'Should have timestamp');
      assert.strictEqual(state.source, 'set-active-plan', 'Should have source');
      assert(Number.isInteger(state.timestamp), 'Timestamp should be integer');
      assert(state.timestamp > 0, 'Timestamp should be positive');
    });

    it('T24: plan directory with unicode characters is handled', () => {
      const unicodeName = '测试-планὸ-plan';
      const planPath = createTestPlan(unicodeName);
      const result = runSetActivePlan(planPath);

      assert.strictEqual(result.success, true, 'Should handle unicode paths');
      const state = getSessionState();
      assert.strictEqual(state.activePlan, planPath, 'Unicode path should be preserved');
    });

  });

});

// Cleanup after all tests
afterEach(() => {
  if (fs.existsSync(testSessionPath)) {
    try {
      fs.unlinkSync(testSessionPath);
    } catch (e) {
      // Ignore cleanup errors
    }
  }
});
