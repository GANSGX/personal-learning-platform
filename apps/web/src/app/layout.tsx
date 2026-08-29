import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ClientProgressProvider } from "@/components/client-progress-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Learning Platform",
  description: "Knowledge graph for systems learning",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <ClientProgressProvider>{children}</ClientProgressProvider>
      </body>
    </html>
  );
}
