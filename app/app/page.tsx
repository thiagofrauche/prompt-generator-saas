'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// app/app/page.tsx
import { cookies } from 'next/headers';
import Link from 'next/link';
import GeneratorPlaceholder from '@/components/GeneratorPlaceholder';
import { createServerClient } from '@supabase/ssr';

export default async function Page() {
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
          try {
            cookieStore.set({ name, value, ...options });
          } catch {}
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options, expires: new Date(0) });
          } catch {}
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="p-6">
      {session ? (
        <GeneratorPlaceholder />
      ) : (
        <div className="space-y-4">
          <p>Você precisa entrar para usar o gerador.</p>
          <Link href="/login" className="underline">
            Ir para Login
          </Link>
        </div>
      )}
    </div>
  );
}
