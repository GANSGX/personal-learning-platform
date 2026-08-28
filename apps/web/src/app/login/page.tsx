import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Sign in — Personal Learning Platform",
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Suspense fallback={<p className="text-muted-foreground text-sm">Loading sign in…</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
