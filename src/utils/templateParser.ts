import { TemplateSection } from "@/types/template";

export interface ParsedTemplate {
  sections: TemplateSection[];
  styles: string;
}

/**
 * Parse HTML content into Builder sections
 */
export const parseTemplateToSections = async (htmlPath: string, cssPath: string): Promise<ParsedTemplate> => {
  try {
    // Fetch HTML and CSS content
    const htmlResponse = await fetch(htmlPath);
    const cssResponse = await fetch(cssPath);
    
    if (!htmlResponse.ok || !cssResponse.ok) {
      throw new Error('Failed to fetch template files');
    }
    
    const htmlContent = await htmlResponse.text();
    const cssContent = await cssResponse.text();
    
    // Parse HTML into sections
    const sections = extractSections(htmlContent);
    
    return {
      sections,
      styles: cssContent
    };
  } catch (error) {
    console.error('Error parsing template:', error);
    throw new Error('Failed to parse template');
  }
};

/**
 * Extract sections from HTML content
 */
const extractSections = (htmlContent: string): TemplateSection[] => {
  const sections: TemplateSection[] = [];
  
  // Create a temporary DOM parser
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  // Extract hero sections
  const heroElements = doc.querySelectorAll('header, .hero, .banner, [class*="hero"]');
  heroElements.forEach((element, index) => {
    const title = element.querySelector('h1, .title, [class*="title"]')?.textContent || '';
    const subtitle = element.querySelector('h2, .subtitle, [class*="subtitle"]')?.textContent || '';
    const button = element.querySelector('button, .btn, [class*="button"]')?.textContent || '';
    
    if (title || subtitle || button) {
      sections.push({
        id: `hero-${index}`,
        type: 'hero',
        content: {
          title: title || 'Welcome',
          subtitle: subtitle || 'Your subtitle here',
          buttonText: button || 'Get Started'
        }
      });
    }
  });
  
  // Extract text sections
  const textElements = doc.querySelectorAll('p, .text, [class*="text"], section:not(header):not(footer)');
  textElements.forEach((element, index) => {
    const text = element.textContent?.trim();
    if (text && text.length > 20) { // Only include substantial text
      sections.push({
        id: `text-${index}`,
        type: 'text',
        content: {
          text: text
        }
      });
    }
  });
  
  // Extract image sections
  const imageElements = doc.querySelectorAll('img, .image, [class*="image"]');
  imageElements.forEach((element, index) => {
    const img = element as HTMLImageElement;
    if (img.src) {
      sections.push({
        id: `image-${index}`,
        type: 'image',
        content: {
          imageUrl: img.src
        }
      });
    }
  });
  
  // Extract CTA sections
  const ctaElements = doc.querySelectorAll('.cta, [class*="cta"], .call-to-action, [class*="call-to-action"]');
  ctaElements.forEach((element, index) => {
    const title = element.querySelector('h2, h3, .title')?.textContent || '';
    const button = element.querySelector('button, .btn')?.textContent || '';
    
    if (title || button) {
      sections.push({
        id: `cta-${index}`,
        type: 'cta',
        content: {
          title: title || 'Call to Action',
          buttonText: button || 'Learn More'
        }
      });
    }
  });
  
  // Extract features sections
  const featureElements = doc.querySelectorAll('.features, [class*="feature"], .services, [class*="service"]');
  featureElements.forEach((element, index) => {
    const title = element.querySelector('h2, h3, .title')?.textContent || '';
    const features: Array<{ title: string; description: string }> = [];
    
    const featureItems = element.querySelectorAll('.feature-item, .service-item, li, .card');
    featureItems.forEach(item => {
      const featureTitle = item.querySelector('h3, h4, .title')?.textContent || '';
      const featureDesc = item.querySelector('p, .description')?.textContent || '';
      
      if (featureTitle) {
        features.push({
          title: featureTitle,
          description: featureDesc || 'Feature description'
        });
      }
    });
    
    if (title && features.length > 0) {
      sections.push({
        id: `features-${index}`,
        type: 'features',
        content: {
          title: title,
          features: features
        }
      });
    }
  });
  
  // Extract testimonials sections
  const testimonialElements = doc.querySelectorAll('.testimonials, [class*="testimonial"], .reviews, [class*="review"]');
  testimonialElements.forEach((element, index) => {
    const title = element.querySelector('h2, h3, .title')?.textContent || '';
    const testimonials: Array<{ name: string; role: string; text: string }> = [];
    
    const testimonialItems = element.querySelectorAll('.testimonial-item, .review-item, .testimonial, .review');
    testimonialItems.forEach(item => {
      const name = item.querySelector('.name, .author, h4, h5')?.textContent || '';
      const role = item.querySelector('.role, .title, .position')?.textContent || '';
      const text = item.querySelector('p, .text, .quote')?.textContent || '';
      
      if (name && text) {
        testimonials.push({
          name: name,
          role: role || 'Customer',
          text: text
        });
      }
    });
    
    if (title && testimonials.length > 0) {
      sections.push({
        id: `testimonials-${index}`,
        type: 'testimonials',
        content: {
          title: title,
          testimonials: testimonials
        }
      });
    }
  });
  
  // Extract contact sections
  const contactElements = doc.querySelectorAll('.contact, [class*="contact"], .footer, [class*="footer"]');
  contactElements.forEach((element, index) => {
    const title = element.querySelector('h2, h3, .title')?.textContent || '';
    const email = element.querySelector('[href^="mailto:"]')?.getAttribute('href')?.replace('mailto:', '') || '';
    const phone = element.querySelector('[href^="tel:"]')?.getAttribute('href')?.replace('tel:', '') || '';
    const address = element.querySelector('.address, [class*="address"]')?.textContent || '';
    
    if (title || email || phone || address) {
      sections.push({
        id: `contact-${index}`,
        type: 'contact',
        content: {
          title: title || 'Contact Us',
          email: email,
          phone: phone,
          address: address
        }
      });
    }
  });
  
  // If no sections were found, create a basic structure
  if (sections.length === 0) {
    sections.push({
      id: 'default-hero',
      type: 'hero',
      content: {
        title: 'Welcome to Your Website',
        subtitle: 'Build something amazing',
        buttonText: 'Get Started'
      }
    });
  }
  
  return sections;
};

/**
 * Apply template styles to Builder components
 */
export const applyTemplateStyles = (cssContent: string): void => {
  // For now, let's not apply template styles globally to avoid theme conflicts
  // Template styles will be applied inline to individual components instead
  console.log('Template styles available for inline application:', cssContent);
  
  // Remove any existing template styles to prevent conflicts
  const existingStyles = document.getElementById('template-styles');
  if (existingStyles) {
    existingStyles.remove();
  }
};

/**
 * Clean up template styles
 */
export const removeTemplateStyles = (): void => {
  const existingStyles = document.getElementById('template-styles');
  if (existingStyles) {
    existingStyles.remove();
  }
};
