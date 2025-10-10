import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

interface FooterSectionProps {
  content: {
    companyName?: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    socialLinks?: Array<{
      platform: string;
      url: string;
    }>;
    quickLinks?: Array<{
      label: string;
      href: string;
    }>;
    copyright?: string;
  };
  onUpdate: (content: any) => void;
  preview?: boolean;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ 
  content, 
  onUpdate, 
  preview = false 
}) => {
  const defaultContent = {
    companyName: 'Your Company',
    description: 'Building amazing websites with SiteForge. Create, customize, and deploy your perfect site in minutes.',
    address: '123 Business St, City, State 12345',
    phone: '+1 (555) 123-4567',
    email: 'hello@yourcompany.com',
    socialLinks: [
      { platform: 'facebook', url: 'https://facebook.com' },
      { platform: 'twitter', url: 'https://twitter.com' },
      { platform: 'instagram', url: 'https://instagram.com' },
      { platform: 'linkedin', url: 'https://linkedin.com' }
    ],
    quickLinks: [
      { label: 'About Us', href: '#about' },
      { label: 'Services', href: '#services' },
      { label: 'Portfolio', href: '#portfolio' },
      { label: 'Contact', href: '#contact' }
    ],
    copyright: '© 2024 Your Company. All rights reserved.'
  };

  const finalContent = { ...defaultContent, ...content };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return <Facebook className="h-5 w-5" />;
      case 'twitter': return <Twitter className="h-5 w-5" />;
      case 'instagram': return <Instagram className="h-5 w-5" />;
      case 'linkedin': return <Linkedin className="h-5 w-5" />;
      default: return <div className="h-5 w-5 bg-gray-400 rounded" />;
    }
  };

  if (preview) {
    return (
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-4">{finalContent.companyName}</h3>
              <p className="text-gray-300 mb-6 max-w-md">
                {finalContent.description}
              </p>
              
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center text-gray-300">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">{finalContent.address}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="text-sm">{finalContent.phone}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="text-sm">{finalContent.email}</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {finalContent.quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                {finalContent.socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {getSocialIcon(social.platform)}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">{finalContent.copyright}</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </a>
                <a href="#terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <Card className="border-2 border-dashed border-gray-300">
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Footer</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <Input
                value={finalContent.companyName}
                onChange={(e) => onUpdate({ ...content, companyName: e.target.value })}
                placeholder="Your Company"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                value={finalContent.email}
                onChange={(e) => onUpdate({ ...content, email: e.target.value })}
                placeholder="hello@company.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={finalContent.description}
              onChange={(e) => onUpdate({ ...content, description: e.target.value })}
              placeholder="Company description..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input
                value={finalContent.address}
                onChange={(e) => onUpdate({ ...content, address: e.target.value })}
                placeholder="123 Business St, City, State 12345"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={finalContent.phone}
                onChange={(e) => onUpdate({ ...content, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Quick Links</label>
            <div className="space-y-2">
              {finalContent.quickLinks.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={link.label}
                    onChange={(e) => {
                      const newLinks = [...finalContent.quickLinks];
                      newLinks[index] = { ...link, label: e.target.value };
                      onUpdate({ ...content, quickLinks: newLinks });
                    }}
                    placeholder="Link Label"
                    className="flex-1"
                  />
                  <Input
                    value={link.href}
                    onChange={(e) => {
                      const newLinks = [...finalContent.quickLinks];
                      newLinks[index] = { ...link, href: e.target.value };
                      onUpdate({ ...content, quickLinks: newLinks });
                    }}
                    placeholder="#link"
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Copyright</label>
            <Input
              value={finalContent.copyright}
              onChange={(e) => onUpdate({ ...content, copyright: e.target.value })}
              placeholder="© 2024 Your Company. All rights reserved."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
