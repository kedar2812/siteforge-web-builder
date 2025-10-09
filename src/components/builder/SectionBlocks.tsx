import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Users, Star, Mail, Phone, MapPin } from "lucide-react";

export const SECTION_BLOCKS = [
  {
    name: "Hero Section",
    description: "Eye-catching header with title and CTA",
    icon: Plus,
    template: {
      type: "hero",
      content: {
        title: "Welcome to Our Company",
        subtitle: "We create amazing digital experiences",
        buttonText: "Get Started",
      },
    },
  },
  {
    name: "Features Grid",
    description: "3-column feature showcase",
    icon: Star,
    template: {
      type: "features",
      content: {
        title: "Why Choose Us",
        features: [
          { title: "Fast", description: "Lightning fast performance" },
          { title: "Secure", description: "Enterprise-grade security" },
          { title: "Reliable", description: "99.9% uptime guarantee" },
        ],
      },
    },
  },
  {
    name: "Testimonials",
    description: "Customer reviews and feedback",
    icon: Users,
    template: {
      type: "testimonials",
      content: {
        title: "What Our Customers Say",
        testimonials: [
          { name: "John Doe", role: "CEO", text: "Amazing service!" },
          { name: "Jane Smith", role: "Designer", text: "Love the design!" },
        ],
      },
    },
  },
  {
    name: "Contact Info",
    description: "Contact details and information",
    icon: Phone,
    template: {
      type: "contact",
      content: {
        title: "Get in Touch",
        email: "hello@company.com",
        phone: "+1 (555) 123-4567",
        address: "123 Main St, City, State",
      },
    },
  },
];

type SectionBlocksProps = {
  onAdd: (template: any) => void;
};

export default function SectionBlocks({ onAdd }: SectionBlocksProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">Section Blocks</h4>
      <div className="space-y-2">
        {SECTION_BLOCKS.map((block) => (
          <Card
            key={block.name}
            className="p-3 cursor-pointer hover:border-primary/50 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white transition-colors group"
            onClick={() => onAdd(block.template)}
          >
            <div className="flex items-start gap-3">
              <block.icon className="w-5 h-5 text-primary mt-0.5 group-hover:text-white" />
              <div className="flex-1">
                <div className="font-medium text-sm group-hover:text-white">{block.name}</div>
                <div className="text-xs text-muted-foreground group-hover:text-white/80">{block.description}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
