const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const sourceDistPath = path.join(rootDir, "frontend", "dist");
const targetDistPath = path.join(rootDir, "dist");

function copyDirectory(sourcePath, targetPath) {
  fs.rmSync(targetPath, { recursive: true, force: true });
  fs.cpSync(sourcePath, targetPath, { recursive: true });
}

if (!fs.existsSync(sourceDistPath)) {
  throw new Error(
    `Source dist introuvable: ${sourceDistPath}. Lancez d'abord le build frontend.`
  );
}

copyDirectory(sourceDistPath, targetDistPath);
console.log(`Build frontend copie vers ${targetDistPath}`);