import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const COLOR_SWATCHES = [
  // Primary colors
  { name: "Primary Blue", value: "hsl(217, 90%, 60%)" },
  { name: "Primary Dark", value: "hsl(217, 90%, 40%)" },
  { name: "Primary Light", value: "hsl(217, 90%, 80%)" },
  
  // Neutrals
  { name: "Black", value: "hsl(0, 0%, 0%)" },
  { name: "Dark Gray", value: "hsl(0, 0%, 20%)" },
  { name: "Gray", value: "hsl(0, 0%, 50%)" },
  { name: "Light Gray", value: "hsl(0, 0%, 80%)" },
  { name: "White", value: "hsl(0, 0%, 100%)" },
  
  // Accent colors
  { name: "Success", value: "hsl(142, 76%, 36%)" },
  { name: "Warning", value: "hsl(38, 92%, 50%)" },
  { name: "Error", value: "hsl(0, 84%, 60%)" },
  { name: "Info", value: "hsl(200, 100%, 50%)" },
  
  // Brand colors
  { name: "Purple", value: "hsl(270, 100%, 60%)" },
  { name: "Pink", value: "hsl(330, 100%, 60%)" },
  { name: "Orange", value: "hsl(25, 100%, 60%)" },
  { name: "Teal", value: "hsl(180, 100%, 40%)" },
];

type ColorSwatchesProps = {
  onSelect: (color: string) => void;
  currentColor?: string;
};

export default function ColorSwatches({ onSelect, currentColor }: ColorSwatchesProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">Color Swatches</h4>
      <div className="grid grid-cols-4 gap-2">
        {COLOR_SWATCHES.map((color) => (
          <Button
            key={color.name}
            variant="outline"
            size="sm"
            className={`h-8 w-8 p-0 border-2 ${
              currentColor === color.value ? "border-primary ring-2 ring-primary/20" : ""
            }`}
            style={{ backgroundColor: color.value }}
            onClick={() => onSelect(color.value)}
            title={color.name}
          />
        ))}
      </div>
      <div className="pt-2">
        <input
          type="color"
          value={currentColor || "#000000"}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full h-8 rounded border border-border"
        />
      </div>
    </div>
  );
}
