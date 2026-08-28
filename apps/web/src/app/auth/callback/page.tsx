"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setError("Cloud sign-in is not configured.");
      return;
    }

    const code = searchParams.get("code");
    const nextPath = searchParams.get("next") ?? "/";

    if (code === null) {
      setError("Missing auth code.");
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (supabase === null) {
      setError("Cloud sign-in is not configured.");
      return;
    }

    void supabase.auth.exchangeCodeForSession(code).then(({ error: authError }) => {
      if (authError !== null) {
        setError(authError.message);
        return;
      }

      router.replace(nextPath);
    });
  }, [router, searchParams]);

  if (error !== null) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-destructive text-sm">{error}</p>
        <Button nativeButton={false} render={<Link href="/login" />} variant="outline">
          Back to sign in
        </Button>
      </div>
    );
  }

  return <p className="text-muted-foreground text-sm">Signing you in…</p>;
}

export default function AuthCallbackPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Suspense fallback={<p className="text-muted-foreground text-sm">Signing you in…</p>}>
        <AuthCallbackContent />
      </Suspense>
    </div>
  );
}
