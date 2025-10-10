export interface TemplateMetadata {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  thumbnail: string;
  preview: string;
  htmlPath: string;
  cssPath: string;
  features: string[];
  tags: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  layout: {
    sections: number;
    responsive: boolean;
    darkMode: boolean;
  };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  downloads: number;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  pricing: {
    free: boolean;
    premium: boolean;
    price?: number;
  };
  compatibility: {
    browsers: string[];
    devices: string[];
  };
}

export type TemplateCategory = 
  | 'Business' 
  | 'Portfolio' 
  | 'Blog' 
  | 'Creative' 
  | 'Restaurant' 
  | 'E-commerce' 
  | 'Education' 
  | 'Event' 
  | 'Fashion' 
  | 'Fitness' 
  | 'NGO' 
  | 'Photography' 
  | 'Product' 
  | 'Real Estate' 
  | 'Resume' 
  | 'SaaS' 
  | 'Tech' 
  | 'Travel' 
  | 'Consulting'
  | 'All';

export interface TemplateSearchFilters {
  category: TemplateCategory;
  searchQuery: string;
  sortBy: 'name' | 'rating' | 'downloads' | 'createdAt' | 'price';
  sortOrder: 'asc' | 'desc';
  difficulty: ('beginner' | 'intermediate' | 'advanced')[];
  pricing: ('free' | 'premium')[];
  features: string[];
  colors: string[];
  rating: {
    min: number;
    max: number;
  };
}

export interface TemplateCustomization {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
    size: 'small' | 'medium' | 'large';
  };
  layout: {
    width: 'narrow' | 'standard' | 'wide';
    spacing: 'compact' | 'normal' | 'spacious';
    sections: string[];
  };
  content: {
    [key: string]: any;
  };
}

export interface TemplatePreview {
  template: TemplateMetadata;
  customization: TemplateCustomization;
  previewUrl: string;
  isCustomized: boolean;
}