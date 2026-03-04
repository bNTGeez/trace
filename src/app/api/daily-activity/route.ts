import { NextResponse } from "next/server";
import { createClient, getUser } from "@/lib/supabase/server";

/**
 * GET /api/daily-activity?from=YYYY-MM-DD&to=YYYY-MM-DD
 *
 * Returns daily aggregates for the current user within the date range.
 * Defaults to last 7 days if no range provided.
 */
export async function GET(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  // Default to last 7 days
  const toDate = to ?? new Date().toISOString().slice(0, 10);
  const fromDate =
    from ??
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("daily_activity")
    .select(
      "date, coding_minutes, study_minutes, workouts_count, sleep_hours, updated_at",
    )
    .eq("user_id", user.id)
    .gte("date", fromDate)
    .lte("date", toDate)
    .order("date", { ascending: false });

  if (error) {
    console.error("[daily-activity] query error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
