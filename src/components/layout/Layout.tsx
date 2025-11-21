import React from 'react';
import ModernHeader from './ModernHeader';
import ModernFooter from '../home/ModernFooter';
import { ErrorBoundary } from '../common';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <ModernHeader />
        <main className="flex-grow pt-16 lg:pt-20">
          {children}
        </main>
        <ModernFooter />
      </div>
    </ErrorBoundary>
  );
};

export default Layout;
