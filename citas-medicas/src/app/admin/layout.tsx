"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-lg font-semibold mb-6">Admin Panel</h2>
        <nav className="space-y-3">
          <Link href="/admin/dashboard" className="block text-gray-700 hover:text-blue-600">
            📊 Dashboard
          </Link>
          <Link href="/admin/usuarios" className="block text-gray-700 hover:text-blue-600">
            👥 Usuarios
          </Link>
          <Link href="/admin/doctores" className="block text-gray-700 hover:text-blue-600">
            🩺 Doctores
          </Link>
          <Link href="/admin/pacientes" className="block text-gray-700 hover:text-blue-600">
            🧍 Pacientes
          </Link>
          <Link href="/admin/citas" className="block text-gray-700 hover:text-blue-600">
            📅 Citas
          </Link>
          <Link href="/admin/reportes" className="block text-gray-700 hover:text-blue-600">
            📈 Reportes
          </Link>
        </nav>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-6">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Panel de Administración</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </header>

        {/* CONTENIDO PRINCIPAL */}
        <section>{children}</section>
      </main>
    </div>
  );
}
