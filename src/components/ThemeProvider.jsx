import React, { createContext, useContext, useEffect } from "react"

const initialState = {
  theme: "light",
  setTheme: () => null,
}

const ThemeProviderContext = createContext(initialState)

export function ThemeProvider({
  children,
  ...props
}) {
  useEffect(() => {
    const root = window.document.documentElement
    const storageKey = "homygo-ui-theme"

    root.classList.remove("dark")
    root.classList.add("light")
    localStorage.removeItem(storageKey)
  }, [])

  const value = {
    theme: "light",
    setTheme: () => {},
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}