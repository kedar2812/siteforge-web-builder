import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Pause, 
  Square, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Bug,
  RefreshCw,
  Download,
  Upload,
  Settings,
  Eye,
  Code,
  TestTube
} from 'lucide-react';

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  duration?: number;
  error?: string;
  details?: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

interface TestSuite {
  id: string;
  name: string;
  tests: TestResult[];
  status: 'pending' | 'running' | 'completed';
  duration?: number;
  passed: number;
  failed: number;
  skipped: number;
}

interface TestSuiteProps {
  onRunTests?: (tests: TestResult[]) => void;
  onExportResults?: (results: TestResult[]) => void;
  className?: string;
}

const MOCK_TESTS: TestResult[] = [
  // Unit Tests
  {
    id: 'test-1',
    name: 'Button component renders correctly',
    status: 'pending',
    category: 'unit',
    priority: 'high'
  },
  {
    id: 'test-2',
    name: 'Form validation works',
    status: 'pending',
    category: 'unit',
    priority: 'high'
  },
  {
    id: 'test-3',
    name: 'Color picker functionality',
    status: 'pending',
    category: 'unit',
    priority: 'medium'
  },
  {
    id: 'test-4',
    name: 'Typography scale calculations',
    status: 'pending',
    category: 'unit',
    priority: 'medium'
  },

  // Integration Tests
  {
    id: 'test-5',
    name: 'Template loading and rendering',
    status: 'pending',
    category: 'integration',
    priority: 'high'
  },
  {
    id: 'test-6',
    name: 'Drag and drop functionality',
    status: 'pending',
    category: 'integration',
    priority: 'high'
  },
  {
    id: 'test-7',
    name: 'Multi-select operations',
    status: 'pending',
    category: 'integration',
    priority: 'medium'
  },
  {
    id: 'test-8',
    name: 'Snap to grid behavior',
    status: 'pending',
    category: 'integration',
    priority: 'medium'
  },

  // E2E Tests
  {
    id: 'test-9',
    name: 'Complete website creation flow',
    status: 'pending',
    category: 'e2e',
    priority: 'high'
  },
  {
    id: 'test-10',
    name: 'Export functionality',
    status: 'pending',
    category: 'e2e',
    priority: 'high'
  },
  {
    id: 'test-11',
    name: 'Mobile responsive behavior',
    status: 'pending',
    category: 'e2e',
    priority: 'medium'
  },
  {
    id: 'test-12',
    name: 'Touch gesture interactions',
    status: 'pending',
    category: 'e2e',
    priority: 'medium'
  },

  // Performance Tests
  {
    id: 'test-13',
    name: 'Page load performance',
    status: 'pending',
    category: 'performance',
    priority: 'high'
  },
  {
    id: 'test-14',
    name: 'Memory usage optimization',
    status: 'pending',
    category: 'performance',
    priority: 'medium'
  },
  {
    id: 'test-15',
    name: 'Bundle size analysis',
    status: 'pending',
    category: 'performance',
    priority: 'medium'
  },

  // Accessibility Tests
  {
    id: 'test-16',
    name: 'WCAG compliance check',
    status: 'pending',
    category: 'accessibility',
    priority: 'high'
  },
  {
    id: 'test-17',
    name: 'Keyboard navigation',
    status: 'pending',
    category: 'accessibility',
    priority: 'high'
  },
  {
    id: 'test-18',
    name: 'Screen reader compatibility',
    status: 'pending',
    category: 'accessibility',
    priority: 'medium'
  }
];

const CATEGORIES = [
  { key: 'unit', label: 'Unit Tests', icon: TestTube },
  { key: 'integration', label: 'Integration Tests', icon: Code },
  { key: 'e2e', label: 'E2E Tests', icon: Eye },
  { key: 'performance', label: 'Performance Tests', icon: Clock },
  { key: 'accessibility', label: 'Accessibility Tests', icon: Bug }
];

