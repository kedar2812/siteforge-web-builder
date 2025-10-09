export interface TemplateMeta {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  htmlPath: string;
  cssPath: string;
  description?: string;
  uniqueFeatures?: string[];
}

export interface TemplateSection {
  id: string;
  type: "hero" | "text" | "image" | "cta" | "html" | "features" | "testimonials" | "contact";
  content: {
    title?: string;
    subtitle?: string;
    text?: string;
    imageUrl?: string;
    buttonText?: string;
    htmlPath?: string;
    features?: Array<{ title: string; description: string }>;
    testimonials?: Array<{ name: string; role: string; text: string }>;
    email?: string;
    phone?: string;
    address?: string;
  };
  styles?: {
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
  };
}

export type TemplateCategory = 
  | "Business" 
  | "Portfolio" 
  | "Blog" 
  | "Creative" 
  | "Restaurant"
  | "E-commerce" 
  | "Education" 
  | "Event" 
  | "Fashion" 
  | "Fitness"
  | "NGO" 
  | "Photography" 
  | "Product" 
  | "Real Estate" 
  | "Resume"
  | "SaaS" 
  | "Tech" 
  | "Travel" 
  | "Consulting";

export interface TemplateLoaderState {
  isLoading: boolean;
  error: string | null;
  currentTemplate: TemplateMeta | null;
  parsedSections: TemplateSection[];
}

export interface TemplatePreviewProps {
  template: TemplateMeta;
  onApply: (sections: TemplateSection[]) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export interface TemplateSearchFilters {
  category: TemplateCategory | "All";
  searchQuery: string;
  sortBy: "name" | "category" | "newest";
}
