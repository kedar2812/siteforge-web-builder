import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Sparkles, Search } from "lucide-react";

type TemplateMeta = {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  htmlPath: string;
  cssPath: string;
};

const CATEGORIES = ["All", "Business", "Portfolio", "Blog", "Creative", "Restaurant", "E-commerce", "Education", "Event", "Fashion", "Fitness", "NGO", "Photography", "Product", "Real Estate", "Resume", "SaaS", "Tech", "Travel", "Consulting"];

const Templates = () => {
  const [templates, setTemplates] = useState<TemplateMeta[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [preview, setPreview] = useState<TemplateMeta | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/templates/templates.json").then(r => r.json()).then(setTemplates).catch(() => setTemplates([]));
  }, []);

  const filtered = useMemo(() => {
    return templates.filter(t =>
      (category === "All" || !category || t.category === category) && t.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [templates, category, query]);

  const useTemplate = (tpl: TemplateMeta) => {
    navigate(`/builder?template=${encodeURIComponent(tpl.id)}&html=${encodeURIComponent(tpl.htmlPath)}&css=${encodeURIComponent(tpl.cssPath)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SiteForge Templates
            </span>
          </div>
          <Link to="/">
            <Button variant="ghost">Back</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-auto flex-grow">
            <Input placeholder="Search templates" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9 pr-4 py-2 rounded-lg border" />
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
          <div className="flex-shrink-0 overflow-x-auto scrollbar-thin pb-2">
            <div className="flex gap-2">
              {CATEGORIES.map(cat => (
                <Button
                  key={cat}
                  variant={category === cat ? "hero" : "outline"}
                  className="flex-shrink-0"
                  onClick={() => setCategory(c => c === cat ? null : cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <section className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((tpl) => (
              <Card
                key={tpl.id}
                className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
              >
                <div className="relative w-full h-48 bg-muted flex items-center justify-center overflow-hidden">
                  <img
                    src={tpl.thumbnail}
                    alt={tpl.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Button
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-lg font-semibold"
                    onClick={() => useTemplate(tpl)}
                  >
                    Use Template
                  </Button>
                </div>
                <div className="p-4">
                  <div className="font-semibold">{tpl.name}</div>
                  <div className="text-sm text-muted-foreground">{tpl.category}</div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
        <DialogContent className="max-w-7xl w-[95vw] h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b shrink-0">
            <DialogTitle>Preview: {preview?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 p-4">
            {preview && (
              <iframe title={preview.name} src={preview.htmlPath} className="w-full h-full bg-white rounded-lg border" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Templates;


