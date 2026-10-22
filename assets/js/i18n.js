import ar from '../i18n/ar.js';
import en from '../i18n/en.js';
export const LANGS = { ar: { dict: ar, dir: 'rtl', other: 'English', otherLang: 'en' }, en: { dict: en, dir: 'ltr', other: 'العربية', otherLang: 'ar' } };
const KEY = 'bw-lang'; // only the language choice is stored, in localStorage (no cookies, no tracking)
export function getLang() { try { const v = localStorage.getItem(KEY); if (v && v in LANGS) return v; } catch {} return 'ar'; }
export function t(key) { return LANGS[document.documentElement.lang]?.dict[key] ?? key; }
export function setLang(lang, persist = false) {
  const L = LANGS[lang]; const root = document.documentElement;
  root.lang = lang; root.dir = L.dir;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = L.dict[el.dataset.i18n] ?? el.textContent; });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', L.dict[el.dataset.i18nAria]));
  const page = root.dataset.page; if (page) {
    document.title = L.dict[`meta_${page}_title`];
    document.querySelector('meta[name=description]')?.setAttribute('content', L.dict[`meta_${page}_desc`]);
  }
  const b = document.querySelector('.lang-btn'); if (b) { b.textContent = L.other; b.lang = L.otherLang; }
  if (persist) try { localStorage.setItem(KEY, lang); } catch {}
  document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
}
