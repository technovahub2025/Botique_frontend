const API_ORIGIN = (() => {
  const raw = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
  if (raw.endsWith('/api')) {
    return raw.slice(0, -4);
  }
  return raw;
})();

export function getImageUrl(image) {
  if (!image) {
    return '';
  }

  if (typeof image === 'string') {
    const trimmed = image.trim();
    if (!trimmed) return '';

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

  if (typeof image === 'object') {
    const extracted =
      image.url ||
      image.secure_url ||
      image.src ||
      image.imageUrl ||
      '';
    if (extracted) return getImageUrl(extracted);
    return '';
  }

  return '';
}
