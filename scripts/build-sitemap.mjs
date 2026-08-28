import { existsSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://smartdailyapps.com';

const locales = ['de', 'es', 'fr', 'it', 'pt', 'tr'];
const pages = ['', 'contact/', 'terms/', 'disclaimer/', 'cookie-policy/'];
const rootOnly = ['impressum/'];

function buildSitemap() {
  const entries = new Map();
  // Using today's date for new pages, or keeping it fixed? Let's use today's date for simplicity,
  // or a fixed date like the ones currently in the sitemap. Let's use 2026-08-28.
  const lastmod = '2026-08-28';

  const add = (path, priority) => {
    entries.set(`${BASE}${path}`, { lastmod, priority });
  };

  // Add root pages
  for (const p of pages) {
    if (existsSync(join(repoRoot, p, 'index.html')) || p === '') {
      add(`/${p}`, p === '' ? '1.0' : '0.8');
    }
  }
  for (const p of rootOnly) {
    if (existsSync(join(repoRoot, p, 'index.html'))) {
      add(`/${p}`, '0.8');
    }
  }

  // Add locale pages
  for (const loc of locales) {
    for (const p of pages) {
      const pPath = p ? `${loc}/${p}` : loc;
      if (existsSync(join(repoRoot, pPath, 'index.html')) || p === '') {
         add(`/${loc}/${p}`, p === '' ? '1.0' : '0.8');
      }
    }
  }

  const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
  for (const [loc, data] of [...entries.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    lines.push('  <url>', `    <loc>${loc}</loc>`, `    <lastmod>${data.lastmod}</lastmod>`, `    <changefreq>monthly</changefreq>`, `    <priority>${data.priority}</priority>`, '  </url>');
  }
  lines.push('</urlset>', '');
  
  return lines.join('\n');
}

const xml = buildSitemap();
const sitemapPath = join(repoRoot, 'sitemap.xml');
writeFileSync(sitemapPath, xml, 'utf8');
console.log(`WROTE ${sitemapPath} (${(xml.match(/<url>/g) || []).length} URLs)`);
