import type { Metadata } from "next";

import PageLayout from "components/layouts/PageLayout";

import { ViewTransition } from 'react';
import "./globals.css";

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
    <ViewTransition>
      <html lang="en">
        <body
          className={`antialiased`}
        >
          <PageLayout>
            {children}
          </PageLayout>
        </body>
      </html>
    </ViewTransition>
  );
}
