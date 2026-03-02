import { NextResponse } from "next/server";
import { createClient, getUser } from "@/lib/supabase/server";
import { eventInputSchema } from "@/lib/events/schema";

/**
 * GET /api/events — list recent events for the current user.
 */
export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("id, type, ts, value, metadata")
    .eq("user_id", user.id)
    .order("ts", { ascending: false })
    .limit(10);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

/**
 * POST /api/events — write path only. Validates input, inserts event, returns id.
 * Body: { type: "coding"|"workout"|"sleep"|"study", value: number, ts?: string (ISO), metadata?: object }
 */
export async function POST(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = eventInputSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.flatten().formErrors.join("; ") || "Validation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { type, value, ts, metadata } = parsed.data;
  const insertRow = {
    user_id: user.id,
    type,
    value,
    ts: ts ?? new Date().toISOString(),
    metadata: metadata ?? null,
  };

  const label = "events.insert";
  console.time(label);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .insert(insertRow)
    .select("id")
    .single();

  console.timeEnd(label);
  if (data) {
    console.log("[events] inserted", { id: data.id, type, user_id: user.id });
  }

  if (error) {
    console.error("[events] insert error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
