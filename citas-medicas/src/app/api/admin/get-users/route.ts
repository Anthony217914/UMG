import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabaseServer = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // ✅ 1. Obtener lista de usuarios desde auth
    const { data: authData, error: authError } =
      await supabaseServer.auth.admin.listUsers();

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // ✅ 2. Obtener perfiles
    const { data: profiles, error: profilesError } = await supabaseServer
      .from("profiles")
      .select("*");

    if (profilesError) {
      return NextResponse.json(
        { error: profilesError.message },
        { status: 400 }
      );
    }

    // ✅ 3. Unir auth.users + profiles por ID
    const users = (authData?.users || []).map((authUser) => {
      const profile = profiles?.find((p) => p.id === authUser.id);
      return {
        id: authUser.id,
        email: authUser.email,
        created_at: authUser.created_at,
        full_name: profile?.full_name || "-",
        role: profile?.role || "-",
        phone: profile?.phone || "-",
      };
    });

    return NextResponse.json(users);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Error interno" },
      { status: 500 }
    );
  }
}
