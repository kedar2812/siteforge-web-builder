import React, { Suspense, lazy } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="w-6 h-6 animate-spin" />
  </div>
);

// Loading skeleton for components
const ComponentSkeleton = () => (
  <Card>
    <CardContent className="p-6">
      <div className="space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-32 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Lazy load heavy components
export const LazyTemplateGallery = lazy(() => 
  import('@/components/builder/EnhancedTemplateGallery').then(module => ({
    default: module.EnhancedTemplateGallery
  }))
);

export const LazyTemplateCustomizationWizard = lazy(() => 
  import('@/components/builder/TemplateCustomizationWizard').then(module => ({
    default: module.TemplateCustomizationWizard
  }))
);

export const LazyDesignSystemPanel = lazy(() => 
  import('@/components/design-system/DesignSystemPanel').then(module => ({
    default: module.DesignSystemPanel
  }))
);

export const LazyColorPicker = lazy(() => 
  import('@/components/design-system/ColorPicker').then(module => ({
    default: module.default
  }))
);

export const LazyTypographyScale = lazy(() => 
  import('@/components/design-system/TypographyScale').then(module => ({
    default: module.default
  }))
);

export const LazyAlignmentGuides = lazy(() => 
  import('@/components/builder/AlignmentGuides').then(module => ({
    default: module.AlignmentGuides
  }))
);

export const LazyMultiSelect = lazy(() => 
  import('@/components/builder/MultiSelect').then(module => ({
    default: module.MultiSelect
  }))
);

export const LazySnapToGrid = lazy(() => 
  import('@/components/builder/SnapToGrid').then(module => ({
    default: module.SnapToGrid
  }))
);

// Higher-order component for lazy loading with fallback
export const withLazyLoading = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) => {
  return (props: P) => (
    <Suspense fallback={fallback || <ComponentSkeleton />}>
      <Component {...props} />
    </Suspense>
  );
};

// Lazy loaded components with fallbacks
export const LazyTemplateGalleryWithFallback = withLazyLoading(LazyTemplateGallery);
export const LazyTemplateCustomizationWizardWithFallback = withLazyLoading(LazyTemplateCustomizationWizard);
export const LazyDesignSystemPanelWithFallback = withLazyLoading(LazyDesignSystemPanel);
export const LazyColorPickerWithFallback = withLazyLoading(LazyColorPicker);
export const LazyTypographyScaleWithFallback = withLazyLoading(LazyTypographyScale);
export const LazyAlignmentGuidesWithFallback = withLazyLoading(LazyAlignmentGuides);
export const LazyMultiSelectWithFallback = withLazyLoading(LazyMultiSelect);
export const LazySnapToGridWithFallback = withLazyLoading(LazySnapToGrid);

// Error boundary for lazy components
export class LazyComponentErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Failed to load component</p>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Lazy component wrapper with error boundary
export const LazyComponent = ({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode 
}) => (
  <LazyComponentErrorBoundary fallback={fallback}>
    <Suspense fallback={<ComponentSkeleton />}>
      {children}
    </Suspense>
  </LazyComponentErrorBoundary>
);

export default LazyComponent;
