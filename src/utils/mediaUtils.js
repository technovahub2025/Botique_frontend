// frontend/src/utils/mediaUtils.js
import { getImageUrl } from '../services/imageUrl';

const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov', 'm4v', 'ogg', 'ogv'];

export const isVideoUrl = (url) => {
  if (!url || typeof url !== 'string') return false;

  const cleanUrl = url.toLowerCase().split('?')[0].split('#')[0];

  return VIDEO_EXTENSIONS.some((ext) => cleanUrl.endsWith(`.${ext}`));
};

export const resolveMediaUrl = (value) => {
  if (!value) return '';
  const url = typeof value === 'string' ? getImageUrl(value) : getImageUrl(value);
  return url || '';
};

export const isVideoMedia = (value, mimeType) => {
  const url = typeof value === 'string' ? value : '';
  if (mimeType && mimeType.startsWith('video/')) return true;
  return isVideoUrl(url);
};
