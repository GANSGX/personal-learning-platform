"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { readGithubAuthEnabled } from "@/lib/auth/auth-settings";
import { oauthErrorFromSearchParams } from "@/lib/auth/oauth-callback-error";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getSupabasePublicEnv, isSupabaseConfigured } from "@/lib/supabase/env";

type LoginMode = "signin" | "signup";

type ConfiguredLoginFormProps = {
  supabase: SupabaseClient;
  nextPath: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildRedirectTo(nextPath: string): string {
  return `${globalThis.window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
}

function GitHubMark() {
  return (
    <svg aria-hidden="true" className="size-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.486 2 12.021c0 4.425 2.865 8.18 6.839 9.504.5.093.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.622.069-.61.069-.61 1.004.071 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.56 9.56 0 0 1 12 6.844a9.56 9.56 0 0 1 2.504.337c1.909-1.296 2.748-1.026 2.748-1.026.546 1.378.203 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.31.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.481A10.02 10.02 0 0 0 22 12.021C22 6.486 17.523 2 12 2" />
    </svg>
  );
}

function ConfiguredLoginForm({ supabase, nextPath }: ConfiguredLoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<LoginMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(() => oauthErrorFromSearchParams(searchParams));
  const [pending, setPending] = useState(false);

  const emailValid = emailPattern.test(email.trim());
  const passwordValid = password.length >= 8;

  function resetFeedback() {
    setError(null);
    setMessage(null);
  }

  async function signInWithGitHub() {
    setPending(true);
    resetFeedback();

    const env = getSupabasePublicEnv();

    if (env !== null) {
      const githubEnabled = await readGithubAuthEnabled(env);

      if (githubEnabled === false) {
        setError("GitHub sign-in is not enabled. Use email and password, or a magic link.");
        setPending(false);
        return;
      }
    }

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: buildRedirectTo(nextPath) },
    });

    if (authError !== null) {
      setError(authError.message);
      setPending(false);
    }
  }

  async function sendMagicLink() {
    if (!emailValid) {
      setError("Enter a valid email address.");
      return;
    }

    setPending(true);
    resetFeedback();

    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: buildRedirectTo(nextPath) },
    });

    setPending(false);

    if (authError !== null) {
      setError(authError.message);
      return;
    }

    setMessage("Check your email for the sign-in link.");
  }

  async function signInWithPassword() {
    if (!emailValid || !passwordValid) {
      setError("Use a valid email and a password of at least 8 characters.");
      return;
    }

    setPending(true);
    resetFeedback();

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setPending(false);

    if (authError !== null) {
      setError(authError.message);
      return;
    }

    router.replace(nextPath);
  }

  async function signUpWithPassword() {
    if (!emailValid || !passwordValid) {
      setError("Use a valid email and a password of at least 8 characters.");
      return;
    }

    setPending(true);
    resetFeedback();

    const { error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: buildRedirectTo(nextPath) },
    });

    setPending(false);

    if (authError !== null) {
      setError(authError.message);
      return;
    }

    setMessage("Account created. Confirm your email if asked, then sign in.");
    setMode("signin");
  }

  return (
    <div
      className="border-border bg-card mx-auto w-full max-w-md rounded-2xl border p-5 shadow-[0_24px_80px_-40px_oklch(0_0_0/0.8)] sm:p-7"
      data-testid="login-form"
    >
      <div
        className="mb-6 grid grid-cols-2 rounded-xl bg-neutral-800 p-1"
        role="tablist"
        aria-label="Authentication mode"
      >
        <button
          aria-selected={mode === "signin"}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            mode === "signin" ? "bg-white text-neutral-950" : "text-neutral-200 hover:text-white"
          }`}
          onClick={() => {
            setMode("signin");
            resetFeedback();
          }}
          role="tab"
          type="button"
        >
          Sign in
        </button>
        <button
          aria-selected={mode === "signup"}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            mode === "signup" ? "bg-white text-neutral-950" : "text-neutral-200 hover:text-white"
          }`}
          data-testid="signup-tab"
          onClick={() => {
            setMode("signup");
            resetFeedback();
          }}
          role="tab"
          type="button"
        >
          Create account
        </button>
      </div>

      <Button
        className="h-10 w-full gap-2"
        disabled={pending}
        onClick={() => {
          void signInWithGitHub();
        }}
        type="button"
        variant="outline"
      >
        <GitHubMark />
        Continue with GitHub
      </Button>

      <div className="text-muted-foreground my-5 flex items-center gap-3 text-xs tracking-[0.16em] uppercase">
        <span className="bg-border h-px flex-1" />
        or email
        <span className="bg-border h-px flex-1" />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-muted-foreground text-xs font-medium" htmlFor="email">
            Email
          </label>
          <Input
            autoComplete="email"
            className="h-10"
            id="email"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            placeholder="you@example.com"
            type="email"
            value={email}
          />
        </div>

        <div className="space-y-2">
          <label className="text-muted-foreground text-xs font-medium" htmlFor="password">
            Password
          </label>
          <Input
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            className="h-10"
            id="password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            placeholder="At least 8 characters"
            type="password"
            value={password}
          />
        </div>

        {mode === "signin" ? (
          <Button
            className="h-10 w-full"
            disabled={pending || !emailValid || !passwordValid}
            onClick={() => {
              void signInWithPassword();
            }}
            type="button"
          >
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        ) : (
          <Button
            className="h-10 w-full"
            disabled={pending || !emailValid || !passwordValid}
            onClick={() => {
              void signUpWithPassword();
            }}
            type="button"
          >
            {pending ? "Creating account…" : "Create account"}
          </Button>
        )}

        {mode === "signin" ? (
          <button
            className="text-muted-foreground hover:text-foreground w-full text-center text-sm transition-colors disabled:opacity-50"
            disabled={pending || !emailValid}
            onClick={() => {
              void sendMagicLink();
            }}
            type="button"
          >
            Email me a sign-in link
          </button>
        ) : null}

        <div aria-live="polite" className="min-h-5">
          {message === null ? null : (
            <p className="text-muted-foreground text-sm" data-testid="login-message">
              {message}
            </p>
          )}
          {error === null ? null : (
            <p className="text-destructive text-sm" data-testid="login-error">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function LoginForm({ nextPath: nextPathProp }: { nextPath?: string }) {
  const searchParams = useSearchParams();
  const nextPath = nextPathProp ?? searchParams.get("next") ?? "/";

  if (!isSupabaseConfigured()) {
    return (
      <div className="border-border bg-card mx-auto w-full max-w-md rounded-2xl border p-6">
        <h2 className="text-lg font-medium">Sign-in is unavailable</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
          before starting the app.
        </p>
      </div>
    );
  }

  const supabase = createSupabaseBrowserClient();

  if (supabase === null) {
    return null;
  }

  return <ConfiguredLoginForm nextPath={nextPath} supabase={supabase} />;
}
