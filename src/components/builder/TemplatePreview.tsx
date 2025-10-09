import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { TemplatePreviewProps } from '@/types/template';
import { Eye, Check, X, Star, Sparkles } from 'lucide-react';

const TemplatePreview = ({ template, onApply, onCancel, isOpen }: TemplatePreviewProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleApply = async () => {
    setIsLoading(true);
    try {
      // This will be handled by the parent component
      // The actual template loading happens in the Builder
      onApply([]); // Empty array for now, will be populated by the loader
    } catch (error) {
      console.error('Error applying template:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] flex flex-col p-0 bg-background">
        <DialogHeader className="px-6 py-4 border-b border-border shrink-0 bg-card/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-primary" />
              <div>
                <DialogTitle className="text-foreground text-xl">{template.name}</DialogTitle>
                <p className="text-sm text-muted-foreground">{template.category} Template</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleApply}
                disabled={isLoading}
                className="text-black dark:text-white"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Apply Template
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 flex">
          {/* Template Preview */}
          <div className="flex-1 min-h-0 bg-white dark:bg-card">
            <iframe 
              title={template.name} 
              src={template.htmlPath} 
              className="w-full h-full border-0" 
              sandbox="allow-same-origin"
            />
          </div>

          {/* Template Info Sidebar */}
          <div className="w-80 border-l border-border bg-card/50 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Template Description */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">
                  {template.description || 'A beautiful template for your website.'}
                </p>
              </div>

              {/* Template Features */}
              {template.uniqueFeatures && template.uniqueFeatures.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Features</h3>
                  <div className="space-y-2">
                    {template.uniqueFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Template Category */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Category</h3>
                <Badge variant="secondary" className="text-sm">
                  {template.category}
                </Badge>
              </div>

              {/* Template Stats */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Template Info</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="text-foreground">{template.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Features:</span>
                    <span className="text-foreground">{template.uniqueFeatures?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="text-foreground">Professional</span>
                  </div>
                </div>
              </div>

              {/* Preview Actions */}
              <div className="pt-4 border-t border-border">
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(template.htmlPath, '_blank')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Open in New Tab
                  </Button>
                  
                  <div className="text-xs text-muted-foreground text-center">
                    This template will be loaded into your Builder workspace
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePreview;
