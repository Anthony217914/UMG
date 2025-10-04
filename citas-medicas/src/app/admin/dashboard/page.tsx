"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getUserProfile } from "@/lib/getUserProfile";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        // Si no hay sesión, redirigimos a /login
        router.push("/login");
        return;
      }

      const perfil = await getUserProfile(session.user.id);

      if (!perfil || perfil.role !== "admin") {
        // Si no es admin, lo sacamos
        router.push("/");
        return;
      }

      // Usuario válido
      setUserEmail(session.user.email ?? null);
      setUserRole(perfil.role);
      setLoading(false);
    };

    checkSession();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded shadow">
          <p>Cargando Dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow text-center max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
        <p className="mb-2">Bienvenido, {userEmail}</p>
        <p className="text-sm text-gray-600 mb-6">Rol: {userRole}</p>

        <p className="text-lg font-medium">
          Aquí irá el dashboard del administrador (estadísticas, gestión, etc).
        </p>
      </div>
    </main>
  );
}
