// src/app/api/health/route.ts
import { NextResponse } from 'next/server';
// ✅ Usa ESTA versión según cuál quite el error:
import { supabase } from '@/lib/supabaseClient';
// O bien (si sigue error):
// import { supabase } from '../../../lib/supabaseClient';

export async function GET() {
  const { data, error } = await supabase
    .from('app_status')
    .select('id')
    .limit(1);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: !!data?.length });
}
