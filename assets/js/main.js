import { getLang, setLang, LANGS } from './i18n.js';
const cur = getLang();
if (cur !== 'ar') setLang(cur); else setLang('ar'); // syncs button label and meta
document.querySelector('.lang-btn')?.addEventListener('click', () => setLang(document.documentElement.lang === 'ar' ? 'en' : 'ar', true));
const mb = document.querySelector('.menu-btn'), nav = document.getElementById('nav');
mb?.addEventListener('click', () => { const o = nav.classList.toggle('open'); mb.setAttribute('aria-expanded', o); });
nav?.addEventListener('click', e => { if (e.target.closest('a')) { nav.classList.remove('open'); mb?.setAttribute('aria-expanded', 'false'); } });
if (document.querySelector('[data-dl]')) import('./render.js').then(m => m.renderDownloads());
if (document.getElementById('rel-list')) import('./render.js').then(m => m.renderReleases());
