import { useState, useRef, useEffect } from 'react';
import { getImageUrl } from '../../services/imageUrl';
import { isVideoMedia } from '../../utils/mediaUtils';

const AutoMediaNatural = ({
  image,
  video,
  videoMimeType = '',
  alt = 'Media',
  fallbackText = 'No media available',
}) => {
  const [showVideo, setShowVideo] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  const imageUrl = image ? getImageUrl(image) : '';
  const videoUrl = video ? getImageUrl(video) : '';

  const hasVideo = Boolean(videoUrl) && !videoFailed && isVideoMedia(videoUrl, videoMimeType);

  useEffect(() => {
    if (!hasVideo) {
      setShowVideo(false);
      return;
    }

    if (!showVideo) {
      timerRef.current = setTimeout(() => {
        setShowVideo(true);
      }, 4000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [showVideo, hasVideo]);

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

  const baseMediaClass = 'block w-full h-auto object-contain object-center';

  return (
    <div className="relative w-full overflow-hidden bg-cream">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          loading="lazy"
          className={`${baseMediaClass} transition-opacity duration-700 ${
            hasVideo && showVideo ? 'opacity-0' : 'opacity-100'
          }`}
        />
      ) : (
        <div className={`${baseMediaClass} bg-gray-100 flex items-center justify-center`}>
          <span className="text-gray-400 text-sm">{fallbackText}</span>
        </div>
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
          onError={() => {
            setVideoFailed(true);
            if (import.meta.env.DEV) {
              console.error('Video failed to load:', videoUrl);
            }
          }}
          className={`${baseMediaClass} transition-opacity duration-700 ${
            showVideo ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />
      )}
    </div>
  );
};

export default AutoMediaNatural;
