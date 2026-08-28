import { z } from "zod";

const publicEnvSchema = z.object({
  url: z.url(),
  anonKey: z.string().min(1),
});

type SupabasePublicEnv = z.infer<typeof publicEnvSchema>;

export function getSupabasePublicEnv(): SupabasePublicEnv | null {
  const url = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const anonKey = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"];

  if (url === undefined || anonKey === undefined) {
    return null;
  }

  return publicEnvSchema.parse({ url, anonKey });
}

export function isSupabaseConfigured(): boolean {
  return getSupabasePublicEnv() !== null;
}
