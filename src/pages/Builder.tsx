import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  Save,
  Eye,
  Undo,
  Redo,
  Settings,
  Plus,
  Type,
  Image as ImageIcon,
  Square,
  Layout,
  ZoomIn,
  ZoomOut,
  Maximize,
  Search,
  Filter,
  Star,
  Monitor,
  Tablet,
  Smartphone,
  Download,
  MousePointer,
  PanelTop,
  LayoutGrid,
  Heading1,
  Pilcrow,
} from "lucide-react";
import { toast } from "sonner";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableSection } from "@/components/builder/SortableSection";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import FreeElement, { FreeElementData } from "@/components/builder/FreeElement";
import TypographyPresets from "@/components/builder/TypographyPresets";
import ColorSwatches from "@/components/builder/ColorSwatches";
import SectionBlocks from "@/components/builder/SectionBlocks";
import ExportImport from "@/components/builder/ExportImport";
import TemplatePreview from "@/components/builder/TemplatePreview";
import { useTemplateLoader } from "@/hooks/useTemplateLoader";
import { TemplateMeta, TemplateCategory, TemplateSearchFilters } from "@/types/template";

export interface Section {
  id: string;
  type: "hero" | "text" | "image" | "cta" | "html";
  content: {
    title?: string;
    subtitle?: string;
    text?: string;
    imageUrl?: string;
    buttonText?: string;
    htmlPath?: string;
  };
}

