import { checkDownloads, checkReleases } from './data-check.js';
import { t } from './i18n.js';
const el = (tag, props = {}, ...kids) => { const n = Object.assign(document.createElement(tag), props); n.append(...kids); return n; };
const lang = () => document.documentElement.lang;
async function load(url) { const r = await fetch(url, { cache: 'no-cache' }); if (!r.ok) throw new Error(url + ' ' + r.status); return r.json(); }
const fmtSize = b => b == null ? t('na') : b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.ceil(b / 1024) + ' KB';
const val = v => v == null || v === '' ? t('na') : v;
function card(it) {
  const dl = el('dl', { className: 'meta' });
  const add = (k, v, ltr) => dl.append(el('dt', {}, t(k)), el('dd', ltr ? { dir: 'ltr', style: 'text-align:start' } : {}, v));
  add('f_platform', val(it.platform)); add('f_version', val(it.version), true); add('f_engine', val(it.engineVersion), true);
  add('f_size', fmtSize(it.sizeBytes), true); add('f_req', val(it.minRequirements)); add('f_license', val(it.license)); add('f_sha', val(it.sha256), true);
  const ok = it.status === 'available';
  const act = ok ? el('a', { className: 'btn primary', href: it.url, rel: 'noopener' }, t('btn_download')) : el('span', { className: 'btn', ariaDisabled: 'true' }, t('st_' + it.status));
  return el('article', { className: 'card' }, el('h3', {}, it.product, el('span', { className: 'badge ' + it.status }, t('st_' + it.status))),
    el('p', { className: 'muted' }, it.description?.[lang()] || ''), dl, act);
}
export async function renderDownloads() {
  const boxes = document.querySelectorAll('[data-dl]'); let data;
  try { data = await load('/data/downloads.json'); } catch { boxes.forEach(b => b.replaceChildren(el('p', { className: 'notice' }, t('dl_error')))); return; }
  const draw = () => boxes.forEach(b => {
    if (checkDownloads(data).length) return b.replaceChildren(el('p', { className: 'notice' }, t('dl_invalid')));
    const items = data.items.filter(i => i.kind === b.dataset.dl);
    b.replaceChildren(...(items.length ? items.map(card) : [el('p', { className: 'muted' }, t('na'))]));
  });
  draw(); document.addEventListener('langchange', draw);
}
export async function renderReleases() {
  const box = document.getElementById('rel-list'); let rel, dls;
  try { [rel, dls] = await Promise.all([load('/data/releases.json'), load('/data/downloads.json')]); } catch { box.replaceChildren(el('p', { className: 'notice' }, t('dl_error'))); return; }
  const draw = () => {
    if (checkReleases(rel, dls).length) return box.replaceChildren(el('p', { className: 'notice' }, t('dl_invalid')));
    if (!rel.releases.length) return box.replaceChildren(el('p', { className: 'notice' }, t('rel_empty')));
    box.replaceChildren(...rel.releases.map(r => el('article', { className: 'card', style: 'margin-bottom:1rem' },
      el('h2', {}, el('bdi', {}, r.version), el('span', { className: 'badge ' + r.channel }, t('rel_' + r.channel))),
      el('p', { className: 'muted' }, `${t('rel_date')}: ${val(r.date)}`),
      el('ul', {}, ...((r.notes && r.notes[lang()]) || []).map(n => el('li', {}, n))),
      ...(r.downloadIds || []).map(id => { const d = dls.items.find(x => x.id === id); return d && d.status === 'available' ? el('a', { className: 'btn', href: d.url, rel: 'noopener' }, `${t('btn_download')} ${d.product}`) : ''; }))));
  };
  draw(); document.addEventListener('langchange', draw);
}
