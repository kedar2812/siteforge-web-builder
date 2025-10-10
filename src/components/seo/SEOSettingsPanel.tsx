import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Eye, 
  Globe, 
  Link, 
  Image as ImageIcon,
  Share2,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';

interface SEOSettings {
  // Basic SEO
  title: string;
  description: string;
  keywords: string[];
  author: string;
  language: string;
  
  // Open Graph
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  ogSiteName: string;
  
  // Twitter Card
  twitterCard: string;
  twitterSite: string;
  twitterCreator: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  
  // Technical SEO
  canonicalUrl: string;
  robots: string;
  viewport: string;
  charset: string;
  
  // Schema Markup
  schemaType: string;
  schemaData: Record<string, any>;
  
  // Analytics
  googleAnalytics: string;
  googleTagManager: string;
  facebookPixel: string;
  
  // Sitemap
  sitemapEnabled: boolean;
  sitemapPriority: number;
  sitemapChangeFreq: string;
}

interface SEOSettingsPanelProps {
  settings: SEOSettings;
  onChange: (settings: SEOSettings) => void;
  onPreview?: () => void;
  onExport?: () => void;
  className?: string;
}

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' }
];

const OG_TYPES = [
  { value: 'website', label: 'Website' },
  { value: 'article', label: 'Article' },
  { value: 'product', label: 'Product' },
  { value: 'profile', label: 'Profile' },
  { value: 'video', label: 'Video' },
  { value: 'music', label: 'Music' }
];

const TWITTER_CARDS = [
  { value: 'summary', label: 'Summary' },
  { value: 'summary_large_image', label: 'Summary Large Image' },
  { value: 'app', label: 'App' },
  { value: 'player', label: 'Player' }
];

const ROBOTS_OPTIONS = [
  { value: 'index, follow', label: 'Index, Follow' },
  { value: 'noindex, nofollow', label: 'No Index, No Follow' },
  { value: 'index, nofollow', label: 'Index, No Follow' },
  { value: 'noindex, follow', label: 'No Index, Follow' }
];

const SCHEMA_TYPES = [
  { value: 'WebSite', label: 'Website' },
  { value: 'Organization', label: 'Organization' },
  { value: 'Person', label: 'Person' },
  { value: 'Article', label: 'Article' },
  { value: 'Product', label: 'Product' },
  { value: 'Event', label: 'Event' },
  { value: 'LocalBusiness', label: 'Local Business' }
];

const SITEMAP_CHANGE_FREQ = [
  { value: 'always', label: 'Always' },
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'never', label: 'Never' }
];

