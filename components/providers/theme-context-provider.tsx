// components/providers/theme-context-provider.tsx
'use client'; // This directive makes this a Client Component

import { ThemeProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types"; // Import the props type from next-themes
import React from "react";

// Change the prop type to accept all props that ThemeProvider from next-themes can take
export function ThemeContextProvider({ children, ...props }: ThemeProviderProps) {
  return (
    // Spread all received props directly onto the ThemeProvider from next-themes
    <ThemeProvider {...props}>
      {children}
    </ThemeProvider>
  );
}