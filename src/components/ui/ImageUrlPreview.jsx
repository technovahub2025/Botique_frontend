import { useState } from 'react';
import { getImageUrl } from '../../services/imageUrl';

const parseUrls = (url) => {
  if (!url || typeof url !== 'string') return [];
  const trimmed = url.trim();
  if (!trimmed) return [];
  if (trimmed.includes(',')) {
    return trimmed
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }
  return [trimmed];
};

const ImageUrlPreview = ({ url, className = '', alt = 'Image preview' }) => {
  const [failed, setFailed] = useState(false);

  const urls = typeof url === 'string' ? parseUrls(url) : [];

  if (urls.length === 0 || failed) {
    if (failed && urls.length > 0) {
      return (
        <p className="text-xs text-gray-500 mt-2">
          Unable to load image preview
        </p>
      );
    }
    return null;
  }

  return (
    <div className={`mt-2 space-y-2 ${className}`}>
      {urls.map((singleUrl, i) => {
        const imageUrl = getImageUrl(singleUrl);
        if (!imageUrl) return null;

        return (
          <div
            key={`${singleUrl}-${i}`}
            className="overflow-hidden bg-gray-50 rounded border border-gray-200"
          >
            <img
              src={imageUrl}
              alt={alt}
              loading="lazy"
              className="max-w-full max-h-64 w-full h-auto object-contain mx-auto"
              onError={(e) => {
                const img = e.currentTarget;
                if (img.dataset.triedFallback) {
                  img.style.display = 'none';
                  return;
                }
                img.dataset.triedFallback = 'true';
                img.style.display = 'none';
                setFailed(true);
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ImageUrlPreview;
