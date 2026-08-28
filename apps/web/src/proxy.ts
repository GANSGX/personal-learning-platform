import { type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // String.raw breaks Next.js segment config validation during `next build`.
    // eslint-disable-next-line unicorn/prefer-string-raw -- Next.js rejects tagged template in segment config
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
