import { NextResponse } from "next/server";
import { createClient, getUser } from "@/lib/supabase/server";

/**
 * GET /api/events — list recent events for the current user (for testing Phase 2).
 */
export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("id, type, ts, value")
    .eq("user_id", user.id)
    .order("ts", { ascending: false })
    .limit(10);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

/**
 * POST /api/events — insert one event (for testing Phase 2). Body: { type: string, value?: object }
 */
export async function POST(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { type?: string; value?: object };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const type = body.type ?? "test";
  const value = body.value ?? null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .insert({ user_id: user.id, type, value })
    .select("id, type, ts")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
