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

const CATEGORIES = ["Business", "Portfolio", "Blog", "Creative", "Restaurant"];

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
      (!category || t.category === category) && t.name.toLowerCase().includes(query.toLowerCase())
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
          <Link to="/dashboard">
            <Button variant="ghost">Back</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-64 space-y-4">
            <div className="relative">
              <Input placeholder="Search templates" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              {CATEGORIES.map(cat => (
                <Button key={cat} variant={category === cat ? "hero" : "outline"} className="w-full justify-start" onClick={() => setCategory(c => c === cat ? null : cat)}>
                  {cat}
                </Button>
              ))}
            </div>
          </aside>

          <section className="flex-1">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(tpl => (
                <Card key={tpl.id} className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all hover:shadow-glow">
                  <div className="aspect-video bg-card relative">
                    <img src={tpl.thumbnail} alt={tpl.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <Button variant="secondary" onClick={() => setPreview(tpl)}>Preview</Button>
                      <Button variant="hero" onClick={() => useTemplate(tpl)}>Use Template</Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="font-semibold">{tpl.name}</div>
                    <div className="text-sm text-muted-foreground">{tpl.category}</div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
        <DialogContent className="max-w-5xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Preview: {preview?.name}</DialogTitle>
          </DialogHeader>
          <div className="w-full h-full border rounded-lg overflow-hidden">
            {preview && (
              <iframe title={preview.name} src={preview.htmlPath} className="w-full h-full bg-white" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Templates;


