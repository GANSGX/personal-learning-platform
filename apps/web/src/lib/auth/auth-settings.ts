import { z } from "zod";

const authSettingsSchema = z.object({
  external: z.object({
    github: z.boolean(),
  }),
});

type AuthSettingsEnv = {
  url: string;
  anonKey: string;
};

export async function readGithubAuthEnabled(
  env: AuthSettingsEnv,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean | null> {
  try {
    const response = await fetchImpl(new URL("/auth/v1/settings", env.url), {
      headers: {
        apikey: env.anonKey,
        Authorization: `Bearer ${env.anonKey}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const parsed = authSettingsSchema.safeParse(await response.json());

    if (!parsed.success) {
      return null;
    }

    return parsed.data.external.github;
  } catch {
    return null;
  }
}
