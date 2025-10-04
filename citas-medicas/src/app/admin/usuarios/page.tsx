"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getUserProfile } from "@/lib/getUserProfile";

interface UserWithProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: string | null;
  phone: string | null;
  created_at: string | null;
}

export default function UsuariosAdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      // ✅ Validar sesión
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/login");
        return;
      }

      const perfil = await getUserProfile(session.user.id);
      if (!perfil || perfil.role !== "admin") {
        router.push("/");
        return;
      }

      // ✅ Llamar al endpoint seguro para obtener usuarios completos
      const res = await fetch("/api/admin/get-users");
      const data = await res.json();

      if (res.ok) {
        setUsers(data);
      } else {
        console.error("Error al obtener usuarios:", data.error);
      }

      setLoading(false);
    };

    fetchUsers();
  }, [router]);

  if (loading) {
    return <p className="p-6">Cargando usuarios...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Gestión de Usuarios</h2>

      <button
        onClick={() => router.push("/admin/usuarios/nuevo")}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        ➕ Nuevo Usuario
      </button>

      {users.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
       <table className="min-w-full border border-gray-300 bg-white text-black">
  <thead>
    <tr className="bg-gray-200 text-left text-black">
      <th className="py-2 px-4 border">Email</th>
      <th className="py-2 px-4 border">Nombre</th>
      <th className="py-2 px-4 border">Rol</th>
      <th className="py-2 px-4 border">Teléfono</th>
      <th className="py-2 px-4 border">Creado</th>
      <th className="py-2 px-4 border text-center">Acciones</th>
    </tr>
  </thead>
  <tbody>
    {users.map((u) => (
      <tr key={u.id} className="hover:bg-gray-100">
        <td className="py-2 px-4 border text-black">{u.email}</td>
        <td className="py-2 px-4 border text-black">{u.full_name ?? "-"}</td>
        <td className="py-2 px-4 border text-black">{u.role ?? "-"}</td>
        <td className="py-2 px-4 border text-black">{u.phone ?? "-"}</td>
        <td className="py-2 px-4 border text-black">{u.created_at ?? "-"}</td>
        <td className="py-2 px-4 border text-center">
         
 <button
  onClick={() => router.push(`/admin/usuarios/editar/${u.id}`)}
  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
>
  ✏️ Editar
</button>


          <button
  onClick={async () => {
    if (!confirm(`¿Seguro que deseas eliminar este usuario?`)) return;
    try {
      const res = await fetch("/api/admin/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: u.id }),
      });
      const json = await res.json();
      if (!res.ok) {
        alert("Error: " + (json.error || "No se pudo eliminar"));
        return;
      }
      alert("✅ Usuario eliminado");
      // Recargar la lista:
      setUsers((prev) => prev.filter((x) => x.id !== u.id));
    } catch (err) {
      console.error(err);
      alert("Error en la eliminación");
    }
  }}
  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
>
  🗑 Eliminar
</button>


        </td>
      </tr>
    ))}
  </tbody>
</table>

      )}
    </div>
  );
}
