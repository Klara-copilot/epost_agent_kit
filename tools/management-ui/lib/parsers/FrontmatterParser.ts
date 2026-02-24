/**
 * Parser for Markdown files with YAML frontmatter
 * Used to parse agent, skill, and command definition files
 */

import matter from 'gray-matter';
import { readFileSync } from 'fs';

export interface ParsedFrontmatter<T> {
  frontmatter: T;
  body: string;
  path: string;
}

/**
 * Generic frontmatter parser for .md files with YAML frontmatter
 */
export class FrontmatterParser {
  /**
   * Parse a markdown file with YAML frontmatter
   * @param filePath - Absolute path to the .md file
   * @returns Parsed frontmatter and body content
   */
  parse<T = Record<string, unknown>>(filePath: string): ParsedFrontmatter<T> {
    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);

      return {
        frontmatter: data as T,
        body: content,
        path: filePath,
      };
    } catch (error) {
      throw new Error(`Failed to parse frontmatter from ${filePath}: ${error}`);
    }
  }

  /**
   * Parse just the frontmatter without the body
   * @param filePath - Absolute path to the .md file
   * @returns Parsed frontmatter only
   */
  parseFrontmatterOnly<T = Record<string, unknown>>(filePath: string): T {
    const { frontmatter } = this.parse<T>(filePath);
    return frontmatter;
  }

  /**
   * Check if a file has valid frontmatter
   * @param filePath - Absolute path to the .md file
   * @returns True if file has valid frontmatter
   */
  hasValidFrontmatter(filePath: string): boolean {
    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      return matter.test(fileContent);
    } catch {
      return false;
    }
  }
}

export const frontmatterParser = new FrontmatterParser();
