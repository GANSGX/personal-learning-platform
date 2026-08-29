"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { oauthErrorFromSearchParams } from "@/lib/auth/oauth-callback-error";
import { useI18n } from "@/lib/i18n/i18n-context";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

function AuthCallbackContent() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setError(t("callback.notConfigured"));
      return;
    }

    const oauthError = oauthErrorFromSearchParams(searchParams);

    if (oauthError !== null) {
      setError(oauthError);
      return;
    }

    const code = searchParams.get("code");
    const nextPath = searchParams.get("next") ?? "/";

    if (code === null) {
      setError(t("callback.missingCode"));
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (supabase === null) {
      setError(t("callback.notConfigured"));
      return;
    }

    void supabase.auth.exchangeCodeForSession(code).then(({ error: authError }) => {
      if (authError !== null) {
        setError(authError.message);
        return;
      }

      router.replace(nextPath);
    });
  }, [router, searchParams, t]);

  if (error !== null) {
    return (
      <div className="mx-auto w-full max-w-md space-y-4 text-center">
        <p className="text-destructive text-sm">{error}</p>
        <Button nativeButton={false} render={<Link href="/login" />} variant="outline">
          {t("callback.backToLogin")}
        </Button>
      </div>
    );
  }

  return <p className="text-muted-foreground text-center text-sm">{t("callback.signingIn")}</p>;
}

function AuthCallbackFallback() {
  const { t } = useI18n();

  return <p className="text-muted-foreground text-center text-sm">{t("callback.signingIn")}</p>;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<AuthCallbackFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
