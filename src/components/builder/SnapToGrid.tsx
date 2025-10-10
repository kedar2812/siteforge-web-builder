import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Grid3X3, 
  Settings, 
  Eye, 
  EyeOff,
  Move,
  RotateCw,
  Square
} from 'lucide-react';

interface SnapToGridProps {
  enabled: boolean;
  gridSize: number;
  snapThreshold: number;
  showGrid: boolean;
  onToggle: (enabled: boolean) => void;
  onGridSizeChange: (size: number) => void;
  onSnapThresholdChange: (threshold: number) => void;
  onShowGridToggle: (show: boolean) => void;
  containerRef: React.RefObject<HTMLElement>;
}

interface GridSettings {
  enabled: boolean;
  size: number;
  snapThreshold: number;
  showGrid: boolean;
  color: string;
  opacity: number;
  style: 'dots' | 'lines' | 'crosses';
}

export const SnapToGrid: React.FC<SnapToGridProps> = ({
  enabled,
  gridSize,
  snapThreshold,
  showGrid,
  onToggle,
  onGridSizeChange,
  onSnapThresholdChange,
  onShowGridToggle,
  containerRef
}) => {
  const [settings, setSettings] = useState<GridSettings>({
    enabled,
    size: gridSize,
    snapThreshold,
    showGrid,
    color: '#3b82f6',
    opacity: 0.3,
    style: 'dots'
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [snapPosition, setSnapPosition] = useState<{ x: number; y: number } | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);

  // Update settings when props change
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      enabled,
      size: gridSize,
      snapThreshold,
      showGrid
    }));
  }, [enabled, gridSize, snapThreshold, showGrid]);

  // Calculate snap position
  const calculateSnapPosition = (x: number, y: number) => {
    if (!settings.enabled) return { x, y };

    const snappedX = Math.round(x / settings.size) * settings.size;
    const snappedY = Math.round(y / settings.size) * settings.size;

    const distance = Math.sqrt(Math.pow(x - snappedX, 2) + Math.pow(y - snappedY, 2));
    
    if (distance <= settings.snapThreshold) {
      return { x: snappedX, y: snappedY };
    }

    return { x, y };
  };

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Handle drag move
  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging || !dragStart || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;

    const snapped = calculateSnapPosition(x, y);
    
    if (snapped.x !== x || snapped.y !== y) {
      setSnapPosition(snapped);
    } else {
      setSnapPosition(null);
    }
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
    setDragStart(null);
    setSnapPosition(null);
  };

  // Mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging, dragStart]);

  // Render grid
  const renderGrid = () => {
    if (!settings.showGrid || !containerRef.current) return null;

    const containerRect = containerRef.current.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;

    const gridLines = [];
    const gridDots = [];

    if (settings.style === 'lines') {
      // Vertical lines
      for (let x = 0; x <= width; x += settings.size) {
        gridLines.push(
          <line
            key={`v-${x}`}
            x1={x}
            y1={0}
            x2={x}
            y2={height}
            stroke={settings.color}
            strokeWidth={1}
            opacity={settings.opacity}
          />
        );
      }

      // Horizontal lines
      for (let y = 0; y <= height; y += settings.size) {
        gridLines.push(
          <line
            key={`h-${y}`}
            x1={0}
            y1={y}
            x2={width}
            y2={y}
            stroke={settings.color}
            strokeWidth={1}
            opacity={settings.opacity}
          />
        );
      }
    } else if (settings.style === 'dots') {
      // Grid dots
      for (let x = 0; x <= width; x += settings.size) {
        for (let y = 0; y <= height; y += settings.size) {
          gridDots.push(
            <circle
              key={`dot-${x}-${y}`}
              cx={x}
              cy={y}
              r={1}
              fill={settings.color}
              opacity={settings.opacity}
            />
          );
        }
      }
    } else if (settings.style === 'crosses') {
      // Grid crosses
      for (let x = 0; x <= width; x += settings.size) {
        for (let y = 0; y <= height; y += settings.size) {
          gridDots.push(
            <g key={`cross-${x}-${y}`}>
              <line
                x1={x - 2}
                y1={y}
                x2={x + 2}
                y2={y}
                stroke={settings.color}
                strokeWidth={1}
                opacity={settings.opacity}
              />
              <line
                x1={x}
                y1={y - 2}
                x2={x}
                y2={y + 2}
                stroke={settings.color}
                strokeWidth={1}
                opacity={settings.opacity}
              />
            </g>
          );
        }
      }
    }

    return (
      <svg
        className="absolute inset-0 pointer-events-none"
        width={width}
        height={height}
      >
        {gridLines}
        {gridDots}
      </svg>
    );
  };

  return (
    <>
      {/* Grid overlay */}
      {settings.showGrid && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {renderGrid()}
        </div>
      )}

      {/* Snap indicator */}
      {snapPosition && (
        <div
          className="absolute w-2 h-2 bg-blue-500 rounded-full pointer-events-none z-20"
          style={{
            left: snapPosition.x - 4,
            top: snapPosition.y - 4
          }}
        />
      )}

      {/* Grid settings panel */}
      <Card className="w-80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5" />
            Snap to Grid
          </CardTitle>
          <CardDescription>
            Align elements to a grid for precise positioning
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Enable/disable */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">Enable Snap to Grid</label>
              <p className="text-xs text-muted-foreground">
                Snap elements to grid points
              </p>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={onToggle}
            />
          </div>

          {/* Grid size */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Grid Size</label>
            <div className="flex items-center gap-2">
              <Slider
                value={[settings.size]}
                onValueChange={([value]) => onGridSizeChange(value)}
                min={5}
                max={50}
                step={5}
                className="flex-1"
              />
              <Badge variant="outline" className="w-12 text-center">
                {settings.size}px
              </Badge>
            </div>
          </div>

          {/* Snap threshold */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Snap Threshold</label>
            <div className="flex items-center gap-2">
              <Slider
                value={[settings.snapThreshold]}
                onValueChange={([value]) => onSnapThresholdChange(value)}
                min={1}
                max={20}
                step={1}
                className="flex-1"
              />
              <Badge variant="outline" className="w-12 text-center">
                {settings.snapThreshold}px
              </Badge>
            </div>
          </div>

          {/* Show grid */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">Show Grid</label>
              <p className="text-xs text-muted-foreground">
                Display grid overlay
              </p>
            </div>
            <Switch
              checked={settings.showGrid}
              onCheckedChange={onShowGridToggle}
            />
          </div>

          {/* Grid style */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Grid Style</label>
            <Select
              value={settings.style}
              onValueChange={(value) => setSettings(prev => ({ ...prev, style: value as any }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dots">Dots</SelectItem>
                <SelectItem value="lines">Lines</SelectItem>
                <SelectItem value="crosses">Crosses</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Grid color */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Grid Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.color}
                onChange={(e) => setSettings(prev => ({ ...prev, color: e.target.value }))}
                className="w-8 h-8 rounded border"
              />
              <input
                type="text"
                value={settings.color}
                onChange={(e) => setSettings(prev => ({ ...prev, color: e.target.value }))}
                className="flex-1 px-2 py-1 text-sm border rounded"
              />
            </div>
          </div>

          {/* Grid opacity */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Grid Opacity</label>
            <div className="flex items-center gap-2">
              <Slider
                value={[settings.opacity]}
                onValueChange={([value]) => setSettings(prev => ({ ...prev, opacity: value }))}
                min={0.1}
                max={1}
                step={0.1}
                className="flex-1"
              />
              <Badge variant="outline" className="w-12 text-center">
                {Math.round(settings.opacity * 100)}%
              </Badge>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSettings(prev => ({ ...prev, showGrid: !prev.showGrid }))}
              className="flex-1"
            >
              {settings.showGrid ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {settings.showGrid ? 'Hide' : 'Show'} Grid
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
              className="flex-1"
            >
              <Move className="w-4 h-4 mr-2" />
              {settings.enabled ? 'Disable' : 'Enable'} Snap
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

// Hook for snap to grid functionality
export const useSnapToGrid = (
  containerRef: React.RefObject<HTMLElement>,
  gridSize: number = 20,
  snapThreshold: number = 10
) => {
  const [enabled, setEnabled] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [snapPosition, setSnapPosition] = useState<{ x: number; y: number } | null>(null);

  const snapToGrid = (x: number, y: number) => {
    if (!enabled) return { x, y };

    const snappedX = Math.round(x / gridSize) * gridSize;
    const snappedY = Math.round(y / gridSize) * gridSize;

    const distance = Math.sqrt(Math.pow(x - snappedX, 2) + Math.pow(y - snappedY, 2));
    
    if (distance <= snapThreshold) {
      setSnapPosition({ x: snappedX, y: snappedY });
      return { x: snappedX, y: snappedY };
    }

    setSnapPosition(null);
    return { x, y };
  };

  const toggleSnap = () => {
    setEnabled(!enabled);
  };

  const toggleGrid = () => {
    setShowGrid(!showGrid);
  };

  return {
    enabled,
    showGrid,
    snapPosition,
    snapToGrid,
    toggleSnap,
    toggleGrid,
    setEnabled,
    setShowGrid
  };
};
