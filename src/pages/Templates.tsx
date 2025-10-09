import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Sparkles, Search, Eye, ExternalLink, Star, Filter, Settings } from "lucide-react";
import { toast } from "sonner";

type TemplateMeta = {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  htmlPath: string;
  cssPath: string;
  description?: string;
  uniqueFeatures?: string[];
};

const CATEGORIES = ["All", "Business", "Portfolio", "Blog", "Creative", "Restaurant", "E-commerce", "Education", "Event", "Fashion", "Fitness", "NGO", "Photography", "Product", "Real Estate", "Resume", "SaaS", "Tech", "Travel", "Consulting"];

const Templates = () => {
  const [templates, setTemplates] = useState<TemplateMeta[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [preview, setPreview] = useState<TemplateMeta | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user came from Dashboard
  const cameFromDashboard = location.state?.from === 'dashboard' || 
                          document.referrer.includes('/dashboard') ||
                          sessionStorage.getItem('cameFromDashboard') === 'true';

  // Check if user came from Landing page
  const cameFromLanding = location.state?.from === 'landing' || 
                         document.referrer.includes('/') ||
                         !cameFromDashboard;

  // Check if user is authenticated (simplified check - in real app, use proper auth context)
  const isAuthenticated = localStorage.getItem('user') !== null || 
                         sessionStorage.getItem('isAuthenticated') === 'true' ||
                         document.cookie.includes('authenticated=true');

  // Determine button text
  const getBackButtonText = () => {
    if (cameFromDashboard) {
      return 'Back to Dashboard';
    } else {
      // Came from Landing page
      return isAuthenticated ? 'Back to Dashboard' : 'Back to Home';
    }
  };

  // Debug logging
  console.log('Templates Debug:', {
    cameFromDashboard,
    cameFromLanding,
    isAuthenticated,
    locationState: location.state,
    referrer: document.referrer,
    sessionStorage: sessionStorage.getItem('cameFromDashboard'),
    localStorage: localStorage.getItem('user'),
    sessionAuth: sessionStorage.getItem('isAuthenticated'),
    cookie: document.cookie,
    buttonText: getBackButtonText()
  });

  const handleBackClick = () => {
    // Clear the sessionStorage flag
    sessionStorage.removeItem('cameFromDashboard');
    
    if (cameFromDashboard) {
      // Always go back to Dashboard if came from Dashboard
      navigate('/dashboard');
    } else {
      // Came from Landing page - check authentication
      if (isAuthenticated) {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    }
  };

  useEffect(() => {
    fetch("/templates/templates.json").then(r => r.json()).then(setTemplates).catch(() => setTemplates([]));
    
    // Set sessionStorage flag if user came from Dashboard
    if (location.state?.from === 'dashboard') {
      sessionStorage.setItem('cameFromDashboard', 'true');
    }
    
    // Cleanup function to clear sessionStorage when component unmounts
    return () => {
      sessionStorage.removeItem('cameFromDashboard');
    };
  }, [location.state]);

  const filtered = useMemo(() => {
    return templates.filter(t =>
      (category === "All" || !category || t.category === category) && t.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [templates, category, query]);

  const useTemplate = (tpl: TemplateMeta) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Store template data for after authentication
      sessionStorage.setItem('pendingTemplate', JSON.stringify({
        template: tpl.id,
        html: tpl.htmlPath,
        css: tpl.cssPath,
        name: tpl.name,
        category: tpl.category
      }));
      
      // Show notification
      toast.info("Please sign in to use this template", {
        description: "You'll be redirected to the sign-in page"
      });
      
      // Redirect to Auth page
      navigate('/auth');
      return;
    }
    
    // Navigate to Builder with template data
    const params = new URLSearchParams({
      template: tpl.id,
      html: tpl.htmlPath,
      css: tpl.cssPath,
      name: tpl.name,
      category: tpl.category
    });
    
    navigate(`/builder?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/50 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <Sparkles className="w-6 h-6 text-primary group-hover:rotate-180 transition-transform duration-200 ease-in-out" />
            <span className="text-xl font-bold text-black dark:text-white">
              SiteForge Templates
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="border-border hover:bg-accent"
              onClick={() => setPreview(null)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="ghost" onClick={handleBackClick}>
              {getBackButtonText()}
            </Button>
            <Link to="/settings">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/10 transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
          Choose Your Perfect <span className="bg-gradient-to-r from-primary to-secondary-glow bg-clip-text text-transparent">Template</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Professional templates designed for every industry. Customize them to match your brand perfectly.
        </p>
        
        {/* Search and Filters */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Input 
              placeholder="Search templates..." 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              className="pl-12 pr-4 py-3 rounded-xl"
            />
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map(cat => (
            <Button
              key={cat}
              variant={category === cat ? "hero" : "outline"}
              onClick={() => setCategory(c => c === cat ? null : cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </section>

      {/* Templates Grid */}
      <main className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((tpl) => (
            <Card
              key={tpl.id}
              className="group overflow-hidden rounded-2xl bg-card backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow hover:-translate-y-2"
            >
              <div className="relative w-full h-64 overflow-hidden">
                <img
                  src={tpl.thumbnail}
                  alt={tpl.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="hero"
                      className="text-black dark:text-white"
                      onClick={() => setPreview(tpl)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => useTemplate(tpl)}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Use
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{tpl.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-muted-foreground">4.8</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{tpl.category}</p>
                {tpl.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{tpl.description}</p>
                )}
                {tpl.uniqueFeatures && tpl.uniqueFeatures.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {tpl.uniqueFeatures.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                      {tpl.uniqueFeatures.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{tpl.uniqueFeatures.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
                <Button
                  variant="hero"
                  className="w-full text-black dark:text-white"
                  onClick={() => useTemplate(tpl)}
                >
                  Use This Template
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>

      {/* Full Screen Preview Dialog */}
      <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
        <DialogContent className="max-w-[98vw] w-[98vw] h-[98vh] flex flex-col p-0 bg-background">
          <DialogHeader className="px-6 py-4 border-b border-border shrink-0 bg-card/50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-foreground text-xl mb-2">Preview: {preview?.name}</DialogTitle>
                {preview?.description && (
                  <p className="text-sm text-muted-foreground mb-2">{preview.description}</p>
                )}
                {preview?.uniqueFeatures && preview.uniqueFeatures.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {preview.uniqueFeatures.map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="hero"
                  size="sm"
                  className="text-black dark:text-white"
                  onClick={() => useTemplate(preview!)}
                >
                  Use Template
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreview(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 min-h-0 bg-white dark:bg-card">
            {preview && (
              <iframe 
                title={preview.name} 
                src={preview.htmlPath} 
                className="w-full h-full border-0" 
                style={{ border: 'none' }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Templates;


