#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 Building Bodega Cat with product generation...\n");

// Load environment variables from .env file
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  const envLines = envContent.split("\n");

  envLines.forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith("#")) {
      const [key, ...valueParts] = trimmedLine.split("=");
      if (key && valueParts.length > 0) {
        const value = valueParts.join("=").replace(/^["']|["']$/g, "");
        process.env[key] = value;
      }
    }
  });
}

// Check if environment variables are set
const requiredEnvVars = ["STRIPE_SECRET_KEY", "STRIPE_PUBLISHABLE_KEY"];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error("❌ Missing required environment variables:");
  missingVars.forEach((varName) => console.error(`   - ${varName}`));
  console.error(
    "\nPlease set these variables in your .env file or environment.",
  );
  process.exit(1);
}

try {
  // Clean previous build
  console.log("🧹 Cleaning previous build...");
  if (fs.existsSync("dist")) {
    fs.rmSync("dist", { recursive: true, force: true });
  }

  // Run the build
  console.log("🔨 Building site with static product pages...");
  execSync("npm run build", { stdio: "inherit" });

  // Check if product pages were generated
  const shopDir = path.join("dist", "shop");
  if (fs.existsSync(shopDir)) {
    const productDirs = fs
      .readdirSync(shopDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    console.log(`\n✅ Build completed successfully!`);
    console.log(`📦 Generated ${productDirs.length} product pages:`);

    if (productDirs.length > 0) {
      productDirs.forEach((dir) => {
        console.log(`   - /shop/${dir}/`);
      });
    } else {
      console.log(
        "   (No products found in Stripe - add some products to see pages generated)",
      );
    }
  } else {
    console.log(
      "\n⚠️  No shop directory found. This might be normal if no products exist.",
    );
  }

  console.log("\n🎉 Build process completed!");
  console.log("💡 To preview the site, run: npm run preview");
  console.log("🚀 To deploy, run: wrangler pages deploy dist");
} catch (error) {
  console.error("\n❌ Build failed:", error.message);
  process.exit(1);
}
