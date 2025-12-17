import type { Metadata } from "next";

import PageLayout from "components/layouts/PageLayout";
import { ViewTransitions } from '@jamesg9802/next-view-transitions'

import "./globals.css";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sink",
  description: "Everything and the Kitchen Sink.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense>
      <ViewTransitions enableHashTransitions>
        <html lang="en">
          <body
            className={`antialiased`}
          >
            <PageLayout>
              {children}
            </PageLayout>
          </body>
        </html>
      </ViewTransitions>
    </Suspense>
  );
}
