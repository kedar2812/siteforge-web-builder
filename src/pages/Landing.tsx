import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { Sparkles, Layout, Zap, Palette, Code, Shield, ArrowRight, Star, Users, Globe, Rocket, Settings } from "lucide-react";
import Particles from "@/components/Particles";

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
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23000000%22%20fill-opacity%3D%220.05%22%20class%3D%22dark%3Afill-white%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-secondary-glow/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-primary-glow/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Cursor Glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute w-[36rem] h-[36rem] rounded-full bg-primary/10 blur-3xl transition-transform duration-300"
          style={{
            transform: `translate(${cursor.x - 288}px, ${cursor.y - 288}px)`,
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-xl bg-card/50 fixed top-0 left-0 right-0 z-50 shadow-elevation">
        <div className="relative w-full h-16 flex items-center">
          {/* Left Section */}
          <div className="absolute left-0 z-10">
            <div className="container mx-auto px-4">
              <Link to="/" className="flex items-center gap-2 group cursor-pointer">
                <Sparkles className="w-6 h-6 text-primary group-hover:rotate-180 transition-transform duration-200 ease-in-out" />
                <span className="text-xl font-bold text-black dark:text-white group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-blue-700 group-hover:to-blue-800 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-100">
                  SiteForge
                </span>
              </Link>
            </div>
          </div>
          
          {/* Center Navigation - Centered to entire website width */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-4">
            <Link to="/templates" className="text-base font-semibold relative group cursor-pointer px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white transition-all duration-100">
              <span className="relative z-10">Templates</span>
            </Link>
            <button 
              onClick={(e) => {
                e.preventDefault();
                const featuresSection = document.getElementById('features');
                if (featuresSection) {
                  const yOffset = -80;
                  const y = featuresSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className="text-base font-semibold relative group cursor-pointer px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white transition-all duration-100"
            >
              Features
            </button>
          </div>
          
          {/* Right Section */}
          <div className="absolute right-0 z-10">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-4">
                <Link to="/auth">
                  <Button className="hidden sm:inline-flex text-black dark:text-white no-hover-effect" variant="hero">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="hero" className="gap-2 text-black dark:text-white no-hover-effect">
                    Get Started
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
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
          </div>
        </div>
      </nav>

      {/* Spacer for fixed header */}
      <div className="h-12" />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-16">
        <div className="relative grid lg:grid-cols-2 gap-12 items-center">
          <div className="absolute -z-10 inset-0 opacity-60">
            <Particles />
          </div>
          <div className="space-y-8 animate-fade-in-up reveal-up">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
                ✨ No coding required
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.35] tracking-tight text-foreground">
              <span className="inline-block animate-fade-in-up">Build</span>{" "}
              <span className="inline-block bg-gradient-to-r from-primary via-secondary-glow to-primary bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent animate-fade-in-up animation-delay-100 pb-2">
                Stunning
              </span>
              <br />
              <span className="inline-block animate-fade-in-up animation-delay-200">Websites in</span>{" "}
              <span className="inline-block relative animate-fade-in-up animation-delay-300">
                <span className="relative z-10">Minutes</span>
                <div className="absolute -inset-2 bg-primary/20 blur-2xl -z-10 animate-pulse" />
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl reveal-up">
              Create beautiful, professional websites with our intuitive drag-and-drop builder.
              Perfect for entrepreneurs, creatives, and businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/templates" state={{ from: 'landing' }}>
                <Button variant="hero" className="w-full sm:w-auto gap-2 text-black dark:text-white no-hover-effect">
                  View Templates
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" className="w-full sm:w-auto border-primary/50 hover:bg-primary/10 hover:border-primary">
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
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary-glow/20 opacity-30 blur-3xl" />
            <div className="relative rounded-2xl shadow-elevation border border-border overflow-hidden">
              {/* Modern Hero Mockup */}
              <div className="bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 bg-muted rounded px-3 py-1 text-xs text-muted-foreground">
                    siteforge.com
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-8 bg-gradient-primary rounded"></div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-20 bg-gradient-to-br from-primary/30 to-secondary-glow/30 rounded"></div>
                    <div className="h-20 bg-gradient-to-br from-secondary-glow/30 to-primary/30 rounded"></div>
                    <div className="h-20 bg-gradient-to-br from-primary/30 to-secondary-glow/30 rounded"></div>
                  </div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-primary rounded w-24"></div>
                    <div className="h-8 bg-muted rounded w-20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 border-t border-border/50">
        <div className="text-center mb-16 reveal-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
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
              className="group p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all hover:shadow-glow animate-fade-in-up hover:-translate-y-1"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 transition-colors group-hover:bg-primary/20">
                <feature.icon className="w-6 h-6 text-primary transition-transform group-hover:scale-110" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border/50">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-primary p-12 md:p-16 text-center reveal-up">
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-white">Ready to Build Your Dream Site?</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Join thousands of creators building beautiful websites with SiteForge
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 font-semibold"
                >
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-secondary opacity-30 animate-pulse-slow" />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">SiteForge</span>
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
    icon: Rocket,
    title: "AI-Powered",
    description: "Smart suggestions and automated optimizations to make your site shine.",
  },
];

export default Landing;
