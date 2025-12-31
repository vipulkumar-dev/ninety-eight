#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const JavaScriptBundler = require("./bundler.js");

class BuildSystem {
  constructor() {
    this.bundler = new JavaScriptBundler();
    this.buildDir = path.join(process.cwd(), "build");
  }

  /**
   * Find all index.js files in the project
   * @returns {Array} Array of file paths
   */
  findIndexFiles() {
    const indexFiles = [];
    const projectRoot = process.cwd();

    // Get all directories in the project root
    const items = fs.readdirSync(projectRoot, { withFileTypes: true });

    for (const item of items) {
      if (item.isDirectory() && !item.name.startsWith(".")) {
        const indexPath = path.join(projectRoot, item.name, "index.js");

        // Check if index.js exists in this directory
        if (fs.existsSync(indexPath)) {
          indexFiles.push({
            path: indexPath,
            folderName: item.name,
          });
        }
      }
    }

    return indexFiles;
  }

  /**
   * Create build directory if it doesn't exist
   */
  ensureBuildDir() {
    if (!fs.existsSync(this.buildDir)) {
      fs.mkdirSync(this.buildDir, { recursive: true });
      console.log("Created build directory");
    }
  }

  /**
   * Build all index.js files
   */
  buildAll() {
    console.log("🚀 Starting build process...\n");

    // Ensure build directory exists
    this.ensureBuildDir();

    // Find all index.js files
    const indexFiles = this.findIndexFiles();

    if (indexFiles.length === 0) {
      console.log("❌ No index.js files found in project directories");
      return;
    }

    console.log(`📁 Found ${indexFiles.length} index.js files:`);
    indexFiles.forEach((file) => {
      console.log(`   - ${file.folderName}/index.js`);
    });
    console.log();

    // Build each file
    let successCount = 0;
    let errorCount = 0;

    for (const file of indexFiles) {
      try {
        console.log(`📦 Bundling ${file.folderName}/index.js...`);

        // Create output filename: folderName.js
        const outputFile = path.join(this.buildDir, `${file.folderName}.js`);

        // Bundle the file
        this.bundler.bundleFile(file.path, outputFile);

        console.log(`✅ Successfully bundled: ${file.folderName}.js\n`);
        successCount++;
      } catch (error) {
        console.error(
          `❌ Error bundling ${file.folderName}/index.js:`,
          error.message
        );
        errorCount++;
      }
    }

    // Summary
    console.log("🎉 Build completed!");
    console.log(`✅ Successfully built: ${successCount} files`);
    if (errorCount > 0) {
      console.log(`❌ Failed to build: ${errorCount} files`);
    }
    console.log(`📁 Output directory: ${this.buildDir}`);
  }

  /**
   * Clean build directory
   */
  clean() {
    if (fs.existsSync(this.buildDir)) {
      fs.rmSync(this.buildDir, { recursive: true, force: true });
      console.log("🧹 Cleaned build directory");
    }
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const buildSystem = new BuildSystem();

  if (args.includes("--clean")) {
    buildSystem.clean();
  }

  buildSystem.buildAll();
}

module.exports = BuildSystem;
