import { Section } from '@/pages/Builder';
import { FreeElementData } from '@/components/builder/FreeElement';

export interface ExportOptions {
  title?: string;
  description?: string;
  author?: string;
  keywords?: string;
  viewport?: string;
  includeMeta?: boolean;
  includeAnalytics?: boolean;
  analyticsId?: string;
  minify?: boolean;
  includeComments?: boolean;
}

export interface ExportResult {
  html: string;
  css: string;
  js?: string;
  assets: string[];
}

/**
 * Generates clean, production-ready HTML from builder sections and free elements
 */
export class HTMLExporter {
  private sections: Section[];
  private freeElements: FreeElementData[];
  private options: ExportOptions;

  constructor(sections: Section[], freeElements: FreeElementData[], options: ExportOptions = {}) {
    this.sections = sections;
    this.freeElements = freeElements;
    this.options = {
      title: 'My Website',
      description: 'Built with SiteForge',
      author: 'SiteForge',
      keywords: 'website, builder, responsive',
      viewport: 'width=device-width, initial-scale=1.0',
      includeMeta: true,
      includeAnalytics: false,
      minify: true,
      includeComments: false,
      ...options
    };
  }

  /**
   * Main export method that generates complete HTML document
   */
  export(): ExportResult {
    const css = this.generateCSS();
    const js = this.generateJS();
    const html = this.generateHTML(css, js);
    const assets = this.extractAssets();

    return {
      html: this.options.minify ? this.minifyHTML(html) : html,
      css: this.options.minify ? this.minifyCSS(css) : css,
      js: js ? (this.options.minify ? this.minifyJS(js) : js) : undefined,
      assets
    };
  }

