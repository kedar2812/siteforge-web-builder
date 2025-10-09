import * as React from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  enableSystem?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: "dark" | "light";
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  actualTheme: "light",
};

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState);

// Update meta theme-color based on current theme
const updateMetaThemeColor = (theme: "dark" | "light") => {
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  const color = theme === "dark" ? "#2A3F5F" : "#E8F2FF";
  
  if (metaThemeColor) {
    metaThemeColor.setAttribute("content", color);
  } else {
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = color;
    document.head.appendChild(meta);
  }
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "siteforge-theme",
  enableSystem = true,
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  const [actualTheme, setActualTheme] = React.useState<"dark" | "light">("light");

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    let resolvedTheme: "dark" | "light";

    if (theme === "system" && enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      resolvedTheme = systemTheme;
      root.classList.add(systemTheme);
    } else {
      resolvedTheme = theme as "dark" | "light";
      root.classList.add(theme);
    }

    setActualTheme(resolvedTheme);
    updateMetaThemeColor(resolvedTheme);
  }, [theme, enableSystem]);

  // Listen for system theme changes
  React.useEffect(() => {
    if (!enableSystem || theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e: MediaQueryListEvent) => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      const newTheme = e.matches ? "dark" : "light";
      root.classList.add(newTheme);
      setActualTheme(newTheme);
      updateMetaThemeColor(newTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, enableSystem]);

  const setTheme = React.useCallback((theme: Theme) => {
    localStorage.setItem(storageKey, theme);
    setThemeState(theme);
  }, [storageKey]);

  const value = {
    theme,
    setTheme,
    actualTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
