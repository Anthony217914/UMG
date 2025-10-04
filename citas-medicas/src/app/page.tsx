'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getUserProfile } from '@/lib/getUserProfile';
import { Database } from 'lucide-react';

export default function Home() {
  const [ok, setOk] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Verificar conexión a BD
    (async () => {
      try {
        const res = await fetch('/api/health');
        const json = await res.json();
        setOk(!!json.ok);
      } catch {
        setOk(false);
      }
    })();

    // Verificar sesión y obtener perfil
    (async () => {
 const { data } = await supabase.auth.getSession();
const session = data?.session;

if (session?.user) {
  const user = session.user;
  setUserEmail(user.email ?? null);

  const perfil = await getUserProfile(user.id);
  setUserRole(perfil?.role ?? null);
}


    })();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 rounded-2xl shadow bg-white max-w-md w-full text-center">

        <div className="flex items-center justify-center gap-2 mb-4">
          <Database className="w-6 h-6" />
          <h1 className="text-xl font-semibold">
            Citas Médicas — Inicio
          </h1>
        </div>

        {userEmail ? (
          <div className="mb-6">
            <p className="text-sm">Usuario conectado:</p>
            <p className="font-medium">{userEmail}</p>
            {userRole && (
              <p className="text-sm mt-2">
                Rol: <strong>{userRole}</strong>
              </p>
            )}
            <button
              onClick={handleLogout}
              className="mt-3 bg-red-600 text-white rounded py-1 px-3 hover:bg-red-700 transition"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <p className="mb-4 text-gray-600">
            No hay sesión iniciada.
          </p>
        )}

        {ok === null && <p>Comprobando conexión con la base de datos...</p>}

        {ok === true && (
          <p className="text-green-600 font-medium">✅ Conectado a Supabase</p>
        )}

        {ok === false && (
          <p className="text-red-600 font-medium">❌ Sin conexión a la base de datos</p>
        )}
      </div>
    </main>
  );
}
