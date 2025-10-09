import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Edit3, 
  Trash2, 
  Copy,
  LayoutGrid,
  Image as ImageIcon,
  Star,
  Clock
} from 'lucide-react';
import { TemplateMeta, TemplateCategory } from '@/types/template';
import { useTemplateEditor } from '@/utils/templateEditor';

interface TemplateGalleryProps {
  onTemplateLoad: (htmlContent: string) => void;
  onTemplatePreview: (template: TemplateMeta) => void;
}

export default function TemplateGallery({ onTemplateLoad, onTemplatePreview }: TemplateGalleryProps) {
  const [templates, setTemplates] = useState<TemplateMeta[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<TemplateMeta[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'date'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  const templateCategories: TemplateCategory[] = [
    'Business', 'Portfolio', 'Blog', 'Creative', 'Restaurant', 
    'E-commerce', 'Education', 'Event', 'Fashion', 'Fitness',
    'NGO', 'Photography', 'Product', 'Real Estate', 'Resume',
    'SaaS', 'Tech', 'Travel', 'Consulting'
  ];

  // Load templates
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/templates/templates.json');
        const data = await response.json();
        setTemplates(data);
        setFilteredTemplates(data);
      } catch (error) {
        console.error('Error loading templates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, []);

  // Filter and search templates
  useEffect(() => {
    let filtered = templates;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.uniqueFeatures?.some(feature => 
          feature.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Sort templates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'date':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        default:
          return 0;
      }
    });

    setFilteredTemplates(filtered);
  }, [templates, selectedCategory, searchQuery, sortBy]);

  const handleTemplateLoad = async (template: TemplateMeta) => {
    try {
      const response = await fetch(template.htmlPath);
      const htmlContent = await response.text();
      onTemplateLoad(htmlContent);
    } catch (error) {
      console.error('Error loading template:', error);
    }
  };

  const handleTemplatePreview = (template: TemplateMeta) => {
    onTemplatePreview(template);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <LayoutGrid className="w-5 h-5" />
            Template Gallery
          </h3>
          <p className="text-sm text-muted-foreground">
            {filteredTemplates.length} templates available
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white"
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'category' | 'date')}
            className="px-3 py-2 border border-input rounded-md bg-background text-sm"
          >
            <option value="name">Sort by Name</option>
            <option value="category">Sort by Category</option>
            <option value="date">Sort by Date</option>
          </select>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1">
          <Button
            variant={selectedCategory === 'All' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('All')}
            className="text-xs hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600"
          >
            All
          </Button>
          {templateCategories.slice(0, 6).map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="text-xs hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Template Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="group cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all duration-200"
            >
              <div className="p-3">
                {/* Template Thumbnail */}
                <div className="aspect-video bg-muted rounded mb-3 flex items-center justify-center relative overflow-hidden">
                  {template.thumbnail ? (
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  )}
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTemplatePreview(template);
                      }}
                      className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTemplateLoad(template);
                      }}
                      className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Template Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm truncate">{template.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                  
                  {template.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                  )}

                  {template.uniqueFeatures && template.uniqueFeatures.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {template.uniqueFeatures.slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {template.uniqueFeatures.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.uniqueFeatures.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-1 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTemplateLoad(template);
                      }}
                    >
                      <Edit3 className="w-3 h-3 mr-1" />
                      Use Template
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTemplatePreview(template);
                      }}
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="group cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-200"
            >
              <div className="p-3 flex items-center gap-3">
                {/* Thumbnail */}
                <div className="w-16 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                  {template.thumbnail ? (
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm truncate">{template.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                  
                  {template.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {template.description}
                    </p>
                  )}

                  {template.uniqueFeatures && template.uniqueFeatures.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.uniqueFeatures.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTemplatePreview(template);
                    }}
                    className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600"
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTemplateLoad(template);
                    }}
                    className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600"
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8">
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-medium mb-1">No templates found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
