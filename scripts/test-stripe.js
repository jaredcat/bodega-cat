#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔍 Testing Stripe connection and products...\n");

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

console.log("✅ Environment variables found");
console.log(
  `🔑 Stripe Key: ${process.env.STRIPE_SECRET_KEY.substring(0, 12)}...`,
);

// Create a simple test script
const testScript = `
import Stripe from 'stripe';

const stripe = new Stripe('${process.env.STRIPE_SECRET_KEY}', {
  apiVersion: '2024-12-18.acacia',
});

async function testStripe() {
  try {
    console.log('🔍 Fetching all products from Stripe...');

    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    });

    console.log(\`📦 Found \${products.data.length} total products\`);

    if (products.data.length === 0) {
      console.log('⚠️  No products found in Stripe. You need to add products first.');
      return;
    }

    console.log('\\n📋 All products:');
    products.data.forEach((product, index) => {
      const generatedSlug = product.name
        .toLowerCase()
        .trim()
        .replace(/[^\\w\\s-]/g, '')
        .replace(/\\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-/, '')
        .replace(/-$/, '');

      console.log(\`\${index + 1}. \${product.name}\`);
      console.log(\`   ID: \${product.id}\`);
      console.log(\`   Active: \${product.active}\`);
      console.log(\`   Custom Slug: \${product.metadata.slug || 'None'}\`);
      console.log(\`   Generated Slug: \${generatedSlug}\`);
      console.log(\`   Final Slug: \${product.metadata.slug || generatedSlug}\`);
      console.log(\`   bodegacat_active: \${product.metadata.bodegacat_active}\`);
      console.log(\`   Default Price: \${product.default_price ? 'Yes' : 'No'}\`);
      console.log('');
    });

    // Check for products with bodegacat_active = "true"
    const activeProducts = products.data.filter(
      (product) => product.metadata.bodegacat_active === "true"
    );

    console.log(\`✅ Found \${activeProducts.length} products with bodegacat_active = "true"\`);

    if (activeProducts.length === 0) {
      console.log('\\n⚠️  No products are marked as active for Bodega Cat.');
      console.log('\\nTo fix this, you need to:');
      console.log('1. Go to your Stripe Dashboard');
      console.log('2. Edit each product you want to show');
      console.log('3. Add metadata: bodegacat_active = "true"');
      console.log('4. Add metadata: slug = "your-product-slug"');
      console.log('5. Make sure the product has a default price set');
    } else {
      console.log('\\n🎉 These products will be available on your site:');
      activeProducts.forEach((product, index) => {
        console.log(\`\${index + 1}. \${product.name} (\${product.metadata.slug})\`);
      });
    }

  } catch (error) {
    console.error('❌ Error connecting to Stripe:', error.message);
    if (error.message.includes('Invalid API key')) {
      console.log('\\n💡 Make sure your STRIPE_SECRET_KEY is correct');
    }
  }
}

testStripe();
`;

// Write and run the test script
const testFilePath = path.join(__dirname, "temp-stripe-test.js");
fs.writeFileSync(testFilePath, testScript);

try {
  console.log("🚀 Running Stripe test...\n");
  execSync(`node ${testFilePath}`, { stdio: "inherit" });
} catch (error) {
  console.error("❌ Test failed:", error.message);
} finally {
  // Clean up
  if (fs.existsSync(testFilePath)) {
    fs.unlinkSync(testFilePath);
  }
}
