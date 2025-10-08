import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Layout, Zap, Palette, Code, Shield, ArrowRight, Star, Users, Globe, Rocket } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 smooth-scroll relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Cursor Glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute w-[36rem] h-[36rem] rounded-full bg-blue-500/10 blur-3xl transition-transform duration-300"
          style={{
            transform: `translate(${cursor.x - 288}px, ${cursor.y - 288}px)`,
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-xl bg-black/20 fixed top-0 left-0 right-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <Sparkles className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              SiteForge
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/templates" className="text-base font-semibold relative group cursor-pointer">
              <span className="relative z-10 bg-gradient-to-r from-foreground to-foreground bg-clip-text hover:from-blue-400 hover:to-cyan-400 transition-all duration-300">Templates</span>
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
              className="text-base font-semibold relative group cursor-pointer"
            >
              <span className="relative z-10 bg-gradient-to-r from-foreground to-foreground bg-clip-text hover:from-blue-400 hover:to-cyan-400 transition-all duration-300">Features</span>
            </button>
            <Link to="/auth">
              <Button className="hidden sm:inline-flex relative overflow-hidden group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 hover:shadow-lg hover:shadow-blue-500/25 transition-all hover:scale-105">
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 hover:shadow-xl hover:shadow-blue-500/25 transition-all hover:scale-105">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
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
              <span className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm font-medium text-blue-300">
                ✨ No coding required
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.35] tracking-tight">
              <span className="inline-block animate-fade-in-up">Build</span>{" "}
              <span className="inline-block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent animate-fade-in-up animation-delay-100 pb-2">
                Stunning
              </span>
              <br />
              <span className="inline-block animate-fade-in-up animation-delay-200">Websites in</span>{" "}
              <span className="inline-block relative animate-fade-in-up animation-delay-300">
                <span className="relative z-10">Minutes</span>
                <div className="absolute -inset-2 bg-blue-500/20 blur-2xl -z-10 animate-pulse" />
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-xl reveal-up">
              Create beautiful, professional websites with our intuitive drag-and-drop builder.
              Perfect for entrepreneurs, creatives, and businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/templates">
                <Button className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 hover:shadow-xl hover:shadow-blue-500/25 transition-all hover:scale-105 w-full sm:w-auto">
                  <span className="relative z-10 flex items-center gap-2">
                    View Templates
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" className="w-full sm:w-auto border-blue-400/50 text-blue-300 hover:bg-blue-500/10 hover:border-blue-400">
                  Start Building Free
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Secure & Reliable</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <span>Lightning Fast</span>
              </div>
            </div>
          </div>
          <div className="relative animate-fade-in group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-30 blur-3xl" />
            <div className="relative rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
              {/* Modern Hero Mockup */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 bg-slate-700 rounded px-3 py-1 text-xs text-gray-300">
                    siteforge.com
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded"></div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-20 bg-gradient-to-br from-blue-600/30 to-cyan-600/30 rounded"></div>
                    <div className="h-20 bg-gradient-to-br from-cyan-600/30 to-blue-600/30 rounded"></div>
                    <div className="h-20 bg-gradient-to-br from-blue-600/30 to-cyan-600/30 rounded"></div>
                  </div>
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-blue-600 rounded w-24"></div>
                    <div className="h-8 bg-slate-700 rounded w-20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 border-t border-white/10">
        <div className="text-center mb-16 reveal-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Everything You Need to Build Amazing Sites
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Powerful features that make website building effortless
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-400/50 transition-all hover:shadow-2xl hover:shadow-blue-500/10 animate-fade-in-up hover:-translate-y-1"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 transition-colors group-hover:bg-blue-500/20">
                <feature.icon className="w-6 h-6 text-blue-400 transition-transform group-hover:scale-110" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 p-12 md:p-16 text-center reveal-up">
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-white">Ready to Build Your Dream Site?</h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Join thousands of creators building beautiful websites with SiteForge
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                >
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 animate-pulse-slow" />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span className="font-semibold text-white">SiteForge</span>
            </div>
            <p className="text-sm text-gray-400">
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
