import type { Metadata } from "next";

import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Sign in — Personal Learning Platform",
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params.next ?? "/";

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <LoginForm nextPath={nextPath} />
    </div>
  );
}
