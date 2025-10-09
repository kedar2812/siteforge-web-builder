import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

/**
 * Utility function to add SiteForge standard hover effects to any button
 * Usage: className={buttonHover()}
 */
export const buttonHover = () => 
  "hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600";

/**
 * Utility function for outline buttons with hover effects
 * Usage: className={buttonHoverOutline()}
 */
export const buttonHoverOutline = () => 
  "hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600";

/**
 * Utility function for ghost buttons with hover effects
 * Usage: className={buttonHoverGhost()}
 */
export const buttonHoverGhost = () => 
  "hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white";

/**
 * Enhanced Button component with automatic SiteForge hover effects
 */
interface SiteForgeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "hero" | "destructive";
  size?: "sm" | "default" | "lg" | "icon";
  hoverEffect?: boolean; // Enable/disable hover effect
}

const SiteForgeButton = forwardRef<HTMLButtonElement, SiteForgeButtonProps>(
  ({ className, variant = "default", size = "default", hoverEffect = true, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    const variantClasses = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      hero: "bg-gradient-to-r from-primary to-blue-600 text-white hover:from-blue-600 hover:to-blue-700",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
    };

    const sizeClasses = {
      sm: "h-9 px-3",
      default: "h-10 px-4 py-2",
      lg: "h-11 px-8",
      icon: "h-10 w-10"
    };

    const hoverClasses = hoverEffect ? buttonHover() : "";

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          hoverClasses,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

SiteForgeButton.displayName = "SiteForgeButton";

export { SiteForgeButton, buttonHover, buttonHoverOutline, buttonHoverGhost };
