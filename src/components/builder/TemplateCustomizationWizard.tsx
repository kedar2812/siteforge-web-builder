import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Palette, 
  Type, 
  Layout, 
  Eye, 
  Download, 
  RotateCcw,
  Check,
  Star,
  Download as DownloadIcon
} from 'lucide-react';
import { TemplateMetadata, TemplateCustomization } from '@/types/template';

interface TemplateCustomizationWizardProps {
  template: TemplateMetadata;
  onCustomize: (customization: TemplateCustomization) => void;
  onApply: (customization: TemplateCustomization) => void;
  onClose: () => void;
}

const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter', category: 'Sans-serif' },
  { value: 'Roboto', label: 'Roboto', category: 'Sans-serif' },
  { value: 'Open Sans', label: 'Open Sans', category: 'Sans-serif' },
  { value: 'Lato', label: 'Lato', category: 'Sans-serif' },
  { value: 'Poppins', label: 'Poppins', category: 'Sans-serif' },
  { value: 'Playfair Display', label: 'Playfair Display', category: 'Serif' },
  { value: 'Merriweather', label: 'Merriweather', category: 'Serif' },
  { value: 'Lora', label: 'Lora', category: 'Serif' },
  { value: 'Source Code Pro', label: 'Source Code Pro', category: 'Monospace' },
  { value: 'Fira Code', label: 'Fira Code', category: 'Monospace' },
];

