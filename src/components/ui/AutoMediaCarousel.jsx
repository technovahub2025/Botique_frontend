import { useState, useRef, useEffect } from 'react';
import { getImageUrl } from '../../services/imageUrl';
import { isVideoMedia } from '../../utils/mediaUtils';

const AutoMediaCarousel = ({
  image,
  video,
  videoMimeType = '',
  alt = 'Media',
  className = '',
  containerClassName = '',
  imageClassName = '',
  videoClassName = '',
  objectFit = 'object-cover',
  fallback = null,
  imageDurationMs = 4000,
}) => {
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  const imageUrl = image ? getImageUrl(image) : '';
  const videoUrl = video ? getImageUrl(video) : '';

  const hasVideo = Boolean(videoUrl) && isVideoMedia(videoUrl, videoMimeType);

  useEffect(() => {
    if (!hasVideo) {
      setShowVideo(false);
      return;
    }

    if (!showVideo) {
      timerRef.current = setTimeout(() => {
        setShowVideo(true);
      }, imageDurationMs);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [showVideo, hasVideo, imageDurationMs]);

  useEffect(() => {
    if (!hasVideo) return;

    if (showVideo && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch((err) => {
        console.error('Auto video playback failed:', err);
      });
    }
  }, [showVideo, hasVideo]);

  const handleVideoEnd = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setShowVideo(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };
  }, []);

  const baseMediaClass = `absolute inset-0 w-full h-full ${objectFit}`;

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          loading="lazy"
          className={`${baseMediaClass} ${imageClassName} transition-opacity duration-700 ${
            hasVideo && showVideo ? 'opacity-0' : 'opacity-100'
          }`}
        />
      ) : (
        fallback || (
          <div className={`${baseMediaClass} bg-gray-100 flex items-center justify-center ${imageClassName}`}>
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )
      )}

      {hasVideo && (
        <video
          ref={videoRef}
          src={videoUrl}
          muted
          autoPlay
          playsInline
          preload="metadata"
          controls={false}
          onEnded={handleVideoEnd}
          className={`${baseMediaClass} ${videoClassName} transition-opacity duration-700 ${
            showVideo ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />
      )}
    </div>
  );
};

export default AutoMediaCarousel;
