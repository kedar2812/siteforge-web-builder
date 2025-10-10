import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDrag } from '@dnd-kit/core';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Move, 
  Copy, 
  Trash2, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  AlignJustify,
  AlignVerticalJustifyCenter,
  AlignHorizontalJustifyCenter,
  Group,
  Ungroup,
  Lock,
  Unlock,
  Eye,
  EyeOff
} from 'lucide-react';

interface MultiSelectProps {
  selectedElements: string[];
  onSelectionChange: (elements: string[]) => void;
  onDelete: (elements: string[]) => void;
  onCopy: (elements: string[]) => void;
  onAlign: (alignment: string) => void;
  onGroup: () => void;
  onUngroup: () => void;
  onToggleVisibility: (elements: string[]) => void;
  onToggleLock: (elements: string[]) => void;
  containerRef: React.RefObject<HTMLElement>;
}

interface SelectionBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  selectedElements,
  onSelectionChange,
  onDelete,
  onCopy,
  onAlign,
  onGroup,
  onUngroup,
  onToggleVisibility,
  onToggleLock,
  containerRef
}) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const selectionRef = useRef<HTMLDivElement>(null);

  // Handle mouse down for selection box
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target !== containerRef.current) return;
    
    e.preventDefault();
    setIsSelecting(true);
    setStartPoint({ x: e.clientX, y: e.clientY });
    setSelectionBox({
      x: e.clientX,
      y: e.clientY,
      width: 0,
      height: 0
    });
  }, [containerRef]);

  // Handle mouse move for selection box
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isSelecting || !startPoint) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = Math.min(startPoint.x, e.clientX) - rect.left;
    const y = Math.min(startPoint.y, e.clientY) - rect.top;
    const width = Math.abs(e.clientX - startPoint.x);
    const height = Math.abs(e.clientY - startPoint.y);

    setSelectionBox({ x, y, width, height });

    // Find elements within selection box
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll('[data-element-id]');
      const selectedIds: string[] = [];

      elements.forEach((element) => {
        const elementRect = element.getBoundingClientRect();
        const containerRect = containerRef.current!.getBoundingClientRect();
        
        const elementX = elementRect.left - containerRect.left;
        const elementY = elementRect.top - containerRect.top;
        const elementWidth = elementRect.width;
        const elementHeight = elementRect.height;

        // Check if element intersects with selection box
        const intersects = !(
          elementX > x + width ||
          elementX + elementWidth < x ||
          elementY > y + height ||
          elementY + elementHeight < y
        );

        if (intersects) {
          const elementId = element.getAttribute('data-element-id');
          if (elementId) {
            selectedIds.push(elementId);
          }
        }
      });

      onSelectionChange(selectedIds);
    }
  }, [isSelecting, startPoint, containerRef, onSelectionChange]);

  // Handle mouse up to finish selection
  const handleMouseUp = useCallback(() => {
    setIsSelecting(false);
    setStartPoint(null);
    setSelectionBox(null);
  }, []);

  // Handle drag start for selected elements
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (selectedElements.length === 0) return;
    
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragOffset({ x: 0, y: 0 });
  }, [selectedElements]);

  // Handle drag move for selected elements
  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragStart) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setDragOffset({ x: deltaX, y: deltaY });

    // Move all selected elements
    selectedElements.forEach((elementId) => {
      const element = containerRef.current?.querySelector(`[data-element-id="${elementId}"]`);
      if (element) {
        const currentTransform = element.style.transform || '';
        const translateMatch = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
        
        if (translateMatch) {
          const currentX = parseFloat(translateMatch[1]) || 0;
          const currentY = parseFloat(translateMatch[2]) || 0;
          element.style.transform = `translate(${currentX + deltaX}px, ${currentY + deltaY}px)`;
        } else {
          element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        }
      }
    });
  }, [isDragging, dragStart, selectedElements, containerRef]);

  // Handle drag end for selected elements
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedElements.length === 0) return;

      switch (e.key) {
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          onDelete(selectedElements);
          break;
        case 'c':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            onCopy(selectedElements);
          }
          break;
        case 'Escape':
          onSelectionChange([]);
          break;
        case 'a':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            // Select all elements
            if (containerRef.current) {
              const elements = containerRef.current.querySelectorAll('[data-element-id]');
              const allIds = Array.from(elements).map(el => el.getAttribute('data-element-id')).filter(Boolean) as string[];
              onSelectionChange(allIds);
            }
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedElements, onDelete, onCopy, onSelectionChange, containerRef]);

  // Mouse event listeners
  useEffect(() => {
    if (isSelecting) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isSelecting, isDragging, handleMouseMove, handleMouseUp, handleDragMove, handleDragEnd]);

  if (selectedElements.length === 0) {
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        onMouseDown={handleMouseDown}
      >
        {selectionBox && (
          <div
            className="absolute border-2 border-blue-500 bg-blue-500/10 pointer-events-none"
            style={{
              left: selectionBox.x,
              top: selectionBox.y,
              width: selectionBox.width,
              height: selectionBox.height
            }}
          />
        )}
      </div>
    );
  }

  return (
    <>
      {/* Selection box for multiple elements */}
      {selectionBox && (
        <div
          className="absolute border-2 border-blue-500 bg-blue-500/10 pointer-events-none z-50"
          style={{
            left: selectionBox.x,
            top: selectionBox.y,
            width: selectionBox.width,
            height: selectionBox.height
          }}
        />
      )}

      {/* Multi-select toolbar */}
      {selectedElements.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="mr-2">
                  {selectedElements.length} selected
                </Badge>
                
                {/* Move handle */}
                <Button
                  variant="outline"
                  size="sm"
                  onMouseDown={handleDragStart}
                  className="cursor-move"
                >
                  <Move className="w-4 h-4" />
                </Button>

                {/* Alignment buttons */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAlign('left')}
                    title="Align Left"
                  >
                    <AlignLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAlign('center')}
                    title="Align Center"
                  >
                    <AlignCenter className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAlign('right')}
                    title="Align Right"
                  >
                    <AlignRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAlign('justify')}
                    title="Justify"
                  >
                    <AlignJustify className="w-4 h-4" />
                  </Button>
                </div>

                <div className="w-px h-6 bg-border mx-2" />

                {/* Vertical alignment */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAlign('top')}
                    title="Align Top"
                  >
                    <AlignVerticalJustifyCenter className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAlign('middle')}
                    title="Align Middle"
                  >
                    <AlignHorizontalJustifyCenter className="w-4 h-4" />
                  </Button>
                </div>

                <div className="w-px h-6 bg-border mx-2" />

                {/* Group/ungroup */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onGroup}
                  title="Group Elements"
                >
                  <Group className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onUngroup}
                  title="Ungroup Elements"
                >
                  <Ungroup className="w-4 h-4" />
                </Button>

                <div className="w-px h-6 bg-border mx-2" />

                {/* Actions */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCopy(selectedElements)}
                  title="Copy"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleVisibility(selectedElements)}
                  title="Toggle Visibility"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleLock(selectedElements)}
                  title="Toggle Lock"
                >
                  <Lock className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(selectedElements)}
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Selection indicators for each selected element */}
      {selectedElements.map((elementId) => {
        const element = containerRef.current?.querySelector(`[data-element-id="${elementId}"]`);
        if (!element) return null;

        const rect = element.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect) return null;

        return (
          <div
            key={elementId}
            className="absolute border-2 border-blue-500 bg-blue-500/10 pointer-events-none z-40"
            style={{
              left: rect.left - containerRect.left + (isDragging ? dragOffset.x : 0),
              top: rect.top - containerRect.top + (isDragging ? dragOffset.y : 0),
              width: rect.width,
              height: rect.height
            }}
          >
            {/* Corner handles */}
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
          </div>
        );
      })}
    </>
  );
};

