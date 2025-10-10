import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Zap, 
  Clock, 
  Database, 
  Wifi, 
  Cpu, 
  HardDrive,
  Play,
  Pause,
  Square,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Activity
} from 'lucide-react';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'good' | 'warning' | 'critical';
  description: string;
}

interface PerformanceTest {
  id: string;
  name: string;
  description: string;
  category: string;
  metrics: PerformanceMetric[];
  duration: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

interface PerformanceTesterProps {
  onTestComplete?: (results: PerformanceTest[]) => void;
  onExportResults?: (results: PerformanceTest[]) => void;
  className?: string;
}

const PERFORMANCE_TESTS: PerformanceTest[] = [
  {
    id: 'test-1',
    name: 'Page Load Performance',
    description: 'Measure initial page load time and resource loading',
    category: 'loading',
    duration: 0,
    status: 'pending',
    metrics: [
      {
        name: 'First Contentful Paint',
        value: 0,
        unit: 'ms',
        threshold: 1800,
        status: 'good',
        description: 'Time to first contentful paint'
      },
      {
        name: 'Largest Contentful Paint',
        value: 0,
        unit: 'ms',
        threshold: 2500,
        status: 'good',
        description: 'Time to largest contentful paint'
      },
      {
        name: 'Time to Interactive',
        value: 0,
        unit: 'ms',
        threshold: 3800,
        status: 'good',
        description: 'Time until page is interactive'
      }
    ]
  },
  {
    id: 'test-2',
    name: 'Memory Usage',
    description: 'Monitor memory consumption and leaks',
    category: 'memory',
    duration: 0,
    status: 'pending',
    metrics: [
      {
        name: 'Heap Used',
        value: 0,
        unit: 'MB',
        threshold: 50,
        status: 'good',
        description: 'JavaScript heap memory usage'
      },
      {
        name: 'Heap Total',
        value: 0,
        unit: 'MB',
        threshold: 100,
        status: 'good',
        description: 'Total heap memory allocated'
      },
      {
        name: 'Memory Leaks',
        value: 0,
        unit: 'count',
        threshold: 0,
        status: 'good',
        description: 'Number of memory leaks detected'
      }
    ]
  },
  {
    id: 'test-3',
    name: 'Bundle Analysis',
    description: 'Analyze JavaScript bundle size and composition',
    category: 'bundle',
    duration: 0,
    status: 'pending',
    metrics: [
      {
        name: 'Total Bundle Size',
        value: 0,
        unit: 'KB',
        threshold: 500,
        status: 'good',
        description: 'Total JavaScript bundle size'
      },
      {
        name: 'Vendor Bundle Size',
        value: 0,
        unit: 'KB',
        threshold: 200,
        status: 'good',
        description: 'Third-party library bundle size'
      },
      {
        name: 'Chunk Count',
        value: 0,
        unit: 'count',
        threshold: 10,
        status: 'good',
        description: 'Number of code chunks'
      }
    ]
  },
  {
    id: 'test-4',
    name: 'Network Performance',
    description: 'Test network requests and API performance',
    category: 'network',
    duration: 0,
    status: 'pending',
    metrics: [
      {
        name: 'API Response Time',
        value: 0,
        unit: 'ms',
        threshold: 500,
        status: 'good',
        description: 'Average API response time'
      },
      {
        name: 'Request Count',
        value: 0,
        unit: 'count',
        threshold: 20,
        status: 'good',
        description: 'Number of network requests'
      },
      {
        name: 'Failed Requests',
        value: 0,
        unit: 'count',
        threshold: 0,
        status: 'good',
        description: 'Number of failed requests'
      }
    ]
  },
  {
    id: 'test-5',
    name: 'Rendering Performance',
    description: 'Measure rendering performance and frame rates',
    category: 'rendering',
    duration: 0,
    status: 'pending',
    metrics: [
      {
        name: 'FPS',
        value: 0,
        unit: 'fps',
        threshold: 30,
        status: 'good',
        description: 'Frames per second'
      },
      {
        name: 'Frame Time',
        value: 0,
        unit: 'ms',
        threshold: 16.67,
        status: 'good',
        description: 'Average frame rendering time'
      },
      {
        name: 'Layout Shifts',
        value: 0,
        unit: 'count',
        threshold: 0,
        status: 'good',
        description: 'Cumulative Layout Shift score'
      }
    ]
  }
];

const CATEGORIES = [
  { key: 'loading', label: 'Loading Performance', icon: Clock },
  { key: 'memory', label: 'Memory Usage', icon: Database },
  { key: 'bundle', label: 'Bundle Analysis', icon: HardDrive },
  { key: 'network', label: 'Network Performance', icon: Wifi },
  { key: 'rendering', label: 'Rendering Performance', icon: Cpu }
];

export const PerformanceTester: React.FC<PerformanceTesterProps> = ({
  onTestComplete,
  onExportResults,
  className = ''
}) => {
  const [tests, setTests] = useState<PerformanceTest[]>(PERFORMANCE_TESTS);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const runPerformanceTest = useCallback(async (test: PerformanceTest): Promise<PerformanceTest> => {
    const startTime = Date.now();
    
    // Simulate performance testing
    await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 1000));
    
    const endTime = Date.now();
    const duration = endTime - startTime;

    // Simulate realistic performance metrics
    const updatedMetrics = test.metrics.map(metric => {
      let value = 0;
      
      switch (metric.name) {
        case 'First Contentful Paint':
          value = Math.random() * 2000 + 500;
          break;
        case 'Largest Contentful Paint':
          value = Math.random() * 3000 + 1000;
          break;
        case 'Time to Interactive':
          value = Math.random() * 4000 + 2000;
          break;
        case 'Heap Used':
          value = Math.random() * 100 + 20;
          break;
        case 'Heap Total':
          value = Math.random() * 200 + 50;
          break;
        case 'Total Bundle Size':
          value = Math.random() * 800 + 200;
          break;
        case 'API Response Time':
          value = Math.random() * 1000 + 100;
          break;
        case 'FPS':
          value = Math.random() * 30 + 30;
          break;
        case 'Frame Time':
          value = Math.random() * 20 + 10;
          break;
        default:
          value = Math.random() * 100;
      }

      const status = value <= metric.threshold ? 'good' : 
                   value <= metric.threshold * 1.5 ? 'warning' : 'critical';

      return {
        ...metric,
        value: Math.round(value * 100) / 100,
        status
      };
    });

    return {
      ...test,
      status: 'completed',
      duration,
      metrics: updatedMetrics
    };
  }, []);

  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    const updatedTests = [...tests];
    
    // Reset all tests
    updatedTests.forEach(test => {
      test.status = 'pending';
      test.duration = 0;
      test.metrics.forEach(metric => {
        metric.value = 0;
        metric.status = 'good';
      });
    });
    setTests(updatedTests);

    // Run tests sequentially
    for (let i = 0; i < updatedTests.length; i++) {
      const test = updatedTests[i];
      
      updatedTests[i] = { ...test, status: 'running' };
      setTests([...updatedTests]);

      try {
        const result = await runPerformanceTest(test);
        updatedTests[i] = result;
        setTests([...updatedTests]);
      } catch (error) {
        updatedTests[i] = {
          ...test,
          status: 'failed',
          duration: 0
        };
        setTests([...updatedTests]);
      }
    }

    setIsRunning(false);
    onTestComplete?.(updatedTests);
  }, [tests, runPerformanceTest, onTestComplete]);

  const runCategoryTests = useCallback(async (category: string) => {
    setIsRunning(true);
    const categoryTests = tests.filter(test => test.category === category);
    const updatedTests = [...tests];
    
    // Reset category tests
    categoryTests.forEach(test => {
      const index = updatedTests.findIndex(t => t.id === test.id);
      if (index !== -1) {
        updatedTests[index].status = 'pending';
        updatedTests[index].duration = 0;
        updatedTests[index].metrics.forEach(metric => {
          metric.value = 0;
          metric.status = 'good';
        });
      }
    });
    setTests(updatedTests);

    // Run category tests
    for (const test of categoryTests) {
      const index = updatedTests.findIndex(t => t.id === test.id);
      if (index === -1) continue;

      updatedTests[index] = { ...test, status: 'running' };
      setTests([...updatedTests]);

      try {
        const result = await runPerformanceTest(test);
        updatedTests[index] = result;
        setTests([...updatedTests]);
      } catch (error) {
        updatedTests[index] = {
          ...test,
          status: 'failed',
          duration: 0
        };
        setTests([...updatedTests]);
      }
    }

    setIsRunning(false);
    onTestComplete?.(updatedTests);
  }, [tests, runPerformanceTest, onTestComplete]);

  const exportResults = useCallback(() => {
    const results = tests.filter(test => test.status === 'completed');
    onExportResults?.(results);
  }, [tests, onExportResults]);

  const getTestStats = () => {
    const total = tests.length;
    const completed = tests.filter(t => t.status === 'completed').length;
    const running = tests.filter(t => t.status === 'running').length;
    const failed = tests.filter(t => t.status === 'failed').length;
    const pending = tests.filter(t => t.status === 'pending').length;

    return { total, completed, running, failed, pending };
  };

  const getCategoryStats = (category: string) => {
    const categoryTests = tests.filter(test => test.category === category);
    const completed = categoryTests.filter(t => t.status === 'completed').length;
    const total = categoryTests.length;

    return { total, completed };
  };

  const getMetricStatus = (metric: PerformanceMetric) => {
    switch (metric.status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getMetricIcon = (metric: PerformanceMetric) => {
    switch (metric.status) {
      case 'good': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const filteredTests = selectedCategory === 'all' 
    ? tests 
    : tests.filter(test => test.category === selectedCategory);

  const stats = getTestStats();

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Performance Tester
            </CardTitle>
            <CardDescription>
              Comprehensive performance testing and analysis
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportResults}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              size="sm" 
              onClick={() => runAllTests()} 
              disabled={isRunning}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run All
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Performance Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Tests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.running}</div>
                <div className="text-sm text-muted-foreground">Running</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">
                  {stats.completed} / {stats.total}
                </span>
              </div>
              <Progress 
                value={(stats.completed / stats.total) * 100} 
                className="h-2"
              />
            </div>

            {/* Category Breakdown */}
            <div className="space-y-4">
              <h3 className="font-semibold">Performance Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  const categoryStats = getCategoryStats(category.key);
                  const progress = categoryStats.total > 0 
                    ? (categoryStats.completed / categoryStats.total) * 100 
                    : 0;

                  return (
                    <div key={category.key} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{category.label}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => runCategoryTests(category.key)}
                          disabled={isRunning}
                        >
                          Run
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{categoryStats.completed} completed</span>
                          <span>{categoryStats.total} total</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tests" className="space-y-4">
            {/* Test Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((category) => (
                  <option key={category.key} value={category.key}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Test List */}
            <div className="space-y-4">
              {filteredTests.map((test) => (
                <div key={test.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{test.name}</h3>
                      <p className="text-sm text-muted-foreground">{test.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{test.category}</Badge>
                      {test.status === 'running' && (
                        <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                      )}
                      {test.status === 'completed' && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                      {test.status === 'failed' && (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  </div>

                  {test.status === 'completed' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {test.metrics.map((metric, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {getMetricIcon(metric)}
                                <span className="font-medium">{metric.name}</span>
                              </div>
                              <div className={`text-lg font-bold ${getMetricStatus(metric)}`}>
                                {metric.value} {metric.unit}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">
                              {metric.description}
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span>Threshold: {metric.threshold} {metric.unit}</span>
                              <Badge 
                                variant={metric.status === 'good' ? 'default' : 'destructive'}
                                className="text-xs"
                              >
                                {metric.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {test.duration > 0 && (
                        <div className="text-sm text-muted-foreground">
                          Test completed in {test.duration}ms
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            {/* Category Management */}
            <div className="space-y-4">
              {CATEGORIES.map((category) => {
                const Icon = category.icon;
                const categoryTests = tests.filter(test => test.category === category.key);
                const categoryStats = getCategoryStats(category.key);

                return (
                  <div key={category.key} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5" />
                        <span className="font-semibold">{category.label}</span>
                        <Badge variant="outline">{categoryStats.total} tests</Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => runCategoryTests(category.key)}
                        disabled={isRunning}
                      >
                        Run Category
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{categoryStats.completed} completed</span>
                        <span>{Math.round((categoryStats.completed / categoryStats.total) * 100)}% complete</span>
                      </div>
                      <Progress 
                        value={(categoryStats.completed / categoryStats.total) * 100} 
                        className="h-2"
                      />
                    </div>

                    <div className="mt-4 space-y-2">
                      {categoryTests.map((test) => (
                        <div key={test.id} className="flex items-center justify-between text-sm">
                          <span className="flex-1">{test.name}</span>
                          <div className="flex items-center gap-2">
                            {test.status === 'running' && (
                              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                            )}
                            {test.status === 'completed' && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                            {test.status === 'failed' && (
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                            )}
                            <span className="text-muted-foreground">
                              {test.duration > 0 ? `${test.duration}ms` : 'Pending'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PerformanceTester;
