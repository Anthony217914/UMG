import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    const supabaseServer = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabaseServer.auth.admin.getUserById(userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      email: data.user?.email,
      created_at: data.user?.created_at,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Error interno" },
      { status: 500 }
    );
  }
}
