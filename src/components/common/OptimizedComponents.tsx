import React, { Suspense } from 'react';

// Optimized Error Boundary Component
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          color: '#dc2626',
          backgroundColor: '#fef2f2',
          borderRadius: '8px',
          border: '1px solid #ffffffff'
        }}>
          <h3>Đã xảy ra lỗi</h3>
          <p>Vui lòng tải lại trang hoặc liên hệ hỗ trợ.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Tải lại trang
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Optimized Suspense Wrapper
export const SuspenseWrapper: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <Suspense fallback={fallback || <div>Đang tải...</div>}>
    {children}
  </Suspense>
);

// Optimized Lazy Image Component
export const LazyImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
}> = ({ src, alt, className, style, loading = 'lazy' }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  return (
    <div style={{ position: 'relative', ...style }} className={className}>
      {!isLoaded && !hasError && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px'
        }}>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>Đang tải...</div>
        </div>
      )}
      
      {hasError ? (
        <div style={{
          backgroundColor: '#f9fafb',
          border: '2px dashed #d1d5db',
          borderRadius: '4px',
          padding: '20px',
          textAlign: 'center',
          color: '#6b7280'
        }}>
          Không thể tải ảnh
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={loading}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.3s ease',
            opacity: isLoaded ? 1 : 0
          }}
        />
      )}
    </div>
  );
};

// Performance Monitor Hook with componentName parameter
export const usePerformanceMonitor = (componentName: string) => {
  React.useEffect(() => {
    const isDevelopment = window.location.hostname === 'localhost';
    
    if (!isDevelopment) return;

    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 16.67) { // More than one frame (60fps)
        console.warn(`⚡ Performance Warning: ${componentName} took ${renderTime.toFixed(2)}ms to render`);
      }
    };
  }, [componentName]);

  const logInteraction = React.useCallback((action: string) => {
    if (window.location.hostname === 'localhost') {
      console.log(`🎯 User Interaction: ${componentName} - ${action}`);
    }
  }, [componentName]);

  return { logInteraction };
};

// SEO Head Component
export const SEOHead: React.FC<{
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
}> = ({ 
  title = 'DMT Education - Vững nguồn tri thức, tiếp bước tương lai',
  description = 'Trung tâm giáo dục DMT cung cấp các khóa học chất lượng cao với phương pháp giảng dạy hiện đại.',
  keywords = 'giáo dục, học tập, DMT Education, IELTS, toán học, tiếng anh',
  image = '/logo-dmt.png'
}) => {
  React.useEffect(() => {
    document.title = title;
    
    // Update meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }
    
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      ogImage.setAttribute('content', image);
    }
  }, [title, description, keywords, image]);

  return null;
};
