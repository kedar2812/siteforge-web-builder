# SiteForge Button Hover Standards

## Overview
All buttons in the SiteForge application should use consistent hover effects for a unified user experience.

## Standard Hover Effect
- **Background**: Blue gradient (`hover:from-blue-700 hover:to-blue-800`)
- **Text Color**: White (`hover:text-white`)
- **Border**: Blue (`hover:border-blue-600` for outline buttons)
- **Transition**: Instant (no smooth transitions)

## Implementation Methods

### 1. Global CSS (Automatic)
All buttons automatically get the hover effect through global CSS:
```css
button:not([disabled]):hover {
  background: linear-gradient(to right, rgb(29 78 216), rgb(30 64 175)) !important;
  color: white !important;
  border-color: rgb(37 99 235) !important;
}
```

### 2. Utility Functions
Use the provided utility functions for manual application:

```tsx
import { buttonHover, buttonHoverOutline, buttonHoverGhost } from "@/components/ui/button-hover";

// For regular buttons
<Button className={buttonHover()}>Click me</Button>

// For outline buttons
<Button variant="outline" className={buttonHoverOutline()}>Click me</Button>

// For ghost buttons
<Button variant="ghost" className={buttonHoverGhost()}>Click me</Button>
```

### 3. SiteForgeButton Component
Use the enhanced button component for automatic hover effects:

```tsx
import { SiteForgeButton } from "@/components/ui/button-hover";

<SiteForgeButton variant="outline" size="sm">
  Click me
</SiteForgeButton>
```

## Button Variants

### Default Buttons
```tsx
<Button className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white">
  Default Button
</Button>
```

### Outline Buttons
```tsx
<Button 
  variant="outline" 
  className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600"
>
  Outline Button
</Button>
```

### Ghost Buttons
```tsx
<Button 
  variant="ghost" 
  className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white"
>
  Ghost Button
</Button>
```

### Hero Buttons
```tsx
<Button 
  variant="hero" 
  className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white"
>
  Hero Button
</Button>
```

## Card Components
For card-based buttons (like SectionBlocks), use group hover:

```tsx
<Card className="group hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white">
  <div className="group-hover:text-white">Title</div>
  <div className="group-hover:text-white/80">Description</div>
</Card>
```

## Best Practices

1. **Always apply hover effects** to interactive elements
2. **Use consistent classes** across the application
3. **Test hover states** in both light and dark themes
4. **Ensure accessibility** - hover effects should not interfere with keyboard navigation
5. **Use group hover** for complex components with multiple text elements

## Examples

### Simple Button
```tsx
<Button className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white">
  Save
</Button>
```

### Icon Button
```tsx
<Button 
  variant="ghost" 
  size="icon"
  className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white"
>
  <Save className="w-4 h-4" />
</Button>
```

### Complex Card Button
```tsx
<Card className="group hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white">
  <div className="flex items-center gap-2">
    <Icon className="w-4 h-4 group-hover:text-white" />
    <span className="group-hover:text-white">Button Text</span>
  </div>
</Card>
```

## Migration Guide

When updating existing buttons:

1. **Add hover classes** to button className
2. **Use group hover** for complex components
3. **Test in both themes** to ensure proper contrast
4. **Remove any conflicting** hover styles

## Troubleshooting

### Hover effect not working?
- Check if button is disabled (`disabled` attribute)
- Ensure no conflicting CSS is overriding the effect
- Verify classes are applied correctly

### Text not turning white?
- Use `group-hover:text-white` for nested elements
- Check for inline styles that might override
- Ensure proper group class is applied to parent

### Border not changing?
- Add `hover:border-blue-600` for outline buttons
- Check if border classes are being overridden
