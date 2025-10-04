"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function NuevoUsuarioPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("paciente"); // default
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

 const handleCreateUser = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMsg("");
  setSuccessMsg("");

  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
    setErrorMsg("El correo ingresado no es válido.");
    return;
  }


  console.log("🟦 Enviando datos a Supabase:", {
  email: cleanEmail,
  password: cleanPassword,
});

  // 1) Crear usuario en auth
const res = await fetch("/api/admin/create-user", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: cleanEmail,
    password: cleanPassword,
    full_name: fullName,
    role,
    phone,
  }),
});

const result = await res.json();

if (!res.ok) {
  setErrorMsg(result.error || "Error al crear usuario");
  return;
}

setSuccessMsg("✅ Usuario creado con éxito");
setTimeout(() => {
  router.push("/admin/usuarios");
}, 1500);

  // 2) Insertar en profiles
  const { error: profileError } = await supabase.from("profiles").insert([
    {
      id: userId,
      full_name: fullName,
      role,
      phone,
    },
  ]);

  if (profileError) {
    setErrorMsg(profileError.message);
    return;
  }

  setSuccessMsg("✅ Usuario creado con éxito");
  setTimeout(() => {
    router.push("/admin/usuarios");
  }, 1500);
};


  return (
    <div className="max-w-md bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Crear Nuevo Usuario</h2>

      <form onSubmit={handleCreateUser} className="space-y-4">
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
          <label className="block text-sm">Email</label>
          <input
            type="email"
            className="w-full border rounded px-2 py-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm">Contraseña</label>
          <input
            type="password"
            className="w-full border rounded px-2 py-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        {errorMsg && <p className="text-red-600">{errorMsg}</p>}
        {successMsg && <p className="text-green-600">{successMsg}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Crear Usuario
        </button>
      </form>
    </div>
  );
}
