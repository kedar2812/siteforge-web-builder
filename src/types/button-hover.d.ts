/**
 * SiteForge Button Hover Effect Types
 * 
 * This file provides TypeScript support for the standardized button hover effects
 * used throughout the SiteForge application.
 */

declare module "react" {
  interface ButtonHTMLAttributes<T> {
    /**
     * Apply SiteForge standard hover effect
     * @example className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white"
     */
    "data-hover-effect"?: boolean;
  }
}

/**
 * Standard hover effect classes for SiteForge buttons
 */
export type ButtonHoverClass = 
  | "hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white"
  | "hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600"
  | "hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600";

/**
 * Button hover effect configuration
 */
export interface ButtonHoverConfig {
  /** Enable/disable hover effect */
  enabled?: boolean;
  /** Custom hover classes */
  customClasses?: string;
  /** Apply to child elements */
  applyToChildren?: boolean;
}

/**
 * Utility type for components that support hover effects
 */
export interface HoverEffectProps {
  /** Apply SiteForge hover effect */
  hoverEffect?: boolean;
  /** Custom hover classes */
  hoverClasses?: ButtonHoverClass;
}
