import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function GET() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // Vercel/Next adaptador de cookies no server
          try {
            cookieStore.set({ name, value, ...options });
          } catch (_) {
            // ignora em ambiente sem suporte
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({
              name,
              value: '',
              ...options,
              expires: new Date(0),
            });
          } catch (_) {}
        },
      },
    }
  );

  // autenticação básica: pega usuário logado
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return NextResponse.json(
      { ok: false, error: error?.message ?? 'Not authenticated' },
      { status: 401 }
    );
  }

  // TODO: aqui você pode consultar sua licença do usuário,
  // por enquanto só retornamos ok=true para a build passar.
  return NextResponse.json({ ok: true });
}
