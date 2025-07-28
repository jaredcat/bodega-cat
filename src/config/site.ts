import { STRIPE_PUBLISHABLE_KEY } from "astro:env/client";
import { STRIPE_WEBHOOK_SECRET } from "astro:env/server";
import type { ProductType, SiteConfig, ThemeConfig } from "../types/product";

// Default theme configuration
export const defaultTheme: ThemeConfig = {
  name: "default",
  colors: {
    primary: "#3B82F6",
    secondary: "#6B7280",
    accent: "#F59E0B",
    background: "#FFFFFF",
    surface: "#F9FAFB",
    text: "#111827",
    textSecondary: "#6B7280",
  },
  fonts: {
    heading: "Inter, system-ui, sans-serif",
    body: "Inter, system-ui, sans-serif",
  },
  borderRadius: "0.5rem",
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
};

// Dark theme
export const darkTheme: ThemeConfig = {
  name: "dark",
  colors: {
    primary: "#60A5FA",
    secondary: "#9CA3AF",
    accent: "#FBBF24",
    background: "#111827",
    surface: "#1F2937",
    text: "#F9FAFB",
    textSecondary: "#D1D5DB",
  },
  fonts: {
    heading: "Inter, system-ui, sans-serif",
    body: "Inter, system-ui, sans-serif",
  },
  borderRadius: "0.5rem",
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
};

// Default product types that can be customized
export const defaultProductTypes: ProductType[] = [
  {
    id: "clothing",
    name: "Clothing",
    description: "Apparel and accessories",
    variations: [
      {
        id: "size",
        name: "Size",
        type: "select",
        required: true,
        options: [
          { id: "xs", name: "XS", priceModifier: 0, enabled: true },
          { id: "s", name: "S", priceModifier: 0, enabled: true },
          { id: "m", name: "M", priceModifier: 0, enabled: true },
          { id: "l", name: "L", priceModifier: 0, enabled: true },
          { id: "xl", name: "XL", priceModifier: 2, enabled: true },
          { id: "xxl", name: "XXL", priceModifier: 4, enabled: true },
        ],
      },
      {
        id: "color",
        name: "Color",
        type: "select",
        required: true,
        options: [
          { id: "black", name: "Black", priceModifier: 0, enabled: true },
          { id: "white", name: "White", priceModifier: 0, enabled: true },
          { id: "navy", name: "Navy", priceModifier: 0, enabled: true },
          { id: "gray", name: "Gray", priceModifier: 0, enabled: true },
        ],
      },
    ],
  },
  {
    id: "prints",
    name: "Prints",
    description: "Art prints and posters",
    variations: [
      {
        id: "size",
        name: "Size",
        type: "select",
        required: true,
        options: [
          { id: "8x10", name: '8" x 10"', priceModifier: 0, enabled: true },
          { id: "11x14", name: '11" x 14"', priceModifier: 5, enabled: true },
          { id: "16x20", name: '16" x 20"', priceModifier: 15, enabled: true },
          { id: "24x36", name: '24" x 36"', priceModifier: 25, enabled: true },
        ],
      },
      {
        id: "material",
        name: "Material",
        type: "select",
        required: true,
        options: [
          { id: "paper", name: "Paper", priceModifier: 0, enabled: true },
          { id: "canvas", name: "Canvas", priceModifier: 10, enabled: true },
          { id: "vinyl", name: "Vinyl", priceModifier: 5, enabled: true },
        ],
      },
    ],
  },
  {
    id: "digital",
    name: "Digital",
    description: "Digital downloads",
    variations: [],
  },
];

// Default site configuration
export const defaultSiteConfig: SiteConfig = {
  name: "Bodega Cat",
  description: "Your friendly neighborhood store",
  logo: "/logo.png",
  favicon: "/favicon.ico",
  theme: defaultTheme,
  productTypes: defaultProductTypes,
  stripe: {
    publishableKey: STRIPE_PUBLISHABLE_KEY,
    webhookSecret: STRIPE_WEBHOOK_SECRET,
  },
};

// Function to get site config (can be extended to load from database or file)
export function getSiteConfig(): SiteConfig {
  // In a real implementation, this would load from a database or configuration file
  // For now, we'll use environment variables to override defaults
  const config = { ...defaultSiteConfig };

  // Use process.env for these optional environment variables since they're not in our schema
  const siteName = process.env.SITE_NAME;
  const siteDescription = process.env.SITE_DESCRIPTION;
  const siteLogo = process.env.SITE_LOGO;
  const siteFavicon = process.env.SITE_FAVICON;

  if (siteName) {
    config.name = siteName;
  }

  if (siteDescription) {
    config.description = siteDescription;
  }

  if (siteLogo) {
    config.logo = siteLogo;
  }

  if (siteFavicon) {
    config.favicon = siteFavicon;
  }

  return config;
}
