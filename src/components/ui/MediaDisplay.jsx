import { getImageUrl } from '../../services/imageUrl';
import { isVideoUrl } from '../../utils/mediaUtils';

const MediaDisplay = ({
  src,
  alt = 'Media',
  className = '',
  objectFit = 'object-cover',
  loading = 'lazy',
  muted = true,
  autoPlay = false,
  loop = false,
  playsInline = true,
  preload = 'metadata',
  fallback = null,
  onError = null,
  ...props
}) => {
  const mediaUrl = src ? getImageUrl(src) : '';

  const commonClassName = `w-full h-full ${objectFit} ${className}`.trim();

  if (!mediaUrl) {
    return fallback;
  }

  if (isVideoUrl(mediaUrl)) {
    return (
      <video
        src={mediaUrl}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        preload={preload}
        className={commonClassName}
        onError={onError}
      />
    );
  }

  return (
    <img
      src={mediaUrl}
      alt={alt}
      loading={loading}
      className={commonClassName}
      onError={onError}
    />
  );
};

export default MediaDisplay;
