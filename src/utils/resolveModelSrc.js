/** Resolves `/models/...` for Vite `base` (e.g. project subpaths). */
export function resolveModelSrc(src) {
  if (!src) return src;
  if (/^https?:\/\//i.test(src)) return src;
  const base = import.meta.env.BASE_URL || '/';
  const path = src.startsWith('/') ? src.slice(1) : src;
  return base.endsWith('/') ? `${base}${path}` : `${base}/${path}`;
}
