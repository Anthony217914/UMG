"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditarUsuarioPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;

  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("paciente");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setErrorMsg("");
      setSuccessMsg("");

      console.log("✅ ID recibido:", userId);

      if (!userId) {
        setErrorMsg("ID inválido");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/admin/get-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const json = await res.json();
      console.log("✅ Respuesta backend:", json);

      if (!res.ok) {
        setErrorMsg(json.error || "No se pudo cargar el usuario");
        setLoading(false);
        return;
      }

      setFullName(json.profile?.full_name ?? "");
      setRole(json.profile?.role ?? "paciente");
      setPhone(json.profile?.phone ?? "");
      setEmail(json.email ?? null);
      setCreatedAt(json.created_at ?? null);
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  const handleUpdate = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMsg("");
  setSuccessMsg("");

  const res = await fetch("/api/admin/update-profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, full_name: fullName, role, phone }),
  });

  const json = await res.json();
  if (!res.ok) {
    setErrorMsg(json.error || "Error al actualizar usuario");
    return;
  }

  setSuccessMsg("✅ Usuario actualizado con éxito");
  setTimeout(() => router.push("/admin/usuarios"), 1200);
};


  if (loading) {
    return <p className="p-6 text-black">Cargando usuario...</p>;
  }

  return (
    <div className="max-w-md bg-white p-6 rounded shadow text-black">
      <h2 className="text-xl font-semibold mb-4">Editar Usuario</h2>

      {email && (
        <p className="text-sm mb-2">
          <span className="font-medium">Email:</span> {email}{" "}
          {createdAt ? `• Creado: ${createdAt}` : ""}
        </p>
      )}

      {errorMsg && <p className="text-red-600 mb-2">{errorMsg}</p>}
      {successMsg && <p className="text-green-600 mb-2">{successMsg}</p>}

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm">Nombre completo</label>
          <input
            type="text"
            className="w-full border rounded px-2 py-1"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm">Rol</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="paciente">Paciente</option>
          </select>
        </div>

        <div>
          <label className="block text-sm">Teléfono</label>
          <input
            type="text"
            className="w-full border rounded px-2 py-1"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
