import type Stripe from "stripe";

export interface ProductType {
  id: string;
  name: string;
  description?: string;
  variations: VariationConfig[];
}

export interface VariationConfig {
  id: string;
  name: string;
  type: "select" | "radio" | "checkbox";
  required: boolean;
  options: VariationOption[];
}

export interface VariationOption {
  id: string;
  name: string;
  priceModifier: number; // Can be positive or negative
  enabled: boolean;
}

// New robust variation system
export interface ProductVariationDefinition {
  id: string;
  name: string;
  displayName: string;
  type: "independent" | "dependent";
  order: number; // Order in which variations should be displayed/processed
  required: boolean;
  dependsOn?: string[]; // Array of variation IDs this depends on
  options: ProductVariationOptionDefinition[];
}

export interface ProductVariationOptionDefinition {
  id: string;
  name: string;
  displayName: string;
  priceModifier: number; // Can be positive or negative
  available: boolean;
  images?: string[];
  // For dependent variations, define which parent option combinations this is available for
  availableFor?: {
    variationId: string;
    optionIds: string[];
  }[];
}

// Runtime variation state
export interface ProductVariation {
  id: string;
  name: string;
  displayName: string;
  type: "independent" | "dependent";
  order: number;
  required: boolean;
  dependsOn?: string[];
  options: ProductVariationOption[];
  isVisible: boolean; // Whether this variation should be shown based on current selections
}

export interface ProductVariationOption {
  id: string;
  name: string;
  displayName: string;
  priceModifier: number;
  available: boolean;
  images?: string[];
  isVisible: boolean; // Whether this option should be shown based on current selections
}

export interface ProductMetadata {
  productTypeId: string;
  tags: string[];
  category?: string;
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  metadata: ProductMetadata;
  images: string[];
  active: boolean;
  slug: string;
  basePrice: number;
  currency: string;
  stripeProductId?: string;
  stripePriceId?: string;
  prices?: Stripe.Price[]; // All available prices for this product
  // New: robust variation system
  variationDefinitions: ProductVariationDefinition[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedVariations: Record<string, string>; // variationId -> optionId
  price: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  currency: string;
}

export interface SiteConfig {
  name: string;
  description: string;
  logo?: string;
  favicon?: string;
  theme: ThemeConfig;
  productTypes: ProductType[];
  stripe: {
    publishableKey: string;
    webhookSecret: string;
  };
}

export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  borderRadius: string;
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}
