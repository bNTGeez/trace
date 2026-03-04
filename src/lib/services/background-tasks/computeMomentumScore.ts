/**
 * Compute momentum score for a user on a specific date.
 *
 * Phase 4: Stub implementation
 * Phase 7: Real scoring logic
 */

export async function computeMomentumScore(
  userId: string,
  eventDate: string,
): Promise<void> {
  console.log("[computeMomentumScore] stub called", {
    userId,
    eventDate,
  });

  // Phase 7: Implement real logic
  // - Calculate score based on recent activity
  // - Consider streaks, frequency, consistency
  // - Upsert scores table
}
