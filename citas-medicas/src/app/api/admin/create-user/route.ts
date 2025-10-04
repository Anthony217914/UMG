import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, full_name, role, phone } = body;

    // ✅ Usamos la service_key para crear usuarios
    const supabaseServer = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // 🚨 IMPORTANTE
    );

    // 1) Crear usuario en auth
    const { data: userData, error: userError } =
      await supabaseServer.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // No requiere verificación
      });

    if (userError) {
      console.error("Error creando auth user:", userError);
      return NextResponse.json(
        { error: userError.message },
        { status: 400 }
      );
    }

    const userId = userData.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "No se obtuvo el ID del usuario" },
        { status: 400 }
      );
    }

    // 2) Insertar en profiles
    const { error: profileError } = await supabaseServer
      .from("profiles")
      .insert([
        {
          id: userId,
          full_name,
          role,
          phone,
        },
      ]);

    if (profileError) {
      console.error("Error creando perfil:", profileError);
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
