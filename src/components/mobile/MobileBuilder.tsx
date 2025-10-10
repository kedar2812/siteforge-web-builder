import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { 
  Menu, 
  X, 
  Plus, 
  Settings, 
  Eye, 
  Save, 
  Undo, 
  Redo,
  Smartphone,
  Tablet,
  Monitor,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move,
  Copy,
  Trash2,
  Layers,
  Palette,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Triangle
} from 'lucide-react';
import { useTouchGestures } from '@/hooks/useTouchGestures';

interface MobileBuilderProps {
  children: React.ReactNode;
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onPreview?: () => void;
  className?: string;
}

interface ViewportSize {
  width: number;
  height: number;
  type: 'mobile' | 'tablet' | 'desktop';
}

const VIEWPORT_SIZES: ViewportSize[] = [
  { width: 375, height: 667, type: 'mobile' },
  { width: 768, height: 1024, type: 'tablet' },
  { width: 1200, height: 800, type: 'desktop' }
];

export const MobileBuilder: React.FC<MobileBuilderProps> = ({
  children,
  onSave,
  onUndo,
  onRedo,
  onPreview,
  className = ''
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentViewport, setCurrentViewport] = useState<ViewportSize>(VIEWPORT_SIZES[2]);
  const [zoom, setZoom] = useState(1);
  const [activePanel, setActivePanel] = useState<'elements' | 'properties' | 'layers' | null>(null);
  const [isGestureMode, setIsGestureMode] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768;
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Touch gesture handlers
  const handleGesture = useCallback((gesture: any) => {
    if (!isGestureMode) return;

    switch (gesture.type) {
      case 'swipe':
        if (gesture.direction === 'left') {
          setActivePanel('elements');
        } else if (gesture.direction === 'right') {
          setActivePanel('properties');
        }
        break;
      case 'pinch':
        if (gesture.scale > 1) {
          setZoom(prev => Math.min(prev * 1.1, 2));
        } else {
          setZoom(prev => Math.max(prev * 0.9, 0.5));
        }
        break;
      case 'double-tap':
        setZoom(1);
        break;
    }
  }, [isGestureMode]);

  const { gestureRef } = useTouchGestures({
    onGesture: handleGesture,
    enabled: isMobile
  });

  const handleViewportChange = (viewport: ViewportSize) => {
    setCurrentViewport(viewport);
    setZoom(1);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev * 0.8, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className={`mobile-builder ${className}`} ref={gestureRef}>
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Sheet open={activePanel === 'elements'} onOpenChange={(open) => setActivePanel(open ? 'elements' : null)}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Elements</SheetTitle>
                  <SheetDescription>
                    Add and manage page elements
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="flex flex-col items-center gap-2 h-auto p-3">
                      <Type className="w-4 h-4" />
                      <span className="text-xs">Text</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex flex-col items-center gap-2 h-auto p-3">
                      <ImageIcon className="w-4 h-4" />
                      <span className="text-xs">Image</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex flex-col items-center gap-2 h-auto p-3">
                      <Square className="w-4 h-4" />
                      <span className="text-xs">Shape</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex flex-col items-center gap-2 h-auto p-3">
                      <Circle className="w-4 h-4" />
                      <span className="text-xs">Circle</span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Button variant="ghost" size="sm" onClick={() => setActivePanel('properties')}>
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* Viewport Selector */}
            <div className="flex items-center gap-1 border border-border rounded-lg p-1">
              <Button
                variant={currentViewport.type === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewportChange(VIEWPORT_SIZES[0])}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
              <Button
                variant={currentViewport.type === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewportChange(VIEWPORT_SIZES[1])}
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={currentViewport.type === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewportChange(VIEWPORT_SIZES[2])}
              >
                <Monitor className="w-4 h-4" />
              </Button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleResetZoom}>
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onUndo}>
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onRedo}>
              <Redo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onPreview}>
              <Eye className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={onSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Zoom Indicator */}
        <div className="px-4 pb-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{currentViewport.type} ({currentViewport.width}×{currentViewport.height})</span>
            <span>{Math.round(zoom * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Canvas Area */}
          <div className="flex-1 overflow-auto bg-muted/30 p-4">
            <div className="flex items-center justify-center min-h-full">
              <div
                className="bg-background border border-border rounded-lg shadow-lg overflow-hidden"
                style={{
                  width: currentViewport.width * zoom,
                  height: currentViewport.height * zoom,
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top left'
                }}
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="sticky bottom-0 z-40 bg-background border-t border-border/50 backdrop-blur-sm">
        <Tabs defaultValue="layers" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="layers" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Layers
            </TabsTrigger>
            <TabsTrigger value="properties" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Properties
            </TabsTrigger>
            <TabsTrigger value="styles" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Styles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="layers" className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Page Layers</span>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">Header</span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      <Move className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">Hero Section</span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      <Move className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="properties" className="p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Element Properties</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Width</span>
                    <input type="number" className="w-20 px-2 py-1 text-sm border rounded" placeholder="100%" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Height</span>
                    <input type="number" className="w-20 px-2 py-1 text-sm border rounded" placeholder="auto" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Opacity</span>
                    <input type="range" min="0" max="1" step="0.1" className="w-20" />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="styles" className="p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Colors</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm" className="h-8 bg-red-500"></Button>
                  <Button variant="outline" size="sm" className="h-8 bg-blue-500"></Button>
                  <Button variant="outline" size="sm" className="h-8 bg-green-500"></Button>
                  <Button variant="outline" size="sm" className="h-8 bg-yellow-500"></Button>
                  <Button variant="outline" size="sm" className="h-8 bg-purple-500"></Button>
                  <Button variant="outline" size="sm" className="h-8 bg-pink-500"></Button>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Typography</h3>
                <div className="space-y-2">
                  <select className="w-full px-2 py-1 text-sm border rounded">
                    <option>Inter</option>
                    <option>Roboto</option>
                    <option>Open Sans</option>
                  </select>
                  <div className="flex items-center gap-2">
                    <input type="range" min="12" max="48" className="flex-1" />
                    <span className="text-xs text-muted-foreground">24px</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Gesture Mode Toggle */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant={isGestureMode ? 'default' : 'outline'}
          size="sm"
          onClick={() => setIsGestureMode(!isGestureMode)}
          className="rounded-full"
        >
          {isGestureMode ? 'Gesture On' : 'Gesture Off'}
        </Button>
      </div>
    </div>
  );
};

export default MobileBuilder;
