#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🛠️  Setting up sample products in Stripe...\n");

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
const requiredEnvVars = ["STRIPE_SECRET_KEY"];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error("❌ Missing required environment variables:");
  missingVars.forEach((varName) => console.error(`   - ${varName}`));
  console.error(
    "\nPlease set these variables in your .env file or environment.",
  );
  process.exit(1);
}

// Create a script to set up sample products
const setupScript = `
import Stripe from 'stripe';

const stripe = new Stripe('${process.env.STRIPE_SECRET_KEY}', {
  apiVersion: '2024-12-18.acacia',
});

async function setupSampleProducts() {
  try {
    console.log('🛠️  Creating sample products...');

    // Sample product 1: T-Shirt (with custom slug)
    console.log('\\n👕 Creating T-Shirt product...');
    const tshirtProduct = await stripe.products.create({
      name: 'Bodega Cat T-Shirt',
      description: 'A comfortable cotton t-shirt featuring the Bodega Cat logo',
      images: ['https://via.placeholder.com/400x400?text=T-Shirt'],
      metadata: {
        bodegacat_active: 'true',
        slug: 'bodega-cat-tshirt', // Custom slug
        productTypeId: 'clothing',
        category: 'Clothing',
        brand: 'Bodega Cat',
        sku: 'TSHIRT-001',
        tags: JSON.stringify(['clothing', 'tshirt', 'cotton']),
      },
    });

    const tshirtPrice = await stripe.prices.create({
      product: tshirtProduct.id,
      unit_amount: 2500, // $25.00
      currency: 'usd',
    });

    await stripe.products.update(tshirtProduct.id, {
      default_price: tshirtPrice.id,
    });

    console.log('✅ T-Shirt created:', tshirtProduct.id);

    // Sample product 2: Coffee Mug (auto-generated slug)
    console.log('\\n☕ Creating Coffee Mug product...');
    const mugProduct = await stripe.products.create({
      name: 'Bodega Cat Coffee Mug',
      description: 'A ceramic coffee mug with the Bodega Cat design',
      images: ['https://via.placeholder.com/400x400?text=Coffee+Mug'],
      metadata: {
        bodegacat_active: 'true',
        // No slug provided - will be auto-generated as 'bodega-cat-coffee-mug'
        productTypeId: 'accessories',
        category: 'Kitchen',
        brand: 'Bodega Cat',
        sku: 'MUG-001',
        tags: JSON.stringify(['kitchen', 'mug', 'ceramic']),
      },
    });

    const mugPrice = await stripe.prices.create({
      product: mugProduct.id,
      unit_amount: 1500, // $15.00
      currency: 'usd',
    });

    await stripe.products.update(mugProduct.id, {
      default_price: mugPrice.id,
    });

    console.log('✅ Coffee Mug created:', mugProduct.id);

    console.log('\\n🎉 Sample products created successfully!');
    console.log('\\n📋 Product Details:');
    console.log('1. Bodega Cat T-Shirt - $25.00 (slug: bodega-cat-tshirt)');
    console.log('2. Bodega Cat Coffee Mug - $15.00 (slug: bodega-cat-coffee-mug)');
    console.log('\\n💡 Note: The coffee mug uses an auto-generated slug from the product name!');
    console.log('\\n💡 Now run: npm run test:stripe');
    console.log('💡 Then run: npm run build:with-products');

  } catch (error) {
    console.error('❌ Error creating products:', error.message);
    if (error.message.includes('Invalid API key')) {
      console.log('\\n💡 Make sure your STRIPE_SECRET_KEY is correct');
    }
  }
}

setupSampleProducts();
`;

// Write and run the setup script
const setupFilePath = path.join(__dirname, "temp-setup-products.js");
fs.writeFileSync(setupFilePath, setupScript);

try {
  console.log("🚀 Creating sample products in Stripe...\n");
  execSync(`node ${setupFilePath}`, { stdio: "inherit" });
} catch (error) {
  console.error("❌ Setup failed:", error.message);
} finally {
  // Clean up
  if (fs.existsSync(setupFilePath)) {
    fs.unlinkSync(setupFilePath);
  }
}
