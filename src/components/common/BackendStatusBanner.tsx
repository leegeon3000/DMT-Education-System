import React, { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw, CheckCircle } from 'lucide-react';
import { healthCheckService } from '../../services/healthCheck';

interface HealthStatus {
  isHealthy: boolean;
  lastCheck: Date;
  error?: string;
  latency?: number;
}

const BackendStatusBanner: React.FC = () => {
  const [status, setStatus] = useState<HealthStatus>(healthCheckService.getStatus());
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // Start health monitoring
    healthCheckService.start();

    // Subscribe to status changes
    const unsubscribe = healthCheckService.subscribe((newStatus) => {
      setStatus(newStatus);
    });

    // Cleanup
    return () => {
      unsubscribe();
    };
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    await healthCheckService.checkHealth();
    setTimeout(() => setIsRetrying(false), 1000);
  };

  // Don't show banner if healthy
  if (status.isHealthy) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'linear-gradient(135deg, #dc2626, #991b1b)',
        color: 'white',
        padding: '12px 16px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        animation: 'slideDown 0.3s ease-out',
      }}
    >
      <AlertTriangle size={20} />
      <span style={{ flex: 1, textAlign: 'center', fontWeight: 500 }}>
        ⚠️ Không kết nối được với server. Vui lòng kiểm tra backend hoặc thử lại.
        {status.error && ` (${status.error})`}
      </span>
      <button
        onClick={handleRetry}
        disabled={isRetrying}
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '6px',
          padding: '6px 16px',
          color: 'white',
          cursor: isRetrying ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '14px',
          fontWeight: 500,
          transition: 'all 0.2s',
          opacity: isRetrying ? 0.6 : 1,
        }}
        onMouseEnter={(e) => {
          if (!isRetrying) {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
        }}
      >
        <RefreshCw size={16} className={isRetrying ? 'spin' : ''} />
        {isRetrying ? 'Đang kiểm tra...' : 'Thử lại'}
      </button>

      <style>
        {`
          @keyframes slideDown {
            from {
              transform: translateY(-100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          .spin {
            animation: spin 1s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default BackendStatusBanner;
