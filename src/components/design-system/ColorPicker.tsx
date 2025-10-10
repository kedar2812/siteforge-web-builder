import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Palette, 
  Copy, 
  Check, 
  RotateCcw,
  Eye,
  EyeOff,
  Download,
  Upload,
  Save,
  RefreshCw
} from 'lucide-react';
import { colors } from '@/design-system/tokens';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  description?: string;
  showPresets?: boolean;
  showAdvanced?: boolean;
  showHistory?: boolean;
  className?: string;
}

interface ColorPreset {
  name: string;
  colors: string[];
  category: string;
}

const COLOR_PRESETS: ColorPreset[] = [
  {
    name: 'Ocean Blue',
    colors: ['#0ea5e9', '#0284c7', '#38bdf8', '#7dd3fc', '#bae6fd'],
    category: 'Blue'
  },
  {
    name: 'Forest Green',
    colors: ['#22c55e', '#16a34a', '#4ade80', '#86efac', '#bbf7d0'],
    category: 'Green'
  },
  {
    name: 'Sunset Orange',
    colors: ['#f97316', '#ea580c', '#fb923c', '#fdba74', '#fed7aa'],
    category: 'Orange'
  },
  {
    name: 'Royal Purple',
    colors: ['#8b5cf6', '#7c3aed', '#a78bfa', '#c4b5fd', '#ddd6fe'],
    category: 'Purple'
  },
  {
    name: 'Rose Pink',
    colors: ['#ec4899', '#db2777', '#f472b6', '#f9a8d4', '#fce7f3'],
    category: 'Pink'
  },
  {
    name: 'Slate Gray',
    colors: ['#64748b', '#475569', '#94a3b8', '#cbd5e1', '#e2e8f0'],
    category: 'Gray'
  },
  {
    name: 'Fire Red',
    colors: ['#ef4444', '#dc2626', '#f87171', '#fca5a5', '#fecaca'],
    category: 'Red'
  },
  {
    name: 'Golden Yellow',
    colors: ['#f59e0b', '#d97706', '#fbbf24', '#fcd34d', '#fde68a'],
    category: 'Yellow'
  }
];

const GRADIENT_PRESETS = [
  {
    name: 'Sunset',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    colors: ['#667eea', '#764ba2']
  },
  {
    name: 'Ocean',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    colors: ['#667eea', '#764ba2']
  },
  {
    name: 'Forest',
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    colors: ['#11998e', '#38ef7d']
  },
  {
    name: 'Fire',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    colors: ['#f093fb', '#f5576c']
  },
  {
    name: 'Purple',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    colors: ['#4facfe', '#00f2fe']
  },
  {
    name: 'Pink',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    colors: ['#43e97b', '#38f9d7']
  }
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  label = 'Color',
  description,
  showPresets = true,
  showAdvanced = true,
  showHistory = true,
  className = ''
}) => {
  const [colorHistory, setColorHistory] = useState<string[]>([]);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('picker');

  // Add color to history
  const addToHistory = useCallback((color: string) => {
    setColorHistory(prev => {
      const filtered = prev.filter(c => c !== color);
      return [color, ...filtered].slice(0, 10);
    });
  }, []);

  // Handle color change
  const handleColorChange = (color: string) => {
    onChange(color);
    addToHistory(color);
  };

  // Copy color to clipboard
  const copyColor = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const rgb = hexToRgb(value);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          {label}
        </CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="picker">Picker</TabsTrigger>
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="picker" className="space-y-4">
            {/* Color Input */}
            <div className="space-y-2">
              <Label htmlFor="color-input">Color Value</Label>
              <div className="flex gap-2">
                <Input
                  id="color-input"
                  type="color"
                  value={value}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={value}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyColor(value)}
                  className="gap-2"
                >
                  {copiedColor === value ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Color Preview */}
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-lg border-2 border-border shadow-sm"
                  style={{ backgroundColor: value }}
                />
                <div className="space-y-1">
                  <div className="text-sm font-medium">{value}</div>
                  {rgb && (
                    <div className="text-xs text-muted-foreground">
                      RGB: {rgb.r}, {rgb.g}, {rgb.b}
                    </div>
                  )}
                  {hsl && (
                    <div className="text-xs text-muted-foreground">
                      HSL: {hsl.h}°, {hsl.s}%, {hsl.l}%
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Color History */}
            {showHistory && colorHistory.length > 0 && (
              <div className="space-y-2">
                <Label>Recent Colors</Label>
                <div className="flex flex-wrap gap-2">
                  {colorHistory.map((color, index) => (
                    <button
                      key={index}
                      className="w-8 h-8 rounded border-2 border-border hover:border-primary transition-colors"
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="presets" className="space-y-4">
            {/* Color Presets */}
            <div className="space-y-4">
              <Label>Color Palettes</Label>
              <div className="grid grid-cols-2 gap-3">
                {COLOR_PRESETS.map((preset) => (
                  <Card key={preset.name} className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{preset.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {preset.category}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        {preset.colors.map((color, index) => (
                          <button
                            key={index}
                            className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorChange(color)}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            {/* Gradient Presets */}
            <div className="space-y-4">
              <Label>Gradient Presets</Label>
              <div className="grid grid-cols-2 gap-3">
                {GRADIENT_PRESETS.map((preset) => (
                  <Card key={preset.name} className="p-3">
                    <div className="space-y-2">
                      <span className="text-sm font-medium">{preset.name}</span>
                      <div
                        className="w-full h-8 rounded border border-border"
                        style={{ background: preset.gradient }}
                      />
                      <div className="flex gap-1">
                        {preset.colors.map((color, index) => (
                          <button
                            key={index}
                            className="w-4 h-4 rounded border border-border hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorChange(color)}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            {/* Design System Colors */}
            <div className="space-y-4">
              <Label>Design System Colors</Label>
              
              {/* Primary Colors */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Primary</h4>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(colors.primary).map(([key, value]) => (
                    <button
                      key={key}
                      className="w-full h-8 rounded border border-border hover:scale-105 transition-transform"
                      style={{ backgroundColor: value }}
                      onClick={() => handleColorChange(value)}
                      title={`Primary ${key}: ${value}`}
                    />
                  ))}
                </div>
              </div>

              {/* Secondary Colors */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Secondary</h4>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(colors.secondary).map(([key, value]) => (
                    <button
                      key={key}
                      className="w-full h-8 rounded border border-border hover:scale-105 transition-transform"
                      style={{ backgroundColor: value }}
                      onClick={() => handleColorChange(value)}
                      title={`Secondary ${key}: ${value}`}
                    />
                  ))}
                </div>
              </div>

              {/* Accent Colors */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Accent</h4>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(colors.accent).map(([key, value]) => (
                    <button
                      key={key}
                      className="w-full h-8 rounded border border-border hover:scale-105 transition-transform"
                      style={{ backgroundColor: value }}
                      onClick={() => handleColorChange(value)}
                      title={`Accent ${key}: ${value}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ColorPicker;
