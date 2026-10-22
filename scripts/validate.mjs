// Usage: node scripts/validate.mjs   (exit code 1 on any failure)
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { checkDownloads, checkReleases } from '../assets/js/data-check.js';
import ar from '../assets/i18n/ar.js';
import en from '../assets/i18n/en.js';
let fail = 0, warn = 0;
const bad = m => { fail++; console.log('FAIL', m); }, ok = m => console.log('ok  ', m);
const pagesList = ['index.html', 'downloads/index.html', 'docs/index.html', 'releases/index.html', 'about/index.html', '404.html'];
// 1. data
const dl = JSON.parse(readFileSync('data/downloads.json', 'utf8')), rel = JSON.parse(readFileSync('data/releases.json', 'utf8'));
const e1 = [...checkDownloads(dl), ...checkReleases(rel, dl)]; e1.forEach(bad); if (!e1.length) ok('JSON data valid');
// 2. translations: same keys, no empty values
const ka = Object.keys(ar), ke = Object.keys(en);
ka.filter(k => !(k in en)).forEach(k => bad('missing in en: ' + k)); ke.filter(k => !(k in ar)).forEach(k => bad('missing in ar: ' + k));
[...ka].forEach(k => { if (!ar[k] || !en[k]) bad('empty translation: ' + k); }); ok(`translation keys checked (${ka.length})`);
// 3. each HTML page: data-i18n keys exist, baked Arabic text matches ar.js, internal links resolve
const resolves = u => { u = u.split('#')[0].split('?')[0]; if (!u) return true; const p = u.replace(/^\//, ''); if (p === '') return existsSync('index.html'); return existsSync(p) && (statSync(p).isFile() || existsSync(join(p, 'index.html'))); };
for (const f of pagesList) {
  if (!existsSync(f)) { bad('missing page ' + f); continue; }
  const h = readFileSync(f, 'utf8');
  for (const m of h.matchAll(/data-i18n="(\w+)"[^>]*>([^<]*)</g)) { if (!(m[1] in ar)) bad(`${f}: unknown key ${m[1]}`); else if (m[2] !== ar[m[1]]) bad(`${f}: baked text differs from ar.js for ${m[1]}`); }
  for (const m of h.matchAll(/(?:href|src)="(\/[^"]*)"/g)) if (!resolves(m[1])) bad(`${f}: broken link ${m[1]}`);
  if (!/<title>.+<\/title>/.test(h) || !/name="description" content=".+"/.test(h)) bad(f + ': title/description missing');
  if (!/<html lang="ar" dir="rtl"/.test(h)) bad(f + ': html lang/dir default');
}
ok('pages: keys, links, meta checked');
// 4. SEO files
if (!existsSync('sitemap.xml') || !existsSync('robots.txt')) bad('sitemap.xml/robots.txt missing');
else { const s = readFileSync('sitemap.xml', 'utf8'); for (const m of s.matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g)) if (!resolves(m[1])) bad('sitemap path missing: ' + m[1]);
  if (s.includes('CHANGE-ME')) { warn++; console.log('WARN sitemap/robots still use the placeholder domain (run gen-sitemap with SITE_URL)'); } else ok('sitemap domain set'); }
console.log(fail ? `\n${fail} failure(s)` : '\nAll checks passed', warn ? `(${warn} warning)` : ''); process.exit(fail ? 1 : 0);
