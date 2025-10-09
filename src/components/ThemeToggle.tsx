import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";

export default function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme();

  const toggleTheme = () => {
    // If currently on system, switch to the opposite of current actual theme
    if (theme === "system") {
      setTheme(actualTheme === "dark" ? "light" : "dark");
    } else {
      // Toggle between light and dark
      setTheme(theme === "dark" ? "light" : "dark");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative rounded-full w-10 h-10 p-0 hover:bg-primary/10 transition-all duration-300"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}


