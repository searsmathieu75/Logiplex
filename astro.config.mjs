// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';

// loadEnv lit les fichiers .env en local et les variables d'environnement
// injectées par Cloudflare Pages au moment du build. process.env seul ne
// verrait pas les fichiers .env.
const { PUBLIC_SITE_URL } = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

export default defineConfig({
  site: PUBLIC_SITE_URL || 'https://monwifi.pages.dev',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
    inlineStylesheets: 'auto',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
