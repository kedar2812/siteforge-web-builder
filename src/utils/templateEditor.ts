/**
 * Template Editor - Advanced HTML Template Integration System
 * Converts static HTML templates into fully editable, interactive components
 */

export interface EditableElement {
  id: string;
  type: 'text' | 'image' | 'button' | 'container' | 'section' | 'heading' | 'paragraph' | 'link';
  tagName: string;
  content: string;
  attributes: Record<string, string>;
  styles: Record<string, string>;
  children: EditableElement[];
  parentId?: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isDraggable: boolean;
  isResizable: boolean;
  isEditable: boolean;
}

export interface TemplateEditorState {
  elements: EditableElement[];
  selectedElementId: string | null;
  isEditing: boolean;
  dragState: {
    isDragging: boolean;
    dragElementId: string | null;
    startPosition: { x: number; y: number };
  };
  resizeState: {
    isResizing: boolean;
    resizeElementId: string | null;
    resizeHandle: string | null;
    startSize: { width: number; height: number };
  };
}

/**
 * Parse HTML template into editable elements
 */
export function parseTemplateToEditableElements(htmlContent: string): EditableElement[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const elements: EditableElement[] = [];
  
  function processElement(element: Element, parentId?: string): EditableElement {
    const id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Determine element type
    const tagName = element.tagName.toLowerCase();
    let type: EditableElement['type'] = 'container';
    
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
      type = 'heading';
    } else if (tagName === 'p') {
      type = 'paragraph';
    } else if (tagName === 'img') {
      type = 'image';
    } else if (tagName === 'button' || tagName === 'a') {
      type = 'button';
    } else if (tagName === 'a') {
      type = 'link';
    } else if (['section', 'div', 'article', 'header', 'footer', 'main', 'aside'].includes(tagName)) {
      type = 'section';
    } else if (['span', 'strong', 'em', 'small'].includes(tagName)) {
      type = 'text';
    }
    
    // Extract attributes
    const attributes: Record<string, string> = {};
    Array.from(element.attributes).forEach(attr => {
      attributes[attr.name] = attr.value;
    });
    
    // Extract styles
    const computedStyle = window.getComputedStyle(element);
    const styles: Record<string, string> = {};
    const importantStyles = ['width', 'height', 'background-color', 'color', 'font-size', 'font-weight', 'text-align', 'margin', 'padding', 'border'];
    importantStyles.forEach(prop => {
      const value = computedStyle.getPropertyValue(prop);
      if (value && value !== 'initial' && value !== 'inherit') {
        styles[prop] = value;
      }
    });
    
    // Process children
    const children: EditableElement[] = [];
    Array.from(element.children).forEach(child => {
      children.push(processElement(child, id));
    });
    
    return {
      id,
      type,
      tagName,
      content: element.textContent || '',
      attributes,
      styles,
      children,
      parentId,
      position: { x: 0, y: 0 },
      size: { width: 200, height: 50 },
      isDraggable: true,
      isResizable: ['section', 'container', 'image'].includes(type),
      isEditable: ['text', 'heading', 'paragraph', 'button'].includes(type)
    };
  }
  
  // Process all top-level elements
  Array.from(doc.body.children).forEach(element => {
    elements.push(processElement(element));
  });
  
  return elements;
}

/**
 * Generate React component from editable elements
 */
