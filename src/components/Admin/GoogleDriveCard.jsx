import { useState, useEffect } from 'react';
import { HardDrive, RefreshCw, CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
import adminApi from '../../services/adminApi';

const GoogleDriveCard = () => {
  const [status, setStatus] = useState({
    loading: true,
    configured: false,
    connected: false,
    email: null,
    folderAccessible: false,
    folderId: null,
    error: null,
  });

  const fetchStatus = async () => {
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
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleConnect = () => {
    const baseUrl = adminApi.defaults.baseURL || '';
    window.location.href = `${baseUrl}/google-drive/auth`;
  };

  const handleReconnect = () => {
    const baseUrl = adminApi.defaults.baseURL || '';
    window.location.href = `${baseUrl}/google-drive/auth`;
  };

  const handleTryAgain = () => {
    fetchStatus();
  };

  const getConnectButtonLabel = () => {
    if (!status.configured) return 'Configure Required';
    return 'Connect Google Drive';
  };

  const getConnectButtonDisabled = () => {
    if (status.loading) return true;
    if (!status.configured) return true;
    return false;
  };

  const getConnectButtonTitle = () => {
    if (!status.configured) {
      return 'Google Drive OAuth is not configured on the server. Contact your system administrator.';
    }
    return null;
  };

  if (status.loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <HardDrive className="w-5 h-5 text-charcoal animate-pulse" />
          </div>
          <h2 className="text-lg font-semibold text-gray-700">Google Drive</h2>
        </div>
        <p className="text-sm text-gray-500 mb-3">Checking connection status...</p>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (status.error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-700">Google Drive</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">Unable to check connection.</p>
        <button
          onClick={handleTryAgain}
          className="px-3 py-1 bg-charcoal text-ivory text-sm rounded-md hover:bg-deep-brown flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <HardDrive className="w-5 h-5 text-charcoal" />
        </div>
        <h2 className="text-lg font-semibold text-gray-700">Google Drive</h2>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        {status.connected
          ? 'Your Google Drive is connected and ready for image uploads.'
          : 'Connect Google Drive to store all your boutique images securely in your Google Drive.'}
      </p>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status</span>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                status.connected ? 'bg-green-500' : 'bg-red-500'
              }`}
            ></span>
            <span className="text-sm font-medium text-gray-700">
              {status.connected ? 'Connected' : 'Not connected'}
            </span>
          </div>
        </div>

        {status.connected && status.email && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Account</span>
            <span className="text-sm text-gray-700">{status.email}</span>
          </div>
        )}

        {status.connected && status.folderId && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Folder accessible</span>
            {status.folderAccessible ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
          </div>
        )}

        {!status.configured && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Configuration</span>
            <span className="text-sm text-red-600">Not configured</span>
          </div>
        )}
      </div>

      <button
        onClick={status.connected ? handleReconnect : handleConnect}
        disabled={getConnectButtonDisabled()}
        title={getConnectButtonTitle()}
        className="w-full px-3 py-2 bg-charcoal text-ivory text-sm rounded-md hover:bg-deep-brown flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status.connected ? (
          <>
            <RefreshCw className="w-3 h-3" />
            Reconnect
          </>
        ) : (
          <>
            <ExternalLink className="w-3 h-3" />
            {getConnectButtonLabel()}
          </>
        )}
      </button>
    </div>
  );
};

export default GoogleDriveCard;
