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

// Detect video from the URL
const isVideoUrl = (url) => {
  if (!url || typeof url !== 'string') return false;

  const cleanUrl = url.toLowerCase().split('?')[0].split('#')[0];

  return (
    cleanUrl.endsWith('.mp4') ||
    cleanUrl.endsWith('.webm') ||
    cleanUrl.endsWith('.mov') ||
    cleanUrl.endsWith('.m4v') ||
    cleanUrl.endsWith('.ogg') ||
    cleanUrl.endsWith('.ogv')
  );
};

const ImageUrlPreview = ({
  url,
  className = '',
  alt = 'Media preview',
  mimeType = '',
}) => {
  const [failedUrls, setFailedUrls] = useState({});

  const urls = typeof url === 'string' ? parseUrls(url) : [];

  if (urls.length === 0) {
    return null;
  }

  const handleMediaError = (singleUrl) => {
    setFailedUrls((previous) => ({
      ...previous,
      [singleUrl]: true,
    }));
  };

  return (
    <div className={`mt-2 space-y-2 ${className}`}>
      {urls.map((singleUrl, i) => {
        const mediaUrl = getImageUrl(singleUrl);

        if (!mediaUrl) {
          return null;
        }

        if (failedUrls[singleUrl]) {
          return (
            <div
              key={`${singleUrl}-${i}`}
              className="overflow-hidden bg-gray-50 rounded border border-gray-200 p-3"
            >
              <p className="text-xs text-gray-500">
                Unable to load media preview
              </p>
            </div>
          );
        }

        /*
         * Determine whether this is a video.
         *
         * First check mimeType if provided.
         * Otherwise detect from the URL extension.
         */
        const isVideo =
          mimeType?.startsWith('video/') ||
          isVideoUrl(singleUrl);

        return (
          <div
            key={`${singleUrl}-${i}`}
            className="overflow-hidden bg-gray-50 rounded border border-gray-200"
          >
            {isVideo ? (
              <video
                src={mediaUrl}
                controls
                muted
                playsInline
                preload="metadata"
                className="max-w-full max-h-64 w-full h-auto object-contain mx-auto bg-black"
                onError={() => handleMediaError(singleUrl)}
              >
                Your browser does not support video playback.
              </video>
            ) : (
              <img
                src={mediaUrl}
                alt={alt}
                loading="lazy"
                className="max-w-full max-h-64 w-full h-auto object-contain mx-auto"
                onError={() => handleMediaError(singleUrl)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ImageUrlPreview;