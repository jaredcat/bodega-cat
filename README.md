# Bodega Cat 🐱

A simple, fast, and configurable e-commerce store built with Astro. Perfect for artists, creators, and small businesses who want a beautiful online store without the complexity.

## Features

- 🚀 **Static Generation** - Fast, SEO-friendly pages that load instantly
- 🎨 **Configurable Themes** - Easy customization of colors, fonts, and branding
- 📦 **Product Variations** - Support for size, color, material, and custom options
- 💳 **Stripe Integration** - Secure payments with Stripe Checkout
- 🔧 **Admin Interface** - Easy product management through Stripe Dashboard
- 📱 **Responsive Design** - Works perfectly on all devices
- 🎯 **SEO Optimized** - Built-in meta tags and structured data
- ⚡ **Cloudflare Ready** - Deploy to Cloudflare Pages for free

## Quick Start

### Prerequisites

- Node.js 18+
- A Stripe account
- A Cloudflare account (for deployment)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd bodegacat-astro
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   SITE_NAME="Your Store Name"
   SITE_DESCRIPTION="Your store description"
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:4321`

## Configuration

### Site Configuration

Edit `src/config/site.ts` to customize your store:

```typescript
export const defaultSiteConfig: SiteConfig = {
  name: 'Your Store Name',
  description: 'Your store description',
  logo: '/logo.png',
  favicon: '/favicon.ico',
  theme: defaultTheme,
  productTypes: defaultProductTypes,
  stripe: {
    publishableKey: import.meta.env.STRIPE_PUBLISHABLE_KEY ?? '',
    webhookSecret: import.meta.env.STRIPE_WEBHOOK_SECRET ?? '',
  },
};
```

### Theme Customization

Themes are defined in `src/config/site.ts`. You can customize:

- **Colors**: Primary, secondary, accent, background, surface, text colors
- **Fonts**: Heading and body font families
- **Spacing**: Consistent spacing scale
- **Border Radius**: Corner rounding

```typescript
export const customTheme: ThemeConfig = {
  name: 'custom',
  colors: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    accent: '#45B7D1',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#2C3E50',
    textSecondary: '#7F8C8D',
  },
  fonts: {
    heading: 'Poppins, sans-serif',
    body: 'Inter, sans-serif',
  },
  borderRadius: '0.75rem',
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
};
```

### Product Types

Define your product types and variations in `src/config/site.ts`:

```typescript
export const customProductTypes: ProductType[] = [
  {
    id: 't-shirts',
    name: 'T-Shirts',
    description: 'Comfortable cotton t-shirts',
    variations: [
      {
        id: 'size',
        name: 'Size',
        type: 'select',
        required: true,
        options: [
          { id: 's', name: 'Small', priceModifier: 0, enabled: true },
          { id: 'm', name: 'Medium', priceModifier: 0, enabled: true },
          { id: 'l', name: 'Large', priceModifier: 0, enabled: true },
          { id: 'xl', name: 'X-Large', priceModifier: 2, enabled: true },
        ],
      },
      {
        id: 'color',
        name: 'Color',
        type: 'select',
        required: true,
        options: [
          { id: 'black', name: 'Black', priceModifier: 0, enabled: true },
          { id: 'white', name: 'White', priceModifier: 0, enabled: true },
          { id: 'navy', name: 'Navy', priceModifier: 1, enabled: true },
        ],
      },
    ],
  },
];
```

## Product Management

### Adding Products

1. **Create products in Stripe Dashboard**
   - Go to your Stripe Dashboard
   - Navigate to Products
   - Create a new product
   - Add the following metadata:
     - `bodegacat_active`: `true`
     - `productTypeId`: The ID of your product type (e.g., `t-shirts`)
     - `slug`: URL-friendly product name (e.g., `my-awesome-shirt`)
     - `category`: Product category
     - `brand`: Product brand
     - `tags`: JSON array of tags (e.g., `["summer", "casual"]`)

2. **Set up pricing**
   - Create a price for your product
   - Set the base price
   - Variations will be calculated automatically

### Product Images

- Upload product images in Stripe
- Images will automatically appear on your store
- First image becomes the main product image

## Deployment

### Cloudflare Pages (Recommended)

1. **Connect your repository**
   - Go to Cloudflare Pages
   - Connect your GitHub repository
   - Set build settings:
     - Build command: `npm run build`
     - Build output directory: `dist`

2. **Set environment variables**
   - Add your environment variables in Cloudflare Pages settings
   - Make sure to use production Stripe keys

3. **Deploy**
   - Push to your main branch
   - Cloudflare will automatically build and deploy

### Other Platforms

Bodega Cat works with any static hosting platform:

- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

## Stripe Webhooks

Set up webhooks in your Stripe Dashboard:

1. **Go to Stripe Dashboard > Webhooks**
2. **Add endpoint**: `https://yourdomain.com/api/stripe-webhook`
3. **Select events**:
   - `product.created`
   - `product.updated`
   - `product.deleted`
   - `price.created`
   - `price.updated`
   - `price.deleted`
   - `checkout.session.completed`

## Development

### Project Structure

```
src/
├── components/          # React components
├── config/             # Site configuration
├── layouts/            # Astro layouts
├── lib/                # Utility functions
├── pages/              # Astro pages
├── styles/             # Global styles
└── types/              # TypeScript types
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. **New Components**: Add React components in `src/components/`
2. **New Pages**: Add Astro pages in `src/pages/`
3. **New Types**: Add TypeScript types in `src/types/`
4. **New Styles**: Add CSS in `src/styles/`

## Customization

### Adding Custom Pages

Create new pages in `src/pages/`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Navbar from '../components/Navbar';
import { getSiteConfig } from '../config/site';

const siteConfig = getSiteConfig();
---

<Layout title="About Us">
  <Navbar siteConfig={siteConfig} client:load />

  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1>About Us</h1>
    <p>Your content here...</p>
  </div>
</Layout>
```

### Adding Custom Components

Create React components in `src/components/`:

```tsx
import React from 'react';

interface MyComponentProps {
  title: string;
}

export default function MyComponent({ title }: MyComponentProps) {
  return (
    <div className="my-component">
      <h2>{title}</h2>
    </div>
  );
}
```

## Support

- **Documentation**: Check the code comments for detailed explanations
- **Issues**: Report bugs and feature requests on GitHub
- **Community**: Join our Discord for help and discussions

## License

MIT License - see LICENSE file for details.

---

Built with ❤️ using [Astro](https://astro.build) and [Stripe](https://stripe.com)
