/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly STRIPE_SECRET_KEY: string;
  readonly STRIPE_PUBLISHABLE_KEY: string;
  readonly STRIPE_WEBHOOK_SECRET: string;
  readonly SITE_NAME?: string;
  readonly SITE_DESCRIPTION?: string;
  readonly SITE_LOGO?: string;
  readonly SITE_FAVICON?: string;
  readonly SITE_PRIMARY_COLOR?: string;
  readonly SITE_SECONDARY_COLOR?: string;
  readonly SITE_ACCENT_COLOR?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    user?: {
      email: string;
      jwt: string;
      isDevelopment?: boolean;
    };
  }
}
