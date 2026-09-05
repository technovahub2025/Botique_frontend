import { useState, useEffect, useCallback } from 'react';
import adminApi from '../services/adminApi';

const useGoogleDriveStatus = () => {
  const [status, setStatus] = useState({
    loading: true,
    configured: false,
    connected: false,
    email: null,
    folderAccessible: false,
    folderId: null,
    error: null,
  });

  const fetchStatus = useCallback(async () => {
    setStatus((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const res = await adminApi.get('/google-drive/status');

      if (res.data.success) {
        setStatus({
          loading: false,
          configured: res.data.configured || false,
          connected: res.data.connected || false,
          email: res.data.email || null,
          folderAccessible: res.data.folderAccessible || false,
          folderId: res.data.folderId || null,
          error: null,
        });
      } else {
        setStatus((prev) => ({
          ...prev,
          loading: false,
          error: res.data.message || 'Failed to check Google Drive status',
        }));
      }
    } catch (err) {
      setStatus((prev) => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Unable to check Google Drive connection',
      }));
    }
  }, []);

  const handleConnect = () => {
    const baseUrl = adminApi.defaults.baseURL || '';
    window.location.href = `${baseUrl}/google-drive/auth`;
  };

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    status,
    fetchStatus,
    handleConnect,
    isConnected: status.connected,
    isLoading: status.loading,
  };
};

export default useGoogleDriveStatus;
