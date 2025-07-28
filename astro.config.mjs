import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
  },

  output: "static",

  build: {
    assets: "_astro",
  },
  env: {
    schema: {
      // Server-side secrets (not exposed to client)
      STRIPE_SECRET_KEY: envField.string({ context: "server", access: "secret" }),
      STRIPE_WEBHOOK_SECRET: envField.string({ context: "server", access: "secret" }),
      BUILD_HOOK_URL: envField.string({ context: "server", access: "secret", optional: true }),

      // Client-side public variables (exposed to browser)
      STRIPE_PUBLISHABLE_KEY: envField.string({ context: "client", access: "public" }),
      STRIPE_API_VERSION: envField.string({ context: "client", access: "public", default: "2025-06-30.basil" }),
    },
  },
});
