// This file exports common components used throughout the application. 
// You can add your common components here as needed.

// Core components that are actually used
export { Icons } from './Icons';
export { default as Loader } from './Spinner';
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Input } from './Input';
export { default as Modal } from './Modal';

// Optimized components for better performance
export { 
  ErrorBoundary, 
  SuspenseWrapper, 
  LazyImage, 
  usePerformanceMonitor, 
  SEOHead 
} from './OptimizedComponents';

// Background section components for dynamic backgrounds
export { 
  BackgroundSection, 
  GradientBackground, 
  SECTION_BACKGROUNDS 
} from './BackgroundSection';

// Teacher UI Components (new)
export { default as DataTable } from './DataTable';
export { default as FilterBar } from './FilterBar';
export { default as StatusBadge } from './StatusBadge';
export { default as ConfirmDialog } from './ConfirmDialog';

// Type exports for Teacher UI
export type { ColumnDef, DataTableProps } from './DataTable';
export type { FilterConfig, FilterBarProps, FilterType } from './FilterBar';
export type { StatusBadgeProps, StatusType } from './StatusBadge';
export type { ConfirmDialogProps, DialogType } from './ConfirmDialog';