import { useState, useCallback } from 'react';
import { TemplateMeta, TemplateSection, TemplateLoaderState } from '@/types/template';
import { parseTemplateToSections, applyTemplateStyles, removeTemplateStyles } from '@/utils/templateParser';

export const useTemplateLoader = () => {
  const [state, setState] = useState<TemplateLoaderState>({
    isLoading: false,
    error: null,
    currentTemplate: null,
    parsedSections: []
  });

  const loadTemplate = useCallback(async (template: TemplateMeta): Promise<TemplateSection[]> => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      currentTemplate: template
    }));

    try {
      // Parse template HTML/CSS into sections
      const parsedTemplate = await parseTemplateToSections(template.htmlPath, template.cssPath);
      
      // Apply template styles
      applyTemplateStyles(parsedTemplate.styles);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        parsedSections: parsedTemplate.sections,
        error: null
      }));

      return parsedTemplate.sections;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load template';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        parsedSections: []
      }));

      throw error;
    }
  }, []);

  const clearTemplate = useCallback(() => {
    removeTemplateStyles();
    
    // Ensure theme is not affected by clearing any global styles
    const existingTemplateStyles = document.getElementById('template-styles');
    if (existingTemplateStyles) {
      existingTemplateStyles.remove();
    }
    
    setState({
      isLoading: false,
      error: null,
      currentTemplate: null,
      parsedSections: []
    });
  }, []);

  const resetError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  return {
    ...state,
    loadTemplate,
    clearTemplate,
    resetError
  };
};
