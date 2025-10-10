import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Palette, 
  Type, 
  Layout, 
  Settings,
  Download,
  Upload,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Grid3X3,
  Layers,
  Zap
} from 'lucide-react';
import ColorPicker from './ColorPicker';
import TypographyScale from './TypographyScale';
import { designSystem } from '@/design-system/tokens';

interface DesignSystemPanelProps {
  onSave?: (designSystem: any) => void;
  onExport?: (designSystem: any) => void;
  onImport?: (designSystem: any) => void;
  className?: string;
}

interface DesignSystemState {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  typography: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
    textAlign: string;
  };
  spacing: {
    base: number;
    scale: number;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export const DesignSystemPanel: React.FC<DesignSystemPanelProps> = ({
  onSave,
  onExport,
  onImport,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState('colors');
  const [designSystemState, setDesignSystemState] = useState<DesignSystemState>({
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#8b5cf6',
      background: '#ffffff',
      foreground: '#0f172a',
      muted: '#f1f5f9',
      border: '#e2e8f0'
    },
    typography: {
      fontFamily: 'Inter',
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0',
      textAlign: 'left'
    },
    spacing: {
      base: 4,
      scale: 1.5
    },
    borderRadius: {
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
    }
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleColorChange = (colorType: keyof DesignSystemState['colors'], color: string) => {
    setDesignSystemState(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorType]: color
      }
    }));
    setHasChanges(true);
  };

  const handleTypographyChange = (typography: DesignSystemState['typography']) => {
    setDesignSystemState(prev => ({
      ...prev,
      typography
    }));
    setHasChanges(true);
  };

  const handleSpacingChange = (spacingType: keyof DesignSystemState['spacing'], value: number) => {
    setDesignSystemState(prev => ({
      ...prev,
      spacing: {
        ...prev.spacing,
        [spacingType]: value
      }
    }));
    setHasChanges(true);
  };

  const handleBorderRadiusChange = (radiusType: keyof DesignSystemState['borderRadius'], value: string) => {
    setDesignSystemState(prev => ({
      ...prev,
      borderRadius: {
        ...prev.borderRadius,
        [radiusType]: value
      }
    }));
    setHasChanges(true);
  };

  const handleShadowChange = (shadowType: keyof DesignSystemState['shadows'], value: string) => {
    setDesignSystemState(prev => ({
      ...prev,
      shadows: {
        ...prev.shadows,
        [shadowType]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave?.(designSystemState);
    setHasChanges(false);
  };

  const handleExport = () => {
    onExport?.(designSystemState);
  };

  const handleImport = () => {
    // This would typically open a file picker
    // For now, we'll just show a placeholder
    console.log('Import design system');
  };

  const resetToDefault = () => {
    setDesignSystemState({
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#8b5cf6',
        background: '#ffffff',
        foreground: '#0f172a',
        muted: '#f1f5f9',
        border: '#e2e8f0'
      },
      typography: {
        fontFamily: 'Inter',
        fontSize: '1rem',
        fontWeight: '400',
        lineHeight: '1.5',
        letterSpacing: '0',
        textAlign: 'left'
      },
      spacing: {
        base: 4,
        scale: 1.5
      },
      borderRadius: {
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem'
      },
      shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
      }
    });
    setHasChanges(false);
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Design System
            </CardTitle>
            <CardDescription>
              Customize your design tokens and system
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            {hasChanges && (
              <Badge variant="secondary" className="animate-pulse">
                Unsaved
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="spacing" className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4" />
              Spacing
            </TabsTrigger>
            <TabsTrigger value="effects" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Effects
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker
                value={designSystemState.colors.primary}
                onChange={(color) => handleColorChange('primary', color)}
                label="Primary Color"
                description="Main brand color"
              />
              <ColorPicker
                value={designSystemState.colors.secondary}
                onChange={(color) => handleColorChange('secondary', color)}
                label="Secondary Color"
                description="Supporting color"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker
                value={designSystemState.colors.accent}
                onChange={(color) => handleColorChange('accent', color)}
                label="Accent Color"
                description="Highlight color"
              />
              <ColorPicker
                value={designSystemState.colors.background}
                onChange={(color) => handleColorChange('background', color)}
                label="Background Color"
                description="Main background"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker
                value={designSystemState.colors.foreground}
                onChange={(color) => handleColorChange('foreground', color)}
                label="Foreground Color"
                description="Text color"
              />
              <ColorPicker
                value={designSystemState.colors.muted}
                onChange={(color) => handleColorChange('muted', color)}
                label="Muted Color"
                description="Subtle backgrounds"
              />
            </div>
          </TabsContent>

          <TabsContent value="typography" className="space-y-4">
            <TypographyScale
              value={designSystemState.typography}
              onChange={handleTypographyChange}
              label="Typography Scale"
              description="Configure your typography system"
            />
          </TabsContent>

          <TabsContent value="spacing" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Base Spacing: {designSystemState.spacing.base}px</label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  step="1"
                  value={designSystemState.spacing.base}
                  onChange={(e) => handleSpacingChange('base', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Scale Factor: {designSystemState.spacing.scale}</label>
                <input
                  type="range"
                  min="1.2"
                  max="2"
                  step="0.1"
                  value={designSystemState.spacing.scale}
                  onChange={(e) => handleSpacingChange('scale', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="effects" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Border Radius</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">Small</label>
                    <input
                      type="text"
                      value={designSystemState.borderRadius.sm}
                      onChange={(e) => handleBorderRadiusChange('sm', e.target.value)}
                      className="w-full px-2 py-1 text-sm border rounded"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">Medium</label>
                    <input
                      type="text"
                      value={designSystemState.borderRadius.md}
                      onChange={(e) => handleBorderRadiusChange('md', e.target.value)}
                      className="w-full px-2 py-1 text-sm border rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-4" />

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefault}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleImport}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={!hasChanges}
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DesignSystemPanel;
