"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useEffect } from "react";

import { AuthScreen, AuthSplash } from "@/components/auth-screen";
import { AppShell } from "@/components/app-shell";
import { LoginForm } from "@/components/login-form";
import { useAuthContext } from "@/lib/auth/auth-context";
import { ProgressProvider } from "@/lib/progress/progress-context";

type AuthGateProps = {
  children: ReactNode;
};

function isAuthCallbackPath(pathname: string): boolean {
  return pathname === "/auth/callback" || pathname.startsWith("/auth/callback/");
}

function isLoginPath(pathname: string): boolean {
  return pathname === "/login" || pathname.startsWith("/login/");
}

export function AuthGate({ children }: AuthGateProps) {
  const { ready, user } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (user === null) {
      if (isAuthCallbackPath(pathname) || isLoginPath(pathname)) {
        return;
      }

      const nextPath = `${pathname}${searchParams.toString().length > 0 ? `?${searchParams.toString()}` : ""}`;
      router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
      return;
    }

    if (isLoginPath(pathname) || isAuthCallbackPath(pathname)) {
      const nextPath = searchParams.get("next") ?? "/";
      router.replace(nextPath);
    }
  }, [pathname, ready, router, searchParams, user]);

  if (!ready) {
    return <AuthSplash />;
  }

  if (user === null) {
    if (isAuthCallbackPath(pathname)) {
      return <AuthScreen>{children}</AuthScreen>;
    }

    return (
      <AuthScreen>
        <LoginForm />
      </AuthScreen>
    );
  }

  if (isLoginPath(pathname) || isAuthCallbackPath(pathname)) {
    return <AuthSplash />;
  }

  return (
    <ProgressProvider>
      <AppShell>{children}</AppShell>
    </ProgressProvider>
  );
}
