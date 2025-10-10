import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize build for production
    target: 'esnext',
    minify: 'terser',
    sourcemap: mode === 'development',
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          'dnd-vendor': ['@dnd-kit/core', '@dnd-kit/sortable'],
          'utils-vendor': ['clsx', 'tailwind-merge', 'class-variance-authority'],
          // Feature chunks
          'builder': [
            './src/components/builder/EnhancedTemplateGallery.tsx',
            './src/components/builder/TemplateCustomizationWizard.tsx',
            './src/components/builder/AlignmentGuides.tsx',
            './src/components/builder/MultiSelect.tsx',
            './src/components/builder/SnapToGrid.tsx'
          ],
          'design-system': [
            './src/components/design-system/ColorPicker.tsx',
            './src/components/design-system/TypographyScale.tsx',
            './src/components/design-system/DesignSystemPanel.tsx'
          ],
          'pages': [
            './src/pages/Builder.tsx',
            './src/pages/Templates.tsx',
            './src/pages/Dashboard.tsx'
          ]
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@dnd-kit/core',
      '@dnd-kit/sortable',
      'lucide-react',
      'sonner',
      'tailwind-merge',
      'clsx'
    ],
    exclude: ['@vite/client', '@vite/env']
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
}));
