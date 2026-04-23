import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/modules/website/components/ThemeProvider"
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)

  // 🔥 Auto theme based on time (runs once)
  useEffect(() => {
    setMounted(true)
    if (localStorage.getItem("theme")) return

    const hour = new Date().getHours()
    const isNight = hour >= 18 || hour < 6

    const autoTheme = isNight ? "dark" : "light"
    setTheme(autoTheme)
    localStorage.setItem("theme", autoTheme)
  }, [setTheme])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)

    toast({
      description: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode enabled`,
      duration: 2000,
      className: "backdrop-blur-md bg-background/80 border-border/20",
    })
  }

  const nextTheme = theme === "dark" ? "light" : "dark"
  const themeLabel = mounted ? `Switch to ${nextTheme} theme` : "Toggle theme"

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className={`h-9 w-9 rounded-full border border-border/10 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer ${className}`}
        aria-label={themeLabel}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
      
      {/* Tooltip */}
      <div className="absolute right-0 top-full mt-2 px-3 py-1.5 bg-popover border border-border text-popover-foreground text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap pointer-events-none z-50">
        {themeLabel}
      </div>
    </div>
  )
}
