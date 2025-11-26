import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <header className="py-10">
          <h1 className="text-3xl font-bold">Gerador de Prompts para E‑commerce</h1>
          <p className="text-zinc-600 mt-2">Crie prompts e códigos prontos para imagens de produtos (Shopee, Mercado Livre, Instagram e TikTok Shop).</p>
        </header>

        <div className="space-y-6">
          <Link href="/login" className="inline-flex items-center gap-2 border rounded-xl px-4 py-2 hover:bg-zinc-50">Entrar</Link>
          <p className="text-sm text-zinc-600">Já comprou? Faça login e acesse o app.</p>
        </div>
      </div>
    </main>
  );
}
