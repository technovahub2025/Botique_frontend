import { useState, useRef } from 'react';
import { Upload, X, Check, AlertCircle } from 'lucide-react';
import adminApi from '../../services/adminApi';
import { getImageUrl } from '../../services/imageUrl';

const ImageUploadField = ({
  label,
  value,
  onChange,
  onMetadataChange,
  accept = 'image/jpeg,image/png,image/webp,image/gif',
  maxSize = 10 * 1024 * 1024,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  const fileInputRef = useRef(null);

  const imageUrl = value ? getImageUrl(value) : '';

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = '';

    setError('');

    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return;
    }

    if (file.size > maxSize) {
      setError('Image is too large. Maximum size is 10MB.');
      return;
    }

    setUploading(true);
    setPreview(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await adminApi.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        onChange(res.data.url);
        if (onMetadataChange && res.data.driveFileId) {
          onMetadataChange({
            driveFileId: res.data.driveFileId,
            originalName: res.data.originalName,
            mimeType: res.data.mimeType,
          });
        }
        setPreview('');
      } else {
        setError(res.data.message || 'Upload failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
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
    setError('');
  };

  const displayUrl = preview || imageUrl;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}

      {displayUrl ? (
        <div className="relative mb-2">
          <img
            src={displayUrl}
            alt={label || 'Image preview'}
            className="w-full max-w-[200px] h-32 object-cover rounded-md border border-gray-200"
            onError={(e) => {
              if (!e.currentTarget.dataset.tried) {
                e.currentTarget.dataset.tried = 'true';
              }
            }}
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-md">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold"></div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-[200px] h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center mb-2">
          <span className="text-gray-500 text-sm">No image</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1 text-sm text-red-600 mb-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={uploading}
          className="px-3 py-1 bg-charcoal text-ivory text-sm rounded-md hover:bg-deep-brown flex items-center gap-1 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-ivory"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-3 h-3" />
              Upload Image
            </>
          )}
        </button>

        {displayUrl && (
          <button
            type="button"
            onClick={handleRemove}
            className="px-3 py-1 border border-gray-300 text-sm rounded-md hover:bg-gray-100 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Remove
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={accept}
        className="hidden"
      />
    </div>
  );
};

export default ImageUploadField;
