import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Menu, X, Home, User, Mail, Phone } from 'lucide-react';

interface NavbarSectionProps {
  content: {
    logo?: string;
    brandName?: string;
    menuItems?: Array<{
      label: string;
      href: string;
    }>;
    ctaText?: string;
    ctaLink?: string;
    phone?: string;
    email?: string;
  };
  onUpdate: (content: any) => void;
  preview?: boolean;
}

export const NavbarSection: React.FC<NavbarSectionProps> = ({ 
  content, 
  onUpdate, 
  preview = false 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const defaultContent = {
    logo: '',
    brandName: 'Your Brand',
    menuItems: [
      { label: 'Home', href: '#home' },
      { label: 'About', href: '#about' },
      { label: 'Services', href: '#services' },
      { label: 'Contact', href: '#contact' }
    ],
    ctaText: 'Get Started',
    ctaLink: '#contact',
    phone: '+1 (555) 123-4567',
    email: 'hello@yourbrand.com'
  };

  const finalContent = { ...defaultContent, ...content };

  if (preview) {
    return (
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              {finalContent.logo ? (
                <img 
                  src={finalContent.logo} 
                  alt={finalContent.brandName}
                  className="h-8 w-auto"
                />
              ) : (
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {finalContent.brandName.charAt(0)}
                  </span>
                </div>
              )}
              <span className="ml-2 text-xl font-bold text-gray-900">
                {finalContent.brandName}
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {finalContent.menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center">
              <Button 
                variant="siteforge-primary"
                size="sm"
                asChild
              >
                <a href={finalContent.ctaLink}>{finalContent.ctaText}</a>
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                {finalContent.menuItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    {item.label}
                  </a>
                ))}
                <div className="pt-4">
                  <Button 
                    variant="siteforge-primary"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <a href={finalContent.ctaLink}>{finalContent.ctaText}</a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    );
  }

  return (
    <Card className="border-2 border-dashed border-gray-300">
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Navigation Bar</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Brand Name</label>
              <Input
                value={finalContent.brandName}
                onChange={(e) => onUpdate({ ...content, brandName: e.target.value })}
                placeholder="Your Brand"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Logo URL</label>
              <Input
                value={finalContent.logo}
                onChange={(e) => onUpdate({ ...content, logo: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Menu Items</label>
            <div className="space-y-2">
              {finalContent.menuItems.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item.label}
                    onChange={(e) => {
                      const newItems = [...finalContent.menuItems];
                      newItems[index] = { ...item, label: e.target.value };
                      onUpdate({ ...content, menuItems: newItems });
                    }}
                    placeholder="Menu Item"
                    className="flex-1"
                  />
                  <Input
                    value={item.href}
                    onChange={(e) => {
                      const newItems = [...finalContent.menuItems];
                      newItems[index] = { ...item, href: e.target.value };
                      onUpdate({ ...content, menuItems: newItems });
                    }}
                    placeholder="#link"
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">CTA Text</label>
              <Input
                value={finalContent.ctaText}
                onChange={(e) => onUpdate({ ...content, ctaText: e.target.value })}
                placeholder="Get Started"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">CTA Link</label>
              <Input
                value={finalContent.ctaLink}
                onChange={(e) => onUpdate({ ...content, ctaLink: e.target.value })}
                placeholder="#contact"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
