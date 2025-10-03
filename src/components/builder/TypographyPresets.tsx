import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const TYPOGRAPHY_PRESETS = [
  {
    name: "Modern Sans",
    heading: { fontFamily: "Inter", fontSize: 32, fontWeight: 700 },
    body: { fontFamily: "Inter", fontSize: 16, fontWeight: 400 },
  },
  {
    name: "Elegant Serif",
    heading: { fontFamily: "Playfair Display", fontSize: 36, fontWeight: 600 },
    body: { fontFamily: "Source Serif Pro", fontSize: 18, fontWeight: 400 },
  },
  {
    name: "Bold Display",
    heading: { fontFamily: "Space Grotesk", fontSize: 40, fontWeight: 800 },
    body: { fontFamily: "Inter", fontSize: 16, fontWeight: 500 },
  },
  {
    name: "Minimal",
    heading: { fontFamily: "Helvetica", fontSize: 28, fontWeight: 300 },
    body: { fontFamily: "Helvetica", fontSize: 14, fontWeight: 300 },
  },
];

type TypographyPresetsProps = {
  onApply: (preset: typeof TYPOGRAPHY_PRESETS[0]) => void;
};

export default function TypographyPresets({ onApply }: TypographyPresetsProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">Typography Presets</h4>
      <div className="grid grid-cols-1 gap-2">
        {TYPOGRAPHY_PRESETS.map((preset) => (
          <Card
            key={preset.name}
            className="p-3 cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => onApply(preset)}
          >
            <div className="space-y-2">
              <div
                className="font-bold"
                style={{
                  fontFamily: preset.heading.fontFamily,
                  fontSize: preset.heading.fontSize,
                  fontWeight: preset.heading.fontWeight,
                }}
              >
                {preset.name}
              </div>
              <div
                className="text-muted-foreground"
                style={{
                  fontFamily: preset.body.fontFamily,
                  fontSize: preset.body.fontSize,
                  fontWeight: preset.body.fontWeight,
                }}
              >
                The quick brown fox jumps over the lazy dog
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
