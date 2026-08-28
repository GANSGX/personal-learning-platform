"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type LoginFormProps = {
  nextPath?: string;
};

type ConfiguredLoginFormProps = {
  supabase: SupabaseClient;
  nextPath: string;
};

function buildRedirectTo(nextPath: string): string {
  return `${globalThis.window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
}

function ConfiguredLoginForm({ supabase, nextPath }: ConfiguredLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function signInWithGitHub() {
    setPending(true);
    setError(null);
    setMessage(null);

    const redirectTo = buildRedirectTo(nextPath);

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo },
    });

    if (authError !== null) {
      setError(authError.message);
      setPending(false);
    }
  }

  async function sendMagicLink() {
    setPending(true);
    setError(null);
    setMessage(null);

    const redirectTo = buildRedirectTo(nextPath);

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    setPending(false);

    if (authError !== null) {
      setError(authError.message);
      return;
    }

    setMessage("Check your email for the sign-in link.");
  }

  async function signInWithPassword() {
    setPending(true);
    setError(null);
    setMessage(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setPending(false);

    if (authError !== null) {
      setError(authError.message);
      return;
    }

    router.replace(nextPath);
    router.refresh();
  }

  async function signUpWithPassword() {
    setPending(true);
    setError(null);
    setMessage(null);

    const redirectTo = buildRedirectTo(nextPath);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectTo },
    });

    setPending(false);

    if (authError !== null) {
      setError(authError.message);
      return;
    }

    setMessage("Account created. Confirm your email if required, then sign in.");
  }

  return (
    <Card className="mx-auto w-full max-w-md" data-testid="login-form">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Sync progress across devices with GitHub, email magic link, or email + password.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          className="w-full"
          disabled={pending}
          onClick={() => {
            void signInWithGitHub();
          }}
          type="button"
          variant="outline"
        >
          Continue with GitHub
        </Button>

        <div className="space-y-2">
          <label
            className="text-muted-foreground text-xs tracking-[0.2em] uppercase"
            htmlFor="email"
          >
            Email
          </label>
          <Input
            autoComplete="email"
            id="email"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            placeholder="you@example.com"
            type="email"
            value={email}
          />
        </div>

        <Button
          className="w-full"
          disabled={pending || email.length === 0}
          onClick={() => {
            void sendMagicLink();
          }}
          type="button"
        >
          Send magic link
        </Button>

        <div className="space-y-2">
          <label
            className="text-muted-foreground text-xs tracking-[0.2em] uppercase"
            htmlFor="password"
          >
            Password (optional)
          </label>
          <Input
            autoComplete="current-password"
            id="password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            placeholder="••••••••"
            type="password"
            value={password}
          />
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1"
            disabled={pending || email.length === 0 || password.length === 0}
            onClick={() => {
              void signInWithPassword();
            }}
            type="button"
          >
            Sign in
          </Button>
          <Button
            className="flex-1"
            disabled={pending || email.length === 0 || password.length === 0}
            onClick={() => {
              void signUpWithPassword();
            }}
            type="button"
            variant="outline"
          >
            Sign up
          </Button>
        </div>

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
      </CardContent>
      <CardFooter>
        <Button nativeButton={false} render={<Link href="/" />} variant="ghost">
          Back to map
        </Button>
      </CardFooter>
    </Card>
  );
}

export function LoginForm({ nextPath: nextPathProp }: LoginFormProps) {
  const searchParams = useSearchParams();
  const nextPath = nextPathProp ?? searchParams.get("next") ?? "/";
  if (!isSupabaseConfigured()) {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>Cloud sign-in unavailable</CardTitle>
          <CardDescription>
            Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
            in your environment to enable cloud sync.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button nativeButton={false} render={<Link href="/" />} variant="outline">
            Back to map
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const supabase = createSupabaseBrowserClient();

  if (supabase === null) {
    return null;
  }

  return <ConfiguredLoginForm nextPath={nextPath} supabase={supabase} />;
}
