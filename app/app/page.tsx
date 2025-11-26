import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import GeneratorPlaceholder from '@/components/GeneratorPlaceholder';
import Link from 'next/link';

export default async function AppPage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return (
      <main className="min-h-screen grid place-items-center p-6">
        <div className="max-w-md text-center">
          <p>Faça login para acessar.</p>
          <Link href="/login" className="underline">Ir para login</Link>
        </div>
      </main>
    );
  }

  const { data: license } = await supabase
    .from('licenses')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  const allowed = !!license && (license.plan === 'mensal' || (license.plan === 'creditos' && (license.credits ?? 0) > 0));

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Aplicativo</h1>
          <div className="text-sm text-zinc-600">
            {allowed ? 'Licença ativa' : 'Sem licença ativa'}
          </div>
        </header>

        {allowed ? (
          <GeneratorPlaceholder />
        ) : (
          <div className="border rounded-2xl p-6 bg-white">
            <h2 className="text-xl font-semibold">Você ainda não tem acesso.</h2>
            <p className="text-zinc-600 mt-2">Finalize a compra na Cakto e aguarde alguns segundos para a ativação automática.</p>
          </div>
        )}
      </div>
    </main>
  );
}
