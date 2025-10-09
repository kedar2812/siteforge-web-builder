import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Move, 
  Trash2, 
  Copy, 
  RotateCcw, 
  Save, 
  Eye, 
  Edit3,
  Maximize2,
  Minimize2,
  Settings
} from 'lucide-react';
import { EditableElement, useTemplateEditor, createResizeHandles, createDeleteButton } from '@/utils/templateEditor';

interface LiveTemplateEditorProps {
  templateHtml: string;
  onSave: (htmlContent: string) => void;
  onClose: () => void;
}

export default function LiveTemplateEditor({ templateHtml, onSave, onClose }: LiveTemplateEditorProps) {
  const {
    state,
    updateElement,
    deleteElement,
    selectElement,
    loadTemplate
  } = useTemplateEditor(templateHtml);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedElement, setSelectedElement] = useState<EditableElement | null>(null);
  const [dragState, setDragState] = useState({
    isDragging: false,
    dragElementId: null as string | null,
    startPosition: { x: 0, y: 0 },
    offset: { x: 0, y: 0 }
  });

  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // Load template on mount
  useEffect(() => {
    if (templateHtml) {
      loadTemplate(templateHtml);
    }
  }, [templateHtml, loadTemplate]);

  // Handle element selection
  const handleElementClick = (elementId: string) => {
    const element = state.elements.find(el => el.id === elementId);
    if (element) {
      setSelectedElement(element);
      selectElement(elementId);
    }
  };

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    setDragState({
      isDragging: true,
      dragElementId: elementId,
      startPosition: { x: e.clientX, y: e.clientY },
      offset: { x: 0, y: 0 }
    });
  };

  // Handle drag move
  const handleDragMove = (e: MouseEvent) => {
    if (!dragState.isDragging || !dragState.dragElementId) return;

    const deltaX = e.clientX - dragState.startPosition.x;
    const deltaY = e.clientY - dragState.startPosition.y;

    updateElement(dragState.dragElementId, {
      position: {
        x: deltaX,
        y: deltaY
      }
    });
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDragState({
      isDragging: false,
      dragElementId: null,
      startPosition: { x: 0, y: 0 },
      offset: { x: 0, y: 0 }
    });
  };

  // Add event listeners for drag
  useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [dragState.isDragging]);

  // Handle element deletion
  const handleDeleteElement = (elementId: string) => {
    deleteElement(elementId);
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
  };

  // Handle element content update
  const handleContentUpdate = (elementId: string, content: string) => {
    updateElement(elementId, { content });
  };

  // Handle element style update
  const handleStyleUpdate = (elementId: string, styles: Record<string, string>) => {
    updateElement(elementId, { styles: { ...selectedElement?.styles, ...styles } });
  };

  // Generate editable component
  const generateEditableComponent = (element: EditableElement): JSX.Element => {
    const isSelected = selectedElement?.id === element.id;
    
    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      handleElementClick(element.id);
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (element.isEditable) {
        setIsEditing(true);
      }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      if (element.isDraggable) {
        handleDragStart(e, element.id);
      }
    };

    const style = {
      ...element.styles,
      position: 'absolute' as const,
      left: `${element.position.x}px`,
      top: `${element.position.y}px`,
      width: `${element.size.width}px`,
      height: `${element.size.height}px`,
      cursor: element.isDraggable ? 'move' : 'default',
      border: isSelected ? '2px solid #3b82f6' : '1px dashed transparent',
      zIndex: isSelected ? 1000 : 1,
      backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
    };

    const className = `editable-element ${element.type} ${element.isDraggable ? 'draggable' : ''} ${element.isResizable ? 'resizable' : ''} ${isSelected ? 'selected' : ''}`;

    const children = element.children.map(child => generateEditableComponent(child));

    const props = {
      key: element.id,
      id: element.id,
      className,
      style,
      onClick: handleClick,
      onDoubleClick: handleDoubleClick,
      onMouseDown: handleMouseDown,
      ...element.attributes
    };

    // Render based on element type
    let content = element.content;
    if (isEditing && element.isEditable) {
      content = (
        <input
          type="text"
          value={element.content}
          onChange={(e) => handleContentUpdate(element.id, e.target.value)}
          onBlur={() => setIsEditing(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setIsEditing(false);
            }
          }}
          autoFocus
          className="w-full bg-transparent border-none outline-none"
        />
      );
    }

    switch (element.type) {
      case 'heading':
        const HeadingTag = element.tagName as keyof JSX.IntrinsicElements;
        return (
          <div className="relative">
            <HeadingTag {...props}>{content}{children}</HeadingTag>
            {isSelected && (
              <>
                {createResizeHandles(element.id, (id, size) => updateElement(id, { size }))}
                {createDeleteButton(element.id, handleDeleteElement)}
              </>
            )}
          </div>
        );
      
      case 'paragraph':
        return (
          <div className="relative">
            <p {...props}>{content}{children}</p>
            {isSelected && (
              <>
                {createResizeHandles(element.id, (id, size) => updateElement(id, { size }))}
                {createDeleteButton(element.id, handleDeleteElement)}
              </>
            )}
          </div>
        );
      
      case 'image':
        return (
          <div className="relative">
            <img {...props} src={element.attributes.src || ''} alt={element.attributes.alt || ''} />
            {isSelected && (
              <>
                {createResizeHandles(element.id, (id, size) => updateElement(id, { size }))}
                {createDeleteButton(element.id, handleDeleteElement)}
              </>
            )}
          </div>
        );
      
      case 'button':
        return (
          <div className="relative">
            <button {...props}>{content}{children}</button>
            {isSelected && (
              <>
                {createResizeHandles(element.id, (id, size) => updateElement(id, { size }))}
                {createDeleteButton(element.id, handleDeleteElement)}
              </>
            )}
          </div>
        );
      
      case 'link':
        return (
          <div className="relative">
            <a {...props} href={element.attributes.href || '#'}>{content}{children}</a>
            {isSelected && (
              <>
                {createResizeHandles(element.id, (id, size) => updateElement(id, { size }))}
                {createDeleteButton(element.id, handleDeleteElement)}
              </>
            )}
          </div>
        );
      
      default:
        return (
          <div className="relative">
            <div {...props}>{content}{children}</div>
            {isSelected && (
              <>
                {createResizeHandles(element.id, (id, size) => updateElement(id, { size }))}
                {createDeleteButton(element.id, handleDeleteElement)}
              </>
            )}
          </div>
        );
    }
  };

  // Generate HTML from elements
  const generateHTML = (elements: EditableElement[]): string => {
    return elements.map(element => {
      const children = element.children.length > 0 ? generateHTML(element.children) : '';
      return `<${element.tagName}${Object.entries(element.attributes).map(([key, value]) => ` ${key}="${value}"`).join('')}>${element.content}${children}</${element.tagName}>`;
    }).join('');
  };

  // Handle save
  const handleSave = () => {
    const htmlContent = generateHTML(state.elements);
    onSave(htmlContent);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Live Template Editor</h3>
          <Badge variant="secondary" className="text-xs">
            {state.elements.length} elements
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCanvasSize({ width: 800, height: 600 })}
            className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCanvasSize({ width: 1200, height: 800 })}
            className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600"
          >
            <Save className="w-4 h-4" />
            Save
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600"
          >
            Close
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Canvas */}
        <div className="flex-1 p-4">
          <div
            ref={canvasRef}
            className="relative bg-white border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
            style={{
              width: `${canvasSize.width}px`,
              height: `${canvasSize.height}px`,
              margin: '0 auto'
            }}
          >
            {state.elements.map(element => generateEditableComponent(element))}
          </div>
        </div>

        {/* Properties Panel */}
        {selectedElement && (
          <div className="w-80 border-l bg-card/30 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Properties</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedElement(null)}
                className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600"
              >
                ×
              </Button>
            </div>

            {/* Element Info */}
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium">Type</label>
                <p className="text-sm text-muted-foreground capitalize">{selectedElement.type}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Tag</label>
                <p className="text-sm text-muted-foreground">{selectedElement.tagName}</p>
              </div>
            </div>

            {/* Content */}
            {selectedElement.isEditable && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  value={selectedElement.content}
                  onChange={(e) => handleContentUpdate(selectedElement.id, e.target.value)}
                  placeholder="Enter content..."
                  className="text-sm"
                />
              </div>
            )}

            {/* Styles */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium">Styles</h5>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">Width</label>
                  <Input
                    type="number"
                    value={selectedElement.size.width}
                    onChange={(e) => handleStyleUpdate(selectedElement.id, { width: `${e.target.value}px` })}
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Height</label>
                  <Input
                    type="number"
                    value={selectedElement.size.height}
                    onChange={(e) => handleStyleUpdate(selectedElement.id, { height: `${e.target.value}px` })}
                    className="text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Background Color</label>
                <Input
                  type="color"
                  value={selectedElement.styles['background-color'] || '#ffffff'}
                  onChange={(e) => handleStyleUpdate(selectedElement.id, { 'background-color': e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Text Color</label>
                <Input
                  type="color"
                  value={selectedElement.styles.color || '#000000'}
                  onChange={(e) => handleStyleUpdate(selectedElement.id, { color: e.target.value })}
                  className="text-xs"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600"
                onClick={() => {
                  // Duplicate element
                  const newElement = { ...selectedElement, id: `element-${Date.now()}` };
                  // Add to elements array
                }}
              >
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600"
                onClick={() => {
                  // Reset element
                  updateElement(selectedElement.id, {
                    position: { x: 0, y: 0 },
                    size: { width: 200, height: 50 },
                    styles: {}
                  });
                }}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                className="w-full hover:bg-red-700"
                onClick={() => handleDeleteElement(selectedElement.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
