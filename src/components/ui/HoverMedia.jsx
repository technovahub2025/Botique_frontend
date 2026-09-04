import { useState, useRef, useEffect } from 'react';
import { getImageUrl } from '../../services/imageUrl';
import { isVideoUrl } from '../../utils/mediaUtils';

const HoverMedia = ({
  image,
  video,
  alt = 'Media',
  className = '',
  containerClassName = '',
  imageClassName = '',
  videoClassName = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  const imageUrl = image ? getImageUrl(image) : '';
  const videoUrl = video ? getImageUrl(video) : '';
  const hasVideo = Boolean(videoUrl) && isVideoUrl(videoUrl);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (!hasVideo) return;
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (!hasVideo) return;
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const baseMediaClass = 'w-full h-full object-cover object-center';

  return (
    <div
      className={`relative overflow-hidden ${containerClassName}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          loading="lazy"
          className={`${baseMediaClass} ${imageClassName} transition-opacity duration-200 ${
            hasVideo && isHovered ? 'opacity-0' : 'opacity-100'
          }`}
        />
      ) : (
        <div className={`${baseMediaClass} bg-gray-100 flex items-center justify-center ${imageClassName}`}>
          <span className="text-gray-400 text-sm">No image</span>
        </div>
      )}

      {hasVideo && (
        <video
          ref={videoRef}
          src={videoUrl}
          muted
          loop
          playsInline
          preload="metadata"
          controls={false}
          className={`${baseMediaClass} absolute inset-0 ${videoClassName} transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />
      )}
    </div>
  );
};

export default HoverMedia;
