import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

interface TestimonialsSectionProps {
  content: {
    title?: string;
    subtitle?: string;
    testimonials?: Array<{
      name: string;
      role: string;
      company: string;
      content: string;
      avatar?: string;
      rating?: number;
    }>;
  };
  onUpdate: (content: any) => void;
  preview?: boolean;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ 
  content, 
  onUpdate, 
  preview = false 
}) => {
  const defaultContent = {
    title: 'What Our Clients Say',
    subtitle: 'Don\'t just take our word for it. Here\'s what our satisfied customers have to say about our services.',
    testimonials: [
      {
        name: 'Sarah Johnson',
        role: 'CEO',
        company: 'TechCorp',
        content: 'SiteForge has completely transformed our online presence. The ease of use and professional results exceeded our expectations.',
        avatar: '',
        rating: 5
      },
      {
        name: 'Michael Chen',
        role: 'Marketing Director',
        company: 'StartupXYZ',
        content: 'The drag-and-drop interface made it so easy to create exactly what we envisioned. Highly recommended!',
        avatar: '',
        rating: 5
      },
      {
        name: 'Emily Rodriguez',
        role: 'Founder',
        company: 'Creative Agency',
        content: 'We\'ve tried many website builders, but SiteForge stands out for its flexibility and beautiful templates.',
        avatar: '',
        rating: 5
      }
    ]
  };

  const finalContent = { ...defaultContent, ...content };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (preview) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {finalContent.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {finalContent.subtitle}
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {finalContent.testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 relative"
              >
                {/* Quote Icon */}
                <Quote className="h-8 w-8 text-blue-600 mb-4" />
                
                {/* Rating */}
                <div className="flex mb-4">
                  {renderStars(testimonial.rating || 5)}
                </div>

                {/* Content */}
                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <Card className="border-2 border-dashed border-gray-300">
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Testimonials</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={finalContent.title}
              onChange={(e) => onUpdate({ ...content, title: e.target.value })}
              placeholder="What Our Clients Say"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Subtitle</label>
            <Textarea
              value={finalContent.subtitle}
              onChange={(e) => onUpdate({ ...content, subtitle: e.target.value })}
              placeholder="Don't just take our word for it..."
              rows={2}
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium">Testimonials</label>
            {finalContent.testimonials.map((testimonial, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    value={testimonial.name}
                    onChange={(e) => {
                      const newTestimonials = [...finalContent.testimonials];
                      newTestimonials[index] = { ...testimonial, name: e.target.value };
                      onUpdate({ ...content, testimonials: newTestimonials });
                    }}
                    placeholder="Customer Name"
                  />
                  <Input
                    value={testimonial.role}
                    onChange={(e) => {
                      const newTestimonials = [...finalContent.testimonials];
                      newTestimonials[index] = { ...testimonial, role: e.target.value };
                      onUpdate({ ...content, testimonials: newTestimonials });
                    }}
                    placeholder="Job Title"
                  />
                </div>
                
                <Input
                  value={testimonial.company}
                  onChange={(e) => {
                    const newTestimonials = [...finalContent.testimonials];
                    newTestimonials[index] = { ...testimonial, company: e.target.value };
                    onUpdate({ ...content, testimonials: newTestimonials });
                  }}
                  placeholder="Company Name"
                />
                
                <Textarea
                  value={testimonial.content}
                  onChange={(e) => {
                    const newTestimonials = [...finalContent.testimonials];
                    newTestimonials[index] = { ...testimonial, content: e.target.value };
                    onUpdate({ ...content, testimonials: newTestimonials });
                  }}
                  placeholder="Testimonial content..."
                  rows={3}
                />
                
                <div className="flex gap-2">
                  <Input
                    value={testimonial.avatar || ''}
                    onChange={(e) => {
                      const newTestimonials = [...finalContent.testimonials];
                      newTestimonials[index] = { ...testimonial, avatar: e.target.value };
                      onUpdate({ ...content, testimonials: newTestimonials });
                    }}
                    placeholder="Avatar URL (optional)"
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={testimonial.rating || 5}
                    onChange={(e) => {
                      const newTestimonials = [...finalContent.testimonials];
                      newTestimonials[index] = { ...testimonial, rating: parseInt(e.target.value) };
                      onUpdate({ ...content, testimonials: newTestimonials });
                    }}
                    placeholder="Rating"
                    className="w-20"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
