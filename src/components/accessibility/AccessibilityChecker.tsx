import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Accessibility, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX,
  MousePointer,
  Keyboard,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  RefreshCw,
  Download,
  Settings
} from 'lucide-react';

interface AccessibilityIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  element?: string;
  suggestion?: string;
  severity: 'high' | 'medium' | 'low';
  wcagLevel: 'A' | 'AA' | 'AAA';
  category: string;
}

interface AccessibilityReport {
  score: number;
  issues: AccessibilityIssue[];
  passed: number;
  failed: number;
  warnings: number;
  info: number;
  categories: {
    [key: string]: {
      passed: number;
      failed: number;
      warnings: number;
    };
  };
}

interface AccessibilityCheckerProps {
  onReport?: (report: AccessibilityReport) => void;
  className?: string;
}

const WCAG_CATEGORIES = [
  { key: 'color', label: 'Color & Contrast', icon: Eye },
  { key: 'keyboard', label: 'Keyboard Navigation', icon: Keyboard },
  { key: 'focus', label: 'Focus Management', icon: MousePointer },
  { key: 'semantics', label: 'Semantic HTML', icon: Accessibility },
  { key: 'media', label: 'Media & Images', icon: Volume2 },
  { key: 'forms', label: 'Forms & Inputs', icon: Settings }
];

