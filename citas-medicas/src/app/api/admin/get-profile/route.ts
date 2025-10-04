import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId es requerido" },
        { status: 400 }
      );
    }

    const supabaseServer = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // Usa la clave secreta
    );

    // Obtener perfil desde la tabla profiles
    const { data: profile, error: profileError } = await supabaseServer
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      );
    }

    // Obtener email desde auth
    const { data: userData, error: userError } =
      await supabaseServer.auth.admin.getUserById(userId);

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 400 });
    }

    return NextResponse.json({
      profile,
      email: userData.user?.email ?? null,
      created_at: userData.user?.created_at ?? null,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}