const Builder = () => {
  const [sections, setSections] = useState<Section[]>([
    {
      id: "1",
      type: "hero",
      content: {
        title: "Welcome to Your Website",
        subtitle: "Build something amazing",
        buttonText: "Get Started",
      },
    },
  ]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const templateId = searchParams.get('template');
  const htmlPath = searchParams.get('html');
  const cssPath = searchParams.get('css');
  
  // Template loading functionality
  const [templates, setTemplates] = useState<TemplateMeta[]>([]);
  const [templateFilters, setTemplateFilters] = useState<TemplateSearchFilters>({
    category: 'All',
    searchQuery: '',
    sortBy: 'name'
  });
  const [previewTemplate, setPreviewTemplate] = useState<TemplateMeta | null>(null);
  const { loadTemplate, isLoading: templateLoading, error: templateError } = useTemplateLoader();
  
  // Load templates on component mount
  useEffect(() => {
    fetch('/templates/templates.json')
      .then(res => res.json())
      .then(setTemplates)
      .catch(() => setTemplates([]));
  }, []);

  // Cleanup template styles on unmount
  useEffect(() => {
    return () => {
      // Remove any template styles when component unmounts
      const existingStyles = document.getElementById('template-styles');
      if (existingStyles) {
        existingStyles.remove();
      }
    };
  }, []);

  // Force theme refresh function
  const refreshTheme = useCallback(() => {
    const body = document.body;
    const currentTheme = body.classList.contains('dark') ? 'dark' : 'light';
    body.classList.remove('dark', 'light');
    setTimeout(() => {
      body.classList.add(currentTheme);
    }, 10);
  }, []);
  
  // Load template from URL parameters
  useEffect(() => {
    if (templateId && htmlPath && cssPath) {
      const template: TemplateMeta = {
        id: templateId,
        name: 'Loaded Template',
        category: 'Custom',
        thumbnail: '',
        htmlPath,
        cssPath
      };
      
      loadTemplate(template)
        .then(parsedSections => {
          setSections(parsedSections.map(section => ({
            id: section.id,
            type: section.type as any,
            content: section.content
          })));
          toast.success('Template loaded successfully!');
        })
        .catch(error => {
          console.error('Error loading template:', error);
          toast.error('Failed to load template');
        });
    }
  }, [templateId, htmlPath, cssPath, loadTemplate]);
  
  // Legacy template loading for backward compatibility
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const html = params.get("html");
    if (html && !templateId) {
      setSections([
        { id: "tpl-html", type: "html", content: { title: "Template", htmlPath: html } },
      ]);
    }
  }, [location.search, templateId]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [freeElements, setFreeElements] = useState<FreeElementData[]>([]);
  const [responsiveView, setResponsiveView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);
  const historyRef = useRef<Section[][]>([]);
  const futureRef = useRef<Section[][]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const pushHistory = useCallback((next: Section[]) => {
    historyRef.current.push(sections);
    futureRef.current = [];
    setSections(next);
  }, [sections]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const moved = arrayMove(items, oldIndex, newIndex);
        historyRef.current.push(items);
        futureRef.current = [];
        return moved;
      });
    }
  };

  const addSection = (type: Section["type"]) => {
    const newSection: Section = {
      id: Date.now().toString(),
      type,
      content: {
        title: type === "hero" ? "New Hero Section" : undefined,
        subtitle: type === "hero" ? "Subtitle text" : undefined,
        text: type === "text" ? "Your text content here..." : undefined,
        imageUrl: type === "image" ? "https://via.placeholder.com/800x400" : undefined,
        buttonText: type === "cta" ? "Click Here" : undefined,
        htmlPath: type === "html" ? "/templates/business-landing/index.html" : undefined,
      },
    };
    pushHistory([...sections, newSection]);
    toast.success("Section added");
  };

  const updateSection = (id: string, content: Section["content"]) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, content } : s)));
  };

  const deleteSection = (id: string) => {
    pushHistory(sections.filter((s) => s.id !== id));
    toast.success("Section removed");
  };

  const handleSave = () => {
    // Save to localStorage for now (in real app, this would be API call)
    const projectData = {
      sections,
      freeElements,
      lastSaved: new Date().toISOString(),
    };
    localStorage.setItem("website-project", JSON.stringify(projectData));
    setLastSaved(new Date());
    toast.success("Site saved successfully!");
  };

  const handleExport = () => {
    // Create a clean HTML export
    const exportData = {
      sections,
      freeElements,
      metadata: {
        title: "My Website",
        description: "Built with SiteForge",
        createdAt: new Date().toISOString()
      }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'website-export.json';
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success("Website exported successfully!");
  };

  // Autosave every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (sections.length > 0 || freeElements.length > 0) {
        const projectData = {
          sections,
          freeElements,
          lastSaved: new Date().toISOString(),
        };
        localStorage.setItem("website-project", JSON.stringify(projectData));
        setLastSaved(new Date());
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [sections, freeElements]);

  // Load saved project on mount
  useEffect(() => {
    const saved = localStorage.getItem("website-project");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.sections) setSections(data.sections);
        if (data.freeElements) setFreeElements(data.freeElements);
        if (data.lastSaved) setLastSaved(new Date(data.lastSaved));
      } catch (error) {
        console.error("Error loading saved project:", error);
      }
    }
  }, []);

  const canUndo = useMemo(() => historyRef.current.length > 0, []);
  const canRedo = useMemo(() => futureRef.current.length > 0, []);

  const undo = () => {
    const prev = historyRef.current.pop();
    if (!prev) return;
    futureRef.current.push(sections);
    setSections(prev);
  };

  const redo = () => {
    const next = futureRef.current.pop();
    if (!next) return;
    historyRef.current.push(sections);
    setSections(next);
  };

  // Keyboard shortcuts: delete/duplicate for elements and sections, undo/redo
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Undo / Redo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "y" || (e.shiftKey && e.key.toLowerCase() === "z"))) {
        e.preventDefault();
        redo();
        return;
      }

      if (!selectedId) return;

      const freeTarget = freeElements.find((e2) => e2.id === selectedId);
      const sectionTarget = sections.find((s) => s.id === selectedId);

      // Delete
      if (e.key === "Delete" || e.key === "Backspace") {
        if (freeTarget) {
          setFreeElements((els) => els.filter((el) => el.id !== selectedId));
          setSelectedId(null);
          e.preventDefault();
          return;
        }
        if (sectionTarget) {
          deleteSection(sectionTarget.id);
          setSelectedId(null);
          e.preventDefault();
          return;
        }
      }

      // Duplicate (Ctrl/Cmd + D)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        if (freeTarget) {
          const copy: FreeElementData = {
            ...freeTarget,
            id: `el-${Date.now()}`,
            x: freeTarget.x + 16,
            y: freeTarget.y + 16,
            locked: false,
          };
          setFreeElements((els) => [...els, copy]);
          setSelectedId(copy.id);
          e.preventDefault();
          return;
        }
        if (sectionTarget) {
          const copy: Section = {
            ...sectionTarget,
            id: `${Date.now()}`,
            content: { ...sectionTarget.content },
          };
          pushHistory([...sections, copy]);
          setSelectedId(copy.id);
          e.preventDefault();
          return;
        }
      }

      // Nudging with arrow keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        if (freeTarget) {
          const step = e.shiftKey ? 10 : 1;
          let newX = freeTarget.x;
          let newY = freeTarget.y;
          
          switch (e.key) {
            case "ArrowUp": newY -= step; break;
            case "ArrowDown": newY += step; break;
            case "ArrowLeft": newX -= step; break;
            case "ArrowRight": newX += step; break;
          }
          
          setFreeElements(els => els.map(el => 
            el.id === selectedId ? { ...el, x: newX, y: newY } : el
          ));
          e.preventDefault();
          return;
        }
      }

      // Align shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "l") {
        // Align left
        if (freeTarget) {
          setFreeElements(els => els.map(el => 
            el.id === selectedId ? { ...el, x: 0 } : el
          ));
          e.preventDefault();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r") {
        // Align right
        if (freeTarget && canvasRef.current) {
          const canvasWidth = canvasRef.current.clientWidth;
          setFreeElements(els => els.map(el => 
            el.id === selectedId ? { ...el, x: canvasWidth - el.width } : el
          ));
          e.preventDefault();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "t") {
        // Align top
        if (freeTarget) {
          setFreeElements(els => els.map(el => 
            el.id === selectedId ? { ...el, y: 0 } : el
          ));
          e.preventDefault();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        // Align bottom
        if (freeTarget && canvasRef.current) {
          const canvasHeight = 800; // fixed canvas height
          setFreeElements(els => els.map(el => 
            el.id === selectedId ? { ...el, y: canvasHeight - el.height } : el
          ));
          e.preventDefault();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, sections, freeElements, undo, redo, pushHistory]);

  const applyTemplate = (tpl: Section[]) => {
    pushHistory(tpl.map((s) => ({ ...s, id: crypto.randomUUID() })));
    setSelectedId(null);
  };

  // Template handling functions
  const handleTemplatePreview = (template: TemplateMeta) => {
    setPreviewTemplate(template);
  };

  const handleTemplateApply = async (template: TemplateMeta) => {
    try {
      const parsedSections = await loadTemplate(template);
      const builderSections = parsedSections.map(section => ({
        id: section.id,
        type: section.type as any,
        content: section.content
      }));
      applyTemplate(builderSections);
      setPreviewTemplate(null);
      
      // Ensure theme is not affected by template loading
      setTimeout(() => {
        refreshTheme();
      }, 100);
      
      toast.success(`${template.name} template applied successfully!`);
    } catch (error) {
      console.error('Error applying template:', error);
      toast.error('Failed to apply template');
    }
  };

  const handleTemplateCancel = () => {
    setPreviewTemplate(null);
  };

  // Filter templates based on search and category
  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesCategory = templateFilters.category === 'All' || template.category === templateFilters.category;
      const matchesSearch = template.name.toLowerCase().includes(templateFilters.searchQuery.toLowerCase()) ||
                          template.description?.toLowerCase().includes(templateFilters.searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [templates, templateFilters]);

  const templateCategories: TemplateCategory[] = [
    "Business", "Portfolio", "Blog", "Creative", "Restaurant",
    "E-commerce", "Education", "Event", "Fashion", "Fitness",
    "NGO", "Photography", "Product", "Real Estate", "Resume",
    "SaaS", "Tech", "Travel", "Consulting"
  ];

  const quickTemplates: { name: string; sections: Section[] }[] = [
    {
      name: "Simple Landing",
      sections: [
        { id: "t1", type: "hero", content: { title: "Build Faster", subtitle: "Your site in minutes", buttonText: "Start" } },
        { id: "t2", type: "text", content: { text: "Add your selling points and showcase your product." } },
        { id: "t3", type: "cta", content: { title: "Get Started Today", buttonText: "Sign Up" } },
      ],
    },
    {
      name: "Portfolio",
      sections: [
        { id: "p1", type: "hero", content: { title: "Hi, I'm Alex", subtitle: "Designer & Developer", buttonText: "View Work" } },
        { id: "p2", type: "image", content: { imageUrl: "https://via.placeholder.com/1200x600" } },
        { id: "p3", type: "text", content: { text: "I create delightful user experiences with a focus on performance." } },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Toolbar */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <div className="flex items-center gap-2 group cursor-pointer">
                <Sparkles className="w-5 h-5 text-primary group-hover:rotate-180 transition-transform duration-200 ease-in-out" />
                <span className="font-semibold hidden sm:inline text-black dark:text-white">SiteForge</span>
              </div>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary" size="sm" className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white">Go to Dashboard</Button>
            </Link>
            <div className="h-6 w-px bg-border" />
            <input
              type="text"
              defaultValue="Untitled Site"
              className="bg-transparent border-none outline-none font-medium text-sm max-w-[200px]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setZoom((z) => Math.min(2, parseFloat((z + 0.1).toFixed(2))))} title="Zoom in" className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setZoom((z) => Math.max(0.4, parseFloat((z - 0.1).toFixed(2))))} title="Zoom out" className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => {
              const wrapper = canvasWrapperRef.current;
              const canvas = canvasRef.current;
              if (!wrapper || !canvas) { setZoom(1); return; }
              const availW = wrapper.clientWidth - 16;
              const availH = wrapper.clientHeight - 16;
              const rect = canvas.getBoundingClientRect();
              const baseW = rect.width / zoom;
              const baseH = 800; // fixed base canvas height
              const scale = Math.max(0.2, Math.min(availW / baseW, availH / baseH));
              setZoom(parseFloat(scale.toFixed(2)));
            }} title="Fit to screen" className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white">
              <Maximize className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white" onClick={undo} disabled={!historyRef.current.length}>
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white" onClick={redo} disabled={!futureRef.current.length}>
              <Redo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setPreview((v) => !v)} aria-pressed={preview} className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white">
              <Eye className="w-4 h-4" />
            </Button>
            {/* Responsive View Switcher */}
            <div className="flex items-center gap-1 border border-border/50 rounded-lg p-1">
              <Button
                variant={responsiveView === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setResponsiveView('desktop')}
                className="h-8 w-8 p-0 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white"
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={responsiveView === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setResponsiveView('tablet')}
                className="h-8 w-8 p-0 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white"
                title="Tablet View"
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={responsiveView === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setResponsiveView('mobile')}
                className="h-8 w-8 p-0 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white"
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
            
            <Button variant="ghost" size="icon" onClick={refreshTheme} title="Refresh Theme" className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="hero" size="sm" onClick={handleSave} className="gap-2 text-black dark:text-white hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white">
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-2 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export HTML</span>
            </Button>
            {lastSaved && (
              <span className="text-xs text-muted-foreground hidden md:inline">
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <ResizablePanelGroup direction="horizontal" className="w-full">
        {/* Left Sidebar - Elements */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={35} className="min-w-[200px]">
            <aside className="h-full border-r border-border/50 bg-card/30 p-4 overflow-y-auto sidebar-scrollbar">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Components
              </h3>
              <div className="space-y-2">
                {/* Layout Components */}
                <div className="space-y-1">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Layout</h4>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600"
                    onClick={() => addSection("hero")}
                  >
                    <Layout className="w-4 h-4" />
                    Section
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600"
                    onClick={() => addSection("html")}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    Card Grid
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600"
                    onClick={() => addSection("html")}
                  >
                    <PanelTop className="w-4 h-4" />
                    Navbar
                  </Button>
                </div>

                {/* Content Components */}
                <div className="space-y-1">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Content</h4>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600"
                    onClick={() => addSection("text")}
                  >
                    <Heading1 className="w-4 h-4" />
                    Heading
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600"
                    onClick={() => addSection("text")}
                  >
                    <Pilcrow className="w-4 h-4" />
                    Text Block
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600"
                    onClick={() => addSection("cta")}
                  >
                    <MousePointer className="w-4 h-4" />
                    Button
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600"
                    onClick={() => addSection("image")}
                  >
                    <ImageIcon className="w-4 h-4" />
                    Image
                  </Button>
                </div>

                {/* Draggable freeform elements */}
                <div
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("application/x-element-type", "text")}
                  className="w-full px-3 py-2 rounded border bg-card cursor-grab hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600"
                >
                  Add Text
                </div>
                <div
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("application/x-element-type", "shape")}
                  className="w-full px-3 py-2 rounded border bg-card cursor-grab hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600"
                >
                  Add Shape
                </div>
                <div
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("application/x-element-type", "image")}
                  className="w-full px-3 py-2 rounded border bg-card cursor-grab hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600"
                >
                  Add Image
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Layout className="w-4 h-4" />
                Templates
              </h3>
              
              {/* Template Search */}
              <div className="mb-3">
                <Input
                  placeholder="Search templates..."
                  value={templateFilters.searchQuery}
                  onChange={(e) => setTemplateFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                  className="text-sm"
                />
              </div>
              
              {/* Template Categories */}
              <div className="mb-3">
                <div className="flex flex-wrap gap-1">
                  <Button
                    variant={templateFilters.category === 'All' ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs"
                    onClick={() => setTemplateFilters(prev => ({ ...prev, category: 'All' }))}
                  >
                    All
                  </Button>
                  {templateCategories.slice(0, 4).map(category => (
                    <Button
                      key={category}
                      variant={templateFilters.category === category ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs"
                      onClick={() => setTemplateFilters(prev => ({ ...prev, category }))}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Template List */}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {templateLoading ? (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    Loading templates...
                  </div>
                ) : filteredTemplates.length === 0 ? (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    No templates found
                  </div>
                ) : (
                  filteredTemplates.slice(0, 6).map((template) => (
                    <Card
                      key={template.id}
                      className="p-3 cursor-pointer hover:border-primary/50 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white transition-colors group"
                      onClick={() => handleTemplatePreview(template)}
                    >
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                          <Star className="w-4 h-4 text-primary group-hover:text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm group-hover:text-white truncate">
                            {template.name}
                          </div>
                          <div className="text-xs text-muted-foreground group-hover:text-white/80 truncate">
                            {template.category}
                          </div>
                          {template.description && (
                            <div className="text-xs text-muted-foreground group-hover:text-white/80 line-clamp-1 mt-1">
                              {template.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
              
              {/* Legacy Templates */}
              <div className="mt-4">
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Quick Templates</h4>
                <div className="space-y-1">
                  {quickTemplates.map((t) => (
                    <Button 
                      key={t.name} 
                      variant="outline" 
                      size="sm"
                      className="w-full justify-start text-xs hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600" 
                      onClick={() => applyTemplate(t.sections)}
                    >
                      {t.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Typography Presets */}
            <TypographyPresets onApply={(preset) => {
              // Apply to all text elements
              setFreeElements(els => els.map(el => 
                el.type === "text" 
                  ? { ...el, props: { ...el.props, fontFamily: preset.heading.fontFamily, fontSize: preset.heading.fontSize, fontWeight: preset.heading.fontWeight } }
                  : el
              ));
              toast.success("Typography preset applied");
            }} />

            {/* Color Swatches */}
            <ColorSwatches 
              onSelect={(color) => {
                if (selectedId) {
                  const freeTarget = freeElements.find(e => e.id === selectedId);
                  if (freeTarget) {
                    setFreeElements(els => els.map(e => 
                      e.id === selectedId 
                        ? { ...e, props: { ...e.props, color } }
                        : e
                    ));
                  }
                }
              }}
              currentColor={freeElements.find(e => e.id === selectedId)?.props?.color}
            />

            {/* Help & Tips Section */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Help & Tips
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="p-2 bg-muted/50 rounded border">
                  <strong>💡 Tip:</strong> Drag elements from the left sidebar to add them to your canvas.
                </div>
                <div className="p-2 bg-muted/50 rounded border">
                  <strong>⌨️ Shortcut:</strong> Use Ctrl+Z to undo and Ctrl+Y to redo.
                </div>
                <div className="p-2 bg-muted/50 rounded border">
                  <strong>🎨 Style:</strong> Select any element to customize its properties on the right.
                </div>
                <div className="p-2 bg-muted/50 rounded border">
                  <strong>📱 Preview:</strong> Click the eye icon to preview your design.
                </div>
                <div className="p-2 bg-muted/50 rounded border">
                  <strong>💾 Save:</strong> Your work is automatically saved as you build.
                </div>
              </div>
            </div>

            {/* Section Blocks */}
            <SectionBlocks onAdd={(template) => {
              const newSection: Section = {
                id: Date.now().toString(),
                type: template.type as any,
                content: template.content,
              };
              pushHistory([...sections, newSection]);
              toast.success("Section block added");
            }} />

            {/* Export & Import */}
            <ExportImport 
              sections={sections}
              freeElements={freeElements}
              onImport={(data) => {
                setSections(data.sections);
                setFreeElements(data.freeElements);
                setSelectedId(null);
                toast.success("Project imported successfully");
              }}
            />
          </div>
        </aside>
          </ResizablePanel>
          <ResizableHandle withHandle />

        {/* Main Canvas */}
          <ResizablePanel defaultSize={60} minSize={30}>
            <main className="h-full overflow-auto bg-muted/30 p-0">
          <div 
            className="w-full h-full transition-all duration-300" 
            ref={canvasWrapperRef}
            style={{
              maxWidth: responsiveView === 'tablet' ? '768px' : responsiveView === 'mobile' ? '420px' : '100%',
              margin: responsiveView !== 'desktop' ? '0 auto' : '0'
            }}
          >
            <Card className="min-h-[600px] bg-background border-border/50 shadow-elevation">
              <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                  {sections.map((section) => (
                    <SortableSection
                      key={section.id}
                      section={section}
                      onUpdate={updateSection}
                      onDelete={deleteSection}
                      onSelect={setSelectedId}
                      selected={selectedId === section.id}
                      preview={preview}
                    />
                  ))}
                </SortableContext>
              </DndContext>
              {/* Freeform canvas */}
              <div
                ref={canvasRef}
                className="relative h-[800px] editor-grid builder-canvas"
                style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const type = e.dataTransfer.getData("application/x-element-type");
                  if (!type) return;
                  const rect = canvasRef.current?.getBoundingClientRect();
                  if (!rect) return;
                  const x = Math.round((e.clientX - rect.left) / zoom);
                  const y = Math.round((e.clientY - rect.top) / zoom);
                  const id = `el-${Date.now()}`;
                  const base: FreeElementData = {
                    id,
                    type: type as any,
                    x: x - 50,
                    y: y - 25,
                    width: type === "text" ? 200 : 120,
                    height: type === "text" ? 60 : 120,
                    props: type === "text" ? { text: "Double-click to edit", fontSize: 20, align: "center" } : type === "shape" ? { bg: "hsl(var(--card))", radius: 8 } : { src: "/placeholder.svg" },
                  };
                  setFreeElements((els) => [...els, base]);
                  setSelectedId(id);
                }}
              >
                {/* center alignment guides */}
                <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-full w-px bg-primary/30" />
                <div className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 w-full h-px bg-primary/30" />
                {freeElements.map(el => (
                  <FreeElement
                    key={el.id}
                    data={el}
                    selected={selectedId === el.id}
                    zoom={zoom}
                    onSelect={setSelectedId}
                    onChange={(id, patch) => setFreeElements(els => els.map(e => e.id === id ? { ...e, ...patch } : e))}
                    onDragStateChange={(_, __) => { /* reserved for future snapping to guides */ }}
                  />
                ))}
              </div>
              {sections.length === 0 && (
                <div className="flex items-center justify-center h-[600px] text-muted-foreground">
                  <div className="text-center">
                    <Layout className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Add sections from the left sidebar to start building</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </main>
          </ResizablePanel>
          <ResizableHandle withHandle />

        {/* Right Sidebar - Properties */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={35} className="min-w-[220px]">
            <aside className="h-full border-l border-border/50 bg-card/30 p-4 overflow-y-auto sidebar-scrollbar">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Inspector
            </h3>
            {!selectedId && (
              <p className="text-sm text-muted-foreground">Select an element or section to edit its properties</p>
            )}
            {selectedId && (
              <div className="space-y-4">
                {(() => {
                  const sectionTarget = sections.find((s) => s.id === selectedId);
                  if (sectionTarget) {
                    const update = (patch: Partial<Section["content"]>) => updateSection(sectionTarget.id, { ...sectionTarget.content, ...patch });
                    switch (sectionTarget.type) {
                      case "hero":
                        return (
                          <div className="space-y-3">
                            <Input value={sectionTarget.content.title || ""} onChange={(e) => update({ title: e.target.value })} placeholder="Title" />
                            <Input value={sectionTarget.content.subtitle || ""} onChange={(e) => update({ subtitle: e.target.value })} placeholder="Subtitle" />
                            <Input value={sectionTarget.content.buttonText || ""} onChange={(e) => update({ buttonText: e.target.value })} placeholder="Button Text" />
                          </div>
                        );
                      case "text":
                        return (
                          <Textarea value={sectionTarget.content.text || ""} onChange={(e) => update({ text: e.target.value })} placeholder="Text" />
                        );
                      case "image":
                        return (
                          <Input value={sectionTarget.content.imageUrl || ""} onChange={(e) => update({ imageUrl: e.target.value })} placeholder="Image URL" />
                        );
                      case "cta":
                        return (
                          <div className="space-y-3">
                            <Input value={sectionTarget.content.title || ""} onChange={(e) => update({ title: e.target.value })} placeholder="Title" />
                            <Input value={sectionTarget.content.buttonText || ""} onChange={(e) => update({ buttonText: e.target.value })} placeholder="Button Text" />
                          </div>
                        );
                      case "html":
                        return (
                          <Input value={sectionTarget.content.htmlPath || ""} onChange={(e) => update({ htmlPath: e.target.value })} placeholder="HTML Path" />
                        );
                    }
                  }
                  const freeTarget = freeElements.find((e) => e.id === selectedId);
                  if (freeTarget) {
                    const update = (patch: Partial<FreeElementData>) => setFreeElements((els) => els.map((e) => e.id === freeTarget.id ? { ...e, ...patch } : e));
                    return (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <Input type="number" value={freeTarget.x} onChange={(e) => update({ x: parseInt(e.target.value || "0", 10) })} placeholder="X" />
                          <Input type="number" value={freeTarget.y} onChange={(e) => update({ y: parseInt(e.target.value || "0", 10) })} placeholder="Y" />
                          <Input type="number" value={freeTarget.width} onChange={(e) => update({ width: parseInt(e.target.value || "0", 10) })} placeholder="W" />
                          <Input type="number" value={freeTarget.height} onChange={(e) => update({ height: parseInt(e.target.value || "0", 10) })} placeholder="H" />
                          <Input type="number" value={freeTarget.rotation || 0} onChange={(e) => update({ rotation: parseInt(e.target.value || "0", 10) })} placeholder="Rotation" />
                        </div>
                        {freeTarget.type === "text" && (
                          <div className="space-y-2">
                            <Input value={freeTarget.props?.text || ""} onChange={(e) => update({ props: { ...freeTarget.props, text: e.target.value } })} placeholder="Text" />
                            <Input type="number" value={freeTarget.props?.fontSize || 24} onChange={(e) => update({ props: { ...freeTarget.props, fontSize: parseInt(e.target.value || "0", 10) } })} placeholder="Font size" />
                            <Input value={freeTarget.props?.color || ""} onChange={(e) => update({ props: { ...freeTarget.props, color: e.target.value } })} placeholder="Color (e.g., #fff or hsl())" />
                          </div>
                        )}
                        {freeTarget.type === "image" && (
                          <div className="space-y-2">
                            <Input value={freeTarget.props?.src || ""} onChange={(e) => update({ props: { ...freeTarget.props, src: e.target.value } })} placeholder="Image URL" />
                            <Input type="number" value={freeTarget.props?.opacity ?? 1} onChange={(e) => update({ props: { ...freeTarget.props, opacity: parseFloat(e.target.value || "1") } })} placeholder="Opacity (0-1)" />
                          </div>
                        )}
                        {freeTarget.type === "shape" && (
                          <div className="space-y-2">
                            <Input value={freeTarget.props?.bg || ""} onChange={(e) => update({ props: { ...freeTarget.props, bg: e.target.value } })} placeholder="Background" />
                            <Input type="number" value={freeTarget.props?.radius ?? 8} onChange={(e) => update({ props: { ...freeTarget.props, radius: parseInt(e.target.value || "0", 10) } })} placeholder="Radius" />
                          </div>
                        )}
                      </div>
                    );
                  }
                })()}
                <div className="pt-2">
                  <Button variant="outline" onClick={() => setSelectedId(null)} className="w-full hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600">Deselect</Button>
                </div>
              </div>
            )}
            {/* Enhanced Layers Panel */}
            <div className="pt-4">
              <h4 className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Layers</h4>
              <div className="space-y-1">
                {/* Sections */}
                {sections.map((section) => (
                  <div key={section.id} className={`flex items-center justify-between text-sm px-2 py-1 rounded ${selectedId === section.id ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
                       onClick={() => setSelectedId(section.id)}>
                    <div className="flex items-center gap-2">
                      <Layout className="w-3 h-3" />
                      <span>{section.type} Section</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white" onClick={(e) => {
                        e.stopPropagation();
                        deleteSection(section.id);
                      }}>Delete</Button>
                    </div>
                  </div>
                ))}
                
                {/* Free Elements */}
                {freeElements
                  .slice()
                  .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0))
                  .map((el) => (
                    <div key={el.id} className={`flex items-center justify-between text-sm px-2 py-1 rounded ${selectedId === el.id ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
                         onClick={() => setSelectedId(el.id)}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded ${el.locked ? 'bg-orange-500' : 'bg-green-500'}`} title={el.locked ? 'Locked' : 'Unlocked'} />
                        <span>{el.type} ({el.id.slice(-4)})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white" onClick={(e) => {
                          e.stopPropagation();
                          setFreeElements(els => els.map(e => e.id === el.id ? { ...e, zIndex: (e.zIndex || 1) + 1 } : e));
                        }}>↑</Button>
                        <Button variant="ghost" size="sm" className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white" onClick={(e) => {
                          e.stopPropagation();
                          setFreeElements(els => els.map(e => e.id === el.id ? { ...e, zIndex: Math.max(1, (e.zIndex || 1) - 1) } : e));
                        }}>↓</Button>
                        <Button variant="ghost" size="sm" className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white" onClick={(e) => {
                          e.stopPropagation();
                          setFreeElements(els => els.map(e => e.id === el.id ? { ...e, locked: !e.locked } : e));
                        }}>{el.locked ? '🔒' : '🔓'}</Button>
                        <Button variant="ghost" size="sm" className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white" onClick={(e) => {
                          e.stopPropagation();
                          setFreeElements(els => els.filter(e => e.id !== el.id));
                          if (selectedId === el.id) setSelectedId(null);
                        }}>🗑</Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Additional Help Content for Right Sidebar */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Properties Help
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="p-2 bg-muted/50 rounded border">
                  <strong>📐 Position:</strong> Use X, Y coordinates to position elements precisely.
                </div>
                <div className="p-2 bg-muted/50 rounded border">
                  <strong>📏 Size:</strong> Adjust width and height for perfect sizing.
                </div>
                <div className="p-2 bg-muted/50 rounded border">
                  <strong>🎨 Colors:</strong> Use the color picker or enter hex values.
                </div>
                <div className="p-2 bg-muted/50 rounded border">
                  <strong>🔒 Lock:</strong> Lock elements to prevent accidental changes.
                </div>
                <div className="p-2 bg-muted/50 rounded border">
                  <strong>📚 Layers:</strong> Use ↑↓ buttons to change element order.
                </div>
                <div className="p-2 bg-muted/50 rounded border">
                  <strong>🗑️ Delete:</strong> Remove elements you no longer need.
                </div>
              </div>
            </div>
          </div>
        </aside>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      
      {/* Template Preview Dialog */}
      {previewTemplate && (
        <TemplatePreview
          template={previewTemplate}
          onApply={(sections) => handleTemplateApply(previewTemplate)}
          onCancel={handleTemplateCancel}
          isOpen={!!previewTemplate}
        />
      )}
    </div>
  );
};

export default Builder;
