import { useState, useRef } from 'react';
import { Upload, X, AlertCircle, Image as ImageIcon, Video } from 'lucide-react';
import adminApi from '../../services/adminApi';
import { getImageUrl } from '../../services/imageUrl';
import { isVideoUrl as isVideoUrlExt, isVideoMimeType } from '../../utils/mediaUtils';

const ImageUploadField = ({
  label,
  value,
  onChange,
  onMetadataChange,
  accept = 'image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime',
  maxSize = 50 * 1024 * 1024,
  mimeType = '',
  mediaType = 'any',
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  const [previewType, setPreviewType] = useState('');
  const fileInputRef = useRef(null);

  const mediaUrl = value ? getImageUrl(value) : '';

  const isVideoFile = (file) => {
    return file?.type?.startsWith('video/');
  };

  const isImageFile = (file) => {
    return file?.type?.startsWith('image/');
  };

  const isVideoUrl = (url) => {
    if (!url) return false;
    return isVideoUrlExt(url);
  };

  const isVideoByMimeType = (mt) => {
    return isVideoMimeType(mt);
  };

  const getHelpText = () => {
    if (mediaType === 'image') {
      return 'Supported: JPG, PNG, WEBP, GIF • Max 10MB';
    }
    if (mediaType === 'video') {
      return 'Supported: MP4, WEBM, MOV, OGG • Max 50MB';
    }
    return 'Supported: JPG, PNG, WEBP, GIF, MP4, WEBM, MOV, M4V, OGG, OGV • Max 50MB';
  };

  const getButtonContent = (isUploading) => {
    const sizeLabel = mediaType === 'image' ? 'Image' : mediaType === 'video' ? 'Video' : 'Media';
    if (isUploading) {
      return (
        <>
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-ivory"></div>
          Uploading...
        </>
      );
    }
    return (
      <>
        <Upload className="w-3 h-3" />
        {`Upload ${sizeLabel}`}
      </>
    );
  };

  const validateFile = (file) => {
    const fileIsImage = isImageFile(file);
    const fileIsVideo = isVideoFile(file);

    if (mediaType === 'image' && !fileIsImage) {
      return 'Only image files are allowed.';
    }

    if (mediaType === 'video' && !fileIsVideo) {
      return 'Only video files are allowed.';
    }

    if (!fileIsImage && !fileIsVideo) {
      return 'Only image or video files are allowed.';
    }

    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      return `File is too large. Maximum size is ${maxSizeMB}MB.`;
    }

    return null;
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Allow the same file to be selected again
    e.target.value = '';

    setError('');

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // -----------------------------------------
    // Create local preview
    // -----------------------------------------
    const localPreview = URL.createObjectURL(file);

    setPreview(localPreview);
    setPreviewType(isVideoFile(file) ? 'video' : 'image');
    setUploading(true);

    try {
      const formData = new FormData();

      // Keep the existing backend field name
      // so other upload functionality doesn't break.
      formData.append('image', file);

      const res = await adminApi.post(
        '/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (res.data.success) {
        onChange(res.data.url);

        if (onMetadataChange) {
          onMetadataChange({
            driveFileId: res.data.driveFileId,
            originalName: res.data.originalName,
            mimeType: res.data.mimeType || file.type,
          });
        }

        // Keep uploaded URL as the final preview
        setPreview('');
        setPreviewType('');
      } else {
        setError(
          res.data.message || 'Upload failed'
        );
      }
    } catch (err) {
      console.error('Media upload error:', err);

      setError(
        err.response?.data?.message ||
        'Upload failed. Please try again.'
      );
    } finally {
      setUploading(false);

      // Clean up temporary preview URL
      URL.revokeObjectURL(localPreview);
    }
  };

  const handleUploadClick = () => {
    setError('');
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    onChange('');

    if (onMetadataChange) {
      onMetadataChange(null);
    }

    setPreview('');
    setPreviewType('');
    setError('');
  };

  const displayUrl = preview || mediaUrl;

  const displayingVideo =
    preview
      ? previewType === 'video'
      : (isVideoByMimeType(mimeType) || isVideoUrl(mediaUrl));

  return (
    <div className="mb-4">

      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      {/* -------------------------------------- */}
      {/* Media Preview */}
      {/* -------------------------------------- */}

      {displayUrl ? (
        <div className="relative mb-2">

          {displayingVideo ? (
            <video
              src={displayUrl}
              controls
              muted
              playsInline
              preload="metadata"
              className="w-full max-w-[300px] h-40 object-cover rounded-md border border-gray-200 bg-black"
              onError={() => {
                setError(
                  'Unable to display this video.'
                );
              }}
            >
              Your browser does not support video playback.
            </video>
          ) : (
            <img
              src={displayUrl}
              alt={label || 'Image preview'}
              className="w-full max-w-[300px] h-40 object-cover rounded-md border border-gray-200"
              onError={(e) => {
                if (!e.currentTarget.dataset.tried) {
                  e.currentTarget.dataset.tried = 'true';
                }
              }}
            />
          )}

          {/* Uploading Overlay */}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-md">
              <div className="flex flex-col items-center gap-2">

                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold"></div>

                <span className="text-xs text-gray-700">
                  Uploading...
                </span>

              </div>
            </div>
          )}

          {/* Media Type Indicator */}
          {!uploading && (
            <div className="absolute top-2 left-2">

              {displayingVideo ? (
                <span className="flex items-center gap-1 px-2 py-1 text-xs bg-black/70 text-white rounded">
                  <Video className="w-3 h-3" />
                  Video
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2 py-1 text-xs bg-black/70 text-white rounded">
                  <ImageIcon className="w-3 h-3" />
                  Image
                </span>
              )}

            </div>
          )}

        </div>
      ) : (
        <div className="w-full max-w-[300px] h-40 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center mb-2">

          <Upload className="w-6 h-6 text-gray-400 mb-2" />

          <span className="text-gray-500 text-sm">
            No media selected
          </span>

          <span className="text-gray-400 text-xs mt-1">
            {mediaType === 'image'
              ? 'Image'
              : mediaType === 'video'
                ? 'Video'
                : 'Image or Video'}
          </span>

        </div>
      )}

      {/* -------------------------------------- */}
      {/* Error */}
      {/* -------------------------------------- */}

      {error && (
        <div className="flex items-center gap-1 text-sm text-red-600 mb-2">

          <AlertCircle className="w-4 h-4" />

          <span>{error}</span>

        </div>
      )}

      {/* -------------------------------------- */}
      {/* Buttons */}
      {/* -------------------------------------- */}

      <div className="flex gap-2">

        <button
          type="button"
          onClick={handleUploadClick}
          disabled={uploading}
          className="px-3 py-1 bg-charcoal text-ivory text-sm rounded-md hover:bg-deep-brown flex items-center gap-1 disabled:opacity-50"
        >
          {getButtonContent(uploading)}
        </button>

        {displayUrl && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={uploading}
            className="px-3 py-1 border border-gray-300 text-sm rounded-md hover:bg-gray-100 flex items-center gap-1 disabled:opacity-50"
          >
            <X className="w-3 h-3" />

            Remove
          </button>
        )}

      </div>

      {/* -------------------------------------- */}
      {/* Hidden File Input */}
      {/* -------------------------------------- */}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={accept}
        className="hidden"
      />

      {/* Help Text */}
      <p className="text-xs text-gray-500 mt-1">
        {getHelpText()}
      </p>

    </div>
  );
};

export default ImageUploadField;
