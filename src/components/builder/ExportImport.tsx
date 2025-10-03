import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Upload, FileText, Code } from "lucide-react";
import { Section } from "@/pages/Builder";
import { FreeElementData } from "@/components/builder/FreeElement";

type ExportImportProps = {
  sections: Section[];
  freeElements: FreeElementData[];
  onImport: (data: { sections: Section[]; freeElements: FreeElementData[] }) => void;
};

export default function ExportImport({ sections, freeElements, onImport }: ExportImportProps) {
  const exportProject = () => {
    const projectData = {
      sections,
      freeElements,
      metadata: {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        name: "My Website Project",
      },
    };
    
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "website-project.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportHTML = () => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <style>
        body { margin: 0; font-family: Inter, sans-serif; }
        .section { padding: 2rem; }
        .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; }
        .text { max-width: 800px; margin: 0 auto; }
        .cta { background: #f8f9fa; text-align: center; }
        .element { position: absolute; }
    </style>
</head>
<body>
    ${sections.map(section => {
      switch (section.type) {
        case "hero":
          return `<div class="section hero">
            <h1>${section.content.title || "Welcome"}</h1>
            <p>${section.content.subtitle || "Subtitle"}</p>
            <button>${section.content.buttonText || "Get Started"}</button>
          </div>`;
        case "text":
          return `<div class="section text">
            <p>${section.content.text || "Your text here"}</p>
          </div>`;
        case "cta":
          return `<div class="section cta">
            <h2>${section.content.title || "Call to Action"}</h2>
            <button>${section.content.buttonText || "Take Action"}</button>
          </div>`;
        case "image":
          return `<div class="section">
            <img src="${section.content.imageUrl || "/placeholder.svg"}" alt="Image" style="width: 100%; height: auto;">
          </div>`;
        case "html":
          return `<div class="section">
            <iframe src="${section.content.htmlPath || ""}" style="width: 100%; height: 600px; border: none;"></iframe>
          </div>`;
        default:
          return "";
      }
    }).join("")}
    
    ${freeElements.map(el => {
      const style = `left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; height: ${el.height}px; transform: rotate(${el.rotation || 0}deg); z-index: ${el.zIndex || 1};`;
      
      if (el.type === "text") {
        return `<div class="element" style="${style}">
          <div style="color: ${el.props?.color || "black"}; font-size: ${el.props?.fontSize || 16}px; font-weight: ${el.props?.fontWeight || 400}; text-align: ${el.props?.align || "left"};">
            ${el.props?.text || "Text"}
          </div>
        </div>`;
      } else if (el.type === "shape") {
        return `<div class="element" style="${style}; background: ${el.props?.bg || "#f0f0f0"}; border-radius: ${el.props?.radius || 0}px;"></div>`;
      } else if (el.type === "image") {
        return `<div class="element" style="${style}">
          <img src="${el.props?.src || "/placeholder.svg"}" alt="Image" style="width: 100%; height: 100%; object-fit: cover;">
        </div>`;
      }
      return "";
    }).join("")}
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "website.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.sections && data.freeElements) {
          onImport(data);
        } else {
          alert("Invalid project file format");
        }
      } catch (error) {
        alert("Error reading project file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">Export & Import</h4>
      <div className="space-y-2">
        <Button onClick={exportProject} className="w-full justify-start gap-2" variant="outline">
          <Download className="w-4 h-4" />
          Export Project (JSON)
        </Button>
        <Button onClick={exportHTML} className="w-full justify-start gap-2" variant="outline">
          <Code className="w-4 h-4" />
          Export HTML
        </Button>
        <div className="relative">
          <input
            type="file"
            accept=".json"
            onChange={handleFileImport}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button className="w-full justify-start gap-2" variant="outline">
            <Upload className="w-4 h-4" />
            Import Project
          </Button>
        </div>
      </div>
    </div>
  );
}
