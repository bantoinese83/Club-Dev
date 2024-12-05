// Ensure correct imports

'use client';

import React from 'react';
import './globals.css'
import { ToastProvider } from '@/components/ui/toast';
import { Toast } from '@/components/ui/toast';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AnimationProvider } from '@/contexts/AnimationContext';
import { WebSocketProvider } from '@/components/WebSocketProvider';
import { AppProvider } from '@/components/AppContext';
import { HeaderNav } from '@/components/HeaderNav';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';

// Wrap components with providers in the layout
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SessionProvider>
          <AnimationProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <WebSocketProvider>
                <AppProvider>
                  <ToastProvider>
                    <div className="flex h-screen flex-col">
                      <HeaderNav />
                      <div className="flex h-full overflow-hidden">
                        <Sidebar />
                        <main className="flex-1 overflow-y-auto p-8">
                          <article>{children}</article>
                        </main>
                      </div>
                      <Footer />
                      <Toast />
                    </div>
                  </ToastProvider>
                </AppProvider>
              </WebSocketProvider>
            </ThemeProvider>
          </AnimationProvider>
        </SessionProvider>
      </body>
    </html>
  );
}