import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Layout, Zap, Palette, Code, Shield } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import Particles from "@/components/Particles";
import heroImage from "@/assets/hero-builder.jpg";

const Landing = () => {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMove);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal-up").forEach((el) => observer.observe(el));
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-hero smooth-scroll relative overflow-hidden">
      {/* Cursor Glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute w-[36rem] h-[36rem] rounded-full bg-primary/20 blur-3xl transition-transform duration-300"
          style={{
            transform: `translate(${cursor.x - 288}px, ${cursor.y - 288}px)`,
          }}
        />
      </div>
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/70 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-primary animate-gradient bg-clip-text text-transparent">
              SiteForge
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button variant="hero">Get Started Free</Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="relative grid lg:grid-cols-2 gap-12 items-center">
          <div className="absolute -z-10 inset-0 opacity-60">
            <Particles />
          </div>
          <div className="space-y-8 animate-fade-in-up reveal-up">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium">
                ✨ No coding required
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Build Stunning Websites{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                in Minutes
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl reveal-up">
              Create beautiful, professional websites with our intuitive drag-and-drop builder.
              Perfect for entrepreneurs, creatives, and businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/templates">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  View Templates
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="hero-outline" size="lg" className="w-full sm:w-auto">
                  Start Building Free
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>Secure & Reliable</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>Lightning Fast</span>
              </div>
            </div>
          </div>
          <div className="relative animate-fade-in group">
            <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl" />
            <img
              src={heroImage}
              alt="Website Builder Interface"
              className="relative rounded-2xl shadow-elevation border border-border/50 transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border/50">
        <div className="text-center mb-16 reveal-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Build Amazing Sites
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful features that make website building effortless
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group p-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-all hover:shadow-glow animate-fade-in-up hover:-translate-y-1"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 transition-colors group-hover:bg-primary/20">
                <feature.icon className="w-6 h-6 text-primary transition-transform group-hover:scale-110" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border/50">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-primary p-12 md:p-16 text-center reveal-up">
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold">Ready to Build Your Dream Site?</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Join thousands of creators building beautiful websites with SiteForge
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto bg-background text-foreground hover:bg-background/90"
                >
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-glow/20 to-secondary-glow/20 animate-pulse-slow" />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-semibold">SiteForge</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 SiteForge. Built with ❤️ for creators.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: Layout,
    title: "Drag & Drop Builder",
    description: "Intuitively build your site by dragging and dropping elements. No technical skills needed.",
  },
  {
    icon: Palette,
    title: "Beautiful Templates",
    description: "Start with professionally designed templates and customize them to match your brand.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Your sites load instantly with optimized code and modern infrastructure.",
  },
  {
    icon: Code,
    title: "SEO Optimized",
    description: "Built-in SEO tools to help your site rank higher in search results.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security and 99.9% uptime guarantee for peace of mind.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Smart suggestions and automated optimizations to make your site shine.",
  },
];

export default Landing;
