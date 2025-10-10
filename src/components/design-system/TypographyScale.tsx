import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Type, 
  Bold, 
  Italic, 
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Plus,
  Minus,
  RotateCcw,
  Copy,
  Check
} from 'lucide-react';
import { typography } from '@/design-system/tokens';

interface TypographyScaleProps {
  value: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
    textAlign: string;
  };
  onChange: (value: any) => void;
  label?: string;
  description?: string;
  showPreview?: boolean;
  className?: string;
}

const FONT_FAMILIES = [
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
  { value: 'JetBrains Mono', label: 'JetBrains Mono', category: 'Monospace' }
];

const FONT_WEIGHTS = [
  { value: '100', label: 'Thin', weight: '100' },
  { value: '200', label: 'Extra Light', weight: '200' },
  { value: '300', label: 'Light', weight: '300' },
  { value: '400', label: 'Normal', weight: '400' },
  { value: '500', label: 'Medium', weight: '500' },
  { value: '600', label: 'Semi Bold', weight: '600' },
  { value: '700', label: 'Bold', weight: '700' },
  { value: '800', label: 'Extra Bold', weight: '800' },
  { value: '900', label: 'Black', weight: '900' }
];

const TEXT_ALIGN_OPTIONS = [
  { value: 'left', label: 'Left', icon: AlignLeft },
  { value: 'center', label: 'Center', icon: AlignCenter },
  { value: 'right', label: 'Right', icon: AlignRight },
  { value: 'justify', label: 'Justify', icon: AlignJustify }
];

const TYPOGRAPHY_PRESETS = [
  {
    name: 'Heading 1',
    style: {
      fontFamily: 'Inter',
      fontSize: '3rem',
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.025em'
    }
  },
  {
    name: 'Heading 2',
    style: {
      fontFamily: 'Inter',
      fontSize: '2.25rem',
      fontWeight: '600',
      lineHeight: '1.3',
      letterSpacing: '-0.025em'
    }
  },
  {
    name: 'Heading 3',
    style: {
      fontFamily: 'Inter',
      fontSize: '1.875rem',
      fontWeight: '600',
      lineHeight: '1.4',
      letterSpacing: '0'
    }
  },
  {
    name: 'Body Large',
    style: {
      fontFamily: 'Inter',
      fontSize: '1.125rem',
      fontWeight: '400',
      lineHeight: '1.6',
      letterSpacing: '0'
    }
  },
  {
    name: 'Body',
    style: {
      fontFamily: 'Inter',
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0'
    }
  },
  {
    name: 'Body Small',
    style: {
      fontFamily: 'Inter',
      fontSize: '0.875rem',
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0'
    }
  },
  {
    name: 'Caption',
    style: {
      fontFamily: 'Inter',
      fontSize: '0.75rem',
      fontWeight: '400',
      lineHeight: '1.4',
      letterSpacing: '0.025em'
    }
  }
];

export const TypographyScale: React.FC<TypographyScaleProps> = ({
  value,
  onChange,
  label = 'Typography',
  description,
  showPreview = true,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [copiedStyle, setCopiedStyle] = useState<string | null>(null);

  const handleChange = (key: string, newValue: string) => {
    onChange({
      ...value,
      [key]: newValue
    });
  };

  const applyPreset = (preset: typeof TYPOGRAPHY_PRESETS[0]) => {
    onChange({
      ...value,
      ...preset.style
    });
  };

  const copyStyle = async () => {
    const css = `
font-family: ${value.fontFamily};
font-size: ${value.fontSize};
font-weight: ${value.fontWeight};
line-height: ${value.lineHeight};
letter-spacing: ${value.letterSpacing};
text-align: ${value.textAlign};
    `.trim();

    try {
      await navigator.clipboard.writeText(css);
      setCopiedStyle('copied');
      setTimeout(() => setCopiedStyle(null), 2000);
    } catch (err) {
      console.error('Failed to copy style:', err);
    }
  };

  const resetToDefault = () => {
    onChange({
      fontFamily: 'Inter',
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0',
      textAlign: 'left'
    });
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="w-5 h-5" />
          {label}
        </CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="presets">Presets</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            {/* Font Family */}
            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select
                value={value.fontFamily}
                onValueChange={(val) => handleChange('fontFamily', val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_FAMILIES.map((font) => (
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

            {/* Font Size */}
            <div className="space-y-2">
              <Label>Font Size: {value.fontSize}</Label>
              <Slider
                value={[parseFloat(value.fontSize.replace('rem', ''))]}
                onValueChange={([val]) => handleChange('fontSize', `${val}rem`)}
                min={0.5}
                max={4}
                step={0.125}
                className="w-full"
              />
            </div>

            {/* Font Weight */}
            <div className="space-y-2">
              <Label>Font Weight</Label>
              <Select
                value={value.fontWeight}
                onValueChange={(val) => handleChange('fontWeight', val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_WEIGHTS.map((weight) => (
                    <SelectItem key={weight.value} value={weight.value}>
                      <div className="flex items-center gap-2">
                        <span style={{ fontWeight: weight.weight }}>{weight.label}</span>
                        <span className="text-xs text-muted-foreground">({weight.value})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Text Alignment */}
            <div className="space-y-2">
              <Label>Text Alignment</Label>
              <div className="flex gap-1">
                {TEXT_ALIGN_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Button
                      key={option.value}
                      variant={value.textAlign === option.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleChange('textAlign', option.value)}
                      className="flex-1"
                    >
                      <Icon className="w-4 h-4" />
                    </Button>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            {/* Line Height */}
            <div className="space-y-2">
              <Label>Line Height: {value.lineHeight}</Label>
              <Slider
                value={[parseFloat(value.lineHeight)]}
                onValueChange={([val]) => handleChange('lineHeight', val.toString())}
                min={1}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Letter Spacing */}
            <div className="space-y-2">
              <Label>Letter Spacing: {value.letterSpacing}</Label>
              <Slider
                value={[parseFloat(value.letterSpacing.replace('em', ''))]}
                onValueChange={([val]) => handleChange('letterSpacing', `${val}em`)}
                min={-0.1}
                max={0.2}
                step={0.01}
                className="w-full"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyStyle}
                className="flex-1"
              >
                {copiedStyle ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copiedStyle ? 'Copied!' : 'Copy CSS'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetToDefault}
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="presets" className="space-y-4">
            <div className="space-y-3">
              {TYPOGRAPHY_PRESETS.map((preset) => (
                <Card key={preset.name} className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{preset.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {preset.style.fontFamily} • {preset.style.fontSize} • {preset.style.fontWeight}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => applyPreset(preset)}
                    >
                      Apply
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Preview */}
        {showPreview && (
          <>
            <Separator className="my-4" />
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="p-4 border rounded-lg bg-muted/50">
                <div
                  style={{
                    fontFamily: value.fontFamily,
                    fontSize: value.fontSize,
                    fontWeight: value.fontWeight,
                    lineHeight: value.lineHeight,
                    letterSpacing: value.letterSpacing,
                    textAlign: value.textAlign as any
                  }}
                >
                  The quick brown fox jumps over the lazy dog. This is a preview of your typography settings.
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TypographyScale;