export function generateEditableComponent(element: EditableElement, onUpdate: (id: string, updates: Partial<EditableElement>) => void): JSX.Element {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(element.id, {});
  };
  
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (element.isEditable) {
      // Enable inline editing
      const target = e.target as HTMLElement;
      target.contentEditable = 'true';
      target.focus();
      
      const saveChanges = () => {
        target.contentEditable = 'false';
        onUpdate(element.id, { content: target.textContent || '' });
        target.removeEventListener('blur', saveChanges);
      };
      target.addEventListener('blur', saveChanges);
    }
  };
  
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', element.id);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId !== element.id) {
      // Handle drop logic here
      console.log(`Dropped ${draggedId} on ${element.id}`);
    }
  };
  
  const style = {
    ...element.styles,
    position: 'relative' as const,
    cursor: element.isDraggable ? 'move' : 'default',
    border: '1px dashed transparent',
    minWidth: `${element.size.width}px`,
    minHeight: `${element.size.height}px`,
  };
  
  const className = `editable-element ${element.type} ${element.isDraggable ? 'draggable' : ''} ${element.isResizable ? 'resizable' : ''}`;
  
  const children = element.children.map(child => 
    generateEditableComponent(child, onUpdate)
  );
  
  const props = {
    key: element.id,
    id: element.id,
    className,
    style,
    onClick: handleClick,
    onDoubleClick: handleDoubleClick,
    draggable: element.isDraggable,
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDrop: handleDrop,
    ...element.attributes
  };
  
  // Render based on element type
  switch (element.type) {
    case 'heading':
      const HeadingTag = element.tagName as keyof JSX.IntrinsicElements;
      return <HeadingTag {...props}>{element.content}{children}</HeadingTag>;
    
    case 'paragraph':
      return <p {...props}>{element.content}{children}</p>;
    
    case 'image':
      return <img {...props} src={element.attributes.src || ''} alt={element.attributes.alt || ''} />;
    
    case 'button':
      return <button {...props}>{element.content}{children}</button>;
    
    case 'link':
      return <a {...props} href={element.attributes.href || '#'}>{element.content}{children}</a>;
    
    case 'section':
      return <section {...props}>{element.content}{children}</section>;
    
    default:
      return <div {...props}>{element.content}{children}</div>;
  }
}

/**
 * Create resize handles for an element
 */
export function createResizeHandles(elementId: string, onResize: (id: string, size: { width: number; height: number }) => void): JSX.Element[] {
  const handles = [
    { position: 'nw', cursor: 'nw-resize' },
    { position: 'ne', cursor: 'ne-resize' },
    { position: 'sw', cursor: 'sw-resize' },
    { position: 'se', cursor: 'se-resize' },
    { position: 'n', cursor: 'n-resize' },
    { position: 's', cursor: 's-resize' },
    { position: 'e', cursor: 'e-resize' },
    { position: 'w', cursor: 'w-resize' }
  ];
  
  return handles.map(handle => (
    <div
      key={`${elementId}-${handle.position}`}
      className={`resize-handle resize-${handle.position}`}
      style={{
        position: 'absolute',
        width: '8px',
        height: '8px',
        backgroundColor: '#3b82f6',
        border: '1px solid white',
        cursor: handle.cursor,
        zIndex: 1000
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        // Handle resize logic here
        console.log(`Resizing ${elementId} from ${handle.position}`);
      }}
    />
  ));
}

/**
 * Create delete button for an element
 */
export function createDeleteButton(elementId: string, onDelete: (id: string) => void): JSX.Element {
  return (
    <button
      key={`delete-${elementId}`}
      className="delete-button"
      style={{
        position: 'absolute',
        top: '-10px',
        right: '-10px',
        width: '20px',
        height: '20px',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        zIndex: 1001,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px'
      }}
      onClick={(e) => {
        e.stopPropagation();
        onDelete(elementId);
      }}
    >
      ×
    </button>
  );
}

/**
 * Template Editor Hook
 */
export function useTemplateEditor(initialTemplate?: string) {
  const [state, setState] = useState<TemplateEditorState>({
    elements: initialTemplate ? parseTemplateToEditableElements(initialTemplate) : [],
    selectedElementId: null,
    isEditing: false,
    dragState: {
      isDragging: false,
      dragElementId: null,
      startPosition: { x: 0, y: 0 }
    },
    resizeState: {
      isResizing: false,
      resizeElementId: null,
      resizeHandle: null,
      startSize: { width: 0, height: 0 }
    }
  });
  
  const updateElement = (id: string, updates: Partial<EditableElement>) => {
    setState(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === id ? { ...el, ...updates } : el
      )
    }));
  };
  
  const deleteElement = (id: string) => {
    setState(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== id)
    }));
  };
  
  const selectElement = (id: string) => {
    setState(prev => ({
      ...prev,
      selectedElementId: id
    }));
  };
  
  const loadTemplate = (htmlContent: string) => {
    setState(prev => ({
      ...prev,
      elements: parseTemplateToEditableElements(htmlContent)
    }));
  };
  
  return {
    state,
    updateElement,
    deleteElement,
    selectElement,
    loadTemplate
  };
}
