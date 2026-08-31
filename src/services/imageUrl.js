const API_ORIGIN = (() => {
  const raw = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
  if (raw.endsWith('/api')) {
    return raw.slice(0, -4);
  }
  return raw;
})();

export function getImageUrl(url) {
  if (!url || typeof url !== 'string') {
    return '';
  }

  const trimmed = url.trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  if (trimmed.startsWith('/')) {
    return `${API_ORIGIN}${trimmed}`;
  }

  if (API_ORIGIN) {
    return `${API_ORIGIN}/${trimmed}`;
  }

  return trimmed;
}
