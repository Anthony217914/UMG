"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMsg("");

  console.log("🔵 Intentando login con:", email, password);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("🔍 Respuesta de Supabase:", { data, error });

  if (error) {
    setErrorMsg(error.message);
    return;
  }

  if (!data?.user) {
    setErrorMsg("No se encontró el usuario después de iniciar sesión");
    return;
  }

  console.log("✅ Usuario autenticado:", data.user);

  const userId = data.user.id;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  console.log("🔍 Resultado de búsqueda en profiles:", { profile, profileError });

  if (profileError || !profile) {
    setErrorMsg("No se pudo recuperar el perfil del usuario");
    return;
  }

  const role = profile.role;
  console.log("🟡 Rol detectado:", role);

  // ✅ Redirección con return
  if (role === "admin") {
    return router.push("/admin/dashboard");
  }

  if (role === "doctor") {
    return router.push("/doctor/dashboard");
  }

  return router.push("/paciente/dashboard");
};

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow rounded p-6 w-full max-w-sm">
        <h1 className="text-xl font-semibold text-center mb-4">
          Iniciar Sesión
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">

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

          {errorMsg && (
            <p className="text-red-600 text-sm">{errorMsg}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