// Hook for multi-select functionality
export const useMultiSelect = (
  containerRef: React.RefObject<HTMLElement>
) => {
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [isMultiSelecting, setIsMultiSelecting] = useState(false);

  const selectElement = (elementId: string, addToSelection: boolean = false) => {
    if (addToSelection) {
      setSelectedElements(prev => 
        prev.includes(elementId) 
          ? prev.filter(id => id !== elementId)
          : [...prev, elementId]
      );
    } else {
      setSelectedElements([elementId]);
    }
  };

  const clearSelection = () => {
    setSelectedElements([]);
  };

  const selectAll = () => {
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll('[data-element-id]');
      const allIds = Array.from(elements).map(el => el.getAttribute('data-element-id')).filter(Boolean) as string[];
      setSelectedElements(allIds);
    }
  };

  const deleteSelected = (onDelete: (elements: string[]) => void) => {
    onDelete(selectedElements);
    setSelectedElements([]);
  };

  const copySelected = (onCopy: (elements: string[]) => void) => {
    onCopy(selectedElements);
  };

  const alignSelected = (alignment: string, onAlign: (alignment: string) => void) => {
    onAlign(alignment);
  };

  return {
    selectedElements,
    isMultiSelecting,
    selectElement,
    clearSelection,
    selectAll,
    deleteSelected,
    copySelected,
    alignSelected,
    setSelectedElements
  };
};
