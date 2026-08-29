import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ClientProgressProvider } from "@/components/client-progress-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Платформа персонального обучения",
  description: "Граф знаний для системного обучения",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className="dark">
      <body>
        <ClientProgressProvider>{children}</ClientProgressProvider>
      </body>
    </html>
  );
}
