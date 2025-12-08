"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function ThemeSwitch() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors">
        <div className="inline-block h-4 w-4 translate-x-1 rounded-full bg-background shadow transition-transform" />
      </div>
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isDark ? "bg-primary" : "bg-muted"
      )}
    >
      <span className="sr-only">Toggle theme</span>
      <div
        className={cn(
          "inline-block h-4 w-4 rounded-full bg-background shadow-lg transition-transform",
          isDark ? "translate-x-6" : "translate-x-1"
        )}
      >
        <div className="flex h-full w-full items-center justify-center">
          {isDark ? (
            <Moon className="h-3 w-3 text-primary-foreground" />
          ) : (
            <Sun className="h-3 w-3 text-muted-foreground" />
          )}
        </div>
      </div>
    </button>
  )
}

