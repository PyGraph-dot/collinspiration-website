// components/providers/theme-context-provider.tsx
'use client';

import { ThemeProvider } from "next-themes";
// CORRECTED: Import ThemeProviderProps directly from 'next-themes'
// or infer it using React.ComponentProps<typeof ThemeProvider>
import type { ThemeProviderProps } from "next-themes"; 
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