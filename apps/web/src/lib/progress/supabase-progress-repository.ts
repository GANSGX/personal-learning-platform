import type { Progress, ProgressRepository } from "@plp/domain";
import { progressSchema } from "@plp/domain";
import type { SupabaseClient } from "@supabase/supabase-js";

const USER_PROGRESS_TABLE = "user_progress";

export class SupabaseProgressRepository implements ProgressRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async getProgress(userId: string): Promise<Progress> {
    const { data, error } = await this.supabase
      .from(USER_PROGRESS_TABLE)
      .select("user_id, nodes")
      .eq("user_id", userId)
      .maybeSingle();

    if (error !== null) {
      throw new Error(`Failed to load progress: ${error.message}`);
    }

    if (data === null) {
      return progressSchema.parse({ userId, nodes: {} });
    }

    return progressSchema.parse({
      userId,
      nodes: progressSchema.shape.nodes.parse(data.nodes),
    });
  }

  async saveProgress(progress: Progress): Promise<void> {
    const validated = progressSchema.parse(progress);

    const { error } = await this.supabase.from(USER_PROGRESS_TABLE).upsert(
      {
        user_id: validated.userId,
        nodes: validated.nodes,
      },
      { onConflict: "user_id" },
    );

    if (error !== null) {
      throw new Error(`Failed to save progress: ${error.message}`);
    }
  }
}
