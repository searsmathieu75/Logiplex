import type { APIRoute } from 'astro';
import { services } from '../data/services';

/**
 * Sitemap généré depuis les routes statiques réelles.
 * /404 et /confidentialite sont exclus : la première n'est pas une page
 * indexable, la seconde porte noindex tant que les mentions légales ne sont
 * pas confirmées.
 */
const routes: readonly string[] = [
  '/',
  ...services.map((service) => `/${service.slug}`),
  '/a-propos',
  '/contact',
];

export const GET: APIRoute = ({ site }) => {
  const origin = (site ?? new URL('https://monwifi.pages.dev')).origin;
  const lastmod = new Date().toISOString().split('T')[0];

  const urls = routes
    .map((route) => {
      const loc = `${origin}${route === '/' ? '/' : route}`;
      const priority = route === '/' ? '1.0' : '0.8';
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
