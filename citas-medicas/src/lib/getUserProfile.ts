import { supabase } from "./supabaseClient";

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error al obtener el perfil:", error);
    return null;
  }

  return data;
}
