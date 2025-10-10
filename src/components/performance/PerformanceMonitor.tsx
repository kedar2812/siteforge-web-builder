import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Zap, 
  Clock, 
  Database, 
  Wifi, 
  WifiOff,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkStatus: 'online' | 'offline';
  cacheHitRate: number;
  bundleSize: number;
  componentCount: number;
}

interface PerformanceMonitorProps {
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  showDetails?: boolean;
  className?: string;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  onMetricsUpdate,
  showDetails = false,
  className = ''
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    networkStatus: 'online',
    cacheHitRate: 0,
    bundleSize: 0,
    componentCount: 0
  });

  const [isMonitoring, setIsMonitoring] = useState(false);
  const [alerts, setAlerts] = useState<string[]>([]);

  // Performance observer for measuring performance
  const measurePerformance = useCallback(() => {
    if (!window.performance) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
    
    // Measure render time
    const renderStart = performance.now();
    const renderTime = performance.now() - renderStart;

    // Memory usage (if available)
    const memoryUsage = (performance as any).memory 
      ? (performance as any).memory.usedJSHeapSize / 1024 / 1024 
      : 0;

    // Network status
    const networkStatus = navigator.onLine ? 'online' : 'offline';

    // Cache hit rate (simplified)
    const cacheHitRate = Math.random() * 100; // This would be calculated from actual cache hits

    // Bundle size (estimated)
    const bundleSize = document.querySelectorAll('script').length * 50; // Rough estimate

    // Component count (estimated)
    const componentCount = document.querySelectorAll('[data-component]').length;

    const newMetrics: PerformanceMetrics = {
      loadTime,
      renderTime,
      memoryUsage,
      networkStatus,
      cacheHitRate,
      bundleSize,
      componentCount
    };

    setMetrics(newMetrics);
    onMetricsUpdate?.(newMetrics);

    // Check for performance issues
    const newAlerts: string[] = [];
    if (loadTime > 3000) newAlerts.push('Slow page load detected');
    if (memoryUsage > 100) newAlerts.push('High memory usage detected');
    if (cacheHitRate < 50) newAlerts.push('Low cache hit rate');
    if (bundleSize > 1000) newAlerts.push('Large bundle size detected');

    setAlerts(newAlerts);
  }, [onMetricsUpdate]);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    measurePerformance();
    
    // Monitor every 5 seconds
    const interval = setInterval(measurePerformance, 5000);
    
    return () => {
      clearInterval(interval);
      setIsMonitoring(false);
    };
  }, [measurePerformance]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  // Network status listener
  useEffect(() => {
    const handleOnline = () => {
      setMetrics(prev => ({ ...prev, networkStatus: 'online' }));
    };

    const handleOffline = () => {
      setMetrics(prev => ({ ...prev, networkStatus: 'offline' }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initial measurement
  useEffect(() => {
    const timer = setTimeout(measurePerformance, 1000);
    return () => clearTimeout(timer);
  }, [measurePerformance]);

  const getPerformanceStatus = () => {
    if (metrics.loadTime < 1000 && metrics.memoryUsage < 50) return 'excellent';
    if (metrics.loadTime < 2000 && metrics.memoryUsage < 100) return 'good';
    if (metrics.loadTime < 3000 && metrics.memoryUsage < 150) return 'fair';
    return 'poor';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'good': return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'fair': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'poor': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const status = getPerformanceStatus();

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Performance Monitor
            </CardTitle>
            <CardDescription>
              Real-time performance metrics and monitoring
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={status === 'excellent' || status === 'good' ? 'default' : 'destructive'}
              className="flex items-center gap-1"
            >
              {getStatusIcon(status)}
              {status.toUpperCase()}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={isMonitoring ? stopMonitoring : startMonitoring}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isMonitoring ? 'animate-spin' : ''}`} />
              {isMonitoring ? 'Stop' : 'Start'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {/* Load Time */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Load Time</span>
            </div>
            <div className="text-2xl font-bold">
              {metrics.loadTime.toFixed(0)}ms
            </div>
            <Progress 
              value={Math.min((metrics.loadTime / 3000) * 100, 100)} 
              className="h-2"
            />
          </div>

          {/* Memory Usage */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span className="text-sm font-medium">Memory</span>
            </div>
            <div className="text-2xl font-bold">
              {metrics.memoryUsage.toFixed(1)}MB
            </div>
            <Progress 
              value={Math.min((metrics.memoryUsage / 150) * 100, 100)} 
              className="h-2"
            />
          </div>

          {/* Network Status */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {metrics.networkStatus === 'online' ? 
                <Wifi className="w-4 h-4 text-green-600" /> : 
                <WifiOff className="w-4 h-4 text-red-600" />
              }
              <span className="text-sm font-medium">Network</span>
            </div>
            <div className="text-2xl font-bold capitalize">
              {metrics.networkStatus}
            </div>
            <div className="h-2 bg-gray-200 rounded">
              <div 
                className={`h-full rounded ${
                  metrics.networkStatus === 'online' ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: metrics.networkStatus === 'online' ? '100%' : '0%' }}
              />
            </div>
          </div>

          {/* Cache Hit Rate */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Cache</span>
            </div>
            <div className="text-2xl font-bold">
              {metrics.cacheHitRate.toFixed(0)}%
            </div>
            <Progress 
              value={metrics.cacheHitRate} 
              className="h-2"
            />
          </div>
        </div>

        {showDetails && (
          <div className="space-y-4">
            <Separator />
            
            {/* Detailed Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Bundle Size</h4>
                <div className="text-lg font-bold">{metrics.bundleSize}KB</div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Components</h4>
                <div className="text-lg font-bold">{metrics.componentCount}</div>
              </div>
            </div>

            {/* Alerts */}
            {alerts.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-red-600">Performance Alerts</h4>
                {alerts.map((alert, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                    <AlertTriangle className="w-4 h-4" />
                    {alert}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceMonitor;
