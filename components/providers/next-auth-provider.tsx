// components/providers/next-auth-provider.tsx
'use client'; // This directive makes this a Client Component

import { SessionProvider } from 'next-auth/react';
import React from 'react';
import type { Session } from 'next-auth'; // Corrected: Import Session type

export default function NextAuthSessionProvider({ children, session }: { children: React.ReactNode, session: Session | null }) { // Corrected: Used Session type
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}