const COLOR_PRESETS = [
  {
    name: 'Ocean Blue',
    colors: { primary: '#0ea5e9', secondary: '#0284c7', accent: '#38bdf8' }
  },
  {
    name: 'Forest Green',
    colors: { primary: '#22c55e', secondary: '#16a34a', accent: '#4ade80' }
  },
  {
    name: 'Sunset Orange',
    colors: { primary: '#f97316', secondary: '#ea580c', accent: '#fb923c' }
  },
  {
    name: 'Royal Purple',
    colors: { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#a78bfa' }
  },
  {
    name: 'Rose Pink',
    colors: { primary: '#ec4899', secondary: '#db2777', accent: '#f472b6' }
  },
  {
    name: 'Slate Gray',
    colors: { primary: '#64748b', secondary: '#475569', accent: '#94a3b8' }
  }
];

export const TemplateCustomizationWizard: React.FC<TemplateCustomizationWizardProps> = ({
  template,
  onCustomize,
  onApply,
  onClose
}) => {
  const [customization, setCustomization] = useState<TemplateCustomization>({
    colors: {
      primary: template.colors.primary,
      secondary: template.colors.secondary,
      accent: template.colors.accent,
      background: '#ffffff',
      text: '#1f2937'
    },
    fonts: {
      heading: template.fonts.heading,
      body: template.fonts.body,
      size: 'medium'
    },
    layout: {
      width: 'standard',
      spacing: 'normal',
      sections: []
    },
    content: {}
  });

  const [activeTab, setActiveTab] = useState('colors');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleColorChange = (colorType: keyof TemplateCustomization['colors'], value: string) => {
    const newCustomization = {
      ...customization,
      colors: {
        ...customization.colors,
        [colorType]: value
      }
    };
    setCustomization(newCustomization);
    onCustomize(newCustomization);
  };

  const handleFontChange = (fontType: keyof TemplateCustomization['fonts'], value: string) => {
    const newCustomization = {
      ...customization,
      fonts: {
        ...customization.fonts,
        [fontType]: value
      }
    };
    setCustomization(newCustomization);
    onCustomize(newCustomization);
  };

  const handleLayoutChange = (layoutType: keyof TemplateCustomization['layout'], value: string) => {
    const newCustomization = {
      ...customization,
      layout: {
        ...customization.layout,
        [layoutType]: value
      }
    };
    setCustomization(newCustomization);
    onCustomize(newCustomization);
  };

  const applyColorPreset = (preset: typeof COLOR_PRESETS[0]) => {
    const newCustomization = {
      ...customization,
      colors: {
        ...customization.colors,
        ...preset.colors
      }
    };
    setCustomization(newCustomization);
    onCustomize(newCustomization);
  };

  const resetToOriginal = () => {
    const originalCustomization: TemplateCustomization = {
      colors: {
        primary: template.colors.primary,
        secondary: template.colors.secondary,
        accent: template.colors.accent,
        background: '#ffffff',
        text: '#1f2937'
      },
      fonts: {
        heading: template.fonts.heading,
        body: template.fonts.body,
        size: 'medium'
      },
      layout: {
        width: 'standard',
        spacing: 'normal',
        sections: []
      },
      content: {}
    };
    setCustomization(originalCustomization);
    onCustomize(originalCustomization);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Customize Template
              </CardTitle>
              <CardDescription>
                {template.name} • {template.category}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {isPreviewMode ? 'Edit' : 'Preview'}
              </Button>
              <Button variant="outline" size="sm" onClick={resetToOriginal}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </CardHeader>

        <div className="flex h-[600px]">
          {/* Customization Panel */}
          <div className="w-1/2 border-r overflow-y-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="colors" className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Colors
                </TabsTrigger>
                <TabsTrigger value="fonts" className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Fonts
                </TabsTrigger>
                <TabsTrigger value="layout" className="flex items-center gap-2">
                  <Layout className="w-4 h-4" />
                  Layout
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                <TabsContent value="colors" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Color Scheme</h3>
                    
                    {/* Color Presets */}
                    <div className="space-y-3">
                      <Label>Quick Presets</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {COLOR_PRESETS.map((preset) => (
                          <Button
                            key={preset.name}
                            variant="outline"
                            size="sm"
                            onClick={() => applyColorPreset(preset)}
                            className="justify-start"
                          >
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: preset.colors.primary }}
                                />
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: preset.colors.secondary }}
                                />
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: preset.colors.accent }}
                                />
                              </div>
                              <span>{preset.name}</span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Custom Colors */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="primary-color">Primary Color</Label>
                          <div className="flex gap-2">
                            <Input
                              id="primary-color"
                              type="color"
                              value={customization.colors.primary}
                              onChange={(e) => handleColorChange('primary', e.target.value)}
                              className="w-12 h-10 p-1"
                            />
                            <Input
                              value={customization.colors.primary}
                              onChange={(e) => handleColorChange('primary', e.target.value)}
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="secondary-color">Secondary Color</Label>
                          <div className="flex gap-2">
                            <Input
                              id="secondary-color"
                              type="color"
                              value={customization.colors.secondary}
                              onChange={(e) => handleColorChange('secondary', e.target.value)}
                              className="w-12 h-10 p-1"
                            />
                            <Input
                              value={customization.colors.secondary}
                              onChange={(e) => handleColorChange('secondary', e.target.value)}
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="accent-color">Accent Color</Label>
                          <div className="flex gap-2">
                            <Input
                              id="accent-color"
                              type="color"
                              value={customization.colors.accent}
                              onChange={(e) => handleColorChange('accent', e.target.value)}
                              className="w-12 h-10 p-1"
                            />
                            <Input
                              value={customization.colors.accent}
                              onChange={(e) => handleColorChange('accent', e.target.value)}
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="background-color">Background</Label>
                          <div className="flex gap-2">
                            <Input
                              id="background-color"
                              type="color"
                              value={customization.colors.background}
                              onChange={(e) => handleColorChange('background', e.target.value)}
                              className="w-12 h-10 p-1"
                            />
                            <Input
                              value={customization.colors.background}
                              onChange={(e) => handleColorChange('background', e.target.value)}
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="fonts" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Typography</h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Heading Font</Label>
                        <Select
                          value={customization.fonts.heading}
                          onValueChange={(value) => handleFontChange('heading', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FONT_OPTIONS.map((font) => (
                              <SelectItem key={font.value} value={font.value}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{font.label}</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {font.category}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Body Font</Label>
                        <Select
                          value={customization.fonts.body}
                          onValueChange={(value) => handleFontChange('body', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FONT_OPTIONS.map((font) => (
                              <SelectItem key={font.value} value={font.value}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{font.label}</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {font.category}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Font Size</Label>
                        <Select
                          value={customization.fonts.size}
                          onValueChange={(value) => handleFontChange('size', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="layout" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Layout Options</h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Container Width</Label>
                        <Select
                          value={customization.layout.width}
                          onValueChange={(value) => handleLayoutChange('width', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="narrow">Narrow (800px)</SelectItem>
                            <SelectItem value="standard">Standard (1200px)</SelectItem>
                            <SelectItem value="wide">Wide (1400px)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Spacing</Label>
                        <Select
                          value={customization.layout.spacing}
                          onValueChange={(value) => handleLayoutChange('spacing', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="compact">Compact</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="spacious">Spacious</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Preview Panel */}
          <div className="w-1/2 bg-gray-50 p-6">
            <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-full bg-white">
                {isPreviewMode ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Eye className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500">Live preview would appear here</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Preview updates in real-time as you customize
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Layout className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500">Template preview</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Switch to preview mode to see live changes
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="w-4 h-4" />
                <span>{template.rating}/5</span>
                <span>•</span>
                <DownloadIcon className="w-4 h-4" />
                <span>{template.downloads} downloads</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                variant="siteforge-primary"
                onClick={() => onApply(customization)}
                className="gap-2"
              >
                <Check className="w-4 h-4" />
                Apply Template
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
