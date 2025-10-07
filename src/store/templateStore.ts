import { create } from 'zustand';

export interface EditableElement {
  id: string;
  type: 'text' | 'image' | 'button' | 'link' | 'container' | 'heading';
  tagName: string;
  textContent: string;
  innerHTML: string;
  styles: Record<string, string>;
  attributes: Record<string, string>;
  domRef?: HTMLElement;
}

interface TemplateStore {
  // Active template
  activeTemplateHTML: string | null;
  activeTemplateCSS: string | null;
  activeTemplateId: string | null;
  
  // Elements
  elements: Record<string, EditableElement>;
  selectedElementId: string | null;
  hoveredElementId: string | null;
  
  // Template mode
  isTemplateMode: boolean;
  
  // Actions
  loadTemplate: (id: string, html: string, css: string) => void;
  selectElement: (id: string | null) => void;
  registerElement: (element: EditableElement) => void;
  updateElement: (id: string, updates: Partial<EditableElement>) => void;
  setHoveredElement: (id: string | null) => void;
  setTemplateMode: (mode: boolean) => void;
  exportModifiedTemplate: () => { html: string; css: string };
}

export const useTemplateStore = create<TemplateStore>((set, get) => ({
  // Initial state
  activeTemplateHTML: null,
  activeTemplateCSS: null,
  activeTemplateId: null,
  elements: {},
  selectedElementId: null,
  hoveredElementId: null,
  isTemplateMode: false,

  // Actions
  loadTemplate: (id: string, html: string, css: string) => {
    set({
      activeTemplateId: id,
      activeTemplateHTML: html,
      activeTemplateCSS: css,
      elements: {},
      selectedElementId: null,
      hoveredElementId: null,
    });
  },

  selectElement: (id: string | null) => {
    set({ selectedElementId: id });
  },

  registerElement: (element: EditableElement) => {
    set(state => ({
      elements: {
        ...state.elements,
        [element.id]: element,
      },
    }));
  },

  updateElement: (id: string, updates: Partial<EditableElement>) => {
    set(state => {
      const element = state.elements[id];
      if (!element) return state;

      const updatedElement = { ...element, ...updates };
      
      // Update DOM if element has a reference
      if (updatedElement.domRef) {
        const domElement = updatedElement.domRef;
        
        // Update text content
        if (updates.textContent !== undefined) {
          domElement.textContent = updates.textContent;
        }
        
        // Update innerHTML
        if (updates.innerHTML !== undefined) {
          domElement.innerHTML = updates.innerHTML;
        }
        
        // Update styles
        if (updates.styles) {
          Object.entries(updates.styles).forEach(([property, value]) => {
            if (value) {
              domElement.style.setProperty(property, value);
            } else {
              domElement.style.removeProperty(property);
            }
          });
        }
        
        // Update attributes
        if (updates.attributes) {
          Object.entries(updates.attributes).forEach(([name, value]) => {
            if (value) {
              domElement.setAttribute(name, value);
            } else {
              domElement.removeAttribute(name);
            }
          });
        }
      }

      return {
        elements: {
          ...state.elements,
          [id]: updatedElement,
        },
      };
    });
  },

  setHoveredElement: (id: string | null) => {
    set({ hoveredElementId: id });
  },

  setTemplateMode: (mode: boolean) => {
    set({ isTemplateMode: mode });
  },

  exportModifiedTemplate: () => {
    const state = get();
    if (!state.activeTemplateHTML || !state.activeTemplateCSS) {
      return { html: '', css: '' };
    }

    // For now, return the original template
    // In a real implementation, you'd generate the modified HTML/CSS
    return {
      html: state.activeTemplateHTML,
      css: state.activeTemplateCSS,
    };
  },
}));
