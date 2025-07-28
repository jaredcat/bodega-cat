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
