import {
  HardDrive,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import useGoogleDriveStatus from '../../hooks/useGoogleDriveStatus';

const GoogleDriveCard = () => {
  const { status, fetchStatus } = useGoogleDriveStatus();

  if (status.loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <HardDrive className="w-5 h-5 text-charcoal animate-pulse" />
          </div>

          <h2 className="text-lg font-semibold text-gray-700">
            Google Drive
          </h2>
        </div>

        <p className="text-sm text-gray-500 mb-3">
          Checking connection status...
        </p>

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

          <h2 className="text-lg font-semibold text-gray-700">
            Google Drive
          </h2>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Unable to check Google Drive connection.
        </p>

        <button
          onClick={fetchStatus}
          className="px-3 py-2 bg-charcoal text-ivory text-sm rounded-md hover:bg-deep-brown flex items-center gap-2"
        >
          <RefreshCw className="w-3 h-3" />
          Check Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <HardDrive className="w-5 h-5 text-charcoal" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700">
            Google Drive
          </h2>

          <p className="text-xs text-gray-400">
            Media storage
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 mb-4">
        {status.connected
          ? 'Google Drive is connected and ready for image and video uploads.'
          : 'Google Drive is currently not connected.'}
      </p>

      {/* Status information */}
      <div className="space-y-3 mb-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Status
          </span>

          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                status.connected
                  ? 'bg-green-500'
                  : 'bg-red-500'
              }`}
            />

            <span className="text-sm font-medium text-gray-700">
              {status.connected
                ? 'Connected'
                : 'Not connected'}
            </span>
          </div>
        </div>

        {/* Google Account */}
        {status.connected && status.email && (
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-600">
              Account
            </span>

            <span className="text-sm text-gray-700 text-right break-all">
              {status.email}
            </span>
          </div>
        )}

        {/* Folder Status */}
        {status.connected && status.folderId && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Folder accessible
            </span>

            {status.folderAccessible ? (
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-600" />

                <span className="text-xs text-green-600">
                  Yes
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <XCircle className="w-4 h-4 text-red-600" />

                <span className="text-xs text-red-600">
                  No
                </span>
              </div>
            )}
          </div>
        )}

        {/* Server configuration */}
        {!status.configured && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Configuration
            </span>

            <span className="text-sm text-red-600">
              Not configured
            </span>
          </div>
        )}
      </div>

      {/* Refresh status only */}
      <button
        onClick={fetchStatus}
        disabled={status.loading}
        className="w-full px-3 py-2 bg-charcoal text-ivory text-sm rounded-md hover:bg-deep-brown flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RefreshCw className="w-3 h-3" />

        Refresh Status
      </button>
    </div>
  );
};

export default GoogleDriveCard;