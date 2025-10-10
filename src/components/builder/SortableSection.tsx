import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GripVertical, Trash2, Menu, Star, Quote } from "lucide-react";
import { Section } from "@/pages/Builder";
import { NavbarSection } from "./sections/NavbarSection";
import { FooterSection } from "./sections/FooterSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";

interface SortableSectionProps {
  section: Section;
  onUpdate: (id: string, content: Section["content"]) => void;
  onDelete: (id: string) => void;
  onSelect?: (id: string) => void;
  selected?: boolean;
  preview?: boolean;
}

export const SortableSection = ({ section, onUpdate, onDelete, onSelect, selected, preview }: SortableSectionProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderSectionContent = () => {
    switch (section.type) {
      case "hero":
        return preview ? (
          <div className="space-y-4 py-12 px-8 text-center bg-gradient-hero rounded-lg">
            <h2 className="text-4xl font-bold">{section.content.title}</h2>
            {section.content.subtitle && (
              <p className="text-xl text-muted-foreground">{section.content.subtitle}</p>
            )}
            {section.content.buttonText && (
              <div className="pt-4">
                <Button variant="hero" className="text-black dark:text-white">{section.content.buttonText}</Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 py-12 px-8 text-center bg-gradient-hero rounded-lg">
            <Input
              value={section.content.title || ""}
              onChange={(e) => onUpdate(section.id, { ...section.content, title: e.target.value })}
              className="text-4xl font-bold text-center bg-transparent border-dashed"
              placeholder="Hero Title"
            />
            <Input
              value={section.content.subtitle || ""}
              onChange={(e) => onUpdate(section.id, { ...section.content, subtitle: e.target.value })}
              className="text-xl text-center bg-transparent border-dashed"
              placeholder="Subtitle"
            />
            <div className="pt-4">
              <Button variant="hero" className="text-black dark:text-white">
                {section.content.buttonText || "Button"}
              </Button>
            </div>
          </div>
        );

      case "text":
        return preview ? (
          <div className="p-8">
            <p className="text-base text-foreground/90 whitespace-pre-wrap">{section.content.text}</p>
          </div>
        ) : (
          <div className="p-8">
            <Textarea
              value={section.content.text || ""}
              onChange={(e) => onUpdate(section.id, { ...section.content, text: e.target.value })}
              className="min-h-[150px] bg-transparent border-dashed"
              placeholder="Your text content..."
            />
          </div>
        );

      case "image":
        return (
          <div className="p-8">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
              {section.content.imageUrl ? (
                <img
                  src={section.content.imageUrl}
                  alt="Section"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <p className="text-muted-foreground">Provide an image URL in Properties</p>
              )}
            </div>
          </div>
        );

      case "cta":
        return preview ? (
          <div className="py-12 px-8 text-center bg-card">
            <h3 className="text-2xl font-bold">{section.content.title}</h3>
            {section.content.buttonText && (
              <Button variant="hero" className="mt-4 text-black dark:text-white">
                {section.content.buttonText}
              </Button>
            )}
          </div>
        ) : (
          <div className="py-12 px-8 text-center bg-card">
            <Input
              value={section.content.title || ""}
              onChange={(e) => onUpdate(section.id, { ...section.content, title: e.target.value })}
              className="text-2xl font-bold text-center bg-transparent border-dashed mb-4"
              placeholder="CTA Title"
            />
            <Button variant="hero" className="mt-4 text-black dark:text-white">
              {section.content.buttonText || "Take Action"}
            </Button>
          </div>
        );
      case "html":
        return (
          <div className="p-0">
            {section.content.htmlPath ? (
              <iframe title={section.content.title || "HTML Section"} src={section.content.htmlPath} className="w-full h-[600px] bg-white rounded-lg border" />
            ) : (
              <div className="p-4 text-muted-foreground">Set htmlPath in Properties</div>
            )}
          </div>
        );

      case "navbar":
        return (
          <NavbarSection
            content={section.content}
            onUpdate={(content) => onUpdate(section.id, content)}
            preview={preview}
          />
        );

      case "footer":
        return (
          <FooterSection
            content={section.content}
            onUpdate={(content) => onUpdate(section.id, content)}
            preview={preview}
          />
        );

      case "testimonials":
        return (
          <TestimonialsSection
            content={section.content}
            onUpdate={(content) => onUpdate(section.id, content)}
            preview={preview}
          />
        );

      default:
        return (
          <div className="p-8 text-center text-muted-foreground">
            <p>Section type "{section.type}" not implemented yet</p>
          </div>
        );
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative mb-4 ${selected ? "ring-2 ring-primary" : ""}`}
      onClick={() => onSelect && onSelect(section.id)}
    >
      {/* Drag Handle & Delete */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="cursor-grab active:cursor-grabbing bg-background/70 backdrop-blur border border-border/50 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(section.id)}
          className="text-destructive hover:text-destructive bg-background/70 backdrop-blur border border-border/50 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Section Content */}
      <div className="border border-border/50 rounded-lg hover:border-primary/50 transition-colors">
        {renderSectionContent()}
      </div>
    </div>
  );
};