export const SEOSettingsPanel: React.FC<SEOSettingsPanelProps> = ({
  settings,
  onChange,
  onPreview,
  onExport,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [seoScore, setSeoScore] = useState(0);
  const [issues, setIssues] = useState<string[]>([]);

  // Calculate SEO score
  useEffect(() => {
    let score = 0;
    const newIssues: string[] = [];

    // Title (20 points)
    if (settings.title && settings.title.length > 0) {
      score += 10;
      if (settings.title.length >= 30 && settings.title.length <= 60) {
        score += 10;
      } else {
        newIssues.push('Title should be 30-60 characters');
      }
    } else {
      newIssues.push('Title is required');
    }

    // Description (20 points)
    if (settings.description && settings.description.length > 0) {
      score += 10;
      if (settings.description.length >= 120 && settings.description.length <= 160) {
        score += 10;
      } else {
        newIssues.push('Description should be 120-160 characters');
      }
    } else {
      newIssues.push('Description is required');
    }

    // Keywords (10 points)
    if (settings.keywords.length > 0) {
      score += 10;
    } else {
      newIssues.push('Keywords are recommended');
    }

    // Open Graph (20 points)
    if (settings.ogTitle && settings.ogDescription && settings.ogImage) {
      score += 20;
    } else {
      newIssues.push('Open Graph tags are incomplete');
    }

    // Twitter Card (10 points)
    if (settings.twitterCard && settings.twitterTitle && settings.twitterDescription) {
      score += 10;
    } else {
      newIssues.push('Twitter Card tags are incomplete');
    }

    // Technical SEO (10 points)
    if (settings.canonicalUrl && settings.robots) {
      score += 10;
    } else {
      newIssues.push('Technical SEO settings are incomplete');
    }

    // Schema (10 points)
    if (settings.schemaType && Object.keys(settings.schemaData).length > 0) {
      score += 10;
    } else {
      newIssues.push('Schema markup is recommended');
    }

    setSeoScore(score);
    setIssues(newIssues);
  }, [settings]);

  const handleChange = (key: keyof SEOSettings, value: any) => {
    onChange({
      ...settings,
      [key]: value
    });
  };

  const handleKeywordsChange = (value: string) => {
    const keywords = value.split(',').map(k => k.trim()).filter(k => k.length > 0);
    handleChange('keywords', keywords);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              SEO Settings
            </CardTitle>
            <CardDescription>
              Optimize your website for search engines
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={seoScore >= 80 ? 'default' : seoScore >= 60 ? 'secondary' : 'destructive'}
              className={getScoreColor(seoScore)}
            >
              {seoScore}/100 - {getScoreLabel(seoScore)}
            </Badge>
            <Button variant="outline" size="sm" onClick={onPreview}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            {/* Basic SEO */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Page Title *</Label>
                <Input
                  id="title"
                  value={settings.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter page title (30-60 characters)"
                  maxLength={60}
                />
                <div className="text-xs text-muted-foreground">
                  {settings.title.length}/60 characters
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Meta Description *</Label>
                <Textarea
                  id="description"
                  value={settings.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Enter meta description (120-160 characters)"
                  maxLength={160}
                  rows={3}
                />
                <div className="text-xs text-muted-foreground">
                  {settings.description.length}/160 characters
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  value={settings.keywords.join(', ')}
                  onChange={(e) => handleKeywordsChange(e.target.value)}
                  placeholder="Enter keywords separated by commas"
                />
                <div className="text-xs text-muted-foreground">
                  {settings.keywords.length} keywords
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={settings.author}
                    onChange={(e) => handleChange('author', e.target.value)}
                    placeholder="Enter author name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => handleChange('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            {/* Open Graph */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Open Graph</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="og-title">OG Title</Label>
                  <Input
                    id="og-title"
                    value={settings.ogTitle}
                    onChange={(e) => handleChange('ogTitle', e.target.value)}
                    placeholder="Open Graph title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="og-description">OG Description</Label>
                  <Textarea
                    id="og-description"
                    value={settings.ogDescription}
                    onChange={(e) => handleChange('ogDescription', e.target.value)}
                    placeholder="Open Graph description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="og-type">OG Type</Label>
                    <Select
                      value={settings.ogType}
                      onValueChange={(value) => handleChange('ogType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {OG_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="og-site-name">OG Site Name</Label>
                    <Input
                      id="og-site-name"
                      value={settings.ogSiteName}
                      onChange={(e) => handleChange('ogSiteName', e.target.value)}
                      placeholder="Site name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="og-image">OG Image URL</Label>
                  <Input
                    id="og-image"
                    value={settings.ogImage}
                    onChange={(e) => handleChange('ogImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Twitter Card */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Twitter Card</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="twitter-card">Card Type</Label>
                    <Select
                      value={settings.twitterCard}
                      onValueChange={(value) => handleChange('twitterCard', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TWITTER_CARDS.map((card) => (
                          <SelectItem key={card.value} value={card.value}>
                            {card.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter-site">Twitter Site</Label>
                    <Input
                      id="twitter-site"
                      value={settings.twitterSite}
                      onChange={(e) => handleChange('twitterSite', e.target.value)}
                      placeholder="@username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter-title">Twitter Title</Label>
                  <Input
                    id="twitter-title"
                    value={settings.twitterTitle}
                    onChange={(e) => handleChange('twitterTitle', e.target.value)}
                    placeholder="Twitter title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter-description">Twitter Description</Label>
                  <Textarea
                    id="twitter-description"
                    value={settings.twitterDescription}
                    onChange={(e) => handleChange('twitterDescription', e.target.value)}
                    placeholder="Twitter description"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter-image">Twitter Image URL</Label>
                  <Input
                    id="twitter-image"
                    value={settings.twitterImage}
                    onChange={(e) => handleChange('twitterImage', e.target.value)}
                    placeholder="https://example.com/twitter-image.jpg"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="technical" className="space-y-4">
            {/* Technical SEO */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="canonical-url">Canonical URL</Label>
                <Input
                  id="canonical-url"
                  value={settings.canonicalUrl}
                  onChange={(e) => handleChange('canonicalUrl', e.target.value)}
                  placeholder="https://example.com/page"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="robots">Robots</Label>
                <Select
                  value={settings.robots}
                  onValueChange={(value) => handleChange('robots', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROBOTS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="viewport">Viewport</Label>
                  <Input
                    id="viewport"
                    value={settings.viewport}
                    onChange={(e) => handleChange('viewport', e.target.value)}
                    placeholder="width=device-width, initial-scale=1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="charset">Charset</Label>
                  <Input
                    id="charset"
                    value={settings.charset}
                    onChange={(e) => handleChange('charset', e.target.value)}
                    placeholder="UTF-8"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Schema Markup */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Schema Markup</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="schema-type">Schema Type</Label>
                  <Select
                    value={settings.schemaType}
                    onValueChange={(value) => handleChange('schemaType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SCHEMA_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schema-data">Schema Data (JSON)</Label>
                  <Textarea
                    id="schema-data"
                    value={JSON.stringify(settings.schemaData, null, 2)}
                    onChange={(e) => {
                      try {
                        const data = JSON.parse(e.target.value);
                        handleChange('schemaData', data);
                      } catch (error) {
                        // Invalid JSON, don't update
                      }
                    }}
                    placeholder='{"@context": "https://schema.org", "@type": "WebSite"}'
                    rows={6}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            {/* Analytics */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="google-analytics">Google Analytics ID</Label>
                <Input
                  id="google-analytics"
                  value={settings.googleAnalytics}
                  onChange={(e) => handleChange('googleAnalytics', e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="google-tag-manager">Google Tag Manager ID</Label>
                <Input
                  id="google-tag-manager"
                  value={settings.googleTagManager}
                  onChange={(e) => handleChange('googleTagManager', e.target.value)}
                  placeholder="GTM-XXXXXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebook-pixel">Facebook Pixel ID</Label>
                <Input
                  id="facebook-pixel"
                  value={settings.facebookPixel}
                  onChange={(e) => handleChange('facebookPixel', e.target.value)}
                  placeholder="123456789012345"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sitemap" className="space-y-4">
            {/* Sitemap */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Sitemap Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure sitemap generation and submission
                  </p>
                </div>
                <Switch
                  checked={settings.sitemapEnabled}
                  onCheckedChange={(checked) => handleChange('sitemapEnabled', checked)}
                />
              </div>

              {settings.sitemapEnabled && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sitemap-priority">Priority</Label>
                    <Input
                      id="sitemap-priority"
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.sitemapPriority}
                      onChange={(e) => handleChange('sitemapPriority', parseFloat(e.target.value))}
                      placeholder="0.5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sitemap-change-freq">Change Frequency</Label>
                    <Select
                      value={settings.sitemapChangeFreq}
                      onValueChange={(value) => handleChange('sitemapChangeFreq', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SITEMAP_CHANGE_FREQ.map((freq) => (
                          <SelectItem key={freq.value} value={freq.value}>
                            {freq.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Issues */}
        {issues.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="space-y-2">
              <h4 className="font-medium text-red-600">SEO Issues</h4>
              {issues.map((issue, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  {issue}
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SEOSettingsPanel;
