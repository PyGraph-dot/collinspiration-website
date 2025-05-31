// components/providers/next-auth-provider.tsx
'use client'; // This directive makes this a Client Component

import { SessionProvider } from 'next-auth/react';
import React from 'react';

export default function NextAuthSessionProvider({ children, session }: { children: React.ReactNode, session: any }) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}