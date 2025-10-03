import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Sparkles, Layout, Globe, Settings, LogOut } from "lucide-react";

const Dashboard = () => {
  // Mock data - will be replaced with real data from Lovable Cloud
  const sites = [
    { id: 1, name: "My Portfolio", url: "portfolio.siteforge.app", lastEdited: "2 hours ago", published: true },
    { id: 2, name: "Coffee Shop", url: "coffee.siteforge.app", lastEdited: "1 day ago", published: true },
    { id: 3, name: "Draft Site", url: "", lastEdited: "3 days ago", published: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SiteForge
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <Link to="/">
              <Button variant="ghost" size="icon">
                <LogOut className="w-5 h-5" />
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Websites</h1>
            <p className="text-muted-foreground">Manage and create your websites</p>
          </div>
          <Link to="/builder">
            <Button variant="hero" size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Create New Site
            </Button>
          </Link>
        </div>

        {/* Sites Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => (
            <Card
              key={site.id}
              className="border-border/50 hover:border-primary/50 transition-all hover:shadow-glow cursor-pointer group"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Layout className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">{site.name}</CardTitle>
                  </div>
                  {site.published && (
                    <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                      Published
                    </span>
                  )}
                </div>
                <CardDescription>
                  {site.url ? (
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {site.url}
                    </span>
                  ) : (
                    "Draft"
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Edited {site.lastEdited}
                  </span>
                  <Link to="/builder">
                    <Button variant="ghost" size="sm" className="group-hover:text-primary">
                      Edit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