export const AccessibilityChecker: React.FC<AccessibilityCheckerProps> = ({
  onReport,
  className = ''
}) => {
  const [report, setReport] = useState<AccessibilityReport>({
    score: 0,
    issues: [],
    passed: 0,
    failed: 0,
    warnings: 0,
    info: 0,
    categories: {}
  });
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Check for common accessibility issues
  const checkAccessibility = useCallback(() => {
    setIsScanning(true);
    const issues: AccessibilityIssue[] = [];

    // Check for missing alt text on images
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.alt || img.alt.trim() === '') {
        issues.push({
          id: `img-alt-${index}`,
          type: 'error',
          message: 'Image missing alt text',
          element: img.tagName,
          suggestion: 'Add descriptive alt text to all images',
          severity: 'high',
          wcagLevel: 'A',
          category: 'media'
        });
      }
    });

    // Check for missing form labels
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach((input, index) => {
      const id = input.getAttribute('id');
      const label = id ? document.querySelector(`label[for="${id}"]`) : null;
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');
      
      if (!label && !ariaLabel && !ariaLabelledBy) {
        issues.push({
          id: `input-label-${index}`,
          type: 'error',
          message: 'Form input missing label',
          element: input.tagName,
          suggestion: 'Add a label element or aria-label attribute',
          severity: 'high',
          wcagLevel: 'A',
          category: 'forms'
        });
      }
    });

    // Check for missing heading structure
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let hasH1 = false;
    const headingLevels: number[] = [];
    
    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1));
      headingLevels.push(level);
      if (level === 1) hasH1 = true;
    });

    if (!hasH1) {
      issues.push({
        id: 'missing-h1',
        type: 'error',
        message: 'Page missing H1 heading',
        element: 'h1',
        suggestion: 'Add a main heading (H1) to the page',
        severity: 'high',
        wcagLevel: 'A',
        category: 'semantics'
      });
    }

    // Check for heading hierarchy
    for (let i = 1; i < headingLevels.length; i++) {
      if (headingLevels[i] - headingLevels[i - 1] > 1) {
        issues.push({
          id: `heading-hierarchy-${i}`,
          type: 'warning',
          message: 'Heading hierarchy skipped',
          element: 'h' + headingLevels[i],
          suggestion: 'Maintain proper heading hierarchy (H1 → H2 → H3)',
          severity: 'medium',
          wcagLevel: 'AA',
          category: 'semantics'
        });
      }
    }

    // Check for color contrast (simplified)
    const elements = document.querySelectorAll('*');
    elements.forEach((element, index) => {
      const style = window.getComputedStyle(element);
      const color = style.color;
      const backgroundColor = style.backgroundColor;
      
      if (color && backgroundColor && color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        // This is a simplified check - in a real implementation, you'd calculate actual contrast ratios
        if (color === backgroundColor) {
          issues.push({
            id: `contrast-${index}`,
            type: 'warning',
            message: 'Potential color contrast issue',
            element: element.tagName,
            suggestion: 'Ensure sufficient color contrast (4.5:1 for normal text)',
            severity: 'medium',
            wcagLevel: 'AA',
            category: 'color'
          });
        }
      }
    });

    // Check for missing focus indicators
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]');
    focusableElements.forEach((element, index) => {
      const style = window.getComputedStyle(element);
      const outline = style.outline;
      const outlineWidth = style.outlineWidth;
      
      if (outline === 'none' && outlineWidth === '0px') {
        issues.push({
          id: `focus-indicator-${index}`,
          type: 'warning',
          message: 'Focus indicator missing',
          element: element.tagName,
          suggestion: 'Add visible focus indicators for keyboard navigation',
          severity: 'medium',
          wcagLevel: 'AA',
          category: 'focus'
        });
      }
    });

    // Check for missing ARIA labels
    const interactiveElements = document.querySelectorAll('button, a, input, textarea, select');
    interactiveElements.forEach((element, index) => {
      const hasAriaLabel = element.getAttribute('aria-label');
      const hasAriaLabelledBy = element.getAttribute('aria-labelledby');
      const hasTextContent = element.textContent && element.textContent.trim().length > 0;
      
      if (!hasAriaLabel && !hasAriaLabelledBy && !hasTextContent) {
        issues.push({
          id: `aria-label-${index}`,
          type: 'info',
          message: 'Interactive element missing accessible name',
          element: element.tagName,
          suggestion: 'Add aria-label or ensure element has text content',
          severity: 'low',
          wcagLevel: 'A',
          category: 'semantics'
        });
      }
    });

    // Calculate report
    const passed = issues.filter(issue => issue.type === 'info').length;
    const failed = issues.filter(issue => issue.type === 'error').length;
    const warnings = issues.filter(issue => issue.type === 'warning').length;
    const info = issues.filter(issue => issue.type === 'info').length;
    
    const total = passed + failed + warnings;
    const score = total > 0 ? Math.round((passed / total) * 100) : 100;

    // Group by categories
    const categories: { [key: string]: { passed: number; failed: number; warnings: number } } = {};
    WCAG_CATEGORIES.forEach(category => {
      categories[category.key] = { passed: 0, failed: 0, warnings: 0 };
    });

    issues.forEach(issue => {
      if (categories[issue.category]) {
        if (issue.type === 'error') {
          categories[issue.category].failed++;
        } else if (issue.type === 'warning') {
          categories[issue.category].warnings++;
        } else {
          categories[issue.category].passed++;
        }
      }
    });

    const newReport: AccessibilityReport = {
      score,
      issues,
      passed,
      failed,
      warnings,
      info,
      categories
    };

    setReport(newReport);
    onReport?.(newReport);
    setIsScanning(false);
  }, [onReport]);

  // Auto-scan on mount
  useEffect(() => {
    const timer = setTimeout(checkAccessibility, 1000);
    return () => clearTimeout(timer);
  }, [checkAccessibility]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'info': return <Info className="w-4 h-4 text-blue-600" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Accessibility className="w-5 h-5" />
              Accessibility Checker
            </CardTitle>
            <CardDescription>
              WCAG compliance and accessibility analysis
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={report.score >= 90 ? 'default' : report.score >= 70 ? 'secondary' : 'destructive'}
              className={getScoreColor(report.score)}
            >
              {report.score}/100 - {getScoreLabel(report.score)}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={checkAccessibility}
              disabled={isScanning}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning ? 'Scanning...' : 'Scan'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Score Overview */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: getScoreColor(report.score) }}>
                  {report.score}
                </div>
                <div className="text-lg font-medium mb-4">
                  {getScoreLabel(report.score)} Accessibility Score
                </div>
                <Progress value={report.score} className="h-3" />
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{report.passed}</div>
                  <div className="text-sm text-muted-foreground">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{report.failed}</div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{report.warnings}</div>
                  <div className="text-sm text-muted-foreground">Warnings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{report.info}</div>
                  <div className="text-sm text-muted-foreground">Info</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="issues" className="space-y-4">
            {/* Issues List */}
            <div className="space-y-3">
              {report.issues.map((issue) => (
                <div key={issue.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    {getIssueIcon(issue.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{issue.message}</span>
                        <Badge variant="outline" className="text-xs">
                          {issue.wcagLevel}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getSeverityColor(issue.severity)}`}
                        >
                          {issue.severity}
                        </Badge>
                      </div>
                      {issue.element && (
                        <div className="text-sm text-muted-foreground mb-2">
                          Element: {issue.element}
                        </div>
                      )}
                      {issue.suggestion && (
                        <div className="text-sm text-blue-600">
                          💡 {issue.suggestion}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            {/* Category Breakdown */}
            <div className="space-y-4">
              {WCAG_CATEGORIES.map((category) => {
                const Icon = category.icon;
                const categoryData = report.categories[category.key];
                const total = (categoryData?.passed || 0) + (categoryData?.failed || 0) + (categoryData?.warnings || 0);
                const score = total > 0 ? Math.round(((categoryData?.passed || 0) / total) * 100) : 100;

                return (
                  <div key={category.key} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{category.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{score}%</span>
                        <Progress value={score} className="w-20 h-2" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-green-600 font-medium">{categoryData?.passed || 0}</div>
                        <div className="text-muted-foreground">Passed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-red-600 font-medium">{categoryData?.failed || 0}</div>
                        <div className="text-muted-foreground">Failed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-yellow-600 font-medium">{categoryData?.warnings || 0}</div>
                        <div className="text-muted-foreground">Warnings</div>
                      </div>
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

export default AccessibilityChecker;
