// Usage: SITE_URL=https://your-site.pages.dev node scripts/gen-sitemap.mjs
import { writeFileSync } from 'node:fs';
const site = (process.env.SITE_URL || 'https://CHANGE-ME.pages.dev').replace(/\/$/, '');
const pages = ['/', '/downloads/', '/docs/', '/releases/', '/about/']; // 404 is intentionally excluded
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  pages.map(p => `  <url><loc>${site}${p}</loc></url>`).join('\n') + `\n</urlset>\n`;
writeFileSync('sitemap.xml', xml);
writeFileSync('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);
console.log('wrote sitemap.xml and robots.txt for', site);