export const TestSuite: React.FC<TestSuiteProps> = ({
  onRunTests,
  onExportResults,
  className = ''
}) => {
  const [tests, setTests] = useState<TestResult[]>(MOCK_TESTS);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const runTest = useCallback(async (test: TestResult): Promise<TestResult> => {
    // Simulate test execution
    const startTime = Date.now();
    
    // Simulate different test outcomes based on test ID
    const shouldPass = Math.random() > 0.2; // 80% pass rate
    const duration = Math.random() * 2000 + 500; // 500-2500ms
    
    await new Promise(resolve => setTimeout(resolve, duration));
    
    const endTime = Date.now();
    const actualDuration = endTime - startTime;

    if (shouldPass) {
      return {
        ...test,
        status: 'passed',
        duration: actualDuration
      };
    } else {
      return {
        ...test,
        status: 'failed',
        duration: actualDuration,
        error: 'Test assertion failed',
        details: 'Expected value did not match actual value'
      };
    }
  }, []);

  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    const updatedTests = [...tests];
    
    // Reset all tests
    updatedTests.forEach(test => {
      if (test.status !== 'skipped') {
        test.status = 'pending';
      }
    });
    setTests(updatedTests);

    // Run tests sequentially
    for (let i = 0; i < updatedTests.length; i++) {
      const test = updatedTests[i];
      if (test.status === 'skipped') continue;

      // Update test status to running
      updatedTests[i] = { ...test, status: 'running' };
      setTests([...updatedTests]);

      try {
        const result = await runTest(test);
        updatedTests[i] = result;
        setTests([...updatedTests]);
      } catch (error) {
        updatedTests[i] = {
          ...test,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
        setTests([...updatedTests]);
      }
    }

    setIsRunning(false);
    onRunTests?.(updatedTests);
  }, [tests, runTest, onRunTests]);

  const runCategoryTests = useCallback(async (category: string) => {
    setIsRunning(true);
    const categoryTests = tests.filter(test => test.category === category);
    const updatedTests = [...tests];
    
    // Reset category tests
    categoryTests.forEach(test => {
      const index = updatedTests.findIndex(t => t.id === test.id);
      if (index !== -1 && updatedTests[index].status !== 'skipped') {
        updatedTests[index].status = 'pending';
      }
    });
    setTests(updatedTests);

    // Run category tests
    for (const test of categoryTests) {
      const index = updatedTests.findIndex(t => t.id === test.id);
      if (index === -1 || updatedTests[index].status === 'skipped') continue;

      updatedTests[index] = { ...test, status: 'running' };
      setTests([...updatedTests]);

      try {
        const result = await runTest(test);
        updatedTests[index] = result;
        setTests([...updatedTests]);
      } catch (error) {
        updatedTests[index] = {
          ...test,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
        setTests([...updatedTests]);
      }
    }

    setIsRunning(false);
    onRunTests?.(updatedTests);
  }, [tests, runTest, onRunTests]);

  const skipTest = useCallback((testId: string) => {
    setTests(prev => prev.map(test => 
      test.id === testId ? { ...test, status: 'skipped' } : test
    ));
  }, []);

  const resetTests = useCallback(() => {
    setTests(prev => prev.map(test => ({ ...test, status: 'pending', error: undefined, details: undefined })));
  }, []);

  const exportResults = useCallback(() => {
    const results = tests.filter(test => test.status !== 'pending');
    onExportResults?.(results);
  }, [tests, onExportResults]);

  const getTestStats = () => {
    const total = tests.length;
    const passed = tests.filter(t => t.status === 'passed').length;
    const failed = tests.filter(t => t.status === 'failed').length;
    const skipped = tests.filter(t => t.status === 'skipped').length;
    const running = tests.filter(t => t.status === 'running').length;
    const pending = tests.filter(t => t.status === 'pending').length;

    return { total, passed, failed, skipped, running, pending };
  };

  const getCategoryStats = (category: string) => {
    const categoryTests = tests.filter(test => test.category === category);
    const passed = categoryTests.filter(t => t.status === 'passed').length;
    const failed = categoryTests.filter(t => t.status === 'failed').length;
    const total = categoryTests.length;

    return { total, passed, failed };
  };

  const filteredTests = selectedCategory === 'all' 
    ? tests 
    : tests.filter(test => test.category === selectedCategory);

  const stats = getTestStats();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'running': return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'skipped': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5" />
              Test Suite
            </CardTitle>
            <CardDescription>
              Comprehensive testing for all components and functionality
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={resetTests}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
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
            {/* Test Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.skipped}</div>
                <div className="text-sm text-muted-foreground">Skipped</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.running}</div>
                <div className="text-sm text-muted-foreground">Running</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">
                  {stats.passed + stats.failed + stats.skipped} / {stats.total}
                </span>
              </div>
              <Progress 
                value={((stats.passed + stats.failed + stats.skipped) / stats.total) * 100} 
                className="h-2"
              />
            </div>

            {/* Category Breakdown */}
            <div className="space-y-4">
              <h3 className="font-semibold">Test Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  const categoryStats = getCategoryStats(category.key);
                  const progress = categoryStats.total > 0 
                    ? ((categoryStats.passed + categoryStats.failed) / categoryStats.total) * 100 
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
                          <span>{categoryStats.passed} passed, {categoryStats.failed} failed</span>
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
            <div className="space-y-2">
              {filteredTests.map((test) => (
                <div key={test.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <div className="font-medium">{test.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {test.category} • <span className={getPriorityColor(test.priority)}>
                            {test.priority} priority
                          </span>
                          {test.duration && (
                            <span> • {test.duration}ms</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {test.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => skipTest(test.id)}
                        >
                          Skip
                        </Button>
                      )}
                      {test.status === 'failed' && test.error && (
                        <div className="text-sm text-red-600">
                          {test.error}
                        </div>
                      )}
                    </div>
                  </div>
                  {test.details && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {test.details}
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
                        <span>{categoryStats.passed} passed, {categoryStats.failed} failed</span>
                        <span>{Math.round(((categoryStats.passed + categoryStats.failed) / categoryStats.total) * 100)}% complete</span>
                      </div>
                      <Progress 
                        value={((categoryStats.passed + categoryStats.failed) / categoryStats.total) * 100} 
                        className="h-2"
                      />
                    </div>

                    <div className="mt-4 space-y-1">
                      {categoryTests.slice(0, 3).map((test) => (
                        <div key={test.id} className="flex items-center gap-2 text-sm">
                          {getStatusIcon(test.status)}
                          <span className="flex-1">{test.name}</span>
                          <span className={getPriorityColor(test.priority)}>
                            {test.priority}
                          </span>
                        </div>
                      ))}
                      {categoryTests.length > 3 && (
                        <div className="text-sm text-muted-foreground">
                          +{categoryTests.length - 3} more tests
                        </div>
                      )}
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

export default TestSuite;
