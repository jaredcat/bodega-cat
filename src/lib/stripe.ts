import { STRIPE_API_VERSION } from "astro:env/client";
import { STRIPE_SECRET_KEY } from "astro:env/server";
import Stripe from "stripe";
import type { Product } from "../types/product";

if (!STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable is required");
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: STRIPE_API_VERSION as Stripe.LatestApiVersion,
});

export async function getProducts(): Promise<Product[]> {
  const products = await stripe.products.list({
    active: true,
    expand: ["data.default_price"],
  });

  return products.data
    .filter((product) => product.metadata.bodegacat_active === "true")
    .map((product) => transformStripeProduct(product));
}

export async function getProduct(slug: string): Promise<Product | null> {
  const products = await stripe.products.list({
    active: true,
    expand: ["data.default_price"],
  });

  const product = products.data.find(
    (p) => p.metadata.slug === slug && p.metadata.bodegacat_active === "true"
  );

  if (!product) return null;

  return transformStripeProduct(product);
}

function transformStripeProduct(product: Stripe.Product): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description ?? "",
    metadata: {
      productTypeId: product.metadata.productTypeId,
      tags: (product.metadata.tags
        ? JSON.parse(product.metadata.tags)
        : []) as string[],
      category: product.metadata.category,
      brand: product.metadata.brand,
      sku: product.metadata.sku,
      weight: product.metadata.weight
        ? parseFloat(product.metadata.weight)
        : undefined,
      dimensions: product.metadata.dimensions
        ? (JSON.parse(product.metadata.dimensions) as {
            height: number;
            width: number;
            length: number;
            weight: number;
          })
        : undefined,
    },
    images: product.images,
    active: product.active,
    slug: product.metadata.slug,
    basePrice: (product.default_price as Stripe.Price).unit_amount ?? 0,
    currency: (product.default_price as Stripe.Price).currency,
    stripeProductId: product.id,
    stripePriceId: (product.default_price as Stripe.Price).id,
    createdAt: new Date(product.created * 1000),
    updatedAt: new Date(),
  };
}

export async function createCheckoutSession(
  items: {
    priceId: string;
    quantity: number;
  }[],
  successUrl: string,
  cancelUrl: string
) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: items,
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session;
}

export { stripe };
