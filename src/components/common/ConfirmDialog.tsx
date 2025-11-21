import React from 'react';
import { X, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

export type DialogType = 'warning' | 'danger' | 'success' | 'info';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: DialogType;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  showCloseButton?: boolean;
}

const dialogConfig: Record<DialogType, {
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  confirmButtonColor: string;
}> = {
  warning: {
    icon: <AlertTriangle className="w-6 h-6" />,
    iconBgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    confirmButtonColor: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
  },
  danger: {
    icon: <XCircle className="w-6 h-6" />,
    iconBgColor: 'bg-red-100',
    iconColor: 'text-red-600',
    confirmButtonColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
  },
  success: {
    icon: <CheckCircle className="w-6 h-6" />,
    iconBgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    confirmButtonColor: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
  },
  info: {
    icon: <Info className="w-6 h-6" />,
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    confirmButtonColor: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
  }
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  type = 'warning',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  onConfirm,
  onCancel,
  loading = false,
  showCloseButton = true
}) => {
  if (!isOpen) return null;

  const config = dialogConfig[type];

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !loading) {
      onCancel();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity"></div>

      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
          {/* Close Button */}
          {showCloseButton && !loading && (
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="p-6">
            {/* Icon */}
            <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${config.iconBgColor} ${config.iconColor} mb-4`}>
              {config.icon}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              {title}
            </h3>

            {/* Message */}
            <p className="text-sm text-gray-600 text-center mb-6">
              {message}
            </p>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-center gap-3">
              <button
                onClick={onCancel}
                disabled={loading}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`px-6 py-2.5 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${config.confirmButtonColor}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
