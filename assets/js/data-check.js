// Pure validation (works in browser and Node). Returns an array of error strings.
const STATUSES = ['available', 'in_development', 'unavailable'];
export function checkDownloads(d) {
  if (!d || !Array.isArray(d.items)) return ['items must be an array'];
  const errs = [], ids = new Set();
  d.items.forEach((it, i) => {
    const p = `items[${i}](${it && it.id})`;
    for (const k of ['id', 'kind', 'product', 'status']) if (!it[k]) errs.push(`${p}: "${k}" is required`);
    if (ids.has(it.id)) errs.push(`${p}: duplicate id`); ids.add(it.id);
    if (!['engine', 'export-template'].includes(it.kind)) errs.push(`${p}: bad kind`);
    if (!STATUSES.includes(it.status)) errs.push(`${p}: bad status`);
    if (it.status === 'available') {
      if (!/^https:\/\/\S+$/.test(it.url || '')) errs.push(`${p}: available needs an https url`);
      if (!it.version) errs.push(`${p}: available needs a version`);
    } else if (it.url) errs.push(`${p}: url must be null unless status is available`);
    if (it.sizeBytes != null && !(Number.isInteger(it.sizeBytes) && it.sizeBytes > 0)) errs.push(`${p}: bad sizeBytes`);
    if (it.sha256 != null && !/^[a-f0-9]{64}$/i.test(it.sha256)) errs.push(`${p}: sha256 must be 64 hex chars`);
  });
  return errs;
}
export function checkReleases(d, downloads) {
  if (!d || !Array.isArray(d.releases)) return ['releases must be an array'];
  const errs = [], known = new Set(((downloads && downloads.items) || []).map(x => x.id));
  d.releases.forEach((r, i) => {
    const p = `releases[${i}](${r && r.version})`;
    if (!r.version) errs.push(`${p}: version required`);
    if (!['stable', 'preview'].includes(r.channel)) errs.push(`${p}: channel must be stable|preview`);
    if (r.date != null && !/^\d{4}-\d{2}-\d{2}$/.test(r.date)) errs.push(`${p}: date must be YYYY-MM-DD`);
    (r.downloadIds || []).forEach(id => { if (!known.has(id)) errs.push(`${p}: unknown downloadId ${id}`); });
  });
  return errs;
}
