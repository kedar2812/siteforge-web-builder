import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Settings, 
  Eye, 
  Code,
  Save,
  Download,
  Upload,
  Plus,
  Trash2,
  Copy,
  Move,
  Zap,
  Clock,
  Target,
  Layers,
  Palette
} from 'lucide-react';

interface AnimationKeyframe {
  id: string;
  time: number; // 0-100%
  properties: {
    transform?: string;
    opacity?: number;
    scale?: number;
    rotate?: number;
    translateX?: number;
    translateY?: number;
    color?: string;
    backgroundColor?: string;
    width?: number;
    height?: number;
  };
}

interface Animation {
  id: string;
  name: string;
  duration: number; // milliseconds
  delay: number; // milliseconds
  iterationCount: number | 'infinite';
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode: 'none' | 'forwards' | 'backwards' | 'both';
  timingFunction: string;
  keyframes: AnimationKeyframe[];
  trigger: 'hover' | 'click' | 'scroll' | 'load' | 'custom';
  target: string; // CSS selector
}

interface AnimationEditorProps {
  onSave?: (animation: Animation) => void;
  onPreview?: (animation: Animation) => void;
  onExport?: (animation: Animation) => void;
  className?: string;
}

const TIMING_FUNCTIONS = [
  { value: 'linear', label: 'Linear' },
  { value: 'ease', label: 'Ease' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' },
  { value: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', label: 'Ease In Quad' },
  { value: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)', label: 'Ease In Cubic' },
  { value: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)', label: 'Ease In Quart' },
  { value: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)', label: 'Ease In Quint' },
  { value: 'cubic-bezier(0.19, 1, 0.22, 1)', label: 'Ease Out Expo' },
  { value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', label: 'Ease Out Back' }
];

const TRIGGERS = [
  { value: 'hover', label: 'Hover', icon: Target },
  { value: 'click', label: 'Click', icon: Target },
  { value: 'scroll', label: 'Scroll', icon: Target },
  { value: 'load', label: 'Page Load', icon: Target },
  { value: 'custom', label: 'Custom', icon: Target }
];

const DIRECTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'reverse', label: 'Reverse' },
  { value: 'alternate', label: 'Alternate' },
  { value: 'alternate-reverse', label: 'Alternate Reverse' }
];

const FILL_MODES = [
  { value: 'none', label: 'None' },
  { value: 'forwards', label: 'Forwards' },
  { value: 'backwards', label: 'Backwards' },
  { value: 'both', label: 'Both' }
];

export const AnimationEditor: React.FC<AnimationEditorProps> = ({
  onSave,
  onPreview,
  onExport,
  className = ''
}) => {
  const [animation, setAnimation] = useState<Animation>({
    id: 'animation-1',
    name: 'Fade In',
    duration: 1000,
    delay: 0,
    iterationCount: 1,
    direction: 'normal',
    fillMode: 'forwards',
    timingFunction: 'ease',
    keyframes: [
      {
        id: 'keyframe-1',
        time: 0,
        properties: {
          opacity: 0,
          transform: 'translateY(20px)'
        }
      },
      {
        id: 'keyframe-2',
        time: 100,
        properties: {
          opacity: 1,
          transform: 'translateY(0)'
        }
      }
    ],
    trigger: 'hover',
    target: '.element'
  });

  const [selectedKeyframe, setSelectedKeyframe] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('timeline');

  const addKeyframe = () => {
    const newKeyframe: AnimationKeyframe = {
      id: `keyframe-${Date.now()}`,
      time: 50,
      properties: {
        opacity: 1,
        transform: 'translateX(0)'
      }
    };
    setAnimation(prev => ({
      ...prev,
      keyframes: [...prev.keyframes, newKeyframe].sort((a, b) => a.time - b.time)
    }));
    setSelectedKeyframe(newKeyframe.id);
  };

  const updateKeyframe = (id: string, updates: Partial<AnimationKeyframe>) => {
    setAnimation(prev => ({
      ...prev,
      keyframes: prev.keyframes.map(kf => 
        kf.id === id ? { ...kf, ...updates } : kf
      ).sort((a, b) => a.time - b.time)
    }));
  };

  const deleteKeyframe = (id: string) => {
    setAnimation(prev => ({
      ...prev,
      keyframes: prev.keyframes.filter(kf => kf.id !== id)
    }));
    if (selectedKeyframe === id) {
      setSelectedKeyframe(null);
    }
  };

  const duplicateKeyframe = (id: string) => {
    const keyframe = animation.keyframes.find(kf => kf.id === id);
    if (keyframe) {
      const newKeyframe: AnimationKeyframe = {
        ...keyframe,
        id: `keyframe-${Date.now()}`,
        time: Math.min(keyframe.time + 10, 100)
      };
      setAnimation(prev => ({
        ...prev,
        keyframes: [...prev.keyframes, newKeyframe].sort((a, b) => a.time - b.time)
      }));
    }
  };

  const updateAnimation = (updates: Partial<Animation>) => {
    setAnimation(prev => ({ ...prev, ...updates }));
  };

  const selectedKeyframeData = animation.keyframes.find(kf => kf.id === selectedKeyframe);

  const generateCSS = () => {
    const keyframes = animation.keyframes.map(kf => {
      const properties = Object.entries(kf.properties)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ');
      return `${kf.time}% { ${properties} }`;
    }).join('\n');

    return `
@keyframes ${animation.name} {
  ${keyframes}
}

.${animation.name} {
  animation: ${animation.name} ${animation.duration}ms ${animation.timingFunction} ${animation.delay}ms ${animation.iterationCount} ${animation.direction} ${animation.fillMode};
}
    `.trim();
  };

  const playAnimation = () => {
    setIsPlaying(true);
    // Simulate animation playback
    setTimeout(() => setIsPlaying(false), animation.duration);
  };

  return (
    <div className={`w-full ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Animation Editor
              </CardTitle>
              <CardDescription>
                Create and customize CSS animations with keyframes
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={playAnimation} disabled={isPlaying}>
                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isPlaying ? 'Playing...' : 'Play'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => onPreview?.(animation)}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm" onClick={() => onExport?.(animation)}>
                <Code className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm" onClick={() => onSave?.(animation)}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Keyframes</h3>
                  <Button variant="outline" size="sm" onClick={addKeyframe}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Keyframe
                  </Button>
                </div>

                {/* Timeline */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-medium">Timeline</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full relative">
                      {animation.keyframes.map((keyframe) => (
                        <div
                          key={keyframe.id}
                          className="absolute top-0 w-3 h-3 bg-primary rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                          style={{ left: `${keyframe.time}%` }}
                          onClick={() => setSelectedKeyframe(keyframe.id)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {animation.keyframes.map((keyframe) => (
                      <div
                        key={keyframe.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                          selectedKeyframe === keyframe.id ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                        onClick={() => setSelectedKeyframe(keyframe.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {keyframe.time}%
                            </Badge>
                            <span className="text-sm">
                              {Object.entries(keyframe.properties)
                                .filter(([_, value]) => value !== undefined)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(', ')}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                duplicateKeyframe(keyframe.id);
                              }}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteKeyframe(keyframe.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Keyframe Editor */}
              {selectedKeyframeData && (
                <div className="mt-6">
                  <Separator />
                  <div className="mt-6">
                    <h3 className="font-semibold mb-4">Edit Keyframe</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Time Position</Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              value={[selectedKeyframeData.time]}
                              onValueChange={([value]) => updateKeyframe(selectedKeyframeData.id, { time: value })}
                              max={100}
                              min={0}
                              step={1}
                              className="flex-1"
                            />
                            <Input
                              type="number"
                              value={selectedKeyframeData.time}
                              onChange={(e) => updateKeyframe(selectedKeyframeData.id, { time: parseInt(e.target.value) || 0 })}
                              className="w-16"
                              min={0}
                              max={100}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Opacity</Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              value={[selectedKeyframeData.properties.opacity || 1]}
                              onValueChange={([value]) => updateKeyframe(selectedKeyframeData.id, { 
                                properties: { ...selectedKeyframeData.properties, opacity: value }
                              })}
                              max={1}
                              min={0}
                              step={0.1}
                              className="flex-1"
                            />
                            <Input
                              type="number"
                              value={selectedKeyframeData.properties.opacity || 1}
                              onChange={(e) => updateKeyframe(selectedKeyframeData.id, { 
                                properties: { ...selectedKeyframeData.properties, opacity: parseFloat(e.target.value) || 1 }
                              })}
                              className="w-16"
                              min={0}
                              max={1}
                              step={0.1}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Scale</Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              value={[selectedKeyframeData.properties.scale || 1]}
                              onValueChange={([value]) => updateKeyframe(selectedKeyframeData.id, { 
                                properties: { ...selectedKeyframeData.properties, scale: value }
                              })}
                              max={2}
                              min={0}
                              step={0.1}
                              className="flex-1"
                            />
                            <Input
                              type="number"
                              value={selectedKeyframeData.properties.scale || 1}
                              onChange={(e) => updateKeyframe(selectedKeyframeData.id, { 
                                properties: { ...selectedKeyframeData.properties, scale: parseFloat(e.target.value) || 1 }
                              })}
                              className="w-16"
                              min={0}
                              max={2}
                              step={0.1}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Translate X</Label>
                          <Input
                            type="number"
                            value={selectedKeyframeData.properties.translateX || 0}
                            onChange={(e) => updateKeyframe(selectedKeyframeData.id, { 
                              properties: { ...selectedKeyframeData.properties, translateX: parseInt(e.target.value) || 0 }
                            })}
                            placeholder="0"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Translate Y</Label>
                          <Input
                            type="number"
                            value={selectedKeyframeData.properties.translateY || 0}
                            onChange={(e) => updateKeyframe(selectedKeyframeData.id, { 
                              properties: { ...selectedKeyframeData.properties, translateY: parseInt(e.target.value) || 0 }
                            })}
                            placeholder="0"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Rotate (degrees)</Label>
                          <Input
                            type="number"
                            value={selectedKeyframeData.properties.rotate || 0}
                            onChange={(e) => updateKeyframe(selectedKeyframeData.id, { 
                              properties: { ...selectedKeyframeData.properties, rotate: parseInt(e.target.value) || 0 }
                            })}
                            placeholder="0"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Color</Label>
                          <Input
                            type="color"
                            value={selectedKeyframeData.properties.color || '#000000'}
                            onChange={(e) => updateKeyframe(selectedKeyframeData.id, { 
                              properties: { ...selectedKeyframeData.properties, color: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="properties" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Animation Name</Label>
                    <Input
                      value={animation.name}
                      onChange={(e) => updateAnimation({ name: e.target.value })}
                      placeholder="Enter animation name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Duration (ms)</Label>
                    <Input
                      type="number"
                      value={animation.duration}
                      onChange={(e) => updateAnimation({ duration: parseInt(e.target.value) || 1000 })}
                      placeholder="1000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Delay (ms)</Label>
                    <Input
                      type="number"
                      value={animation.delay}
                      onChange={(e) => updateAnimation({ delay: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Iteration Count</Label>
                    <Select
                      value={animation.iterationCount.toString()}
                      onValueChange={(value) => updateAnimation({ 
                        iterationCount: value === 'infinite' ? 'infinite' : parseInt(value) 
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="infinite">Infinite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Direction</Label>
                    <Select
                      value={animation.direction}
                      onValueChange={(value) => updateAnimation({ direction: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DIRECTIONS.map((direction) => (
                          <SelectItem key={direction.value} value={direction.value}>
                            {direction.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Fill Mode</Label>
                    <Select
                      value={animation.fillMode}
                      onValueChange={(value) => updateAnimation({ fillMode: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FILL_MODES.map((mode) => (
                          <SelectItem key={mode.value} value={mode.value}>
                            {mode.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Timing Function</Label>
                    <Select
                      value={animation.timingFunction}
                      onValueChange={(value) => updateAnimation({ timingFunction: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMING_FUNCTIONS.map((timing) => (
                          <SelectItem key={timing.value} value={timing.value}>
                            {timing.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Trigger</Label>
                    <Select
                      value={animation.trigger}
                      onValueChange={(value) => updateAnimation({ trigger: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TRIGGERS.map((trigger) => (
                          <SelectItem key={trigger.value} value={trigger.value}>
                            {trigger.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Target Selector</Label>
                  <Input
                    value={animation.target}
                    onChange={(e) => updateAnimation({ target: e.target.value })}
                    placeholder=".element, #id, element"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Animation ID</Label>
                  <Input
                    value={animation.id}
                    onChange={(e) => updateAnimation({ id: e.target.value })}
                    placeholder="animation-1"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="code" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Generated CSS</h3>
                  <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(generateCSS())}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{generateCSS()}</code>
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnimationEditor;
