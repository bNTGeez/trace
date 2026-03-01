import { NextResponse } from "next/server";
import { getUser } from "@/lib/supabase/server";

/**
 * Protected API route: returns the authenticated user or 401.
 * Use getUser() in other API routes to scope data by user_id.
 */
export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    id: user.id,
    email: user.email,
  });
}
