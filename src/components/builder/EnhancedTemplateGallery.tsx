import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  Eye, 
  Heart,
  Clock,
  User,
  Palette,
  Type,
  Layout,
  ChevronDown,
  X,
  Grid3X3,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { TemplateMetadata, TemplateSearchFilters, TemplateCategory } from '@/types/template';
import { TemplateCustomizationWizard } from './TemplateCustomizationWizard';

interface EnhancedTemplateGalleryProps {
  templates: TemplateMetadata[];
  onTemplateSelect: (template: TemplateMetadata) => void;
  onTemplateCustomize: (template: TemplateMetadata, customization: any) => void;
  loading?: boolean;
}

export const EnhancedTemplateGallery: React.FC<EnhancedTemplateGalleryProps> = ({
  templates,
  onTemplateSelect,
  onTemplateCustomize,
  loading = false
}) => {
  const [filters, setFilters] = useState<TemplateSearchFilters>({
    category: 'All',
    searchQuery: '',
    sortBy: 'rating',
    sortOrder: 'desc',
    difficulty: [],
    pricing: [],
    features: [],
    colors: [],
    rating: { min: 0, max: 5 }
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateMetadata | null>(null);
  const [showCustomization, setShowCustomization] = useState(false);

  const categories: TemplateCategory[] = [
    'All', 'Business', 'Portfolio', 'Blog', 'Creative', 'Restaurant',
    'E-commerce', 'Education', 'Event', 'Fashion', 'Fitness', 'NGO',
    'Photography', 'Product', 'Real Estate', 'Resume', 'SaaS', 'Tech',
    'Travel', 'Consulting'
  ];

  const difficultyOptions = [
    { value: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-800' },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-800' }
  ];

  const pricingOptions = [
    { value: 'free', label: 'Free', icon: '🆓' },
    { value: 'premium', label: 'Premium', icon: '💎' }
  ];

  const featureOptions = [
    'Responsive', 'Dark Mode', 'SEO Optimized', 'Fast Loading',
    'Mobile First', 'Accessibility', 'Modern Design', 'Customizable'
  ];

  const colorOptions = [
    { value: 'blue', label: 'Blue', color: '#3b82f6' },
    { value: 'green', label: 'Green', color: '#10b981' },
    { value: 'purple', label: 'Purple', color: '#8b5cf6' },
    { value: 'red', label: 'Red', color: '#ef4444' },
    { value: 'orange', label: 'Orange', color: '#f97316' },
    { value: 'pink', label: 'Pink', color: '#ec4899' },
    { value: 'gray', label: 'Gray', color: '#6b7280' }
  ];

  const filteredTemplates = useMemo(() => {
    let filtered = templates.filter(template => {
      // Category filter
      if (filters.category !== 'All' && template.category !== filters.category) {
        return false;
      }

      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = template.name.toLowerCase().includes(query);
        const matchesDescription = template.description.toLowerCase().includes(query);
        const matchesTags = template.tags.some(tag => tag.toLowerCase().includes(query));
        const matchesFeatures = template.features.some(feature => feature.toLowerCase().includes(query));
        
        if (!matchesName && !matchesDescription && !matchesTags && !matchesFeatures) {
          return false;
        }
      }

      // Difficulty filter
      if (filters.difficulty.length > 0 && !filters.difficulty.includes(template.difficulty)) {
        return false;
      }

      // Pricing filter
      if (filters.pricing.length > 0) {
        const isFree = template.pricing.free;
        const isPremium = template.pricing.premium;
        const matchesPricing = 
          (filters.pricing.includes('free') && isFree) ||
          (filters.pricing.includes('premium') && isPremium);
        
        if (!matchesPricing) {
          return false;
        }
      }

      // Features filter
      if (filters.features.length > 0) {
        const hasAllFeatures = filters.features.every(feature => 
          template.features.some(templateFeature => 
            templateFeature.toLowerCase().includes(feature.toLowerCase())
          )
        );
        if (!hasAllFeatures) {
          return false;
        }
      }

      // Rating filter
      if (template.rating < filters.rating.min || template.rating > filters.rating.max) {
        return false;
      }

      return true;
    });

    // Sort templates
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'downloads':
          aValue = a.downloads;
          bValue = b.downloads;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'price':
          aValue = a.pricing.price || 0;
          bValue = b.pricing.price || 0;
          break;
        default:
          return 0;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [templates, filters]);

  const handleFilterChange = (key: keyof TemplateSearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDifficultyToggle = (difficulty: string) => {
    setFilters(prev => ({
      ...prev,
      difficulty: prev.difficulty.includes(difficulty as any)
        ? prev.difficulty.filter(d => d !== difficulty)
        : [...prev.difficulty, difficulty as any]
    }));
  };

  const handlePricingToggle = (pricing: string) => {
    setFilters(prev => ({
      ...prev,
      pricing: prev.pricing.includes(pricing as any)
        ? prev.pricing.filter(p => p !== pricing)
        : [...prev.pricing, pricing as any]
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'All',
      searchQuery: '',
      sortBy: 'rating',
      sortOrder: 'desc',
      difficulty: [],
      pricing: [],
      features: [],
      colors: [],
      rating: { min: 0, max: 5 }
    });
  };

  const handleTemplateClick = (template: TemplateMetadata) => {
    setSelectedTemplate(template);
  };

  const handleCustomize = (template: TemplateMetadata) => {
    setSelectedTemplate(template);
    setShowCustomization(true);
  };

  const handleCustomizationApply = (customization: any) => {
    if (selectedTemplate) {
      onTemplateCustomize(selectedTemplate, customization);
      setShowCustomization(false);
      setSelectedTemplate(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Template Gallery</h2>
          <p className="text-muted-foreground">
            {filteredTemplates.length} templates found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {Object.values(filters).some(v => 
              Array.isArray(v) ? v.length > 0 : v !== 'All' && v !== '' && v !== 'rating' && v !== 'desc'
            ) && (
              <Badge variant="secondary" className="ml-1">
                Active
              </Badge>
            )}
          </Button>
          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Quick Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={filters.category}
          onValueChange={(value) => handleFilterChange('category', value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onValueChange={(value) => {
            const [sortBy, sortOrder] = value.split('-');
            handleFilterChange('sortBy', sortBy);
            handleFilterChange('sortOrder', sortOrder);
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating-desc">Highest Rated</SelectItem>
            <SelectItem value="rating-asc">Lowest Rated</SelectItem>
            <SelectItem value="downloads-desc">Most Popular</SelectItem>
            <SelectItem value="name-asc">Name A-Z</SelectItem>
            <SelectItem value="name-desc">Name Z-A</SelectItem>
            <SelectItem value="createdAt-desc">Newest</SelectItem>
            <SelectItem value="createdAt-asc">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Advanced Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Difficulty */}
            <div>
              <h4 className="font-medium mb-3">Difficulty</h4>
              <div className="flex gap-2">
                {difficultyOptions.map(option => (
                  <Button
                    key={option.value}
                    variant={filters.difficulty.includes(option.value as any) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleDifficultyToggle(option.value)}
                    className={option.color}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h4 className="font-medium mb-3">Pricing</h4>
              <div className="flex gap-2">
                {pricingOptions.map(option => (
                  <Button
                    key={option.value}
                    variant={filters.pricing.includes(option.value as any) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePricingToggle(option.value)}
                  >
                    <span className="mr-2">{option.icon}</span>
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-medium mb-3">Features</h4>
              <div className="grid grid-cols-2 gap-2">
                {featureOptions.map(feature => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={filters.features.includes(feature)}
                      onCheckedChange={() => handleFeatureToggle(feature)}
                    />
                    <Label htmlFor={feature} className="text-sm">
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <h4 className="font-medium mb-3">Rating: {filters.rating.min} - {filters.rating.max} stars</h4>
              <Slider
                value={[filters.rating.min, filters.rating.max]}
                onValueChange={(value) => handleFilterChange('rating', { min: value[0], max: value[1] })}
                max={5}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Templates Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
      }>
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            onClick={() => handleTemplateClick(template)}
          >
            <div className="relative">
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  size="sm"
                  variant="secondary"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCustomize(template);
                  }}
                >
                  <Palette className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
              {template.pricing.premium && (
                <Badge className="absolute top-2 left-2 bg-yellow-500">
                  Premium
                </Badge>
              )}
            </div>
            
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">{template.category}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{template.rating}</span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {template.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    <span>{template.downloads}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  {template.features.slice(0, 2).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Template Preview Dialog */}
      {selectedTemplate && (
        <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedTemplate.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <img
                src={selectedTemplate.preview}
                alt={selectedTemplate.name}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Features</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedTemplate.features.map((feature, index) => (
                      <Badge key={index} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Details</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Rating:</span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        {selectedTemplate.rating}/5
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Downloads:</span>
                      <span>{selectedTemplate.downloads}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Difficulty:</span>
                      <Badge variant="outline" className="text-xs">
                        {selectedTemplate.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="siteforge-primary"
                  onClick={() => {
                    onTemplateSelect(selectedTemplate);
                    setSelectedTemplate(null);
                  }}
                >
                  Use Template
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCustomization(true);
                    setSelectedTemplate(null);
                  }}
                >
                  Customize
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Customization Wizard */}
      {showCustomization && selectedTemplate && (
        <TemplateCustomizationWizard
          template={selectedTemplate}
          onCustomize={() => {}}
          onApply={handleCustomizationApply}
          onClose={() => {
            setShowCustomization(false);
            setSelectedTemplate(null);
          }}
        />
      )}
    </div>
  );
};
