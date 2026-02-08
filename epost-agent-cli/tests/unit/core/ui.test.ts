/**
 * Unit tests for UI utility module
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Helper to strip ANSI escape codes for assertions
function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1b\[[0-9;]*m/g, "");
}

describe("UI Module", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    // Restore env
    process.env = { ...originalEnv };
    vi.resetModules();
  });

  async function loadUi(env: Record<string, string | undefined> = {}) {
    for (const [key, val] of Object.entries(env)) {
      if (val === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = val;
      }
    }
    // Dynamic import to pick up env changes
    return await import("../../../src/core/ui.js");
  }

  describe("box()", () => {
    it("should wrap content in a border", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const result = ui.box("Hello World");
      const lines = result.split("\n");

      // Should have top border, empty line, content, empty line, bottom border
      expect(lines.length).toBeGreaterThanOrEqual(3);
      expect(lines[0]).toContain("+");
      expect(lines[lines.length - 1]).toContain("+");
    });

    it("should include title when provided", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const result = ui.box("content", { title: "My Title" });

      expect(result).toContain("My Title");
    });

    it("should handle multi-line content", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const result = ui.box("line 1\nline 2\nline 3");
      const stripped = stripAnsi(result);

      expect(stripped).toContain("line 1");
      expect(stripped).toContain("line 2");
      expect(stripped).toContain("line 3");
    });

    it("should respect width option", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const result = ui.box("test", { width: 50 });
      const lines = result.split("\n");

      // Top border should be exactly 50 chars
      expect(lines[0].length).toBe(50);
    });
  });

  describe("divider()", () => {
    it("should return a line of characters", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const result = ui.divider("-", 20);

      expect(result).toBe("-".repeat(20));
    });

    it("should use default character in NO_COLOR mode", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const result = ui.divider(undefined, 10);

      expect(result).toBe("-".repeat(10));
    });
  });

  describe("heading()", () => {
    it("should include the text and a divider", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const result = ui.heading("Test Heading");
      const stripped = stripAnsi(result);

      expect(stripped).toContain("Test Heading");
      expect(stripped).toContain("-"); // ASCII divider in NO_COLOR
    });
  });

  describe("subheading()", () => {
    it("should return indented text", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const result = ui.subheading("Sub text");

      expect(result).toContain("Sub text");
      expect(result.startsWith("  ")).toBe(true);
    });
  });

  describe("stepHeader()", () => {
    it("should format step progress", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const result = ui.stepHeader(3, 7, "Installing");
      const stripped = stripAnsi(result);

      expect(stripped).toContain("[3/7]");
      expect(stripped).toContain("Installing");
    });

    it("should handle first and last steps", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      expect(stripAnsi(ui.stepHeader(1, 1, "Only step"))).toContain("[1/1]");
    });
  });

  describe("keyValue()", () => {
    it("should align keys and values", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const result = ui.keyValue([
        ["Name", "epost-kit"],
        ["Version", "0.1.0"],
      ]);
      const stripped = stripAnsi(result);

      expect(stripped).toContain("Name");
      expect(stripped).toContain("epost-kit");
      expect(stripped).toContain("Version");
      expect(stripped).toContain("0.1.0");
    });

    it("should respect indent option", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const result = ui.keyValue([["Key", "Value"]], { indent: 4 });

      expect(result.startsWith("    ")).toBe(true);
    });
  });

  describe("table()", () => {
    it("should render headers and rows", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const result = ui.table(
        ["Name", "Count"],
        [
          ["agents", "5"],
          ["skills", "10"],
        ],
      );
      const stripped = stripAnsi(result);

      expect(stripped).toContain("Name");
      expect(stripped).toContain("Count");
      expect(stripped).toContain("agents");
      expect(stripped).toContain("5");
      expect(stripped).toContain("skills");
      expect(stripped).toContain("10");
    });

    it("should handle empty rows", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const result = ui.table(["Header"], []);

      expect(stripAnsi(result)).toContain("Header");
    });
  });

  describe("tree()", () => {
    it("should render a flat list", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const result = ui.tree([
        { label: "core" },
        { label: "platform-web" },
      ]);
      const stripped = stripAnsi(result);

      expect(stripped).toContain("core");
      expect(stripped).toContain("platform-web");
    });

    it("should render nested children", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const result = ui.tree([
        {
          label: "core",
          children: [
            { label: "platform-web" },
            { label: "platform-ios" },
          ],
        },
      ]);
      const stripped = stripAnsi(result);

      expect(stripped).toContain("core");
      expect(stripped).toContain("platform-web");
      expect(stripped).toContain("platform-ios");
    });

    it("should include badges when provided", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const result = ui.tree([
        { label: "core", badge: "L0" },
      ]);
      const stripped = stripAnsi(result);

      expect(stripped).toContain("core");
      expect(stripped).toContain("L0");
    });

    it("should use ASCII connectors in NO_COLOR mode", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const result = ui.tree([
        { label: "first" },
        { label: "last" },
      ]);

      expect(result).toContain("|--");
      expect(result).toContain("`--");
    });
  });

  describe("badge()", () => {
    it("should wrap label in brackets", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const result = ui.badge("PASS", "success");

      expect(result).toBe("[PASS]");
    });

    it("should work for all variants in NO_COLOR", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });

      expect(ui.badge("OK", "success")).toBe("[OK]");
      expect(ui.badge("WARN", "warn")).toBe("[WARN]");
      expect(ui.badge("ERR", "error")).toBe("[ERR]");
      expect(ui.badge("INFO", "info")).toBe("[INFO]");
      expect(ui.badge("DIM", "dim")).toBe("[DIM]");
    });
  });

  describe("packageTable()", () => {
    it("should render package summaries as a table", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const result = ui.packageTable([
        { name: "core", layer: 0, agents: 11, skills: 13, commands: 24 },
        { name: "platform-web", layer: 1, agents: 1, skills: 4, commands: 2 },
      ]);
      const stripped = stripAnsi(result);

      expect(stripped).toContain("Package");
      expect(stripped).toContain("core");
      expect(stripped).toContain("platform-web");
      expect(stripped).toContain("11");
      expect(stripped).toContain("13");
    });
  });

  describe("layerDiagram()", () => {
    it("should group packages by layer", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const result = ui.layerDiagram([
        { name: "core", layer: 0, agents: 11, skills: 13, commands: 24 },
        { name: "platform-web", layer: 1, agents: 1, skills: 4, commands: 2 },
        { name: "domain-b2b", layer: 2, agents: 0, skills: 1, commands: 0 },
      ]);
      const stripped = stripAnsi(result);

      expect(stripped).toContain("Layer 0");
      expect(stripped).toContain("Foundation");
      expect(stripped).toContain("Layer 1");
      expect(stripped).toContain("Platforms");
      expect(stripped).toContain("Layer 2");
      expect(stripped).toContain("core");
      expect(stripped).toContain("platform-web");
      expect(stripped).toContain("domain-b2b");
    });

    it("should mark selected packages", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const result = ui.layerDiagram(
        [
          { name: "core", layer: 0, agents: 11, skills: 13, commands: 24 },
          { name: "platform-web", layer: 1, agents: 1, skills: 4, commands: 2 },
        ],
        new Set(["core"]),
      );
      const stripped = stripAnsi(result);

      expect(stripped).toContain("[*]");
      expect(stripped).toContain("[ ]");
      expect(stripped).toContain("[*] = installed");
    });
  });

  describe("nextSteps()", () => {
    it("should render commands in a titled box", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const result = ui.nextSteps([
        { cmd: "/plan:fast", desc: "Plan a feature" },
        { cmd: "epost-kit doctor", desc: "Check health" },
      ]);
      const stripped = stripAnsi(result);

      expect(stripped).toContain("What's Next?");
      expect(stripped).toContain("/plan:fast");
      expect(stripped).toContain("Plan a feature");
      expect(stripped).toContain("epost-kit doctor");
      expect(stripped).toContain("Check health");
    });
  });

  describe("checkResult()", () => {
    it("should format pass results", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const result = ui.checkResult("pass", "Node.js version OK");

      expect(result).toContain("[PASS]");
      expect(result).toContain("Node.js version OK");
    });

    it("should format warn results", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const result = ui.checkResult("warn", "GitHub not authenticated");

      expect(result).toContain("[WARN]");
      expect(result).toContain("GitHub not authenticated");
    });

    it("should format fail results", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const result = ui.checkResult("fail", "Missing metadata");

      expect(result).toContain("[FAIL]");
      expect(result).toContain("Missing metadata");
    });
  });

  describe("checkSummary()", () => {
    it("should show pass/warn/fail counts", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const result = ui.checkSummary(5, 1, 0);
      const stripped = stripAnsi(result);

      expect(stripped).toContain("Summary");
      expect(stripped).toContain("5 passed");
      expect(stripped).toContain("1 warning");
      expect(stripped).toContain("0 failures");
    });

    it("should pluralize correctly", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });

      const single = ui.checkSummary(1, 1, 1);
      expect(stripAnsi(single)).toContain("1 warning");
      expect(stripAnsi(single)).toContain("1 failure");

      const plural = ui.checkSummary(2, 2, 2);
      expect(stripAnsi(plural)).toContain("2 warnings");
      expect(stripAnsi(plural)).toContain("2 failures");
    });
  });

  describe("indent()", () => {
    it("should prepend spaces to each line", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const result = ui.indent("line 1\nline 2", 4);

      expect(result).toBe("    line 1\n    line 2");
    });

    it("should default to 2 spaces", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const result = ui.indent("text");

      expect(result).toBe("  text");
    });
  });

  describe("termWidth()", () => {
    it("should return a number", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const width = ui.termWidth();

      expect(typeof width).toBe("number");
      expect(width).toBeGreaterThan(0);
    });
  });

  describe("banner()", () => {
    it("should include version and tagline in NO_COLOR mode", async () => {
      const ui = await loadUi({ NO_COLOR: "1" });
      const result = ui.banner();

      expect(result).toContain("epost-kit");
      expect(result).toContain("0.1.0");
      expect(result).toContain("Multi-IDE agent framework");
    });

    it("should include ASCII logo in color mode", async () => {
      const ui = await loadUi();
      const result = ui.banner();

      expect(result).toContain("████");
      expect(result).toContain("epost-kit");
    });
  });
});