  /**
   * Generates the complete HTML document
   */
  private generateHTML(css: string, js?: string): string {
    const sectionsHTML = this.sections.map(section => this.renderSection(section)).join('\n');
    const freeElementsHTML = this.freeElements.map(element => this.renderFreeElement(element)).join('\n');
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="${this.options.viewport}">
    <title>${this.escapeHtml(this.options.title!)}</title>
    ${this.options.includeMeta ? this.generateMetaTags() : ''}
    <style>
${css}
    </style>
    ${this.generateFontLinks()}
</head>
<body>
    <div class="siteforge-container">
        ${sectionsHTML}
        ${freeElementsHTML}
    </div>
    ${js ? `<script>\n${js}\n</script>` : ''}
</body>
</html>`;
  }

  /**
   * Generates CSS for all sections and elements
   */
  private generateCSS(): string {
    const baseCSS = this.getBaseCSS();
    const sectionsCSS = this.sections.map(section => this.generateSectionCSS(section)).join('\n');
    const freeElementsCSS = this.freeElements.map(element => this.generateFreeElementCSS(element)).join('\n');
    const responsiveCSS = this.generateResponsiveCSS();

    return `${baseCSS}\n\n${sectionsCSS}\n\n${freeElementsCSS}\n\n${responsiveCSS}`;
  }

  /**
   * Generates JavaScript for interactive elements
   */
  private generateJS(): string {
    const interactiveElements = this.freeElements.filter(el => 
      el.type === 'button' || el.props?.onClick || el.props?.interactive
    );

    if (interactiveElements.length === 0) return '';

    return `
// SiteForge Generated JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Interactive elements initialization
    ${interactiveElements.map(el => this.generateElementJS(el)).join('\n')}
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});`;
  }

  /**
   * Renders a section to HTML
   */
  private renderSection(section: Section): string {
    const sectionId = `section-${section.id}`;
    
    switch (section.type) {
      case 'hero':
        return this.renderHeroSection(section, sectionId);
      case 'text':
        return this.renderTextSection(section, sectionId);
      case 'image':
        return this.renderImageSection(section, sectionId);
      case 'cta':
        return this.renderCTASection(section, sectionId);
      case 'html':
        return this.renderHTMLSection(section, sectionId);
      case 'navbar':
        return this.renderNavbarSection(section, sectionId);
      case 'footer':
        return this.renderFooterSection(section, sectionId);
      case 'testimonials':
        return this.renderTestimonialsSection(section, sectionId);
      default:
        return `<section id="${sectionId}" class="section section-${section.type}"></section>`;
    }
  }

  /**
   * Renders hero section
   */
  private renderHeroSection(section: Section, sectionId: string): string {
    const { title, subtitle, buttonText } = section.content;
    
    return `<section id="${sectionId}" class="section section-hero">
        <div class="hero-container">
            <div class="hero-content">
                ${title ? `<h1 class="hero-title">${this.escapeHtml(title)}</h1>` : ''}
                ${subtitle ? `<p class="hero-subtitle">${this.escapeHtml(subtitle)}</p>` : ''}
                ${buttonText ? `<button class="hero-button">${this.escapeHtml(buttonText)}</button>` : ''}
            </div>
        </div>
    </section>`;
  }

  /**
   * Renders text section
   */
  private renderTextSection(section: Section, sectionId: string): string {
    const { text } = section.content;
    
    return `<section id="${sectionId}" class="section section-text">
        <div class="text-container">
            <div class="text-content">
                ${text ? `<p>${this.escapeHtml(text)}</p>` : ''}
            </div>
        </div>
    </section>`;
  }

  /**
   * Renders image section
   */
  private renderImageSection(section: Section, sectionId: string): string {
    const { imageUrl } = section.content;
    
    return `<section id="${sectionId}" class="section section-image">
        <div class="image-container">
            ${imageUrl ? `<img src="${this.escapeHtml(imageUrl)}" alt="Image" class="section-image" loading="lazy">` : ''}
        </div>
    </section>`;
  }

  /**
   * Renders CTA section
   */
  private renderCTASection(section: Section, sectionId: string): string {
    const { title, buttonText } = section.content;
    
    return `<section id="${sectionId}" class="section section-cta">
        <div class="cta-container">
            ${title ? `<h2 class="cta-title">${this.escapeHtml(title)}</h2>` : ''}
            ${buttonText ? `<button class="cta-button">${this.escapeHtml(buttonText)}</button>` : ''}
        </div>
    </section>`;
  }

  /**
   * Renders HTML section (for templates)
   */
  private renderHTMLSection(section: Section, sectionId: string): string {
    const { htmlPath } = section.content;
    
    if (htmlPath) {
      // For template sections, we'll include a placeholder
      return `<section id="${sectionId}" class="section section-html">
        <div class="html-container">
            <p class="template-placeholder">Template content would be loaded here: ${this.escapeHtml(htmlPath)}</p>
        </div>
    </section>`;
    }
    
    return `<section id="${sectionId}" class="section section-html"></section>`;
  }

  /**
   * Renders navbar section
   */
  private renderNavbarSection(section: Section, sectionId: string): string {
    const { brandName, logo, menuItems, ctaText, ctaLink } = section.content;
    
    return `<nav id="${sectionId}" class="navbar">
        <div class="navbar-container">
            <div class="navbar-brand">
                ${logo ? `<img src="${this.escapeHtml(logo)}" alt="${this.escapeHtml(brandName || 'Brand')}" class="navbar-logo">` : ''}
                <span class="navbar-brand-text">${this.escapeHtml(brandName || 'Brand')}</span>
            </div>
            <div class="navbar-menu">
                ${menuItems ? menuItems.map(item => 
                  `<a href="${this.escapeHtml(item.href)}" class="navbar-link">${this.escapeHtml(item.label)}</a>`
                ).join('') : ''}
            </div>
            ${ctaText ? `<a href="${this.escapeHtml(ctaLink || '#')}" class="navbar-cta">${this.escapeHtml(ctaText)}</a>` : ''}
        </div>
    </nav>`;
  }

  /**
   * Renders footer section
   */
  private renderFooterSection(section: Section, sectionId: string): string {
    const { companyName, description, address, phone, email, quickLinks, socialLinks, copyright } = section.content;
    
    return `<footer id="${sectionId}" class="footer">
        <div class="footer-container">
            <div class="footer-content">
                <div class="footer-brand">
                    <h3 class="footer-company">${this.escapeHtml(companyName || 'Company')}</h3>
                    <p class="footer-description">${this.escapeHtml(description || '')}</p>
                    <div class="footer-contact">
                        ${address ? `<p class="footer-address">${this.escapeHtml(address)}</p>` : ''}
                        ${phone ? `<p class="footer-phone">${this.escapeHtml(phone)}</p>` : ''}
                        ${email ? `<p class="footer-email">${this.escapeHtml(email)}</p>` : ''}
                    </div>
                </div>
                ${quickLinks ? `<div class="footer-links">
                    <h4 class="footer-links-title">Quick Links</h4>
                    <ul class="footer-links-list">
                        ${quickLinks.map(link => 
                          `<li><a href="${this.escapeHtml(link.href)}" class="footer-link">${this.escapeHtml(link.label)}</a></li>`
                        ).join('')}
                    </ul>
                </div>` : ''}
                ${socialLinks ? `<div class="footer-social">
                    <h4 class="footer-social-title">Follow Us</h4>
                    <div class="footer-social-links">
                        ${socialLinks.map(social => 
                          `<a href="${this.escapeHtml(social.url)}" class="footer-social-link" target="_blank" rel="noopener noreferrer">${this.escapeHtml(social.platform)}</a>`
                        ).join('')}
                    </div>
                </div>` : ''}
            </div>
            <div class="footer-bottom">
                <p class="footer-copyright">${this.escapeHtml(copyright || '')}</p>
            </div>
        </div>
    </footer>`;
  }

  /**
   * Renders testimonials section
   */
  private renderTestimonialsSection(section: Section, sectionId: string): string {
    const { title, subtitle, testimonials } = section.content;
    
    return `<section id="${sectionId}" class="section section-testimonials">
        <div class="testimonials-container">
            <div class="testimonials-header">
                ${title ? `<h2 class="testimonials-title">${this.escapeHtml(title)}</h2>` : ''}
                ${subtitle ? `<p class="testimonials-subtitle">${this.escapeHtml(subtitle)}</p>` : ''}
            </div>
            <div class="testimonials-grid">
                ${testimonials ? testimonials.map(testimonial => `
                    <div class="testimonial-card">
                        <div class="testimonial-rating">
                            ${Array.from({ length: testimonial.rating || 5 }, () => '★').join('')}
                        </div>
                        <p class="testimonial-content">"${this.escapeHtml(testimonial.content)}"</p>
                        <div class="testimonial-author">
                            ${testimonial.avatar ? `<img src="${this.escapeHtml(testimonial.avatar)}" alt="${this.escapeHtml(testimonial.name)}" class="testimonial-avatar">` : ''}
                            <div class="testimonial-info">
                                <h4 class="testimonial-name">${this.escapeHtml(testimonial.name)}</h4>
                                <p class="testimonial-role">${this.escapeHtml(testimonial.role)} at ${this.escapeHtml(testimonial.company)}</p>
                            </div>
                        </div>
                    </div>
                `).join('') : ''}
            </div>
        </div>
    </section>`;
  }

  /**
   * Renders free element
   */
  private renderFreeElement(element: FreeElementData): string {
    const elementId = `element-${element.id}`;
    const style = this.generateElementStyle(element);
    
    switch (element.type) {
      case 'text':
        return `<div id="${elementId}" class="free-element free-text" style="${style}">
            ${this.escapeHtml(element.props?.text || 'Text')}
        </div>`;
      case 'image':
        return `<div id="${elementId}" class="free-element free-image" style="${style}">
            <img src="${this.escapeHtml(element.props?.src || '/placeholder.svg')}" alt="Image" style="width: 100%; height: 100%; object-fit: cover;">
        </div>`;
      case 'shape':
        return `<div id="${elementId}" class="free-element free-shape" style="${style}"></div>`;
      case 'button':
        return `<button id="${elementId}" class="free-element free-button" style="${style}">
            ${this.escapeHtml(element.props?.text || 'Button')}
        </button>`;
      default:
        return `<div id="${elementId}" class="free-element" style="${style}"></div>`;
    }
  }

  /**
   * Generates CSS for a section
   */
  private generateSectionCSS(section: Section): string {
    const sectionId = `#section-${section.id}`;
    
    switch (section.type) {
      case 'hero':
        return `${sectionId} {
    padding: 4rem 2rem;
    text-align: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

${sectionId} .hero-container {
    max-width: 1200px;
    margin: 0 auto;
}

${sectionId} .hero-title {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 1rem;
    line-height: 1.2;
}

${sectionId} .hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

${sectionId} .hero-button {
    background: white;
    color: #333;
    padding: 1rem 2rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease;
}

${sectionId} .hero-button:hover {
    transform: translateY(-2px);
}`;

      case 'text':
        return `${sectionId} {
    padding: 3rem 2rem;
    background: #f8f9fa;
}

${sectionId} .text-container {
    max-width: 800px;
    margin: 0 auto;
}

${sectionId} .text-content p {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #333;
}`;

      case 'image':
        return `${sectionId} {
    padding: 2rem;
}

${sectionId} .image-container {
    max-width: 100%;
    margin: 0 auto;
}

${sectionId} .section-image {
    width: 100%;
    height: auto;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}`;

      case 'cta':
        return `${sectionId} {
    padding: 3rem 2rem;
    background: #007bff;
    color: white;
    text-align: center;
}

${sectionId} .cta-container {
    max-width: 600px;
    margin: 0 auto;
}

${sectionId} .cta-title {
    font-size: 2rem;
    margin-bottom: 1rem;
}

${sectionId} .cta-button {
    background: white;
    color: #007bff;
    padding: 1rem 2rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease;
}

${sectionId} .cta-button:hover {
    transform: translateY(-2px);
}`;

      case 'navbar':
        return `${sectionId} {
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
}

${sectionId} .navbar-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

${sectionId} .navbar-brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

${sectionId} .navbar-logo {
    height: 2rem;
    width: auto;
}

${sectionId} .navbar-brand-text {
    font-size: 1.25rem;
    font-weight: bold;
    color: #333;
}

${sectionId} .navbar-menu {
    display: flex;
    gap: 2rem;
}

${sectionId} .navbar-link {
    color: #666;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
}

${sectionId} .navbar-link:hover {
    color: #007bff;
}

${sectionId} .navbar-cta {
    background: #007bff;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    text-decoration: none;
    font-weight: 500;
    transition: background 0.2s ease;
}

${sectionId} .navbar-cta:hover {
    background: #0056b3;
}`;

      case 'footer':
        return `${sectionId} {
    background: #1f2937;
    color: white;
    padding: 3rem 0 1rem;
}

${sectionId} .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

${sectionId} .footer-content {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
}

${sectionId} .footer-company {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
}

${sectionId} .footer-description {
    color: #d1d5db;
    margin-bottom: 1rem;
    line-height: 1.6;
}

${sectionId} .footer-contact p {
    color: #d1d5db;
    margin-bottom: 0.5rem;
}

${sectionId} .footer-links-title,
${sectionId} .footer-social-title {
    font-weight: 600;
    margin-bottom: 1rem;
}

${sectionId} .footer-links-list {
    list-style: none;
    padding: 0;
}

${sectionId} .footer-links-list li {
    margin-bottom: 0.5rem;
}

${sectionId} .footer-link {
    color: #d1d5db;
    text-decoration: none;
    transition: color 0.2s ease;
}

${sectionId} .footer-link:hover {
    color: white;
}

${sectionId} .footer-social-links {
    display: flex;
    gap: 1rem;
}

${sectionId} .footer-social-link {
    color: #d1d5db;
    text-decoration: none;
    transition: color 0.2s ease;
}

${sectionId} .footer-social-link:hover {
    color: white;
}

${sectionId} .footer-bottom {
    border-top: 1px solid #374151;
    padding-top: 1rem;
    text-align: center;
}

${sectionId} .footer-copyright {
    color: #9ca3af;
    font-size: 0.875rem;
}`;

      case 'testimonials':
        return `${sectionId} {
    padding: 4rem 2rem;
    background: #f8f9fa;
}

${sectionId} .testimonials-container {
    max-width: 1200px;
    margin: 0 auto;
}

${sectionId} .testimonials-header {
    text-align: center;
    margin-bottom: 3rem;
}

${sectionId} .testimonials-title {
    font-size: 2.5rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 1rem;
}

${sectionId} .testimonials-subtitle {
    font-size: 1.125rem;
    color: #666;
    max-width: 600px;
    margin: 0 auto;
}

${sectionId} .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

${sectionId} .testimonial-card {
    background: white;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    position: relative;
}

${sectionId} .testimonial-rating {
    color: #fbbf24;
    font-size: 1.25rem;
    margin-bottom: 1rem;
}

${sectionId} .testimonial-content {
    font-style: italic;
    color: #666;
    margin-bottom: 1.5rem;
    line-height: 1.6;
}

${sectionId} .testimonial-author {
    display: flex;
    align-items: center;
    gap: 1rem;
}

${sectionId} .testimonial-avatar {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    object-fit: cover;
}

${sectionId} .testimonial-name {
    font-weight: 600;
    color: #333;
    margin-bottom: 0.25rem;
}

${sectionId} .testimonial-role {
    color: #666;
    font-size: 0.875rem;
}`;

      default:
        return `${sectionId} {
    padding: 2rem;
    min-height: 200px;
}`;
    }
  }

  /**
   * Generates CSS for free elements
   */
  private generateFreeElementCSS(element: FreeElementData): string {
    const elementId = `#element-${element.id}`;
    const style = this.generateElementStyle(element);
    
    return `${elementId} {
    position: absolute;
    ${style}
    z-index: ${element.zIndex || 1};
}`;
  }

  /**
   * Generates inline style for element
   */
  private generateElementStyle(element: FreeElementData): string {
    const styles: string[] = [];
    
    styles.push(`left: ${element.x}px`);
    styles.push(`top: ${element.y}px`);
    styles.push(`width: ${element.width}px`);
    styles.push(`height: ${element.height}px`);
    
    if (element.rotation) {
      styles.push(`transform: rotate(${element.rotation}deg)`);
    }
    
    if (element.props?.color) {
      styles.push(`color: ${element.props.color}`);
    }
    
    if (element.props?.backgroundColor) {
      styles.push(`background-color: ${element.props.backgroundColor}`);
    }
    
    if (element.props?.fontSize) {
      styles.push(`font-size: ${element.props.fontSize}px`);
    }
    
    if (element.props?.bg) {
      styles.push(`background-color: ${element.props.bg}`);
    }
    
    if (element.props?.radius) {
      styles.push(`border-radius: ${element.props.radius}px`);
    }
    
    if (element.props?.opacity !== undefined) {
      styles.push(`opacity: ${element.props.opacity}`);
    }
    
    return styles.join('; ');
  }

  /**
   * Generates JavaScript for interactive elements
   */
  private generateElementJS(element: FreeElementData): string {
    if (element.type === 'button' || element.props?.onClick) {
      return `
    // Element ${element.id} click handler
    const element${element.id.replace(/-/g, '')} = document.getElementById('element-${element.id}');
    if (element${element.id.replace(/-/g, '')}) {
        element${element.id.replace(/-/g, '')}.addEventListener('click', function() {
            // Add your click handler here
            console.log('Element ${element.id} clicked');
        });
    }`;
    }
    return '';
  }

  /**
   * Generates base CSS
   */
  private getBaseCSS(): string {
    return `/* SiteForge Generated CSS */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #fff;
}

.siteforge-container {
    position: relative;
    min-height: 100vh;
}

.section {
    position: relative;
    width: 100%;
}

.free-element {
    position: absolute;
    cursor: pointer;
}

.free-element:hover {
    outline: 2px dashed #007bff;
    outline-offset: 2px;
}

/* Responsive Design */
@media (max-width: 768px) {
    .hero-title {
        font-size: 2rem !important;
    }
    
    .hero-subtitle {
        font-size: 1rem !important;
    }
    
    .section {
        padding: 2rem 1rem !important;
    }
}

@media (max-width: 480px) {
    .hero-title {
        font-size: 1.5rem !important;
    }
    
    .section {
        padding: 1rem 0.5rem !important;
    }
}`;
  }

  /**
   * Generates responsive CSS
   */
  private generateResponsiveCSS(): string {
    return `
/* Mobile First Responsive Design */
@media (max-width: 768px) {
    .siteforge-container {
        padding: 0 1rem;
    }
    
    .free-element {
        position: relative !important;
        left: auto !important;
        top: auto !important;
        width: 100% !important;
        margin-bottom: 1rem;
    }
}

@media (max-width: 480px) {
    .siteforge-container {
        padding: 0 0.5rem;
    }
}`;
  }

  /**
   * Generates meta tags
   */
  private generateMetaTags(): string {
    return `
    <meta name="description" content="${this.escapeHtml(this.options.description!)}">
    <meta name="author" content="${this.escapeHtml(this.options.author!)}">
    <meta name="keywords" content="${this.escapeHtml(this.options.keywords!)}">
    <meta property="og:title" content="${this.escapeHtml(this.options.title!)}">
    <meta property="og:description" content="${this.escapeHtml(this.options.description!)}">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${this.escapeHtml(this.options.title!)}">
    <meta name="twitter:description" content="${this.escapeHtml(this.options.description!)}">`;
  }

  /**
   * Generates font links
   */
  private generateFontLinks(): string {
    return `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">`;
  }

  /**
   * Extracts assets from sections and elements
   */
  private extractAssets(): string[] {
    const assets: string[] = [];
    
    this.sections.forEach(section => {
      if (section.content.imageUrl) {
        assets.push(section.content.imageUrl);
      }
    });
    
    this.freeElements.forEach(element => {
      if (element.props?.src) {
        assets.push(element.props.src);
      }
    });
    
    return [...new Set(assets)];
  }

  /**
   * Utility methods
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private minifyHTML(html: string): string {
    return html.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
  }

  private minifyCSS(css: string): string {
    return css.replace(/\s+/g, ' ').replace(/;\s*}/g, '}').trim();
  }

  private minifyJS(js: string): string {
    return js.replace(/\s+/g, ' ').trim();
  }
}

/**
 * Convenience function to export HTML
 */
export function exportHTML(
  sections: Section[], 
  freeElements: FreeElementData[], 
  options: ExportOptions = {}
): ExportResult {
  const exporter = new HTMLExporter(sections, freeElements, options);
  return exporter.export();
}
