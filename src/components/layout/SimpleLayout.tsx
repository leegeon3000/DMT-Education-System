import React from 'react';
import ErrorBoundary from '../common/ErrorBoundary';

interface SimpleLayoutProps {
  children: React.ReactNode;
}

const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <div style={{ minHeight: '100vh' }}>
        <main>
          {children}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default SimpleLayout;
