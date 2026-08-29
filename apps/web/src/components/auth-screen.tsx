import type { ReactNode } from "react";
import { WaypointsIcon } from "lucide-react";

type AuthScreenProps = {
  children: ReactNode;
};

export function AuthScreen({ children }: AuthScreenProps) {
  return (
    <div
      className="auth-canvas relative flex min-h-svh w-full overflow-hidden"
      data-testid="auth-screen"
    >
      <div aria-hidden="true" className="auth-canvas-grid pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 size-[32rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.45_0_0/0.28),transparent_70%)] blur-2xl md:left-[20%]"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-10 px-5 py-10 sm:px-8 lg:flex-row lg:items-center lg:gap-16 lg:px-12">
        <aside className="auth-enter mx-auto w-full max-w-md text-center lg:mx-0 lg:max-w-sm lg:text-left">
          <div className="mb-5 inline-flex items-center gap-2.5">
            <span className="bg-foreground text-background flex size-10 items-center justify-center rounded-xl">
              <WaypointsIcon aria-hidden="true" className="size-5" />
            </span>
            <span className="text-sm font-medium tracking-wide">Personal Learning</span>
          </div>
          <h1 className="text-3xl font-medium tracking-tight text-balance sm:text-4xl">
            Sign in to open the map
          </h1>
          <p className="text-muted-foreground mt-3 text-sm leading-6 text-pretty sm:text-base">
            Lessons, visualizations, and checkpoints stay behind an account. Progress syncs across
            your devices.
          </p>
        </aside>

        <div className="auth-enter auth-enter-delay w-full">{children}</div>
      </div>
    </div>
  );
}

export function AuthSplash() {
  return (
    <div
      className="auth-canvas flex min-h-svh w-full flex-col items-center justify-center gap-4"
      data-testid="auth-splash"
    >
      <span className="bg-foreground text-background flex size-10 items-center justify-center rounded-xl">
        <WaypointsIcon aria-hidden="true" className="size-5" />
      </span>
      <p className="text-muted-foreground text-sm">Checking session…</p>
    </div>
  );
}
