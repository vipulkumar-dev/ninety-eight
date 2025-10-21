#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

class JavaScriptBundler {
  constructor() {
    this.processedFiles = new Set();
    this.functionDeclarations = new Map();
  }

  /**
   * Parse import statements from a file
   * @param {string} content - File content
   * @returns {Array} Array of import objects
   */
  parseImports(content) {
    const importRegex = /import\s*{([^}]+)}\s*from\s*["']([^"']+)["']/g;
    const imports = [];
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      const functionNames = match[1]
        .split(",")
        .map((name) => name.trim())
        .filter((name) => name.length > 0);

      imports.push({
        functions: functionNames,
        from: match[2],
      });
    }

    return imports;
  }

  /**
   * Read and parse a JavaScript file
   * @param {string} filePath - Path to the file
   * @returns {string} File content
   */
  readFile(filePath) {
    try {
      return fs.readFileSync(filePath, "utf8");
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error.message);
      return "";
    }
  }

  /**
   * Extract function declarations from a file
   * @param {string} content - File content
   * @returns {Map} Map of function names to their declarations
   */
  extractFunctionDeclarations(content) {
    const functions = new Map();

    // Match export function declarations
    const exportFunctionRegex =
      /export\s+function\s+(\w+)\s*\([^)]*\)\s*{[\s\S]*?^}/gm;
    let match;

    while ((match = exportFunctionRegex.exec(content)) !== null) {
      const functionName = match[1];
      const functionBody = match[0].replace(/^export\s+/, "");
      functions.set(functionName, functionBody);
    }

    // Match export const arrow functions
    const exportConstRegex =
      /export\s+const\s+(\w+)\s*=\s*(\([^)]*\)\s*=>\s*{[\s\S]*?^})/gm;
    while ((match = exportConstRegex.exec(content)) !== null) {
      const functionName = match[1];
      const functionBody = `function ${functionName}${match[2]}`;
      functions.set(functionName, functionBody);
    }

    return functions;
  }

  /**
   * Resolve import path to actual file path
   * @param {string} importPath - Import path from the file
   * @param {string} currentFile - Current file path
   * @returns {string} Resolved file path
   */
  resolveImportPath(importPath, currentFile) {
    const currentDir = path.dirname(currentFile);

    if (importPath.startsWith("./") || importPath.startsWith("../")) {
      return path.resolve(currentDir, importPath);
    } else {
      // Handle absolute imports from project root
      return path.resolve(process.cwd(), importPath);
    }
  }

  /**
   * Process a file and its dependencies
   * @param {string} filePath - Path to the main file
   * @returns {string} Bundled code
   */
  bundle(filePath) {
    const resolvedPath = path.resolve(filePath);

    if (this.processedFiles.has(resolvedPath)) {
      return "";
    }

    this.processedFiles.add(resolvedPath);

    const content = this.readFile(resolvedPath);
    if (!content) {
      return "";
    }

    // Parse imports
    const imports = this.parseImports(content);

    // Process each import
    let bundledCode = "";
    for (const importObj of imports) {
      const resolvedImportPath = this.resolveImportPath(
        importObj.from,
        resolvedPath
      );
      const importContent = this.readFile(resolvedImportPath);

      if (importContent) {
        const functions = this.extractFunctionDeclarations(importContent);

        // Add only the requested functions
        for (const functionName of importObj.functions) {
          if (functions.has(functionName)) {
            this.functionDeclarations.set(
              functionName,
              functions.get(functionName)
            );
            bundledCode += functions.get(functionName) + "\n\n";
          }
        }
      }
    }

    // Remove import statements from the main file
    const contentWithoutImports = content.replace(
      /import\s*{[^}]+}\s*from\s*["'][^"']+["'];\s*\n?/g,
      ""
    );

    // Combine bundled functions with main file content
    return bundledCode + contentWithoutImports;
  }

  /**
   * Bundle a file and save the result
   * @param {string} inputFile - Input file path
   * @param {string} outputFile - Output file path (optional)
   */
  bundleFile(inputFile, outputFile = null) {
    console.log(`Bundling ${inputFile}...`);

    const bundledCode = this.bundle(inputFile);

    if (!outputFile) {
      const parsedPath = path.parse(inputFile);
      outputFile = path.join(
        parsedPath.dir,
        `${parsedPath.name}.bundle${parsedPath.ext}`
      );
    }

    fs.writeFileSync(outputFile, bundledCode);
    console.log(`Bundled code saved to: ${outputFile}`);

    return bundledCode;
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Usage: node bundler.js <input-file> [output-file]");
    console.log(
      "Example: node bundler.js cashflow/index.js cashflow/index.bundle.js"
    );
    process.exit(1);
  }

  const inputFile = args[0];
  const outputFile = args[1] || null;

  const bundler = new JavaScriptBundler();
  bundler.bundleFile(inputFile, outputFile);
}

module.exports = JavaScriptBundler;
