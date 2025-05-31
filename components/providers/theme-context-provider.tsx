// components/providers/theme-context-provider.tsx
'use client'; // This directive makes this a Client Component

import { ThemeProvider } from "next-themes" // Assuming this is from 'next-themes'
import React from "react";

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}