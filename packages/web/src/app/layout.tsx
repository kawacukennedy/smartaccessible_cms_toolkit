'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Layout from "@/components/Layout";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import NotificationRenderer from "@/components/NotificationRenderer";
import { AISuggestionProvider } from "@/contexts/AISuggestionContext";
import { AuthProvider } from "@/contexts/AuthProvider";
import { UndoRedoProvider } from "@/contexts/UndoRedoContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { initializeTelemetry } from '@/lib/telemetry';
import OfflineBanner from '@/components/OfflineBanner';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { OfflineProvider, useOffline } from '@/contexts/OfflineContext'; // Import OfflineProvider and useOffline
import { useState, useEffect } from 'react'; // Import useState and useEffect
import { logger } from '@/lib/logger';

const inter = Inter({ subsets: ["latin"] });

// Metadata removed as this is now a client component

(async () => {
  await initializeTelemetry();
})();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary
          onError={(error, errorInfo) => {
            logger.fatal('Application error caught by boundary', 'error-boundary', {
              error: error.message,
              stack: error.stack,
              componentStack: errorInfo.componentStack
            }, error);
          }}
        >
          <OnboardingProvider>
            <ThemeProvider>
              <NotificationProvider>
                <AuthProvider>
                  <UndoRedoProvider>
                    <AISuggestionProvider>
                      <AccessibilityProvider>
                        <OfflineProvider> {/* Wrap with OfflineProvider */}
                          <LayoutWrapper>
                            {children}
                          </LayoutWrapper>
                        </OfflineProvider>
                      </AccessibilityProvider>
                    </AISuggestionProvider>
                  </UndoRedoProvider>
                </AuthProvider>
              </NotificationProvider>
            </ThemeProvider>
          </OnboardingProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

// Create a wrapper component to use the useOffline hook
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOffline, pendingSyncCount } = useOffline();

  return (
    <>
      <OfflineBanner isOnline={!isOffline} syncQueueCount={pendingSyncCount} />
      <Layout>
        {children}
      </Layout>
      <NotificationRenderer />
    </>
  );
};